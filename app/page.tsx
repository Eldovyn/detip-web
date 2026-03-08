"use client";

import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuSearch, LuChevronRight, LuChevronLeft, LuHeart, LuTrophy } from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/api/usersService";
import { useAuth } from "@/hooks/useAuth";

const BrowseCreatorsPage = () => {
    const { account } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 8;

    const { data, isLoading } = useQuery({
        queryKey: ["donates", currentPage],
        queryFn: async () => {
            const response = await usersService.getDonates(currentPage, limit);
            return response.data;
        },
    });

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (data?.meta && currentPage < data.meta.total_pages) {
            setCurrentPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const creators = data?.data || [];
    const filteredCreators = creators.filter(c => c.address?.toLowerCase() !== account?.address?.toLowerCase());
    const isEmpty = !isLoading && filteredCreators.length === 0;

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

                    {/* Search - Currently UI only as backend search for donates isn't implemented */}
                    <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm">
                        <div className="relative w-full">
                            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Search by name, username, or bio..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-100 bg-slate-50 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    {/* Creators Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl border border-emerald-50 p-6 shadow-sm animate-pulse h-[340px]" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredCreators.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {filteredCreators.filter(c => 
                                        c.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        c.bio?.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((creator, index) => (
                                        <Link
                                            key={creator.username || index}
                                            href={`/donate/${creator.username}`}
                                            className="group bg-white rounded-3xl border border-emerald-50 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
                                        >
                                            <div className="relative mb-4">
                                                <Avatar className="h-24 w-24 ring-4 ring-emerald-50 group-hover:ring-emerald-200 transition-all">
                                                    <AvatarImage src={creator.avatar} alt={creator.username} />
                                                    <AvatarFallback className="text-2xl font-bold">{creator.username?.[0].toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                                                    <div className="bg-emerald-500 h-3 w-3 rounded-full" />
                                                </div>
                                            </div>

                                            <div className="space-y-1 mb-4">
                                                <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                    {creator.username}
                                                </h3>
                                                <p className="text-xs text-emerald-600 font-bold">
                                                    @{creator.username}
                                                </p>
                                            </div>

                                            <p className="text-xs text-slate-500 line-clamp-2 mb-6 min-h-[32px]">
                                                {creator.bio || "No bio available."}
                                            </p>

                                            <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between">
                                                <div className="text-left">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Status</p>
                                                    <p className="text-sm font-black text-slate-900">Active</p>
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
                                        We couldn't find any creators at the moment.
                                    </p>
                                </div>
                            )}

                            {/* Pagination Logic matching Transactions Page */}
                            {data?.meta && data.meta.total_pages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 px-2">
                                    <div className="text-sm text-slate-500 order-2 sm:order-1">
                                        Showing page <span className="font-bold text-slate-900">{data.meta.page}</span> of{" "}
                                        <span className="font-bold text-slate-900">{data.meta.total_pages}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 order-1 sm:order-2">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={!data.links.prev}
                                            className="h-11 px-4 flex items-center gap-2 rounded-2xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            <LuChevronLeft size={18} />
                                            Previous
                                        </button>
                                        
                                        <div className="hidden md:flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, data.meta.total_pages) }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`h-11 min-w-[44px] px-3 rounded-2xl text-sm font-bold transition-all ${
                                                        currentPage === page
                                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={!data.links.next}
                                            className="h-11 px-4 flex items-center gap-2 rounded-2xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            Next
                                            <LuChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default BrowseCreatorsPage;
