"use client";

import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuSearch, LuChevronRight, LuChevronLeft, LuHeart, LuTrophy } from "react-icons/lu";
import Link from "next/link";
import { useState, useMemo } from "react";

const ALL_CREATORS = [
    {
        id: 1,
        name: "David Kim",
        username: "dkim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        bio: "Digital artist and blockchain enthusiast.",
        followers: "12.4k",
    },
    {
        id: 2,
        name: "Sophie Bennett",
        username: "sbennett",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
        bio: "Full-stack developer building the future of Web3.",
        followers: "8.2k",
    },
    {
        id: 3,
        name: "Jordan Lee",
        username: "jlee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        bio: "Content creator focused on tech and lifestyle.",
        followers: "5.1k",
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        username: "erodriguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        bio: "Writer and educator sharing insights on DeFi.",
        followers: "15.9k",
    },
    {
        id: 5,
        name: "Marcus Thorne",
        username: "mthorne",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        bio: "Musician exploring decentralized platforms.",
        followers: "3.2k",
    },
    {
        id: 6,
        name: "Sarah Chen",
        username: "schen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        bio: "Product designer with a passion for UX.",
        followers: "9.5k",
    },
    {
        id: 7,
        name: "Alex Rivera",
        username: "arivera",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        bio: "Software engineer and open source contributor.",
        followers: "22.1k",
    },
    {
        id: 8,
        name: "Lisa Wang",
        username: "lwang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        bio: "Crypto analyst and community builder.",
        followers: "11.2k",
    },
    {
        id: 9,
        name: "Tom Harris",
        username: "tharris",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
        bio: "Photographer documenting the crypto revolution.",
        followers: "4.8k",
    },
    {
        id: 10,
        name: "Rachel Moore",
        username: "rmoore",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
        bio: "Entrepreneur and early adopter of blockchain tech.",
        followers: "7.6k",
    },
    {
        id: 11,
        name: "Zoe Styles",
        username: "zstyles",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
        bio: "Pro gamer and streamer.",
        followers: "32.4k",
    },
    {
        id: 12,
        name: "Leo Harmon",
        username: "lharmon",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
        bio: "Indie pop artist.",
        followers: "1.2k",
    },
];

const ITEMS_PER_PAGE = 8;

const BrowseCreatorsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredCreators = useMemo(() => {
        return ALL_CREATORS.filter(creator => {
            return creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                creator.bio.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredCreators.length / ITEMS_PER_PAGE);
    
    const paginatedCreators = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCreators.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredCreators, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-6xl px-4 pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Header */}
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider">
                            <LuTrophy size={14} className="text-emerald-500" />
                            Discover Creators
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                            Support your favorite <br className="hidden sm:block" /> 
                            <span className="text-emerald-600">independent creators</span>
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Browse through our community of artists, developers, and writers. 
                            Your support helps them continue their incredible work.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm">
                        <div className="relative w-full">
                            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Search by name, username, or bio..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-100 bg-slate-50 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    {/* Creators Grid */}
                    {paginatedCreators.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {paginatedCreators.map((creator) => (
                                <Link
                                    key={creator.id}
                                    href={`/donate/${creator.username}`}
                                    className="group bg-white rounded-3xl border border-emerald-50 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                                >
                                    <div className="relative mb-4">
                                        <Avatar className="h-24 w-24 ring-4 ring-emerald-50 group-hover:ring-emerald-200 transition-all">
                                            <AvatarImage src={creator.avatar} alt={creator.name} />
                                            <AvatarFallback className="text-2xl font-bold">{creator.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                                            <div className="bg-emerald-500 h-3 w-3 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-4">
                                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                            {creator.name}
                                        </h3>
                                        <p className="text-xs text-emerald-600 font-bold">
                                            @{creator.username}
                                        </p>
                                    </div>

                                    <p className="text-xs text-slate-500 line-clamp-2 mb-6 min-h-[32px]">
                                        {creator.bio}
                                    </p>

                                    <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Supporters</p>
                                            <p className="text-sm font-black text-slate-900">{creator.followers}</p>
                                        </div>
                                        <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <LuHeart size={18} className="group-hover:fill-current" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-emerald-100">
                            <LuSearch size={48} className="text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">No creators found</h3>
                            <p className="text-slate-500 mt-2 text-sm">
                                We couldn't find any creators matching your search.
                            </p>
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="mt-6 text-emerald-600 font-bold text-sm hover:underline"
                            >
                                Clear search
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 transition-all"
                            >
                                <LuChevronLeft size={20} />
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`h-10 min-w-[40px] px-3 rounded-2xl text-xs font-bold transition-all ${
                                            currentPage === page
                                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                : "bg-white border border-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 transition-all"
                            >
                                <LuChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default BrowseCreatorsPage;
