"use client";

import NavBar from "@/components/NavBar";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LuCoins, LuTrendingUp, LuLock, LuGift, LuInfo, LuClock } from "react-icons/lu";
import { formatCompactNumber, formatPreciseNumber } from "@/utils/format";
import {
    useYieldInfo,
    useStakeDTC,
    useUnstakeDTC,
    useClaimReward,
    useApproveForYield,
    useYieldAllowance,
    useBorrowDTC,
    useRepayDTC,
    useRepayAllDTC
} from "@/hooks/useYield";
import { dtcTokenAddress } from "@/lib/contracts/DTCYieldFarm";
import { toast } from "sonner";
import { toWei } from "thirdweb";

const YieldPage = () => {
    const { account } = useAuth();
    const {
        walletBalance,
        stakedBalance,
        pendingReward,
        userDebt,
        borrowLimit,
        poolLiquidity,
        borrowRate,
        utilization,
        rewardRate,
        totalStaked,
        assetTokenAddressFromContract,
        totalBorrowed,
        maxStakePerUser,
        poolHardCap,
        periodFinish,
        rewardsDuration,
        isLoading: isInfoLoading,
        refetch
    } = useYieldInfo(account?.address);

    const { stake, isPending: isStaking } = useStakeDTC();
    const { unstake, isPending: isUnstaking } = useUnstakeDTC();
    const { claim, isPending: isClaiming } = useClaimReward();
    const { approve, isPending: isApproving } = useApproveForYield();
    const { borrow, isPending: isBorrowing } = useBorrowDTC();
    const { repay, isPending: isRepaying } = useRepayDTC();
    const { repayAll, isPending: isRepayingAll } = useRepayAllDTC();

    const { allowance, refetch: refetchAllowance } = useYieldAllowance(account?.address);

    const [mainTab, setMainTab] = useState<"deposit" | "borrow">("deposit");
    const [stakeAmount, setStakeAmount] = useState("");
    const [unstakeAmount, setUnstakeAmount] = useState("");
    const [activeDepositTab, setActiveDepositTab] = useState<"stake" | "unstake">("stake");

    const [borrowInput, setBorrowInput] = useState("");
    const [repayInput, setRepayInput] = useState("");
    const [activeBorrowTab, setActiveBorrowTab] = useState<"borrow" | "repay">("borrow");

    const SECONDS_PER_YEAR = 31536000;
    const dynamicAPY = (parseFloat(totalStaked) > 0)
        ? ((parseFloat(rewardRate) * SECONDS_PER_YEAR * 100) / parseFloat(totalStaked)).toFixed(2)
        : "0.00";

    const REVERT_ERROR_MAP: Record<string, string> = {
        "AmountZero": "Jumlah tidak boleh 0.",
        "PoolCapReached": "Pool sudah mencapai batas maksimum kapasitas.",
        "UserCapReached": "Anda sudah mencapai batas maksimum deposit per pengguna.",
        "InsufficientBalance": "Saldo staked Anda tidak mencukupi.",
        "CollateralTooLow": "Kolateral terlalu rendah untuk melakukan penarikan ini (masih ada hutang aktif).",
        "InsufficientLiquidity": "Likuiditas pool tidak mencukupi untuk transaksi ini.",
        "ExceedsBorrowLimit": "Jumlah pinjaman melebihi batas yang diizinkan berdasarkan kolateral Anda.",
        "InvalidOptimalUtilization": "Nilai optimal utilization tidak valid.",
        "NoRewardAvailable": "Tidak ada reward yang tersedia untuk diklaim saat ini.",
        "ReentrancyGuardReentrantCall": "Transaksi terdeteksi sebagai reentrancy, coba lagi.",
        "SafeERC20FailedOperation": "Operasi transfer token gagal. Pastikan saldo mencukupi.",
        "OwnableUnauthorizedAccount": "Akun Anda tidak memiliki izin untuk melakukan aksi ini.",
        "OwnableInvalidOwner": "Alamat owner tidak valid.",
        "RewardAmountTooHigh": "Jumlah reward terlalu besar untuk didistribusikan.",
        "RewardPeriodStillActive": "Periode reward masih aktif, tidak bisa diubah.",
        "ExceedsMaxBorrow": "Jumlah pinjaman melebihi batas maksimum (termasuk bunga).",
        "LowLiquidity": "Likuiditas pool saat ini terlalu rendah untuk jumlah pinjaman ini.",
    };

    const getErrorMessage = (error: unknown, fallback: string): string => {
        try {
            console.error(`${fallback}:`, JSON.stringify(error, Object.getOwnPropertyNames(error as object)));
        } catch {
            console.error(`${fallback}:`, error);
        }
        if (!error) return fallback;

        const SELECTORS: Record<string, string> = {
            "0x2c5211c6": "AmountZero",
            "0x5479bc04": "PoolCapReached",
            "0xa741a045": "UserCapReached",
            "0x92e95a6d": "InsufficientBalance",
            "0x5e0f0c5e": "CollateralTooLow",
            "0xbb55fd27": "InsufficientLiquidity",
            "0x60b8b34c": "ExceedsBorrowLimit",
            "0x3bfd31e1": "InvalidOptimalUtilization",
            "0x6a5cfb6d": "NoRewardAvailable",
            "0x3ee5aeb5": "ReentrancyGuardReentrantCall",
            "0x5274afe7": "SafeERC20FailedOperation",
            "0x1e4fbdf7": "OwnableInvalidOwner",
            "0x118cdaa7": "OwnableUnauthorizedAccount",
            "0xa6adcea3": "ExceedsMaxBorrow",
            "0x53d32b73": "LowLiquidity",
        };

        const findInChain = (node: any, depth = 0): string | null => {
            if (!node || typeof node !== 'object' || depth > 15) return null;

            const name: string | undefined = node.errorName ?? node.name;
            if (name && REVERT_ERROR_MAP[name]) return REVERT_ERROR_MAP[name];

            const data: unknown = node.data ?? node.revertData;
            if (data && typeof data === 'string' && data.length >= 10) {
                const selector = data.slice(0, 10).toLowerCase();
                const matched = SELECTORS[selector];
                if (matched && REVERT_ERROR_MAP[matched]) return REVERT_ERROR_MAP[matched];
            }
            if (data && typeof data === 'object') {
                const dataObj = data as Record<string, unknown>;
                if (dataObj.errorName && typeof dataObj.errorName === 'string' && REVERT_ERROR_MAP[dataObj.errorName]) {
                    return REVERT_ERROR_MAP[dataObj.errorName];
                }
            }

            const details: string | undefined = node.details;
            if (details && typeof details === 'string') {
                for (const [sel, errName] of Object.entries(SELECTORS)) {
                    if (details.includes(sel) && REVERT_ERROR_MAP[errName]) return REVERT_ERROR_MAP[errName];
                }
                if (!details.startsWith('0x')) return details;
            }

            const hint: string | undefined = node.shortMessage ?? node.reason;
            if (hint && typeof hint === 'string' && !hint.startsWith('0x')) {
                for (const [sel, errName] of Object.entries(SELECTORS)) {
                    if (hint.includes(sel) && REVERT_ERROR_MAP[errName]) return REVERT_ERROR_MAP[errName];
                }
            }

            const rawMsg: string | undefined = node.message;
            if (rawMsg && typeof rawMsg === 'string') {
                const m = rawMsg.match(/reverted[^:]*:\s*(.+)/i);
                if (m) return m[1].trim();
                for (const [sel, errName] of Object.entries(SELECTORS)) {
                    if (rawMsg.includes(sel) && REVERT_ERROR_MAP[errName]) return REVERT_ERROR_MAP[errName];
                }
            }

            return findInChain(node.cause, depth + 1)
                ?? findInChain(node.error, depth + 1)
                ?? findInChain(node.walk, depth + 1);
        };

        const found = findInChain(error);
        if (found) return found;

        const errorMsg = String(error).toLowerCase() + (error instanceof Error ? error.message.toLowerCase() : "");
        if (errorMsg.includes("out of gas") || errorMsg.includes("gas limit exceeded") || errorMsg.includes("intrinsic gas")) {
            return "Transaksi gagal karena Out of Gas (Gas tidak mencukupi). Coba kurangi sedikit jumlah transaksi atau naikkan gas limit di dompet Anda.";
        }
        
        if (errorMsg.includes("execution reverted")) {
            return "Transaksi ditolak oleh Smart Contract. Pastikan batas pinjaman/saldo mencukupi.";
        }

        return fallback;
    };


    const handleStake = async () => {
        if (!stakeAmount || parseFloat(stakeAmount) <= 0 || !account) return;

        try {
            const amountInWei = toWei(stakeAmount);

            if (!allowance || allowance < amountInWei) {
                await approve(stakeAmount);
                await refetchAllowance();
            }

            await stake(stakeAmount);
            setStakeAmount("");
            refetch();
        } catch (error: unknown) {
            console.error("Stake error:", error);
            toast.error(getErrorMessage(error, "Failed to stake DTC"));
        }
    };

    const handleWithdraw = async () => {
        if (!unstakeAmount || parseFloat(unstakeAmount) <= 0 || !account) return;

        try {
            await unstake(unstakeAmount);
            setUnstakeAmount("");
            refetch();
        } catch (error: unknown) {
            console.error("Withdraw error:", error);
            toast.error(getErrorMessage(error, "Failed to withdraw DTC"));
        }
    };

    const handleClaim = async () => {
        if (parseFloat(pendingReward) <= 0 || !account) return;

        try {
            await claim();
            refetch();
        } catch (error: unknown) {
            console.error("Claim error:", error);
            toast.error(getErrorMessage(error, "Failed to claim rewards"));
        }
    };

    const handleBorrow = async () => {
        if (!borrowInput || parseFloat(borrowInput) <= 0 || !account) return;

        try {
            await borrow(borrowInput);
            setBorrowInput("");
            refetch();
        } catch (error: unknown) {
            console.error("Borrow error:", error);
            toast.error(getErrorMessage(error, "Failed to borrow DTC"));
        }
    };

    const handleRepay = async () => {
        if (!repayInput || parseFloat(repayInput) <= 0 || !account) return;

        try {
            const amountWei = toWei(repayInput);

            if (!allowance || allowance < amountWei) {
                await approve(repayInput);
                await refetchAllowance();
            }

            await repay(repayInput);
            setRepayInput("");
            refetch();
        } catch (error: unknown) {
            console.error("Repay error:", error);
            toast.error(getErrorMessage(error, "Failed to repay DTC debt"));
        }
    };

    const handleRepayAll = async () => {
        if (parseFloat(userDebt) <= 0 || !account) return;

        try {
            const debtWithBuffer = (parseFloat(userDebt) * 1.05).toFixed(6);
            const amountWei = toWei(debtWithBuffer);

            if (!allowance || allowance < amountWei) {
                await approve(debtWithBuffer);
                await refetchAllowance();
            }

            await repayAll();
            setRepayInput("");
            refetch();
        } catch (error: unknown) {
            console.error("RepayAll error:", error);
            toast.error(getErrorMessage(error, "Failed to repay all DTC debt"));
        }
    };

    const isPending = isStaking || isUnstaking || isApproving || isBorrowing || isRepaying || isRepayingAll;

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">

                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Yield</h1>
                        <p className="text-sm text-slate-500">
                            Deposit your DTC tokens to earn yield or borrow against your assets.
                        </p>
                    </header>

                    {assetTokenAddressFromContract && assetTokenAddressFromContract.toLowerCase() !== dtcTokenAddress.toLowerCase() && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2">
                            <LuInfo size={14} />
                            <div className="flex flex-col">
                                <span>Warning: Contract is using a different DTC token address. Transactions may fail.</span>
                                <span className="text-[10px] opacity-70">Frontend: {dtcTokenAddress}</span>
                                <span className="text-[10px] opacity-70">Contract: {assetTokenAddressFromContract}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
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
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">

                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuCoins size={12} className="text-emerald-500" />
                                        Wallet
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {isInfoLoading ? "—" : formatCompactNumber(walletBalance)}
                                        <span className="text-xs font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuLock size={12} className="text-emerald-500" />
                                        Deposited
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {isInfoLoading ? "—" : formatCompactNumber(stakedBalance)}
                                        <span className="text-xs font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                    {!isInfoLoading && (
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] text-slate-400">
                                                Pool: {formatCompactNumber(totalStaked)} / {formatCompactNumber(poolHardCap)} DTC
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Max/user: {formatCompactNumber(maxStakePerUser)} DTC
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuTrendingUp size={12} className="text-emerald-500" />
                                        APY
                                    </p>
                                    <p className="text-base font-semibold text-emerald-600">
                                        {isInfoLoading ? "—" : `${dynamicAPY}%`}
                                    </p>
                                    {!isInfoLoading && parseFloat(rewardRate) > 0 && (
                                        <p className="text-[10px] text-slate-400">
                                            {formatCompactNumber(rewardRate)} DTC/s
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                                        <LuGift size={12} className="text-emerald-500" />
                                        Accrued Yield
                                    </p>
                                    <p className="text-2xl font-semibold text-slate-900">
                                        {isInfoLoading ? "0,000000" : formatPreciseNumber(pendingReward)}
                                        <span className="text-sm font-medium text-slate-400 ml-1.5">DTC</span>
                                    </p>
                                    {!isInfoLoading && parseFloat(pendingReward) > parseFloat(poolLiquidity) && (
                                        <p className="text-[10px] text-red-500 font-medium mt-1">
                                            ⚠ Reward exceeds pool liquidity
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleClaim}
                                    disabled={isClaiming || parseFloat(pendingReward) <= 0 || !account}
                                    className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <LuGift size={14} />
                                    {isClaiming ? "Claiming..." : "Claim Yield"}
                                </button>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                                <div className="flex border-b border-slate-100">
                                    {(["stake", "unstake"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveDepositTab(tab)}
                                            className={`flex-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none ${activeDepositTab === tab
                                                ? "text-emerald-700 border-b-2 border-emerald-500 bg-emerald-50/50"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            {tab === "stake" ? "Deposit" : "Withdraw"}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-5 space-y-4">
                                    {activeDepositTab === "stake" ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount</label>
                                                    <button
                                                        onClick={() => setStakeAmount(walletBalance)}
                                                        className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
                                                    >
                                                        Max: {formatCompactNumber(walletBalance)} DTC
                                                    </button>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={stakeAmount}
                                                        onChange={(e) => setStakeAmount(e.target.value)}
                                                        className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-4 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                                                    />
                                                    <span className="absolute right-3 text-xs font-semibold text-slate-400">DTC</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleStake}
                                                disabled={isPending || !stakeAmount || parseFloat(stakeAmount) <= 0 || !account}
                                                className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isApproving ? "Approving..." : isStaking ? "Processing..." : "Deposit DTC"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount</label>
                                                    <button
                                                        onClick={() => {
                                                            const staked = parseFloat(stakedBalance);
                                                            const debt = parseFloat(userDebt);
                                                            if (debt <= 0) {
                                                                setUnstakeAmount(stakedBalance);
                                                                return;
                                                            }
                                                            
                                                            const minCollateralNeeded = (debt * 1.02 * 100) / 50; 
                                                            const maxUnstake = Math.max(0, staked - minCollateralNeeded);
                                                            setUnstakeAmount(maxUnstake.toFixed(6));
                                                        }}
                                                        className="text-xs text-emerald-600 font-medium hover:text-emerald-700"
                                                    >
                                                        Max: { (parseFloat(userDebt) > 0) ? formatCompactNumber(Math.max(0, parseFloat(stakedBalance) - (parseFloat(userDebt) * 1.02 * 100) / 50).toFixed(6)) : formatCompactNumber(stakedBalance) } DTC
                                                    </button>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={unstakeAmount}
                                                        onChange={(e) => setUnstakeAmount(e.target.value)}
                                                        className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-4 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                                                    />
                                                    <span className="absolute right-3 text-xs font-semibold text-slate-400">DTC</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleWithdraw}
                                                disabled={isUnstaking || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || !account}
                                                className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isUnstaking ? "Processing..." : "Withdraw DTC"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuLock size={12} className="text-emerald-500" />
                                        Borrow Limit
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {isInfoLoading ? "—" : formatCompactNumber(borrowLimit)}
                                        <span className="text-xs font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuCoins size={12} className="text-emerald-500" />
                                        Borrowed
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {isInfoLoading ? "—" : formatPreciseNumber(userDebt)}
                                        <span className="text-xs font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                    {!isInfoLoading && (
                                        <p className="text-[10px] text-slate-400">
                                            Total: {formatCompactNumber(totalBorrowed)} DTC
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuTrendingUp size={12} className="text-emerald-500" />
                                        Borrow APY
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {isInfoLoading ? "—" : `${borrowRate}%`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuInfo size={12} className="text-emerald-500" />
                                        Liquidity
                                    </p>
                                    <p className="text-base font-semibold text-emerald-600">
                                        {isInfoLoading ? "—" : formatCompactNumber(poolLiquidity)}
                                        <span className="text-xs font-medium text-slate-400 ml-1">DTC</span>
                                    </p>
                                    {!isInfoLoading && (
                                        <p className="text-[10px] text-slate-400">{utilization}% utilized</p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-1">
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                        <LuClock size={12} className="text-emerald-500" />
                                        Reward Period
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {isInfoLoading ? "—" : (() => {
                                            const now = Math.floor(Date.now() / 1000);
                                            if (periodFinish === 0) return "Not set";
                                            if (periodFinish <= now) return "Ended";
                                            const remaining = periodFinish - now;
                                            const days = Math.floor(remaining / 86400);
                                            const hours = Math.floor((remaining % 86400) / 3600);
                                            return `${days}d ${hours}h left`;
                                        })()}
                                    </p>
                                    {!isInfoLoading && rewardsDuration > 0 && (
                                        <p className="text-[10px] text-slate-400">
                                            Duration: {Math.floor(rewardsDuration / 86400)}d
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                                <div className="flex border-b border-slate-100">
                                    {(["borrow", "repay"] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveBorrowTab(tab)}
                                            className={`flex-1 py-3 text-sm font-medium transition-colors focus-visible:outline-none capitalize ${activeBorrowTab === tab
                                                ? "text-emerald-700 border-b-2 border-emerald-500 bg-emerald-50/50"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-5 space-y-4">
                                    {activeBorrowTab === "borrow" ? (
                                        <>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount to Borrow</label>
                                                    <div className="flex flex-col items-end gap-0.5">
                                                        <button onClick={() => {
                                                            const max = parseFloat(borrowLimit) - parseFloat(userDebt);
                                                            const maxWithBuffer = Math.max(0, max * 0.99);
                                                            setBorrowInput(maxWithBuffer.toFixed(6));
                                                        }} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                                                            Max: {formatCompactNumber((parseFloat(borrowLimit) - parseFloat(userDebt)).toFixed(6))} DTC
                                                        </button>
                                                        {!isInfoLoading && (
                                                            <span className="text-[10px] text-slate-400">Rate: {borrowRate}% APY</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={borrowInput}
                                                        onChange={(e) => setBorrowInput(e.target.value)}
                                                        className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-4 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                                                    />
                                                    <span className="absolute right-3 text-xs font-semibold text-slate-400">DTC</span>
                                                </div>
                                            </div>
                                            {borrowInput && parseFloat(borrowInput) > parseFloat(poolLiquidity) && (
                                                <p className="text-[10px] text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                                                    ⚠ Borrow amount exceeds available pool liquidity. Transaction will likely fail.
                                                </p>
                                            )}
                                            {parseFloat(stakedBalance) === 0 && (
                                                <p className="text-[10px] text-orange-600 font-medium bg-orange-50 p-2 rounded-lg border border-orange-100">
                                                    ⚠ You have 0 DTC staked. Deposit DTC first as collateral before borrowing.
                                                </p>
                                            )}
                                            <button
                                                onClick={handleBorrow}
                                                disabled={isPending || !borrowInput || parseFloat(borrowInput) <= 0 || parseFloat(borrowInput) > (parseFloat(borrowLimit) - parseFloat(userDebt)) || parseFloat(stakedBalance) === 0 || !account}
                                                className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isBorrowing ? "Processing..." : "Borrow DTC"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-slate-800">Amount to Repay</label>
                                                    <button onClick={() => setRepayInput(userDebt)} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                                                        Debt: {formatPreciseNumber(userDebt)} DTC
                                                    </button>
                                                </div>
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="number"
                                                        placeholder="0.000000"
                                                        value={repayInput}
                                                        onChange={(e) => setRepayInput(e.target.value)}
                                                        className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-4 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                                                    />
                                                    <span className="absolute right-3 text-xs font-semibold text-slate-400">DTC</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleRepay}
                                                    disabled={isPending || !repayInput || parseFloat(repayInput) <= 0 || !account}
                                                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isRepaying ? "Processing..." : "Repay"}
                                                </button>
                                                <button
                                                    onClick={handleRepayAll}
                                                    disabled={isPending || parseFloat(userDebt) <= 0 || !account}
                                                    className="flex-1 rounded-xl border-2 border-emerald-600 bg-white py-2.5 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isRepayingAll ? "Processing..." : "Repay All"}
                                                </button>
                                            </div>
                                            {parseFloat(userDebt) > 0 && (
                                                <p className="text-[10px] text-slate-400 text-center">
                                                    💡 Gunakan &quot;Repay All&quot; untuk melunasi seluruh hutang termasuk bunga.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <LuInfo size={14} className="text-emerald-500" />
                                    Borrowing Information
                                </h4>
                                <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                                    <li>Borrowed amounts are added directly to your wallet.</li>
                                    <li>Interest accrues in real-time (per block) and is added to your total debt.</li>
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
