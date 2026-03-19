import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formatIDR, TOPUP_RATE_IDR_PER_DTC } from "@/utils/currency";
import { PRIMARY_BTN, SECONDARY_BTN, DIALOG_CONTENT } from "@/constants/styles";

interface TopupDialogProps {
    isOpen: boolean;
    step: "form" | "payment";
    amount: string;
    isValidAmount: boolean;
    estimatedIDR: number;
    onOpenChange: (open: boolean) => void;
    onAmountChange: (value: string) => void;
    onStepChange: (step: "form" | "payment") => void;
    onPayment: () => void;
    onPaid: () => void;
}

export function TopupDialog({
    isOpen,
    step,
    amount,
    isValidAmount,
    estimatedIDR,
    onOpenChange,
    onAmountChange,
    onStepChange,
    onPayment,
    onPaid,
}: TopupDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button type="button" className="hidden" />
            </DialogTrigger>

            <DialogContent className={`sm:max-w-md ${DIALOG_CONTENT}`}>
                {step === "form" ? (
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
                                    onChange={(e) => onAmountChange(e.target.value.replace(/[^\d]/g, ""))}
                                    inputMode="numeric"
                                    placeholder="contoh: 50"
                                    className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
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
                                    onClick={() => onOpenChange(false)}
                                >
                                    Batal
                                </button>

                                <button
                                    type="button"
                                    className={PRIMARY_BTN}
                                    onClick={onPayment}
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
                                    onClick={() => onStepChange("form")}
                                >
                                    Kembali
                                </button>

                                <button type="button" className={PRIMARY_BTN} onClick={onPaid}>
                                    Saya sudah bayar
                                </button>
                            </DialogFooter>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
