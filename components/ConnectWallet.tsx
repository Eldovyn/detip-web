"use client";
import { useConnectModal, AutoConnect } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";
import { formatCompactNumber } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useDTCBalance } from "@/hooks/useDTCBalance";

const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    inAppWallet({
        auth: {
            options: ["google", "apple", "facebook", "email", "phone"],
        },
    }),
];

export function ConnectWallet() {
    const { connect } = useConnectModal();
    const { account, needsExplicitAuth, prepareForExplicitAuth, disconnectWallet } = useAuth();
    const { balance, symbol } = useDTCBalance(account?.address);

    const handleConnect = async () => {
        // Jika wallet sudah ada (dari AutoConnect) tapi butuh re-auth MetaMask,
        // reset guard dulu agar doLogin bisa retry setelah connect() dipanggil.
        if (needsExplicitAuth) {
            prepareForExplicitAuth();
        }
        // connect() selalu trigger MetaMask popup (eth_requestAccounts) → fresh auth
        await connect({ client, wallets });
    };

    // Tampilkan tombol Connect Wallet jika:
    // 1. Wallet belum connect sama sekali, ATAU
    // 2. Wallet connect via AutoConnect tapi MetaMask butuh re-authorize (setelah logout)
    const showConnectButton = !account || needsExplicitAuth;

    return (
        <>
            <AutoConnect client={client} wallets={wallets} />

            {showConnectButton ? (
                <button
                    onClick={handleConnect}
                    className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white transition-colors cursor-pointer"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="inline-flex items-stretch divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-linear-to-br from-emerald-50 via-white to-emerald-50">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-medium">Balance</span>
                            <span className="text-sm font-bold text-slate-900">
                                {formatCompactNumber(balance)} {symbol}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                            <code className="text-sm font-mono font-medium text-slate-700">
                                {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
                            </code>
                        </div>
                        <button
                            onClick={disconnectWallet}
                            className="text-xs font-semibold text-red-500 cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
