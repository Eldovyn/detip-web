"use client";

import NavBar from "@/components/NavBar";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LuCoins, LuTrendingUp, LuLock, LuLockOpen, LuGift, LuInfo } from "react-icons/lu";
import { formatCompactNumber } from "@/utils/format";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_WALLET_BALANCE = "5420.500000";
const DUMMY_DEPOSITED = "1250.000000";
const DUMMY_ACCRUED = "15.242857";
const DUMMY_APY = 12.5;
const DUMMY_BORROW_APY = 8.2;
const DUMMY_BORROW_LIMIT = "850.000000";
// ──────────────────────────────────────────────────────────────────────────────

const YieldPage = () => {
    const { account } = useAuth();

    const [mainTab, setMainTab] = useState<"deposit" | "borrow">("deposit");

    // Deposit State (Simulated)
    const [walletBalance, setWalletBalance] = useState(DUMMY_WALLET_BALANCE);
    const [depositedBalance, setDepositedBalance] = useState(DUMMY_DEPOSITED);
    const [accruedYield, setAccruedYield] = useState(DUMMY_ACCRUED);
    const [stakeAmount, setStakeAmount] = useState("");
    const [unstakeAmount, setUnstakeAmount] = useState("");
    const [activeDepositTab, setActiveDepositTab] = useState<"stake" | "unstake">("stake");

    // Borrow State (Simulated)
    const [borrowedAmount, setBorrowedAmount] = useState("0.000000");
    const [borrowInput, setBorrowInput] = useState("");
    const [repayInput, setRepayInput] = useState("");
    const [activeBorrowTab, setActiveBorrowTab] = useState<"borrow" | "repay">("borrow");

    const [isPending, setIsPending] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    // Simulated Actions
    const handleDeposit = async () => {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
        setIsPending(true);
        await new Promise((r) => setTimeout(r, 1000));
        setDepositedBalance((prev) => (parseFloat(prev) + parseFloat(stakeAmount)).toFixed(6));
        setWalletBalance((prev) => (parseFloat(prev) - parseFloat(stakeAmount)).toFixed(6));
        setStakeAmount("");
        setIsPending(false);
    };

    const handleWithdraw = async () => {
        if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
        setIsPending(true);
        await new Promise((r) => setTimeout(r, 1000));
        setDepositedBalance((prev) => Math.max(0, parseFloat(prev) - parseFloat(unstakeAmount)).toFixed(6));
        setWalletBalance((prev) => (parseFloat(prev) + parseFloat(unstakeAmount)).toFixed(6));
        setUnstakeAmount("");
        setIsPending(false);
    };

    const handleClaim = async () => {
        if (parseFloat(accruedYield) <= 0) return;
        setIsClaiming(true);
        await new Promise((r) => setTimeout(r, 1000));
        setWalletBalance((prev) => (parseFloat(prev) + parseFloat(accruedYield)).toFixed(6));
        setAccruedYield("0.000000");
        setIsClaiming(false);
    };

    const handleBorrow = async () => {
        if (!borrowInput || parseFloat(borrowInput) <= 0) return;
        setIsPending(true);
        await new Promise((r) => setTimeout(r, 1000));
        setBorrowedAmount((prev) => (parseFloat(prev) + parseFloat(borrowInput)).toFixed(6));
        setWalletBalance((prev) => (parseFloat(prev) + parseFloat(borrowInput)).toFixed(6));
        setBorrowInput("");
        setIsPending(false);
    };

    const handleRepay = async () => {
        if (!repayInput || parseFloat(repayInput) <= 0) return;
        setIsPending(true);
        await new Promise((r) => setTimeout(r, 1000));
        setBorrowedAmount((prev) => Math.max(0, parseFloat(prev) - parseFloat(repayInput)).toFixed(6));
        setWalletBalance((prev) => (parseFloat(prev) - parseFloat(repayInput)).toFixed(6));
        setRepayInput("");
        setIsPending(false);
    };

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">

                    {/* Header */}
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900 pr-3">Yield</h1>
                        <p className="text-sm text-slate-500">
                            Deposit your DTC tokens to earn yield or borrow against your assets.
                        </p>
                    </header>

                    {/* Main Tabs */}
                    <div className="flex p-1 bg-slate-200/50 backdrop-blur-sm rounded-xl w-fit">
                        <button
                            onClick={() => setMainTab("deposit")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mainTab === "deposit"
                                ? "bg-white text-emerald-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Deposit
                        </button>
                        <button
                            onClick={() => setMainTab("borrow")}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${mainTab === "borrow"
                                ? "bg-white text-emerald-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            Borrow
                        </button>
                    </div>

                    {mainTab === "deposit" ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Stats Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuCoins size={12} className="text-emerald-400" />
                                        Wallet Balance
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {formatCompactNumber(walletBalance)}
                                        <span className="text-sm font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuLock size={12} className="text-emerald-400" />
                                        Deposited
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {formatCompactNumber(depositedBalance)}
                                        <span className="text-sm font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuTrendingUp size={12} className="text-emerald-400" />
                                        APY
                                    </p>
                                    <p className="text-lg font-bold text-emerald-600">{DUMMY_APY}%</p>
                                </div>
                            </div>

                            {/* Accrued Yield */}
                            <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5 shadow-sm flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuGift size={12} className="text-emerald-500" />
                                        Accrued Yield
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {accruedYield}
                                        <span className="text-base font-medium text-slate-400 ml-1.5">DTC</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleClaim}
                                    disabled={isClaiming || parseFloat(accruedYield) <= 0 || !account}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                                >
                                    <LuGift size={14} />
                                    {isClaiming ? "Claiming..." : "Claim Yield"}
                                </button>
                            </div>

                            {/* Deposit / Withdraw Form */}
                            <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                                <div className="flex border-b border-slate-100">
                                    {(["stake", "unstake"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveDepositTab(tab)}
                                            className={`flex-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none capitalize ${activeDepositTab === tab
                                                ? "text-emerald-700 border-b-2 border-emerald-500 bg-emerald-50/50"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            {tab === "stake" ? "Deposit" : "Withdraw"}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6 space-y-4">
                                    {activeDepositTab === "stake" ? (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount to Deposit</label>
                                                    <button onClick={() => setStakeAmount(walletBalance)} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                                                        Max: {formatCompactNumber(walletBalance)} DTC
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={stakeAmount}
                                                        onChange={(e) => setStakeAmount(e.target.value)}
                                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus:ring-2 focus:ring-emerald-500/70"
                                                    />
                                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">DTC</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleDeposit}
                                                disabled={isPending || !stakeAmount || !account}
                                                className="w-full rounded-md bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                            >
                                                {isPending ? "Processing..." : "Deposit DTC"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount to Withdraw</label>
                                                    <button onClick={() => setUnstakeAmount(depositedBalance)} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                                                        Max: {formatCompactNumber(depositedBalance)} DTC
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={unstakeAmount}
                                                        onChange={(e) => setUnstakeAmount(e.target.value)}
                                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus:ring-2 focus:ring-emerald-500/70"
                                                    />
                                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">DTC</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleWithdraw}
                                                disabled={isPending || !unstakeAmount || !account}
                                                className="w-full rounded-md bg-slate-800 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-900 disabled:opacity-50 transition-colors"
                                            >
                                                {isPending ? "Processing..." : "Withdraw DTC"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Borrow Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuLock size={12} className="text-slate-400" />
                                        Borrow Limit
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {formatCompactNumber(DUMMY_BORROW_LIMIT)}
                                        <span className="text-sm font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuCoins size={12} className="text-slate-400" />
                                        Borrowed
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {formatCompactNumber(borrowedAmount)}
                                        <span className="text-sm font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuTrendingUp size={12} className="text-slate-400" />
                                        Borrow APY
                                    </p>
                                    <p className="text-lg font-bold text-slate-900">{DUMMY_BORROW_APY}%</p>
                                </div>
                            </div>

                            {/* Borrow / Repay Form */}
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div className="flex border-b border-slate-100">
                                    {(["borrow", "repay"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveBorrowTab(tab)}
                                            className={`flex-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none capitalize ${activeBorrowTab === tab
                                                ? "text-slate-900 border-b-2 border-slate-900 bg-slate-50"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-6 space-y-4">
                                    {activeBorrowTab === "borrow" ? (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount to Borrow</label>
                                                    <button onClick={() => setBorrowInput((parseFloat(DUMMY_BORROW_LIMIT) - parseFloat(borrowedAmount)).toFixed(6))} className="text-xs text-slate-600 font-medium hover:text-slate-800">
                                                        Max: {formatCompactNumber((parseFloat(DUMMY_BORROW_LIMIT) - parseFloat(borrowedAmount)).toFixed(6))} DTC
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={borrowInput}
                                                        onChange={(e) => setBorrowInput(e.target.value)}
                                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus:ring-2 focus:ring-slate-400"
                                                    />
                                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">DTC</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleBorrow}
                                                disabled={isPending || !borrowInput || !account}
                                                className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
                                            >
                                                {isPending ? "Processing..." : "Borrow DTC"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount to Repay</label>
                                                    <button onClick={() => setRepayInput(borrowedAmount)} className="text-xs text-slate-600 font-medium hover:text-slate-800">
                                                        Max: {formatCompactNumber(borrowedAmount)} DTC
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={repayInput}
                                                        onChange={(e) => setRepayInput(e.target.value)}
                                                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus:ring-2 focus:ring-slate-400"
                                                    />
                                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600">DTC</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRepay}
                                                disabled={isPending || !repayInput || !account}
                                                className="w-full rounded-md bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                            >
                                                {isPending ? "Processing..." : "Repay DTC"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Informational Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <LuInfo size={16} className="text-slate-500" />
                                    Borrowing Information
                                </h4>
                                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                                    <li>Borrowed amounts are added directly to your wallet.</li>
                                    <li>Interest accrues hourly and is added to your total debt.</li>
                                    <li>Ensure your collateral stays above the minimum ratio to avoid liquidation.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </>
    );
};

export default YieldPage;
