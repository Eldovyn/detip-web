'use client';

import Link from "next/link";
import { GrTransaction } from "react-icons/gr";
import { truncateMiddle } from "@/utils/string";
import { transactionsService } from "@/api/transactionsService";
import { useQuery } from "@tanstack/react-query";
import { timeAgo } from "@/utils/format";
import { TransactionDetailDialog } from "@/components/TransactionDetailDialog";
import { useState } from "react";

export function TransactionList() {
    const { data } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await transactionsService.getTransactionsPage(1, 5);
            return response.data;
        },
    });

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (tx: Transaction) => {
        setSelectedTransaction(tx);
        setIsDialogOpen(true);
    };

    return (
        <>
            <div className="rounded-2xl border border-emerald-100 bg-white p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Transactions</p>
                    <span className="text-xs text-slate-500">Latest</span>
                </div>

                <div className="mt-4 space-y-2">
                    {data?.data.map((tx: Transaction, idx: number) => (
                        <div
                            key={idx}
                            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-emerald-50/40"
                            onClick={() => handleRowClick(tx)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                    <GrTransaction size={16} className="text-emerald-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p
                                        title={tx.hash}
                                        className="block truncate font-mono text-sm text-slate-900"
                                    >
                                        {truncateMiddle(tx.hash, 18, 10)}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Status: <span className="text-emerald-700">{tx.status}</span> • {timeAgo(tx.datetime)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-900">{tx.value_eth}</p>
                                    <p className="text-xs text-slate-500">Fee {tx.gas}</p>
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

            <TransactionDetailDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                transaction={selectedTransaction}
            />
        </>
    );
}
