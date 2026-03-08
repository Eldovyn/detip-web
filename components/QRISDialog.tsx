import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formatIDR } from "@/utils/currency";
import { PRIMARY_BTN, SECONDARY_BTN, DIALOG_CONTENT } from "@/constants/styles";
import { LuCheck } from "react-icons/lu";

interface QRISDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    amountIDR: number;
    username: string;
    onPaid: () => void;
    step: "payment" | "success";
}

export function QRISDialog({
    isOpen,
    onOpenChange,
    amountIDR,
    username,
    onPaid,
    step,
}: QRISDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button type="button" className="hidden" />
            </DialogTrigger>

            <DialogContent className={`sm:max-w-md ${DIALOG_CONTENT}`}>
                {step === "payment" ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-slate-900 text-center">Pembayaran QRIS</DialogTitle>
                            <DialogDescription className="text-slate-500 text-center">
                                Mendukung @{username} • Total:{" "}
                                <span className="tabular-nums font-semibold text-emerald-700">
                                    {formatIDR(amountIDR)}
                                </span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-2 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-xl border border-slate-100 bg-emerald-50/50">
                                    <div className="text-center space-y-2">
                                        <p className="text-xs font-bold text-slate-700">QRIS DUMMY</p>
                                        <div className="w-32 h-32 bg-slate-200 mx-auto rounded-lg flex items-center justify-center">
                                            <span className="text-[10px] text-slate-400">QR Code</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3 text-center text-[11px] text-slate-500 leading-relaxed">
                                    Scan QR di atas menggunakan aplikasi e-wallet atau m-banking favorit Anda untuk melakukan pembayaran.
                                </p>
                            </div>

                            <DialogFooter className="sm:justify-center gap-2">
                                <button
                                    type="button"
                                    className={`${SECONDARY_BTN} flex-1`}
                                    onClick={() => onOpenChange(false)}
                                >
                                    Batal
                                </button>

                                <button
                                    type="button"
                                    className={`${PRIMARY_BTN} flex-1`}
                                    onClick={onPaid}
                                >
                                    Saya sudah bayar
                                </button>
                            </DialogFooter>
                        </div>
                    </>
                ) : (
                    <div className="py-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <LuCheck className="text-emerald-600" size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-slate-900">Pembayaran Berhasil!</h3>
                            <p className="text-sm text-slate-500 px-4">
                                Terima kasih telah mendukung <span className="font-medium text-emerald-700">@{username}</span>.
                                Kontribusi Anda sangat berarti!
                            </p>
                        </div>
                        <button
                            type="button"
                            className={`${PRIMARY_BTN} w-full mt-2`}
                            onClick={() => onOpenChange(false)}
                        >
                            Tutup
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
