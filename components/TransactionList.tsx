import Link from "next/link";
import { GrTransaction } from "react-icons/gr";
import { truncateMiddle } from "@/utils/string";

export function TransactionList({ transactions }: TransactionListProps) {
    return (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Transactions</p>
                <span className="text-xs text-slate-500">Latest</span>
            </div>

            <div className="mt-4 space-y-2">
                {transactions.map((tx, idx) => (
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
                                    title={tx.hash}
                                    className="block truncate font-mono text-sm text-slate-900 hover:text-emerald-700"
                                >
                                    {truncateMiddle(tx.hash, 18, 10)}
                                </Link>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Status: <span className="text-emerald-700">{tx.status}</span> • {tx.time}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">{tx.amount}</p>
                                <p className="text-xs text-slate-500">Fee {tx.fee}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end -translate-x-1">
                <Link
                    href="/transactions"
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                    View all
                </Link>
            </div>
        </div>
    );
}
