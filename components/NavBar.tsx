'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "./ConnectWallet";

const NavBar = () => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <>
            <style jsx global>{`
                .navbar-end button img,
                .navbar-end button svg {
                    max-width: 20px !important;
                    max-height: 20px !important;
                    width: 20px !important;
                    height: 20px !important;
                }
                .navbar .dropdown div[role="button"]:focus,
                .navbar .dropdown div[role="button"]:active,
                .navbar .menu li a:focus,
                .navbar .menu li a:active {
                    background-color: transparent !important;
                    color: inherit !important;
                    outline: none !important;
                }
                .navbar .dropdown-content li a:hover {
                    background-color: #ecfdf5 !important;
                    color: #047857 !important;
                }
                .navbar .dropdown-content li a:active,
                .navbar .dropdown-content li a:focus {
                    background-color: #d1fae5 !important;
                }
                /* Arrow Animation */
                .navbar .dropdown:focus-within svg.chevron {
                    transform: rotate(180deg);
                }
            `}</style>

            <div className="navbar bg-emerald-50/60 border-b border-emerald-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>

                        <ul
                            tabIndex={-1}
                            className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 border border-emerald-50"
                        >
                            <li>
                                <Link
                                    href="/"
                                    aria-current={isActive("/") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600 font-medium"
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="menu-title text-slate-400 mt-2">Finance</li>
                            <li>
                                <Link
                                    href="/send"
                                    aria-current={isActive("/send") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Transfer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/swap"
                                    aria-current={isActive("/swap") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Swap
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/yield"
                                    aria-current={isActive("/yield") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Yield
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/donations"
                                    aria-current={isActive("/donations") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Donations
                                </Link>
                            </li>
                            <li className="menu-title text-slate-400 mt-2">Personal</li>
                            <li>
                                <Link
                                    href="/portfolio"
                                    aria-current={isActive("/portfolio") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600 font-medium"
                                >
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/transactions"
                                    aria-current={isActive("/transactions") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Transactions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/profile"
                                    aria-current={isActive("/profile") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <Link href="/" className="flex items-center gap-2 font-semibold text-lg cursor-pointer">
                        <span className="text-slate-900">de</span>
                        <span className="text-emerald-600">tip</span>
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-sm font-medium [&_a]:active:bg-transparent items-center">
                        <li>
                            <Link
                                href="/"
                                aria-current={isActive("/") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Home
                            </Link>
                        </li>
                        
                        <li className="dropdown">
                            <div 
                                tabIndex={0} 
                                role="button" 
                                className={`flex items-center gap-1 hover:text-emerald-600 active:bg-transparent focus:bg-transparent focus:outline-none cursor-pointer transition-colors ${(isActive("/send") || isActive("/swap") || isActive("/yield") || isActive("/donations")) ? "text-emerald-600" : ""}`}
                            >
                                Finance
                                <svg xmlns="http://www.w3.org/2000/svg" className="chevron h-4 w-4 opacity-50 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-50 w-52 p-2 border border-emerald-50 [&_li_a:active]:bg-emerald-100 [&_li_a:focus]:bg-emerald-50 [&_li_a]:transition-colors">
                                <li>
                                    <Link href="/send" className={`px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 ${isActive("/send") ? "text-emerald-600 font-bold bg-emerald-50/50" : "text-slate-600"}`}>
                                        Transfer
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/swap" className={`px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 ${isActive("/swap") ? "text-emerald-600 font-bold bg-emerald-50/50" : "text-slate-600"}`}>
                                        Swap Tokens
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/yield" className={`px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 ${isActive("/yield") ? "text-emerald-600 font-bold bg-emerald-50/50" : "text-slate-600"}`}>
                                        Yield Farming
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/donations" className={`px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 ${isActive("/donations") ? "text-emerald-600 font-bold bg-emerald-50/50" : "text-slate-600"}`}>
                                        Donations
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <Link
                                href="/portfolio"
                                aria-current={isActive("/portfolio") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Portfolio
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/transactions"
                                aria-current={isActive("/transactions") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Transactions
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/profile"
                                aria-current={isActive("/profile") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Settings
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar-end">
                    <ConnectWallet />
                </div>
            </div>
        </>
    );
};

export default NavBar;
