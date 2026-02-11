const NavBar = () => {
    return (
        <div className="navbar bg-white border-b border-slate-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
                    >
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
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow"
                    >
                        <li><a>Beranda</a></li>
                        <li>
                            <a>Kirim</a>
                            <ul className="p-2 bg-white">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a>Aktivitas</a></li>
                        <li><a>Settings</a></li>
                    </ul>
                </div>

                <a className="flex items-center gap-2 font-semibold text-lg">
                    <span className="text-slate-900">de</span>
                    <span className="text-emerald-500">tip</span>
                </a>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-sm font-medium">
                    <li>
                        <a className="hover:text-emerald-600">Beranda</a>
                    </li>
                    <li>
                        <details>
                            <summary className="hover:text-emerald-600">
                                Kirim
                            </summary>
                            <ul className="p-2 bg-white w-40 z-10 border border-slate-100">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <a className="hover:text-emerald-600">Aktivitas</a>
                    </li>
                    <li>
                        <a className="hover:text-emerald-600">Settings</a>
                    </li>
                </ul>
            </div>

            <div className="navbar-end">
                <button
                    className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                >
                    Connect wallet
                </button>
            </div>
        </div>
    );
};

export default NavBar;
