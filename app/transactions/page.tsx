import NavBar from "@/components/NavBar";
import Link from "next/link";
import { GrTransaction } from "react-icons/gr";

const truncateMiddle = (str: string, front = 10, back = 6) => {
    if (!str) return "";
    if (str.length <= front + back + 3) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
};

const mockTxs = [
    {
        hash: "0xaa73e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db421",
        age: "12 secs ago",
        from: "0x1cB9c0a7c8C0f2eE2D9bFf8A1dE0b2fE7c0d9A11",
        to: "0x7cE2F4bB5fE2A93b9cF9bC0aA12F8cB3D9eE1111",
        value: "0.024 ETH",
        status: "Success",
    },
    {
        hash: "0xbb13e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db422",
        age: "1 min ago",
        from: "0x5D1cBc0a7c8C0f2eE2D9bFf8A1dE0b2fE7c0d9B2",
        to: "0x4aE2F4bB5fE2A93b9cF9bC0aA12F8cB3D9eE1234",
        value: "1.002 ETH",
        status: "Pending",
    },
];

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
    return (
        <>
            <NavBar />

            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10">
                    {/* Header */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Transactions
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Latest transactions on this network
                            </p>
                        </div>
                        <div className="flex flex-col gap-1 sm:items-end">
                            <div className="flex gap-3">
                                <input
                                    placeholder="Search hash / address…"
                                    className="w-56 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                                />
                                <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40">
                                    <option>All statuses</option>
                                    <option>Success</option>
                                    <option>Pending</option>
                                    <option>Failed</option>
                                </select>
                            </div>
                            <span className="text-xs text-slate-400">
                                Showing {mockTxs.length} recent transactions
                            </span>
                        </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
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
                                {mockTxs.map((tx) => (
                                    <tr
                                        key={tx.hash}
                                        className="hover:bg-emerald-50/40 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                                                    <GrTransaction
                                                        size={18}
                                                        className="text-emerald-500"
                                                    />
                                                </div>
                                                <Link
                                                    href={`/transaction/${tx.hash}`}
                                                    title={tx.hash}
                                                    className="font-mono text-sm text-emerald-700 hover:underline"
                                                >
                                                    {truncateMiddle(tx.hash, 14, 8)}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">
                                            {tx.age}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            <span className="font-mono">
                                                {truncateMiddle(tx.from, 10, 6)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-700">
                                            <span className="font-mono">
                                                {truncateMiddle(tx.to, 10, 6)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-slate-700">
                                            {tx.value}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <span
                                                className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusBadgeClass(
                                                    tx.status
                                                )}`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="space-y-3 md:hidden">
                        {mockTxs.map((tx) => (
                            <Link
                                key={tx.hash}
                                href={`/transaction/${tx.hash}`}
                                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
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
                                    <span>{tx.age}</span>
                                    <span>{tx.value}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default TransactionsPage;
