"use client";

import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuHeart, LuMessageSquare, LuCoins, LuChevronRight, LuChevronLeft } from "react-icons/lu";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/api/usersService";
import { useAuth } from "@/hooks/useAuth";
import { donationsService } from "@/api/donationsService";
import { useReadContract } from "thirdweb/react";
import { dtcDonateContract } from "@/lib/contracts/DTCDonate";
import { toEther } from "thirdweb";

const ITEMS_PER_PAGE = 4;

const DonationsPage = () => {
    const { accessToken, account } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: globalTotalDistributed } = useReadContract({
        contract: dtcDonateContract,
        method: "totalReceived",
        params: [],
    });

    const { data: userReceivedVal } = useReadContract({
        contract: dtcDonateContract,
        method: "userReceived",
        params: [account?.address || "0x0000000000000000000000000000000000000000"],
    });

    const displayTotalDistributed = useMemo(() => {
        const value = account ? userReceivedVal : globalTotalDistributed;
        if (!value) return "0.00";
        return toEther(value);
    }, [globalTotalDistributed, userReceivedVal, account]);

    const { data: creatorsData, isLoading: isLoadingCreators } = useQuery({
        queryKey: ["favorites", accessToken],
        queryFn: async () => {
            const response = await usersService.getFavorites(1, 3, accessToken ?? "");
            return response.data;
        },
    });

    const favoriteUsers = useMemo(() => {
        return creatorsData?.data || [];
    }, [creatorsData]);

    const { data: donationsData, isLoading: isLoadingDonations } = useQuery({
        queryKey: ["donations", currentPage, ITEMS_PER_PAGE, accessToken],
        queryFn: async () => {
            const response = await donationsService.getDonations(currentPage, ITEMS_PER_PAGE, accessToken ?? "");
            return response.data;
        },
    });

    const donations = useMemo(() => {
        if (!donationsData?.data) return [];

        return donationsData.data.map((donation) => {
            return {
                id: donation.transaction_hash,
                user: {
                    name: donation?.username || "Anonymous",
                    username: donation.from.slice(0, 6) + "..." + donation.from.slice(-4),
                    avatar: donation.avatar,
                },
                recipient: donation.to,
                amount: donation.amountDTC / 1e18,
                message: donation.message,
                timestamp: donation.timestamp ? new Date(donation.timestamp * 1000).toLocaleString() : "Recent",
                blockNumber: donation.block_number,
            };
        });
    }, [donationsData]);

    const totalPages = donationsData?.meta?.total_pages || 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-5xl px-4 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    <header className="space-y-1">
                        <h1 className="text-2xl font-bold text-slate-900">Donations</h1>
                        <p className="text-sm text-slate-500">
                            View the latest support from the community.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {isLoadingDonations ? (
                                    [...Array(5)].map((_, i) => (
                                        <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 animate-pulse flex gap-4">
                                            <div className="h-12 w-12 rounded-full bg-slate-100 shrink-0" />
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between">
                                                    <div className="h-4 w-24 bg-slate-100 rounded" />
                                                    <div className="h-6 w-16 bg-slate-100 rounded-full" />
                                                </div>
                                                <div className="h-3 w-40 bg-slate-50 rounded" />
                                            </div>
                                        </div>
                                    ))
                                ) : donations.length > 0 ? (
                                    donations.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="group rounded-2xl border border-emerald-100 bg-white p-5 transition-all duration-300 border-l-4 border-l-emerald-500"
                                        >
                                            <div className="flex items-start gap-4">
                                                <Avatar className="h-12 w-12 shrink-0 border border-slate-100">
                                                    <AvatarImage src={donation.user.avatar} alt={donation.user.name} />
                                                    <AvatarFallback>{donation.user.name?.[0] || "?"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <p className="font-semibold text-slate-900 truncate">
                                                                {donation.user.name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[120px]">
                                                                {donation.user.username}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                            <LuCoins size={14} className="text-emerald-600" />
                                                            <span className="text-sm font-bold text-emerald-700">
                                                                {donation.amount}
                                                            </span>
                                                            <span className="text-[10px] font-medium text-emerald-600/70 uppercase">DTC</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                            To: {donation.recipient.slice(0, 6)}...{donation.recipient.slice(-4)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            • {donation.timestamp}
                                                        </span>
                                                    </div>

                                                    {donation.message && (
                                                        <div className="mt-3 relative">
                                                            <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-slate-100 rounded-full" />
                                                            <div className="flex gap-2 text-slate-600 italic text-sm">
                                                                <LuMessageSquare size={16} className="shrink-0 text-emerald-400/60 mt-0.5" />
                                                                <p className="leading-relaxed">
                                                                    &quot;{donation.message}&quot;
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-400 italic text-sm">No donations found yet.</p>
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-6">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <LuChevronLeft size={16} />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1 mx-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`h-10 min-w-[40px] px-2 rounded-xl text-xs font-bold transition-all ${currentPage === page
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                        <LuChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl border border-emerald-100 bg-white p-6 sticky top-24">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        <LuHeart size={16} className="text-rose-500 fill-rose-500" />
                                        Favorites
                                    </h2>
                                    <Link
                                        href="/favorites"
                                        className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider"
                                    >
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {isLoadingCreators ? (
                                        [...Array(3)].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                                                <div className="h-10 w-10 rounded-full bg-slate-100" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-3 w-20 bg-slate-100 rounded" />
                                                    <div className="h-2 w-16 bg-slate-100 rounded" />
                                                </div>
                                            </div>
                                        ))
                                    ) : favoriteUsers.length > 0 ? (
                                        favoriteUsers.map((user) => (
                                            <Link
                                                href={`/donate/${user.username}`}
                                                key={user.username}
                                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/50 transition-colors group"
                                            >
                                                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-emerald-50 ring-offset-1 group-hover:ring-emerald-200 transition-all">
                                                    <AvatarImage src={user.avatar} alt={user.username} />
                                                    <AvatarFallback>{user.username?.[0].toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                                        {user.username}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                                <LuChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-0.5 transition-all" />
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="py-4 text-center">
                                            <p className="text-xs text-slate-400 italic">No favorites yet</p>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/"
                                    className="block w-full text-center mt-6 py-2.5 px-4 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                                >
                                    Browse more creators
                                </Link>
                            </div>

                            <div className="rounded-2xl bg-emerald-600 p-6 text-white overflow-hidden relative group">
                                <div className="absolute -right-4 -bottom-4 bg-emerald-500/30 rounded-full w-24 h-24 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 space-y-1">
                                    <p className="text-emerald-100 text-[11px] font-medium uppercase tracking-widest">
                                        {account ? "Your Total Received" : "Global Total Distributed"}
                                    </p>
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <LuCoins />
                                        {displayTotalDistributed} DTC
                                    </h3>
                                    <p className="text-emerald-100/70 text-[10px]">
                                        {account ? "Total support you've received" : "Helping creators the community"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};


export default DonationsPage;
