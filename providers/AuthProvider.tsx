'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { useQuery } from "@tanstack/react-query";
import { SiweMessage } from 'siwe';
import Cookies from 'js-cookie';
import { ganacheChain } from "@/lib/chains";
import { authService } from "@/api/authService";

interface AuthContextValue {
    account: ReturnType<typeof useActiveAccount>;
    isBackendLoggedIn: boolean;
    isSigningIn: boolean;
    /** true = wallet auto-reconnect tapi belum re-authorized MetaMask (butuh klik Connect Wallet) */
    needsExplicitAuth: boolean;
    /** Panggil ini sebelum connect() agar doLogin bisa retry setelah re-auth */
    prepareForExplicitAuth: () => void;
    logout: () => void;
    disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const { disconnect } = useDisconnect();

    const [isBackendLoggedIn, setIsBackendLoggedIn] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [needsExplicitAuth, setNeedsExplicitAuth] = useState(false);
    
    const mountedRef = useRef(true);
    const loginLockRef = useRef(false);
    const lastProcessedAddressRef = useRef("");

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    /**
     * Logout: Clear all session traces and force reload.
     */
    const logout = useCallback(() => {
        console.log("AuthProvider: logout triggered");
        Cookies.remove('accessToken');
        Cookies.remove('account');
        setIsBackendLoggedIn(false);
        setNeedsExplicitAuth(false);
        lastProcessedAddressRef.current = "";
        loginLockRef.current = false;
        if (wallet) disconnect(wallet);
        window.location.reload();
    }, [wallet, disconnect]);

    const disconnectWallet = useCallback(() => {
        logout();
    }, [logout]);

    const prepareForExplicitAuth = useCallback(() => {
        console.log("AuthProvider: internal reset for explicit auth");
        lastProcessedAddressRef.current = "";
        loginLockRef.current = false;
        setNeedsExplicitAuth(false);
    }, []);

    // ─── Global Token Validation ────────────────────────────────────────────
    const token = Cookies.get('accessToken');
    const { isError: isTokenError } = useQuery({
        queryKey: ["tokenValidation", token],
        queryFn: async () => {
            const res = await authService.userMe(token as string);
            return res.data;
        },
        enabled: !!token && isBackendLoggedIn,
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 0,
        throwOnError: false,
    });

    useEffect(() => {
        if (isTokenError && isBackendLoggedIn) {
            console.warn("AuthProvider: Token invalid. Logging out.");
            logout();
        }
    }, [isTokenError, isBackendLoggedIn, logout]);
    // ────────────────────────────────────────────────────────────────────────

    // ─── Unified Auth Controller ────────────────────────────────────────────
    useEffect(() => {
        const address = account?.address;

        // A. Handle Disconnect or Empty State
        if (!address) {
            if (lastProcessedAddressRef.current !== "") {
                console.log("AuthProvider: No active account. Cleaning up state.");
                lastProcessedAddressRef.current = "";
                setIsBackendLoggedIn(false);
            }
            return;
        }

        // B. Handle Account Switch
        const storedAccount = Cookies.get('account');
        if (storedAccount && storedAccount.toLowerCase() !== address.toLowerCase()) {
            console.log("AuthProvider: Switch detected. Syncing account cookie.");
            Cookies.remove('accessToken');
            Cookies.set('account', address);
            setIsBackendLoggedIn(false);
            setNeedsExplicitAuth(false);
            lastProcessedAddressRef.current = "";
            loginLockRef.current = false;
            return;
        }

        // C. Guard: Block if manual re-auth is needed (RPC Error 4100)
        if (needsExplicitAuth) {
            if (lastProcessedAddressRef.current !== address + "_BLOCKED") {
                console.warn("AuthProvider: Auth blocked. User action required for", address);
                lastProcessedAddressRef.current = address + "_BLOCKED";
            }
            return;
        }

        // D. Skip if already logged in for this address
        const storedToken = Cookies.get('accessToken');
        if (storedToken && storedAccount?.toLowerCase() === address.toLowerCase()) {
            if (!isBackendLoggedIn) {
                console.log("AuthProvider: Found valid session for", address);
                setIsBackendLoggedIn(true);
            }
            lastProcessedAddressRef.current = address;
            return;
        }

        // E. Guard: Prevent redundant login triggers
        if (loginLockRef.current || lastProcessedAddressRef.current === address) {
            return;
        }

        // F. Execute SIWE Login Flow
        const doLogin = async () => {
            if (loginLockRef.current) return;
            
            console.log("AuthProvider: Starting SIWE login for", address);
            loginLockRef.current = true;
            lastProcessedAddressRef.current = address;
            setIsSigningIn(true);

            try {
                // 1. Fetch Nonce
                const nonceResp = await authService.createNonce({ address });
                const nonce = nonceResp.data.data.nonce;
                if (!mountedRef.current) return;

                // 2. Build Message
                const siweMessage = new SiweMessage({
                    domain: window.location.host,
                    address,
                    statement: "Sign in to DeTip",
                    uri: window.location.origin,
                    version: "1",
                    chainId: ganacheChain.id,
                    nonce,
                    issuedAt: new Date().toISOString(),
                });
                const message = siweMessage.prepareMessage();

                // 3. Request Signature (Check account one last time)
                const activeAccount = account;
                if (!activeAccount || activeAccount.address.toLowerCase() !== address.toLowerCase()) {
                    console.warn("AuthProvider: Account changed during flow. Aborting.");
                    return;
                }

                console.log("AuthProvider: Requesting signature...");
                const signature = await activeAccount.signMessage({ message });
                if (!mountedRef.current) return;

                // 4. Verify & Store Session
                console.log("AuthProvider: Verifying signature...");
                const signResp = (await authService.signIn(message, signature)).data;
                const accessToken = signResp?.data?.access_token;

                if (accessToken) {
                    console.log("AuthProvider: SIWE Login Successful!");
                    Cookies.set('accessToken', accessToken);
                    Cookies.set('account', address);
                    setIsBackendLoggedIn(true);
                    setNeedsExplicitAuth(false);
                } else {
                    throw new Error("No access token returned");
                }
            } catch (error: any) {
                console.error("AuthProvider: Login failed:", error);
                const errCode = error?.code;

                if (errCode === 4100) {
                    console.warn("AuthProvider: 4100 Error. Enabling explicit auth guard.");
                    setNeedsExplicitAuth(true); 
                } else {
                    lastProcessedAddressRef.current = "";
                }
            } finally {
                loginLockRef.current = false;
                if (mountedRef.current) setIsSigningIn(false);
            }
        };

        doLogin();
    }, [account?.address, isBackendLoggedIn, needsExplicitAuth, account]);
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <AuthContext.Provider value={{
            account,
            isBackendLoggedIn,
            isSigningIn,
            needsExplicitAuth,
            prepareForExplicitAuth,
            logout,
            disconnectWallet,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
