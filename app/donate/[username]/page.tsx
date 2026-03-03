"use client";

import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useParams } from "next/navigation";
import { LuMessageSquare, LuHeart, LuCoins } from "react-icons/lu";

const DonatePage = () => {
    const params = useParams();
    const username = params?.username as string;

    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleDonate = async () => {
        if (!amount || parseFloat(amount) <= 0) return;

        setIsPending(true);
        try {
            // TODO: integrate with wallet & payment logic
            console.log("Donating to:", username);
            console.log("Amount (DTC):", amount);
            console.log("Message:", message);
        } catch (error) {
            console.error("Donation failed:", error);
        } finally {
            setIsPending(false);
        }
    };

    const presetAmounts = ["0.0001", "0.0005", "0.001", "0.005"];

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">
                    {/* Header */}
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Donate</h1>
                        <p className="text-sm text-slate-500">
                            Support{" "}
                            <span className="font-medium text-emerald-700">@{username}</span>{" "}
                            with a Bitcoin donation.
                        </p>
                    </header>

                    {/* Creator Card */}
                    <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                        <Avatar className="h-14 w-14 ring-2 ring-emerald-100 ring-offset-2 ring-offset-white">
                            <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                                className="h-full w-full object-cover"
                            />
                            <AvatarFallback>
                                {username?.[0]?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                @{username}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Thank you for your support! 🙏
                            </p>
                        </div>
                        <LuHeart className="ml-auto shrink-0 text-emerald-400" size={20} />
                    </div>

                    {/* Donate Form */}
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
                        <form className="space-y-5">
                            {/* Amount */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="amount"
                                    className="text-sm font-medium text-slate-800"
                                >
                                    Donation Amount
                                </label>

                                {/* Preset buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {presetAmounts.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 ${amount === preset
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50/60 hover:text-emerald-700"
                                                }`}
                                        >
                                            <LuCoins size={11} />
                                            {preset}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom amount input */}
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        id="amount"
                                        min={0}
                                        step="0.00001"
                                        placeholder="0.00000"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                    />
                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">
                                        <LuCoins size={12} className="text-emerald-500" />
                                        DTC
                                    </span>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium text-slate-800 flex items-center gap-1.5"
                                >
                                    <LuMessageSquare size={14} className="text-emerald-500" />
                                    Message{" "}
                                    <span className="text-slate-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    id="message"
                                    rows={3}
                                    placeholder="Write a kind message to the creator..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 resize-none"
                                />
                                <p className="text-[11px] text-slate-400 text-right">
                                    {message.length}/200
                                </p>
                            </div>

                            {/* Submit */}
                            <button
                                type="button"
                                onClick={handleDonate}
                                disabled={isPending || !amount || parseFloat(amount) <= 0}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <LuCoins size={14} />
                                {isPending ? "Processing..." : "Send Donation"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DonatePage;
