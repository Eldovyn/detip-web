import NavBar from "@/components/NavBar";
import { HiDotsVertical } from "react-icons/hi";
import Link from "next/link";
import { GrTransaction } from "react-icons/gr";

const truncateMiddle = (str: string, front = 14, back = 4) => {
    if (!str) return "";
    if (str.length <= front + back + 3) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
};

const PRIMARY_BTN =
    "inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white";

export default function Page() {
    const hash =
        "0xaa73e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db421";

    return (
        <>
            <NavBar />

            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">
                    {/* Balance card */}
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-900">DTC Balance</p>
                                <p className="text-3xl font-semibold text-slate-900">100 DTC</p>
                                <p className="text-sm text-slate-500">Available</p>
                            </div>

                            <button
                                className="rounded-md p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                aria-label="More options"
                            >
                                <HiDotsVertical size={20} />
                            </button>
                        </div>

                        <div className="mt-5 flex items-center justify-end">
                            <button className={PRIMARY_BTN}>Swap token</button>
                        </div>
                    </div>

                    {/* Transactions card */}
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">Transactions</p>
                            <span className="text-xs text-slate-500">Latest</span>
                        </div>

                        <div className="mt-4 space-y-2">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-emerald-50/40"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                            <GrTransaction size={16} className="text-emerald-600" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href="/transaction"
                                                title={hash}
                                                className="block truncate font-mono text-sm text-slate-900 hover:text-emerald-700"
                                            >
                                                {truncateMiddle(hash, 18, 10)}
                                            </Link>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Status: <span className="text-emerald-700">Success</span> •
                                                12s ago
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-900">0.024 ETH</p>
                                            <p className="text-xs text-slate-500">Fee 0.00042</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Link
                                href="/transactions"
                                className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                            >
                                View all
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
