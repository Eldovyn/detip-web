"use client";
import { useConnectModal, AutoConnect } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";
import { formatCompactNumber } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useDTCBalance } from "@/hooks/useDTCBalance";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
    const { account, user, needsExplicitAuth, prepareForExplicitAuth, disconnectWallet } = useAuth();
    const { balance, symbol } = useDTCBalance(account?.address);

    const handleConnect = async () => {
        if (needsExplicitAuth) {
            prepareForExplicitAuth();
        }
        await connect({ client, wallets });
    };

    const showConnectButton = !account || needsExplicitAuth;

    return (
        <>
            <AutoConnect client={client} wallets={wallets} />

            {showConnectButton ? (
                <button
                    onClick={handleConnect}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 h-10 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white transition-colors cursor-pointer"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="inline-flex items-stretch divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-linear-to-br from-emerald-50 via-white to-emerald-50">
                        <Avatar className="w-10 h-10 border border-emerald-100 ring-2 ring-emerald-50 shrink-0">
                            <AvatarImage src={user?.avatar} alt={user?.username || "User"} />
                            <AvatarFallback className="bg-emerald-500 text-white font-bold text-sm">
                                {user?.username ? user.username[0].toUpperCase() : "?"}
                            </AvatarFallback>
                        </Avatar>
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
                            <code className="font-mono text-xs text-slate-600 font-bold">
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
