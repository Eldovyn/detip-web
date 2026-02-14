"use client";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const truncateMiddle = (str: string, front = 14, back = 4) => {
    if (!str) return "";
    if (str.length <= front + back + 3) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
};

const parseDtcInt = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    const num = Number(digits);
    return Number.isFinite(num) ? num : 0;
};

const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);

const PRIMARY_BTN =
    "inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white";

const SECONDARY_BTN =
    "inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white";

const TOPUP_RATE_IDR_PER_DTC = 1500;

type TopupStep = "form" | "payment";

const DIALOG_CONTENT =
    "border border-emerald-100 bg-white text-slate-900 shadow-lg";

const MENU_CONTENT =
    "w-44 border border-emerald-100 bg-white text-slate-900 shadow-lg";

const MENU_ITEM =
    "cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700";

export default function Page() {
    const hash =
        "0xaa73e2f186929bb376cd76e7e5144face9b8b54b9cb68c3056ad36db421";

    const [menuOpen, setMenuOpen] = useState(false);

    const [topupOpen, setTopupOpen] = useState(false);
    const [topupStep, setTopupStep] = useState<TopupStep>("form");
    const [amount, setAmount] = useState<string>("");

    const dtcAmount = useMemo(() => parseDtcInt(amount), [amount]);
    const isValidAmount = dtcAmount > 0;
    const estimatedIDR = useMemo(
        () => dtcAmount * TOPUP_RATE_IDR_PER_DTC,
        [dtcAmount]
    );

    const resetTopup = () => {
        setTopupStep("form");
        setAmount("");
    };

    const openTopupDialog = () => {
        setMenuOpen(false);
        setTopupStep("form");
        setTopupOpen(true);
    };

    const goToPayment = () => {
        if (!isValidAmount) return;
        setTopupStep("payment");
    };

    const handlePaid = () => {
        // TODO: implement success handler (API / contract)
        setTopupOpen(false);
        resetTopup();
    };

    return (
        <>
            <NavBar />

            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6">
                    {/* Balance card */}
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-900">DTC Balance</p>
                                <p className="text-3xl font-semibold text-slate-900">100 DTC</p>
                                <p className="text-sm text-slate-500">Available</p>
                            </div>

                            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="rounded-md p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                        aria-label="More options"
                                    >
                                        <HiDotsVertical size={20} />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className={MENU_CONTENT}>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            openTopupDialog();
                                        }}
                                        className={MENU_ITEM}
                                    >
                                        Top up
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className={MENU_ITEM}>
                                        <Link href="/swap">Swap</Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-emerald-100" />

                                    <DropdownMenuItem asChild className={MENU_ITEM}>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-2">
                            <Dialog
                                open={topupOpen}
                                onOpenChange={(open) => {
                                    setTopupOpen(open);
                                    if (!open) resetTopup();
                                }}
                            >
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className={SECONDARY_BTN}
                                        onClick={() => setTopupStep("form")}
                                    >
                                        Top up
                                    </button>
                                </DialogTrigger>

                                <DialogContent className={`sm:max-w-md ${DIALOG_CONTENT}`}>
                                    {topupStep === "form" ? (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle className="text-slate-900">Top up saldo</DialogTitle>
                                                <DialogDescription className="text-slate-500">
                                                    Masukkan nominal top up (DTC). Estimasi pembayaran akan dihitung otomatis.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="mt-2 space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-slate-700">
                                                        Nominal (DTC)
                                                    </label>

                                                    <input
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                                                        inputMode="numeric"
                                                        placeholder="contoh: 50"
                                                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                                    />

                                                    <p className="text-[11px] text-slate-500">
                                                        Rate:{" "}
                                                        <span className="tabular-nums text-slate-700">
                                                            {formatIDR(TOPUP_RATE_IDR_PER_DTC)}
                                                        </span>{" "}
                                                        / DTC
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-slate-600">Estimasi bayar</span>
                                                    <span className="tabular-nums text-sm font-semibold text-slate-900">
                                                        {isValidAmount ? formatIDR(estimatedIDR) : "—"}
                                                    </span>
                                                </div>

                                                <DialogFooter className="gap-2">
                                                    <button
                                                        type="button"
                                                        className={SECONDARY_BTN}
                                                        onClick={() => setTopupOpen(false)}
                                                    >
                                                        Batal
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={PRIMARY_BTN}
                                                        onClick={goToPayment}
                                                        disabled={!isValidAmount}
                                                    >
                                                        Lanjut bayar
                                                    </button>
                                                </DialogFooter>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle className="text-slate-900">Pembayaran QRIS (Dummy)</DialogTitle>
                                                <DialogDescription className="text-slate-500">
                                                    Merchant: detip • Total:{" "}
                                                    <span className="tabular-nums">{formatIDR(estimatedIDR)}</span>
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="mt-2 space-y-4">
                                                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                                    <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-xl border border-slate-100 bg-emerald-50/50">
                                                        <p className="text-xs font-semibold text-slate-700">QRIS DUMMY</p>
                                                    </div>
                                                    <p className="mt-3 text-center text-xs text-slate-500">
                                                        Buka e-wallet/m-banking → Scan → Bayar.
                                                    </p>
                                                </div>

                                                <DialogFooter className="gap-2">
                                                    <button
                                                        type="button"
                                                        className={SECONDARY_BTN}
                                                        onClick={() => setTopupStep("form")}
                                                    >
                                                        Kembali
                                                    </button>

                                                    <button type="button" className={PRIMARY_BTN} onClick={handlePaid}>
                                                        Saya sudah bayar
                                                    </button>
                                                </DialogFooter>
                                            </div>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>

                            <button type="button" className={PRIMARY_BTN}>
                                Swap token
                            </button>
                        </div>
                    </div>

                    {/* Transactions card */}
                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-900">Transactions</p>
                            <span className="text-xs text-slate-500">Latest</span>
                        </div>

                        <div className="mt-4 space-y-2">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-emerald-50/40"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                            <GrTransaction size={16} className="text-emerald-600" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href="/transaction"
                                                title={hash}
                                                className="block truncate font-mono text-sm text-slate-900 hover:text-emerald-700"
                                            >
                                                {truncateMiddle(hash, 18, 10)}
                                            </Link>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Status: <span className="text-emerald-700">Success</span> • 12s ago
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-900">0.024 ETH</p>
                                            <p className="text-xs text-slate-500">Fee 0.00042</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-end -translate-x-1">
                            <Link
                                href="/transactions"
                                className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                            >
                                View all
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
