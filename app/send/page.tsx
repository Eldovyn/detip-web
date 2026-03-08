"use client";

import NavBar from "@/components/NavBar";
import { useSearchParams } from "next/navigation";
import { useTransferDTC } from "@/hooks/useTransfer";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";



const SendPage = () => {
    const { account } = useAuth();
    const { transferDTC, isPending } = useTransferDTC();
    const searchParams = useSearchParams();
    const addressFromQuery = searchParams.get("address") ?? "";
    const hasAddress = addressFromQuery.trim().length > 0;

    const [recipient, setRecipient] = useState(() => addressFromQuery);
    const [amount, setAmount] = useState("");

    const handleTransfer = async () => {
        console.log("Account:", account?.address);
        console.log("Recipient:", recipient);
        console.log("Amount:", amount);
        console.log("Token Address:", process.env.NEXT_PUBLIC_DTC_TOKEN_ADDRESS);

        try {
            const result = await transferDTC(recipient, amount);
            console.log("Transfer successful!", result);
        } catch (error) {
            console.error("Transfer failed:", error);
        }
    };

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Send DTC</h1>
                        <p className="text-sm text-slate-500">
                            Choose a recipient and enter the amount you want to send.
                        </p>
                    </header>

                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="recipient"
                                    className="text-sm font-medium text-slate-800"
                                >
                                    Recipient
                                </label>
                                <input
                                    type="text"
                                    id="recipient"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="Username or wallet address"
                                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="amount"
                                    className="text-sm font-medium text-slate-800"
                                >
                                    Amount
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        id="amount"
                                        min={0}
                                        step="0.01"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                    />
                                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">
                                        DTC
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleTransfer}
                                disabled={isPending}
                                className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Send DTC
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SendPage;
