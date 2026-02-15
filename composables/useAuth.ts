import { useState, useRef, useCallback, useEffect } from "react";
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { SiweMessage } from 'siwe';
import Cookies from 'js-cookie';
import type { Account } from "thirdweb/wallets";
import { ganacheChain } from "@/lib/chains";

export function useAuth() {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const { disconnect } = useDisconnect();

    const [isBackendLoggedIn, setIsBackendLoggedIn] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const loginAttemptedRef = useRef(false);

    const fetchNonce = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nonce`);
        return response.text();
    };

    const createSiweMessage = (address: string, nonce: string) => {
        return new SiweMessage({
            domain: window.location.host,
            address,
            statement: "Sign in to Flask App",
            uri: window.location.origin,
            version: "1",
            chainId: ganacheChain.id,
            nonce,
            issuedAt: new Date().toISOString(),
        });
    };

    const verifyLogin = async (message: string, signature: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, signature }),
        });
        return response.json();
    };

    const doSIWELogin = useCallback(async (activeAccount: Account) => {
        setIsSigningIn(true);

        const resetLoginState = () => {
            loginAttemptedRef.current = false;
            if (wallet) disconnect(wallet);
        };

        try {
            const nonce = await fetchNonce();
            const siweMessage = createSiweMessage(activeAccount.address, nonce);
            const message = siweMessage.prepareMessage();
            const signature = await activeAccount.signMessage({ message });

            const result: LoginResponse = await verifyLogin(message, signature);

            if (result.token) {
                Cookies.set('accessToken', result.token, {
                    expires: 1,
                    sameSite: 'strict'
                });
                setIsBackendLoggedIn(true);
            } else {
                console.error("Login Failed:", result.message);
                resetLoginState();
            }
        } catch (error) {
            console.error("SIWE Error:", error);
            resetLoginState();
        } finally {
            setIsSigningIn(false);
        }
    }, [wallet, disconnect]);

    useEffect(() => {
        if (!account) {
            loginAttemptedRef.current = false;
            setIsBackendLoggedIn(false);
        }
    }, [account?.address, account]);

    useEffect(() => {
        const checkLogin = async () => {
            if (!account || isSigningIn || isBackendLoggedIn || loginAttemptedRef.current) {
                return;
            }

            const token = Cookies.get('accessToken');
            if (token) {
                setIsBackendLoggedIn(true);
                return;
            }

            loginAttemptedRef.current = true;
            await doSIWELogin(account);
        };

        checkLogin();
    }, [account, isSigningIn, isBackendLoggedIn, doSIWELogin]);

    const logout = useCallback(() => {
        if (wallet) disconnect(wallet);
        Cookies.remove('account');
        Cookies.remove('accessToken');
        setIsBackendLoggedIn(false);
    }, [wallet, disconnect]);

    return {
        account,
        isBackendLoggedIn,
        isSigningIn,
        logout
    };
}
