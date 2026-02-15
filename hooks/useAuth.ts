import { useState, useRef, useEffect } from "react";
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { SiweMessage } from 'siwe';
import Cookies from 'js-cookie';
import { ganacheChain } from "@/lib/chains";

let globalLoginLock = false;
let lastLoginAddress = "";

export function useAuth() {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const { disconnect } = useDisconnect();

    const [isBackendLoggedIn, setIsBackendLoggedIn] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!account?.address) {
            lastLoginAddress = "";
            globalLoginLock = false;
            setIsBackendLoggedIn(false);
            return;
        }

        const currentAddress = account.address;
        const token = Cookies.get('accessToken');

        if (token) {
            setIsBackendLoggedIn(true);
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
                const nonceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nonce`);
                const nonce = await nonceRes.text();

                if (!mountedRef.current) {
                    globalLoginLock = false;
                    return;
                }

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
                const signature = await account.signMessage({ message });

                if (!mountedRef.current) {
                    globalLoginLock = false;
                    return;
                }

                const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-in`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message, signature }),
                });

                const result: LoginResponse = await loginRes.json();

                if (!mountedRef.current) {
                    globalLoginLock = false;
                    return;
                }

                if (result.token) {
                    Cookies.set('accessToken', result.token);
                    setIsBackendLoggedIn(true);
                } else {
                    console.error("Login Failed:", result.message);
                    lastLoginAddress = "";
                    if (wallet) disconnect(wallet);
                }
            } catch (error) {
                console.error("SIWE Error:", error);
                lastLoginAddress = "";
                if (wallet && mountedRef.current) disconnect(wallet);
            } finally {
                globalLoginLock = false;
                if (mountedRef.current) setIsSigningIn(false);
            }
        };

        doLogin();
    }, [account?.address, wallet, account, disconnect]);

    const logout = () => {
        if (wallet) disconnect(wallet);
        Cookies.remove('account');
        Cookies.remove('accessToken');
        setIsBackendLoggedIn(false);
        lastLoginAddress = "";
        globalLoginLock = false;
    };

    return {
        account,
        isBackendLoggedIn,
        isSigningIn,
        logout
    };
}
