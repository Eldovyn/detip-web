"use client";

import NavBar from "@/components/NavBar";
import Link from "next/link";
import { LuArrowDownUp, LuLoader } from "react-icons/lu";
import { toEther } from "thirdweb";
import { useSwap } from "@/hooks/useSwap";

const PRIMARY_BTN =
    "inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

const SwapPage = () => {
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
        toggleDirection,
        handleSwap,
    } = useSwap();

    return (
        <>
            <NavBar />

            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Header card */}
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-900">Swap tokens</p>
                                <p className="text-3xl font-semibold text-slate-900">
                                    {inputSymbol} → {outputSymbol}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {amountOut ? `Expected receive: ${Number(amountOut).toLocaleString("en-US", { maximumFractionDigits: 6 })} ${outputSymbol}` : "Enter an amount to see expected output"}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <Link
                                    href="/"
                                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                                >
                                    Back to overview
                                </Link>
                                <button
                                    type="button"
                                    onClick={toggleDirection}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-emerald-600 hover:bg-white"
                                    aria-label="Flip direction"
                                >
                                    <LuArrowDownUp size={17} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Swap form card */}
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5">
                        {/* From */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>From</span>
                                <span className="text-[11px]">
                                    Balance: {isEthToDtc ? (ethBalance !== undefined ? Number(toEther(ethBalance)).toLocaleString("en-US", { maximumFractionDigits: 4 }) : "...") : (dtcBalance !== undefined ? Number(toEther(dtcBalance)).toLocaleString("en-US", { maximumFractionDigits: 4 }) : "...")} {inputSymbol}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                                <div className="flex flex-col">
                                    <span className="text-[11px] uppercase tracking-wide text-slate-500">
                                        Token
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {inputSymbol}
                                    </span>
                                </div>
                                <div className="h-9 w-px bg-slate-200" />
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={amountIn}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-transparent text-right text-2xl font-semibold text-slate-900 outline-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* To */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>To (est.)</span>
                                <span className="text-[11px]">
                                    Balance: {isEthToDtc ? (dtcBalance !== undefined ? Number(toEther(dtcBalance)).toLocaleString("en-US", { maximumFractionDigits: 4 }) : "...") : (ethBalance !== undefined ? Number(toEther(ethBalance)).toLocaleString("en-US", { maximumFractionDigits: 4 }) : "...")} {outputSymbol}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
                                <div className="flex flex-col">
                                    <span className="text-[11px] uppercase tracking-wide text-slate-500">
                                        Token
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {outputSymbol}
                                    </span>
                                </div>
                                <div className="h-9 w-px bg-slate-200" />
                                <input
                                    type="text"
                                    readOnly
                                    value={amountOut}
                                    placeholder="0.0"
                                    className="w-full bg-transparent text-right text-2xl font-semibold text-slate-900 outline-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSwap}
                            disabled={isButtonDisabled}
                            className={PRIMARY_BTN}
                        >
                            {isSwapping ? (
                                <>
                                    <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                                    {direction === "DTC_TO_ETH" && allowance !== undefined && allowance < amountInWei ? "Approving & Swapping..." : "Confirm in Wallet..."}
                                </>
                            ) : account ? (
                                "Swap"
                            ) : (
                                "Connect Wallet to Swap"
                            )}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SwapPage;
