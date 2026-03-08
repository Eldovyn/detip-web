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
                            className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link
                                    href="/"
                                    aria-current={isActive("/") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/send"
                                    aria-current={isActive("/send") ? "page" : undefined}
                                    className="aria-[current=page]:text-emerald-600"
                                >
                                    Send
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
                        </ul>
                    </div>

                    <a className="flex items-center gap-2 font-semibold text-lg">
                        <span className="text-slate-900">de</span>
                        <span className="text-emerald-600">tip</span>
                    </a>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-sm font-medium [&_a]:active:bg-transparent">
                        <li>
                            <Link
                                href="/"
                                aria-current={isActive("/") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/send"
                                aria-current={isActive("/send") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Send
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
                                href="/swap"
                                aria-current={isActive("/swap") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Swap
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/yield"
                                aria-current={isActive("/yield") ? "page" : undefined}
                                className="hover:text-emerald-600 aria-[current=page]:text-emerald-600"
                            >
                                Yield
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
