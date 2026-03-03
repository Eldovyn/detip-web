"use client";

import NavBar from "@/components/NavBar";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDTCBalance } from "@/hooks/useDTCBalance";
import { LuCoins, LuTrendingUp, LuLock, LuLockOpen, LuGift, LuInfo } from "react-icons/lu";
import { formatCompactNumber } from "@/utils/format";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_STAKED = "1250.500000";
const DUMMY_REWARD = "3.142857";
const DUMMY_APR = 12;
// ──────────────────────────────────────────────────────────────────────────────

const StakingPage = () => {
    const { account } = useAuth();
    const { balance } = useDTCBalance(account?.address);

    const [stakeAmount, setStakeAmount] = useState("");
    const [unstakeAmount, setUnstakeAmount] = useState("");
    const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");

    const [stakedBalance, setStakedBalance] = useState(DUMMY_STAKED);
    const [pendingReward, setPendingReward] = useState(DUMMY_REWARD);
    const [isPending, setIsPending] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const handleStake = async () => {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
        setIsPending(true);
        await new Promise((r) => setTimeout(r, 1000)); // simulate tx
        setStakedBalance((prev) => (parseFloat(prev) + parseFloat(stakeAmount)).toFixed(6));
        setStakeAmount("");
        setIsPending(false);
    };

    const handleUnstake = async () => {
        if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
        setIsPending(true);
        await new Promise((r) => setTimeout(r, 1000));
        setStakedBalance((prev) =>
            Math.max(0, parseFloat(prev) - parseFloat(unstakeAmount)).toFixed(6)
        );
        setUnstakeAmount("");
        setIsPending(false);
    };

    const handleClaim = async () => {
        if (parseFloat(pendingReward) <= 0) return;
        setIsClaiming(true);
        await new Promise((r) => setTimeout(r, 1000));
        setPendingReward("0.000000");
        setIsClaiming(false);
    };

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">

                    {/* Header */}
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Staking</h1>
                        <p className="text-sm text-slate-500">
                            Stake your DTC tokens to earn rewards over time.
                        </p>
                    </header>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                <LuCoins size={12} className="text-emerald-400" />
                                Wallet Balance
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                                {formatCompactNumber(balance)}
                                <span className="text-sm font-medium text-slate-400 ml-1">DTC</span>
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                <LuLock size={12} className="text-emerald-400" />
                                Staked
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                                {formatCompactNumber(stakedBalance)}
                                <span className="text-sm font-medium text-slate-400 ml-1">DTC</span>
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                <LuTrendingUp size={12} className="text-emerald-400" />
                                APR
                            </p>
                            <p className="text-lg font-bold text-emerald-600">{DUMMY_APR}%</p>
                        </div>
                    </div>

                    {/* Pending Reward */}
                    <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                <LuGift size={12} className="text-emerald-500" />
                                Pending Reward
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                                {pendingReward}
                                <span className="text-base font-medium text-slate-400 ml-1.5">DTC</span>
                            </p>
                        </div>
                        <button
                            onClick={handleClaim}
                            disabled={isClaiming || parseFloat(pendingReward) <= 0 || !account}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                        >
                            <LuGift size={14} />
                            {isClaiming ? "Claiming..." : "Claim"}
                        </button>
                    </div>

                    {/* Stake / Unstake Form */}
                    <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-100">
                            {(["stake", "unstake"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none capitalize ${activeTab === tab
                                            ? "text-emerald-700 border-b-2 border-emerald-500 bg-emerald-50/50"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {tab === "stake"
                                        ? <><LuLock size={13} className="inline mr-1.5 -mt-0.5" />Stake</>
                                        : <><LuLockOpen size={13} className="inline mr-1.5 -mt-0.5" />Unstake</>
                                    }
                                </button>
                            ))}
                        </div>

                        <div className="p-6 space-y-4">
                            {activeTab === "stake" ? (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="stake-amount" className="text-sm font-medium text-slate-800">
                                                Amount to Stake
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setStakeAmount(balance)}
                                                className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
                                            >
                                                Max: {formatCompactNumber(balance)} DTC
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                id="stake-amount"
                                                min={0}
                                                step="0.000001"
                                                placeholder="0.000000"
                                                value={stakeAmount}
                                                onChange={(e) => setStakeAmount(e.target.value)}
                                                className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                            />
                                            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">
                                                <LuCoins size={12} className="text-emerald-500" />
                                                DTC
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-xs text-emerald-700">
                                        <LuInfo size={13} className="shrink-0 mt-0.5" />
                                        <span>Staking requires two transactions: first approving DTC, then staking.</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleStake}
                                        disabled={isPending || !stakeAmount || parseFloat(stakeAmount) <= 0 || !account}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <LuLock size={14} />
                                        {isPending ? "Processing..." : "Stake DTC"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="unstake-amount" className="text-sm font-medium text-slate-800">
                                                Amount to Unstake
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setUnstakeAmount(stakedBalance)}
                                                className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
                                            >
                                                Max: {formatCompactNumber(stakedBalance)} DTC
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                id="unstake-amount"
                                                min={0}
                                                step="0.000001"
                                                placeholder="0.000000"
                                                value={unstakeAmount}
                                                onChange={(e) => setUnstakeAmount(e.target.value)}
                                                className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                            />
                                            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">
                                                <LuCoins size={12} className="text-emerald-500" />
                                                DTC
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleUnstake}
                                        disabled={isPending || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || !account}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <LuLockOpen size={14} />
                                        {isPending ? "Processing..." : "Unstake DTC"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
};

export default StakingPage;
