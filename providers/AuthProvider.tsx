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

let globalLoginLock = false;
let lastLoginAddress = "";

export function AuthProvider({ children }: { children: ReactNode }) {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const { disconnect } = useDisconnect();

    const [isBackendLoggedIn, setIsBackendLoggedIn] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [needsExplicitAuth, setNeedsExplicitAuth] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    /**
     * Logout: hapus token + disconnect wallet (benar-benar logout).
     * Setelah ini AutoConnect mungkin reconnect, tapi karena MetaMask permission
     * sudah dicabut oleh disconnect, signing akan gagal 4100 → needsExplicitAuth=true
     * → user harus klik Connect Wallet lagi (yang trigger MetaMask popup re-auth).
     */
    const logout = useCallback(() => {
        lastLoginAddress = "";
        globalLoginLock = false;
        Cookies.remove('account');
        Cookies.remove('accessToken');
        setIsBackendLoggedIn(false);
        setNeedsExplicitAuth(false);
        if (wallet) disconnect(wallet);
    }, [wallet, disconnect]);

    /** Gunakan jika hanya ingin disconnect tanpa logout context (alias logout) */
    const disconnectWallet = useCallback(() => {
        logout();
    }, [logout]);

    /**
     * Dipanggil oleh ConnectWallet sebelum connect() modal dibuka.
     * Me-reset guard agar doLogin bisa retry setelah MetaMask re-authorize.
     */
    const prepareForExplicitAuth = useCallback(() => {
        setNeedsExplicitAuth(false);
        lastLoginAddress = "";
        globalLoginLock = false;
    }, []);

    // ─── Validasi token secara global ───────────────────────────────────────
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
            logout();
        }
    }, [isTokenError, isBackendLoggedIn, logout]);
    // ────────────────────────────────────────────────────────────────────────

    // ─── SIWE Login Flow ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!account?.address) {
            lastLoginAddress = "";
            globalLoginLock = false;
            setIsBackendLoggedIn(false);
            setNeedsExplicitAuth(false);
            return;
        }

        const currentAddress = account.address;
        const storedToken = Cookies.get('accessToken');

        if (storedToken) {
            setIsBackendLoggedIn(true);
            setNeedsExplicitAuth(false);
            lastLoginAddress = currentAddress;
            return;
        }

        if (globalLoginLock || lastLoginAddress === currentAddress) {
            return;
        }

        const doLogin = async () => {
            if (globalLoginLock) return;

            globalLoginLock = true;
            lastLoginAddress = currentAddress;
            setIsSigningIn(true);

            try {
                const resp = await authService.createNonce({ address: currentAddress });
                const nonce = resp.data.data.nonce;

                if (!mountedRef.current) { globalLoginLock = false; return; }

                const siweMessage = new SiweMessage({
                    domain: window.location.host,
                    address: currentAddress,
                    statement: "Sign in to DeTip",
                    uri: window.location.origin,
                    version: "1",
                    chainId: ganacheChain.id,
                    nonce,
                    issuedAt: new Date().toISOString(),
                });

                const message = siweMessage.prepareMessage();

                if (!account) {
                    console.error("SIWE Error: account no longer available");
                    globalLoginLock = false;
                    lastLoginAddress = "";
                    return;
                }

                const signature = await account.signMessage({ message });

                if (!mountedRef.current) { globalLoginLock = false; return; }

                const SignInResponse = await authService.signIn(message, signature);
                const SignInResp = SignInResponse.data;
                const accessToken = SignInResp?.data?.access_token;

                if (!mountedRef.current) { globalLoginLock = false; return; }

                if (accessToken) {
                    Cookies.set('accessToken', accessToken);
                    setIsBackendLoggedIn(true);
                    setNeedsExplicitAuth(false);
                } else {
                    console.error("Login Failed:", SignInResp.message);
                    lastLoginAddress = "";
                }
            } catch (error: unknown) {
                const errCode = (error as { code?: number })?.code;

                if (errCode === 4100) {
                    // MetaMask tidak punya signing permission (terjadi setelah AutoConnect
                    // reconnect pasca-disconnect). User harus klik Connect Wallet lagi
                    // untuk trigger MetaMask popup dan re-authorize.
                    console.warn("SIWE: MetaMask needs explicit re-authorization (code 4100). Please connect wallet again.");
                    setNeedsExplicitAuth(true);
                    // Jangan reset lastLoginAddress — biarkan blocked sampai user connect eksplisit
                } else if (error instanceof Error) {
                    console.error("SIWE Error:", error.message, error);
                    lastLoginAddress = "";
                } else {
                    console.error("SIWE Error (raw):", JSON.stringify(error), error);
                    lastLoginAddress = "";
                }
            } finally {
                globalLoginLock = false;
                if (mountedRef.current) setIsSigningIn(false);
            }
        };

        doLogin();
    }, [account?.address, wallet, account, disconnect]);
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
