"use client";

import NavBar from "@/components/NavBar";
import Link from "next/link";
import { 
    LuArrowDown, 
    LuArrowDownUp, 
    LuLoader, 
    LuWallet, 
    LuInfo, 
    LuArrowLeft,
    LuRepeat
} from "react-icons/lu";
import { toEther } from "thirdweb";
import { useSwap } from "@/hooks/useSwap";

const SwapPage = () => {
    const swap = useSwap();

    const {
        account,
        direction,
        amountIn,
        amountOut,
        isSwapping,
        isButtonDisabled,
        isEthToDtc,
        inputSymbol,
        outputSymbol,
        dtcBalance,
        ethBalance,
        allowance,
        amountInWei,
        handleAmountChange,
        setAmountIn,
        toggleDirection,
        handleSwap,
    } = swap;

    const currentBalance = isEthToDtc 
        ? (ethBalance !== undefined ? toEther(ethBalance) : "0") 
        : (dtcBalance !== undefined ? toEther(dtcBalance) : "0");

    const handlePercentage = (percent: number) => {
        if (!currentBalance || parseFloat(currentBalance) <= 0) return;
        const amount = (parseFloat(currentBalance) * percent) / 100;
        setAmountIn(amount.toFixed(6));
    };

    return (
        <>
            <NavBar />

            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-[480px] px-4 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white">
                                <LuRepeat size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 leading-none">Swap</h1>
                                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1">Instant Exchange</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50"
                            >
                                <LuArrowLeft size={14} />
                                Overview
                            </Link>
                        </div>
                    </div>

                    <div className="relative space-y-2">
                        {/* Input Section (You Pay) */}
                        <div className="rounded-3xl border border-emerald-100 bg-white p-5 space-y-4 hover:border-emerald-200 transition-all group">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">You Pay</span>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <LuWallet size={12} className="text-emerald-500" />
                                    <span>
                                        Balance: {Number(currentBalance).toLocaleString("en-US", { maximumFractionDigits: 6 })} {inputSymbol}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={amountIn}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        placeholder="0.0"
                                        className="w-full bg-transparent text-3xl font-bold text-slate-900 outline-none placeholder:text-slate-200"
                                    />
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-2xl ring-2 ring-transparent group-focus-within:ring-emerald-100 transition-all">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isEthToDtc ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                                        {inputSymbol[0]}
                                    </div>
                                    <span className="text-lg font-bold text-slate-900">{inputSymbol}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {[25, 50, 75, 100].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePercentage(p)}
                                        disabled={isSwapping}
                                        className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 rounded-xl border border-transparent hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {p === 100 ? 'Max' : `${p}%`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Flip Direction Button */}
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <button
                                type="button"
                                onClick={toggleDirection}
                                disabled={isSwapping}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-slate-50 bg-emerald-600 text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                                aria-label="Flip direction"
                            >
                                <LuArrowDown size={20} />
                            </button>
                        </div>

                        {/* Output Section (You Receive) */}
                        <div className="rounded-3xl border border-emerald-100/50 bg-slate-50/80 p-5 space-y-4 pt-8">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">You Receive</span>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                    <span>
                                        Balance: {isEthToDtc 
                                            ? (dtcBalance !== undefined ? Number(toEther(dtcBalance)).toLocaleString("en-US", { maximumFractionDigits: 4 }) : "...") 
                                            : (ethBalance !== undefined ? Number(toEther(ethBalance)).toLocaleString("en-US", { maximumFractionDigits: 4 }) : "...")
                                        } {outputSymbol}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        readOnly
                                        value={amountOut}
                                        placeholder="0.0"
                                        className="w-full bg-transparent text-3xl font-bold text-slate-900 outline-none placeholder:text-slate-200"
                                    />
                                </div>
                                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-emerald-50">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${!isEthToDtc ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                                        {outputSymbol[0]}
                                    </div>
                                    <span className="text-lg font-bold text-slate-900">{outputSymbol}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Swap Info */}
                    {amountIn && parseFloat(amountIn) > 0 && (
                        <div className="rounded-2xl bg-white border border-slate-100 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-medium">Exchange Rate</span>
                                <span className="text-slate-900 font-bold">1 {inputSymbol} ≈ {parseFloat(amountOut) / parseFloat(amountIn)} {outputSymbol}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                                    Slippage Tolerance
                                    <LuInfo size={12} className="text-slate-300" />
                                </span>
                                <span className="text-emerald-600 font-bold">5.0%</span>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        type="button"
                        onClick={handleSwap}
                        disabled={isButtonDisabled}
                        className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSwapping ? (
                            <>
                                <LuLoader className="h-5 w-5 animate-spin" />
                                {direction === "DTC_TO_ETH" && allowance !== undefined && allowance < amountInWei ? "Approving Tokens..." : "Swapping Now..."}
                            </>
                        ) : !account ? (
                            "Connect Wallet"
                        ) : !amountIn || parseFloat(amountIn) <= 0 ? (
                            "Enter Amount"
                        ) : (
                            <>
                                Confirm Swap
                                <LuArrowDownUp size={18} />
                            </>
                        )}
                    </button>

                    {/* Footer Info */}
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                        <LuInfo size={12} />
                        <p className="text-[10px] font-medium uppercase tracking-widest">Powered by DeTip Smart Router</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SwapPage;
