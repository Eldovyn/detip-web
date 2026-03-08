"use client";

import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuHeart, LuChevronRight, LuChevronLeft, LuSearch } from "react-icons/lu";
import Link from "next/link";
import { useState, useMemo } from "react";

const ALL_FAVORITES = [
    {
        id: 1,
        name: "David Kim",
        username: "dkim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        bio: "Digital artist and blockchain enthusiast.",
    },
    {
        id: 2,
        name: "Sophie Bennett",
        username: "sbennett",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
        bio: "Full-stack developer building the future of Web3.",
    },
    {
        id: 3,
        name: "Jordan Lee",
        username: "jlee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        bio: "Content creator focused on tech and lifestyle.",
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        username: "erodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        bio: "Writer and educator sharing insights on DeFi.",
    },
    {
        id: 5,
        name: "Marcus Thorne",
        username: "mthorne",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        bio: "Musician exploring decentralized platforms.",
    },
    {
        id: 6,
        name: "Sarah Chen",
        username: "schen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        bio: "Product designer with a passion for UX.",
    },
    {
        id: 7,
        name: "Alex Rivera",
        username: "arivera",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        bio: "Software engineer and open source contributor.",
    },
    {
        id: 8,
        name: "Lisa Wang",
        username: "lwang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        bio: "Crypto analyst and community builder.",
    },
    {
        id: 9,
        name: "Tom Harris",
        username: "tharris",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
        bio: "Photographer documenting the crypto revolution.",
    },
    {
        id: 10,
        name: "Rachel Moore",
        username: "rmoore",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
        bio: "Entrepreneur and early adopter of blockchain tech.",
    },
];

const ITEMS_PER_PAGE = 6;

const FavoritesPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredFavorites = useMemo(() => {
        return ALL_FAVORITES.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredFavorites.length / ITEMS_PER_PAGE);
    
    const paginatedFavorites = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredFavorites.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredFavorites, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-5xl px-4 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <LuHeart className="text-rose-500 fill-rose-500" size={24} />
                                Favorite Creators
                            </h1>
                            <p className="text-sm text-slate-500">
                                Creators you support and follow closely.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link 
                                href="/"
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                            >
                                <LuSearch size={14} />
                                Discover
                            </Link>
                            <div className="relative w-full sm:w-64">
                                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text"
                                    placeholder="Search favorites..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                />
                            </div>
                        </div>
                    </header>

                    {paginatedFavorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedFavorites.map((user) => (
                                <Link
                                    key={user.id}
                                    href={`/donate/${user.username}`}
                                    className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center space-y-4"
                                >
                                    <Avatar className="h-20 w-20 ring-4 ring-emerald-50 ring-offset-2 group-hover:ring-emerald-200 transition-all">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="text-xl font-bold">{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                            {user.name}
                                        </h3>
                                        <p className="text-xs text-emerald-600 font-medium">@{user.username}</p>
                                    </div>

                                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                                        {user.bio}
                                    </p>

                                    <div className="pt-2 w-full">
                                        <div className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-emerald-50 py-2 text-xs font-bold text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            Support Creator
                                            <LuChevronRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                             <LuSearch size={40} className="text-slate-200 mx-auto mb-4" />
                            <h3 className="font-bold text-slate-900">No favorites found</h3>
                            <p className="text-sm text-slate-500 mt-1 mb-6">Try a different search term or discover new creators.</p>
                            <Link 
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                            >
                                Browse All Creators
                                <LuChevronRight size={14} />
                            </Link>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 transition-colors"
                            >
                                <LuChevronLeft size={18} />
                            </button>
                            
                            <div className="flex items-center gap-1 px-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`h-9 min-w-[36px] px-2 rounded-lg text-xs font-bold transition-all ${
                                            currentPage === page
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
                                className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50 transition-colors"
                            >
                                <LuChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default FavoritesPage;
