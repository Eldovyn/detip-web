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
    needsExplicitAuth: boolean;
    accessToken: string | undefined;
    user: DataProfile | null;
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
    const [user, setUser] = useState<DataProfile | null>(null);
    
    const mountedRef = useRef(true);
    const loginLockRef = useRef(false);
    const lastProcessedAddressRef = useRef("");

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const logout = useCallback(() => {
        Cookies.remove('accessToken');
        Cookies.remove('account');
        setIsBackendLoggedIn(false);
        setNeedsExplicitAuth(false);
        setUser(null);
        lastProcessedAddressRef.current = "";
        loginLockRef.current = false;
        if (wallet) disconnect(wallet);
        window.location.reload();
    }, [wallet, disconnect]);

    const disconnectWallet = useCallback(() => {
        logout();
    }, [logout]);

    const prepareForExplicitAuth = useCallback(() => {
        lastProcessedAddressRef.current = "";
        loginLockRef.current = false;
        setNeedsExplicitAuth(false);
    }, []);

    const token = Cookies.get('accessToken');
    const { isError: isTokenError, data: profileData } = useQuery({
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
        if (profileData?.data) {
            setUser(profileData.data);
        }
    }, [profileData]);

    useEffect(() => {
        if (isTokenError && isBackendLoggedIn) {
            logout();
        }
    }, [isTokenError, isBackendLoggedIn, logout]);

    useEffect(() => {
        const address = account?.address;

        if (!address) {
            if (lastProcessedAddressRef.current !== "") {
                lastProcessedAddressRef.current = "";
                setIsBackendLoggedIn(false);
            }
            return;
        }

        const storedAccount = Cookies.get('account');
        if (storedAccount && storedAccount.toLowerCase() !== address.toLowerCase()) {
            Cookies.remove('accessToken');
            Cookies.set('account', address);
            setIsBackendLoggedIn(false);
            setNeedsExplicitAuth(false);
            lastProcessedAddressRef.current = "";
            loginLockRef.current = false;
            return;
        }

        if (needsExplicitAuth) {
            if (lastProcessedAddressRef.current !== address + "_BLOCKED") {
                lastProcessedAddressRef.current = address + "_BLOCKED";
            }
            return;
        }

        const storedToken = Cookies.get('accessToken');
        if (storedToken && storedAccount?.toLowerCase() === address.toLowerCase()) {
            if (!isBackendLoggedIn) {
                setIsBackendLoggedIn(true);
            }
            lastProcessedAddressRef.current = address;
            return;
        }

        if (loginLockRef.current || lastProcessedAddressRef.current === address) {
            return;
        }

        const doLogin = async () => {
            if (loginLockRef.current) return;
            
            loginLockRef.current = true;
            lastProcessedAddressRef.current = address;
            setIsSigningIn(true);

            try {
                const nonceResp = await authService.createNonce({ address });
                const nonce = nonceResp.data.data.nonce;
                if (!mountedRef.current) return;

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

                const activeAccount = account;
                if (!activeAccount || activeAccount.address.toLowerCase() !== address.toLowerCase()) {
                    return;
                }

                const signature = await activeAccount.signMessage({ message });
                if (!mountedRef.current) return;

                const signResp = (await authService.signIn(message, signature)).data;
                const accessToken = signResp?.data?.access_token;

                if (accessToken) {
                    Cookies.set('accessToken', accessToken);
                    Cookies.set('account', address);
                    setIsBackendLoggedIn(true);
                    setNeedsExplicitAuth(false);
                } else {
                    throw new Error("No access token returned");
                }
            } catch (error: any) {
                const errCode = error?.code;

                if (errCode === 4100) {
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

    return (
        <AuthContext.Provider value={{
            account,
            isBackendLoggedIn,
            isSigningIn,
            needsExplicitAuth,
            accessToken: token,
            user,
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
