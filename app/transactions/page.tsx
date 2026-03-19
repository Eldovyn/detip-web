'use client';

import NavBar from "@/components/NavBar";
import { GrTransaction } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/api/transactionsService";
import { timeAgo, truncateMiddle } from "@/utils/format";
import { TransactionDetailDialog } from "@/components/TransactionDetailDialog";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const statusBadgeClass = (status: string) => {
    switch (status) {
        case "Success":
            return "bg-emerald-50 text-emerald-700 ring-emerald-500/30";
        case "Pending":
            return "bg-amber-50 text-amber-700 ring-amber-500/30";
        case "Failed":
            return "bg-rose-50 text-rose-700 ring-rose-500/30";
        default:
            return "bg-slate-50 text-slate-700 ring-slate-500/30";
    }
};

const TransactionsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const limit = 5;

    const { data, isLoading } = useQuery({
        queryKey: ["transactions", currentPage],
        queryFn: async () => {
            const response = await transactionsService.getTransactionsPage(currentPage, limit);
            return response.data;
        },
        enabled: !isSearching,
    });

    const { data: searchData, isLoading: isSearchingLoading } = useQuery({
        queryKey: ["transaction-search", searchQuery],
        queryFn: async () => {
            const response = await transactionsService.getTransaction(searchQuery);
            return response.data;
        },
        enabled: isSearching && searchQuery.length > 0,
    });

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (tx: Transaction) => {
        setSelectedTransaction(tx);
        setIsDialogOpen(true);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (data?.meta && currentPage < data.meta.total_pages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearching(true);
            setCurrentPage(1);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setIsSearching(false);
        setCurrentPage(1);
    };

    const transactions = data?.data || [];
    const isEmpty = !isLoading && transactions.length === 0;

    return (
        <>
            <NavBar />

            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Transactions
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                View all transactions on this network
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 sm:items-end">
                            <form onSubmit={handleSearch} className="flex gap-3">
                                <div className="relative">
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search hash..."
                                        className="w-56 rounded-xl border border-slate-200 bg-white px-3 h-11 pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 h-11 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 hover:bg-slate-50"
                                >
                                    <Search size={16} />
                                    Search
                                </button>
                                <select className="rounded-xl border border-slate-200 bg-white px-3 h-11 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40">
                                    <option>All statuses</option>
                                    <option>Success</option>
                                    <option>Pending</option>
                                    <option>Failed</option>
                                </select>
                            </form>
                            <span className="text-xs text-slate-400">
                                {isSearching
                                    ? "Search results"
                                    : `Showing ${data?.meta?.total_items ?? 0} recent transactions`}
                            </span>
                        </div>
                    </div>

                    {isSearching && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h3 className="text-sm font-medium text-slate-900 mb-3">
                                Search Result
                            </h3>
                            {isSearchingLoading ? (
                                <div className="text-center py-8 text-sm text-slate-500">
                                    Searching...
                                </div>
                            ) : searchData?.data ? (
                                <div
                                    className="cursor-pointer rounded-lg border border-slate-200 p-4 hover:bg-emerald-50/40 transition-colors"
                                    onClick={() => handleRowClick(searchData.data)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                                <GrTransaction
                                                    size={20}
                                                    className="text-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm text-emerald-700">
                                                    {truncateMiddle(searchData.data.hash, 14, 8)}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {truncateMiddle(searchData.data.from, 10, 6)} →{" "}
                                                    {searchData.data.to ? truncateMiddle(searchData.data.to, 10, 6) : "-"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-slate-700">
                                                {searchData.data.value_eth} ETH
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(
                                                    searchData.data.status
                                                )}`}
                                            >
                                                {searchData.data.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-sm text-slate-500">
                                    {`No transaction found for "${searchQuery}"`}
                                </div>
                            )}
                        </div>
                    )}

                    {!isSearching && (
                        <>
                            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            <th className="px-4 py-3 text-left">Tx Hash</th>
                                            <th className="px-4 py-3 text-left">Age</th>
                                            <th className="px-4 py-3 text-left">From</th>
                                            <th className="px-4 py-3 text-left">To</th>
                                            <th className="px-4 py-3 text-right">Value</th>
                                            <th className="px-4 py-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : isEmpty ? (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                                                    No transactions found
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx) => (
                                                <tr
                                                    key={tx.hash}
                                                    className="cursor-pointer hover:bg-emerald-50/40 transition-colors"
                                                    onClick={() => handleRowClick(tx)}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                                                                <GrTransaction
                                                                    size={18}
                                                                    className="text-emerald-500"
                                                                />
                                                            </div>
                                                            <span
                                                                className="font-mono text-sm text-emerald-700"
                                                            >
                                                                {truncateMiddle(tx.hash, 14, 8)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-500">
                                                        {timeAgo(tx.datetime)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">
                                                        <span className="font-mono">
                                                            {truncateMiddle(tx.from, 10, 6)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">
                                                        <span className="font-mono">
                                                            {tx.to ? truncateMiddle(tx.to, 10, 6) : "-"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-slate-700">
                                                        {tx.value_eth}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm">
                                                        <span
                                                            className={`inline-flex items-center justify-center rounded-xl px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(
                                                                tx.status
                                                            )}`}
                                                        >
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space-y-3 md:hidden">
                                {isLoading ? (
                                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                                        Loading...
                                    </div>
                                ) : isEmpty ? (
                                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                                        No transactions found
                                    </div>
                                ) : (
                                    transactions.map((tx) => (
                                        <div
                                            key={tx.hash}
                                            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 hover:bg-emerald-50/40 transition-colors"
                                            onClick={() => handleRowClick(tx)}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                                                            <GrTransaction
                                                                size={18}
                                                                className="text-emerald-500"
                                                            />
                                                        </div>
                                                        <p className="font-mono text-sm text-emerald-700">
                                                            {truncateMiddle(tx.hash, 14, 8)}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {truncateMiddle(tx.from, 10, 6)} →{" "}
                                                        {truncateMiddle(tx.to, 10, 6)}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`shrink-0 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(
                                                        tx.status
                                                    )}`}
                                                >
                                                    {tx.status}
                                                </span>
                                            </div>
                                            <div className="mt-3 flex justify-between text-xs text-slate-500">
                                                <span>{timeAgo(tx.datetime)}</span>
                                                <span>{tx.value_eth}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {data?.meta && (
                                <div className="flex items-center justify-between px-2">
                                    <div className="text-sm text-slate-500">
                                        Page <span className="font-medium text-slate-900">{data.meta.page}</span> of{" "}
                                        <span className="font-medium text-slate-900">{data.meta.total_pages}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={!data.links.prev}
                                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 h-10 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <ChevronLeft size={16} />
                                            Previous
                                        </button>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={!data.links.next}
                                            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 h-10 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <TransactionDetailDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                transaction={selectedTransaction}
            />
        </>
    );
};

export default TransactionsPage;
