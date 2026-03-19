"use client";

import NavBar from "@/components/NavBar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransferDTC } from "@/hooks/useTransfer";
import { Suspense, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDTCBalance } from "@/hooks/useDTCBalance";
import { LuLoader, LuUser, LuCoins, LuArrowLeft, LuWallet, LuSend, LuInfo } from "react-icons/lu";
import { formatCompactNumber } from "@/utils/format";

const SendPageContent = () => {
    const { account } = useAuth();
    const { transferDTC, isPending } = useTransferDTC();
    const { balance } = useDTCBalance(account?.address);
    const searchParams = useSearchParams();
    const addressFromQuery = searchParams.get("address") ?? "";

    const [recipient, setRecipient] = useState(() => addressFromQuery);
    const [amount, setAmount] = useState("");

    const handleTransfer = async () => {
        if (!recipient || !amount || parseFloat(amount) <= 0) return;

        try {
            await transferDTC(recipient, amount);
            setAmount("");
        } catch (error) {
            console.error("Transfer failed:", error);
        }
    };

    const presetAmounts = ["0.001", "0.005", "0.01", "0.05", "0.1"];

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <header className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <LuSend className="text-emerald-600" size={24} />
                                Send DTC
                            </h1>
                            <p className="text-sm text-slate-500">
                                Securely transfer tokens to any wallet address or username.
                            </p>
                        </header>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50"
                        >
                            <LuArrowLeft size={14} />
                            Back to overview
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {/* Status Card */}
                        <div className="rounded-2xl border border-emerald-100 bg-white p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <LuWallet size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest leading-none mb-1">
                                        Available Balance
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatCompactNumber(balance)} <span className="text-sm font-medium text-slate-400">DTC</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="rounded-2xl border border-emerald-100 bg-white p-6 space-y-6">
                            <form className="space-y-5">
                                {/* Recipient */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="recipient"
                                        className="text-sm font-semibold text-slate-800 flex items-center gap-2"
                                    >
                                        <LuUser size={14} className="text-emerald-500" />
                                        Recipient
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            id="recipient"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            placeholder="Username or wallet address (0x...)"
                                            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 transition-all group-hover:border-slate-300"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1 px-1">
                                        <LuInfo size={10} />
                                        Make sure the address is correct to avoid loss of funds.
                                    </p>
                                </div>

                                {/* Amount */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="amount"
                                            className="text-sm font-semibold text-slate-800 flex items-center gap-2"
                                        >
                                            <LuCoins size={14} className="text-emerald-500" />
                                            Amount
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setAmount(balance)}
                                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wide"
                                        >
                                            Send MAX
                                        </button>
                                    </div>
                                    
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            id="amount"
                                            min={0}
                                            step="0.000001"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-16 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 transition-all group-hover:border-slate-300"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-400">DTC</span>
                                        </div>
                                    </div>

                                    {/* Presets */}
                                    <div className="flex flex-wrap gap-2">
                                        {presetAmounts.map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setAmount(preset)}
                                                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                                                    amount === preset
                                                        ? "bg-emerald-600 border-emerald-600 text-white"
                                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                                                }`}
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                {amount && parseFloat(amount) > 0 && recipient && (
                                    <div className="rounded-xl bg-slate-50 p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            Transaction Summary
                                        </p>
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-slate-500">Sending to</p>
                                                <p className="text-xs font-mono font-medium text-slate-900 break-all">
                                                    {recipient}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">Total</p>
                                                <p className="text-sm font-bold text-emerald-600">
                                                    {amount} DTC
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleTransfer}
                                    disabled={isPending || !recipient || !amount || parseFloat(amount) <= 0}
                                    className="inline-flex w-full items-center justify-center gap-2 h-12 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isPending ? (
                                        <>
                                            <LuLoader className="h-5 w-5 animate-spin" />
                                            Confirming Transaction...
                                        </>
                                    ) : (
                                        <>
                                            <LuSend size={18} />
                                            Send Tokens Now
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                        <LuInfo className="text-amber-500 shrink-0 mt-0.5" size={18} />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-amber-900">Security Note:</p>
                            <p className="text-[11px] text-amber-800 leading-relaxed">
                                Always double-check the recipient address. Transactions on the blockchain are irreversible. We will never ask for your private key or seed phrase.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const SendPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><LuLoader className="h-8 w-8 animate-spin text-emerald-600" /></div>}>
            <SendPageContent />
        </Suspense>
    );
};

export default SendPage;
