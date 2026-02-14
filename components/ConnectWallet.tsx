"use client";
import { useEffect } from "react";
import { useActiveAccount, useConnectModal, useActiveWallet, useDisconnect } from "thirdweb/react";
import { client } from "@/lib/client";

const PRIMARY_BTN =
    "inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white transition-colors";

export function ConnectWallet() {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const { connect } = useConnectModal();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (account?.address) {
            localStorage.setItem("user_wallet_address", account.address);
        } else {
            localStorage.removeItem("user_wallet_address");
        }
    }, [account]);

    if (!account) {
        return (
            <button
                onClick={() => connect({ client })}
                className={PRIMARY_BTN}
            >
                Connect Wallet
            </button>
        );
    }

    return (
        <div className="inline-flex items-center rounded-lg border border-emerald-100 bg-white p-1 shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1 border-r border-emerald-50">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium text-slate-900">
                    1.2500 ETH
                </span>
            </div>

            <div className="flex items-center gap-3 pl-2 pr-3">
                <div className="flex items-center gap-2 py-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-900">
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                    </span>
                </div>

                <button
                    onClick={() => wallet && disconnect(wallet)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-all cursor-pointer"
                >
                    Disconnect
                </button>
            </div>
        </div>
    );

}
