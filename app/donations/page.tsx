"use client";

import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuHeart, LuMessageSquare, LuCoins, LuChevronRight, LuChevronLeft } from "react-icons/lu";
import Link from "next/link";
import { useState, useMemo } from "react";

const ALL_DONATIONS = [
    {
        id: 1,
        user: {
            name: "Alex Rivera",
            username: "arivera",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        },
        amount: "0.005",
        message: "Keep up the great work! Love the new features.",
        timestamp: "2 hours ago",
    },
    {
        id: 2,
        user: {
            name: "Sarah Chen",
            username: "schen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
        amount: "0.002",
        message: "Thanks for the helpful content!",
        timestamp: "5 hours ago",
    },
    {
        id: 3,
        user: {
            name: "Marcus Thorne",
            username: "mthorne",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        },
        amount: "0.01",
        message: "",
        timestamp: "1 day ago",
    },
    {
        id: 4,
        user: {
            name: "Elena Rodriguez",
            username: "erodriguez",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        },
        amount: "0.003",
        message: "This project is amazing. So happy to support!",
        timestamp: "2 days ago",
    },
    {
        id: 5,
        user: {
            name: "James Wilson",
            username: "jwilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        },
        amount: "0.001",
        message: "Small tip but big fan!",
        timestamp: "3 days ago",
    },
    {
        id: 6,
        user: {
            name: "Lisa Wang",
            username: "lwang",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        },
        amount: "0.007",
        message: "The new UI looks great!",
        timestamp: "4 days ago",
    },
    {
        id: 7,
        user: {
            name: "Tom Harris",
            username: "tharris",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
        },
        amount: "0.004",
        message: "Supporting from London.",
        timestamp: "5 days ago",
    },
    {
        id: 8,
        user: {
            name: "Rachel Moore",
            username: "rmoore",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
        },
        amount: "0.002",
        message: "",
        timestamp: "1 week ago",
    },
];

const favoriteUsers = [
    {
        id: 1,
        name: "David Kim",
        username: "dkim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
        id: 2,
        name: "Sophie Bennett",
        username: "sbennett",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    },
    {
        id: 3,
        name: "Jordan Lee",
        username: "jlee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    },
];

const ITEMS_PER_PAGE = 4;

const DonationsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(ALL_DONATIONS.length / ITEMS_PER_PAGE);
    
    const paginatedDonations = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return ALL_DONATIONS.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage]);

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
                        {/* Main Content - Donation List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {paginatedDonations.map((donation) => (
                                    <div
                                        key={donation.id}
                                        className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-emerald-500"
                                    >
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-12 w-12 shrink-0 border border-slate-100">
                                                <AvatarImage src={donation.user.avatar} alt={donation.user.name} />
                                                <AvatarFallback>{donation.user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold text-slate-900 truncate">
                                                            {donation.user.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            @{donation.user.username} • {donation.timestamp}
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

                                                {donation.message && (
                                                    <div className="mt-3 relative">
                                                        <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-slate-100 rounded-full" />
                                                        <div className="flex gap-2 text-slate-600 italic text-sm">
                                                            <LuMessageSquare size={16} className="shrink-0 text-emerald-400/60 mt-0.5" />
                                                            <p className="leading-relaxed">
                                                                "{donation.message}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-6">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <LuChevronLeft size={14} />
                                        Prev
                                    </button>
                                    
                                    <div className="flex items-center gap-1 mx-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                                                    currentPage === page
                                                        ? "bg-emerald-600 text-white shadow-sm"
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
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                        <LuChevronRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Favorites */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sticky top-24">
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
                                    {favoriteUsers.map((user) => (
                                        <Link
                                            href={`/donate/${user.username}`}
                                            key={user.id}
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50/50 transition-colors group"
                                        >
                                            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-emerald-50 ring-offset-1 group-hover:ring-emerald-200 transition-all">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    @{user.username}
                                                </p>
                                            </div>
                                            <LuChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-0.5 transition-all" />
                                        </Link>
                                    ))}
                                </div>

                                <Link 
                                    href="/"
                                    className="block w-full text-center mt-6 py-2.5 px-4 rounded-xl border border-emerald-100 bg-emerald-50/30 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                                >
                                    Browse more creators
                                </Link>
                            </div>

                            <div className="rounded-2xl bg-emerald-600 p-6 text-white shadow-lg shadow-emerald-200/50 overflow-hidden relative group">
                                <div className="absolute -right-4 -bottom-4 bg-emerald-500/30 rounded-full w-24 h-24 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 space-y-1">
                                    <p className="text-emerald-100 text-[11px] font-medium uppercase tracking-widest">Total Distributed</p>
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <LuCoins />
                                        12.45 DTC
                                    </h3>
                                    <p className="text-emerald-100/70 text-[10px]">Helping 24 creators this month</p>
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
