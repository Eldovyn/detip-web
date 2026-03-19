"use client";

import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LuMessageSquare, LuHeart, LuCoins, LuMapPin, LuMail } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/api/usersService";
import { TOPUP_RATE_IDR_PER_DTC, formatIDR } from "@/utils/currency";
import { QRISDialog } from "@/components/QRISDialog";
import { LuQrCode } from "react-icons/lu";
import { useAuth } from "@/hooks/useAuth";
import { useDonate } from "@/hooks/useDonate";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";

const DonatePage = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const router = useRouter();
    const { account, accessToken } = useAuth();
    const { donateDTC, isDonating } = useDonate();
    const username = params?.username as string;

    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"dtc" | "qris">("dtc");
    const [isQRISOpen, setIsQRISOpen] = useState(false);
    const [qrisStep, setQrisStep] = useState<"payment" | "success">("payment");

    const { data: creatorData, isLoading, isError } = useQuery({
        queryKey: ["donate", username, accessToken],
        queryFn: () => usersService.getDonate(username, accessToken),
        enabled: !!username,
        retry: false,
    });

    const creator = creatorData?.data?.data;

    useEffect(() => {
        if (account?.address && creator?.address && account.address.toLowerCase() === creator.address.toLowerCase()) {
            router.push("/");
        }
    }, [account, creator, router]);

    const { mutate: toggleFavorite } = useMutation({
        mutationFn: async (addressId: string) => {
            if (!accessToken) throw new Error("Not logged in");
            const response = await usersService.favorite(addressId, accessToken);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["donate", username] });
            toast.success(data.status ? "Added to favorites" : "Removed from favorites");
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to update favorite");
        },
    });

    const handleDonate = async () => {
        if (!amount || parseFloat(amount) <= 0) return;

        if (paymentMethod === "qris") {
            setQrisStep("payment");
            setIsQRISOpen(true);
            return;
        }

        if (paymentMethod === "dtc") {
            if (!creator?.address) {
                toast.error("Creator address not found");
                return;
            }

            try {
                await donateDTC(creator.address, amount, message, () => {
                    setAmount("");
                    setMessage("");
                });
            } catch (err) {
                console.error("Donation failed:", err);
            }
            return;
        }



        setIsPending(true);
        try {
            // Implementation for other methods if any
        } catch (error) {
            console.error("Donation failed:", error);
        } finally {
            setIsPending(false);
        }
    };


    const handleQRISPaid = () => {
        setQrisStep("success");
    };

    const handlePaymentMethodChange = (method: "dtc" | "qris") => {
        if (method === paymentMethod) return;

        const currentAmount = parseFloat(amount) || 0;
        let newAmount = "";

        if (method === "qris") {
            // DTC to IDR
            newAmount = (currentAmount * TOPUP_RATE_IDR_PER_DTC).toFixed(0);
        } else {
            // IDR to DTC
            newAmount = (currentAmount / TOPUP_RATE_IDR_PER_DTC).toString();
        }

        setAmount(newAmount === "0" ? "" : newAmount);
        setPaymentMethod(method);
    };

    const estimatedValue = paymentMethod === "dtc"
        ? (parseFloat(amount) || 0) * TOPUP_RATE_IDR_PER_DTC
        : (parseFloat(amount) || 0) / TOPUP_RATE_IDR_PER_DTC;

    const presetAmounts = paymentMethod === "dtc"
        ? ["0.0001", "0.0005", "0.001", "0.005"]
        : ["10000", "50000", "100000", "200000"];

    return (
        <>
            <NavBar />
            <section className="min-h-screen bg-linear-to-b from-emerald-50/40 via-slate-50 to-slate-50 pt-10">
                <div className="mx-auto w-full max-w-3xl px-4 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Header */}
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-slate-900">Donate</h1>
                        <p className="text-sm text-slate-500">
                            Support{" "}
                            <span className="font-medium text-emerald-700">@{username}</span>{" "}
                            with a DTC donation.
                        </p>
                    </header>

                    {/* Creator Card */}
                    {isLoading ? (
                        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 animate-pulse">
                            <div className="h-14 w-14 rounded-full bg-slate-200 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3.5 w-28 rounded bg-slate-200" />
                                <div className="h-3 w-40 rounded bg-slate-100" />
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                            User <span className="font-semibold ml-1">@{username}</span>&nbsp;not found.
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4">
                            <Avatar className="h-14 w-14 ring-2 ring-emerald-100 ring-offset-2 ring-offset-white shrink-0">
                                <AvatarImage
                                    src={creator?.avatar as string}
                                    className="h-full w-full object-cover"
                                />
                                <AvatarFallback>
                                    {(creator?.username ?? username)?.[0]?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                    @{creator?.username ?? username}
                                </p>
                                {creator?.email && (
                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                                        <LuMail size={11} className="text-emerald-400 shrink-0" />
                                        {creator.email}
                                    </p>
                                )}
                                {creator?.location && (
                                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                                        <LuMapPin size={11} className="text-emerald-400 shrink-0" />
                                        {creator.location}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    if (!accessToken) {
                                        toast.error("Please login to favorite creators");
                                        return;
                                    }
                                    if (creator?.address_id) {
                                        toggleFavorite(creator.address_id);
                                    }
                                }}
                                className={`group/heart ml-auto h-12 w-12 flex items-center justify-center rounded-2xl transition-all ${creator?.is_favorited ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"}`}
                            >
                                <LuHeart size={22} className={creator?.is_favorited ? "fill-current" : "group-hover/heart:fill-current"} />
                            </button>
                        </div>
                    )}


                    <div className="rounded-2xl border border-emerald-100 bg-white p-6 space-y-5">
                        <div className="flex p-1 bg-slate-100 rounded-lg w-full max-w-[240px] mx-auto">
                            <button
                                type="button"
                                onClick={() => handlePaymentMethodChange("dtc")}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${paymentMethod === "dtc"
                                    ? "bg-white text-emerald-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <LuCoins size={14} />
                                DTC
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePaymentMethodChange("qris")}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${paymentMethod === "qris"
                                    ? "bg-white text-emerald-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                <LuQrCode size={14} />
                                QRIS
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-[11px] text-slate-400">
                                Rate: <span className="font-medium text-slate-600">1 DTC = {formatIDR(TOPUP_RATE_IDR_PER_DTC)}</span>
                            </p>
                        </div>

                        <form className="space-y-5">

                            <div className="space-y-2">
                                <label htmlFor="amount" className="text-sm font-medium text-slate-800">
                                    Donation Amount
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {presetAmounts.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 ${amount === preset
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50/60 hover:text-emerald-700"
                                                }`}
                                        >
                                            {paymentMethod === "dtc" ? <LuCoins size={11} /> : <span className="text-[10px] font-bold">Rp</span>}
                                            {paymentMethod === "qris" ? parseInt(preset).toLocaleString("id-ID") : preset}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        id="amount"
                                        min={0}
                                        step={paymentMethod === "dtc" ? "0.00001" : "1"}
                                        placeholder={paymentMethod === "dtc" ? "0.00000" : "0"}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                                    />
                                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 min-w-[70px] justify-center">
                                        {paymentMethod === "dtc" ? (
                                            <>
                                                <LuCoins size={12} className="text-emerald-500" />
                                                DTC
                                            </>
                                        ) : (
                                            "IDR"
                                        )}
                                    </span>
                                </div>
                                {amount && parseFloat(amount) > 0 && (
                                    <p className="text-[11px] text-slate-500 animate-in fade-in slide-in-from-top-1">
                                        {paymentMethod === "dtc" ? (
                                            <>
                                                Estimasi pembayaran: <span className="font-semibold text-emerald-700">{formatIDR(estimatedValue as number)}</span>
                                            </>
                                        ) : (
                                            <>
                                                Estimasi: <span className="font-semibold text-emerald-700">{(estimatedValue as number).toFixed(5)} DTC</span>
                                            </>
                                        )}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="text-sm font-medium text-slate-800 flex items-center gap-1.5"
                                >
                                    <LuMessageSquare size={14} className="text-emerald-500" />
                                    Message{" "}
                                    <span className="text-slate-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    id="message"
                                    rows={3}
                                    placeholder="Write a kind message to the creator..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 resize-none"
                                />
                                <p className="text-[11px] text-slate-400 text-right">
                                    {message.length}/200
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleDonate}
                                disabled={isPending || isDonating || !amount || parseFloat(amount) <= 0 || isError}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 h-12 text-sm font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isPending || isDonating ? (
                                    <>
                                        <LuLoader className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {paymentMethod === "dtc" ? <LuCoins size={14} /> : <LuQrCode size={14} />}
                                        {paymentMethod === "dtc" ? "Send Donation" : "Generate QRIS"}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </section>

            <QRISDialog
                isOpen={isQRISOpen}
                onOpenChange={setIsQRISOpen}
                amountIDR={paymentMethod === "dtc" ? estimatedValue as number : parseFloat(amount) || 0}
                username={username}
                onPaid={handleQRISPaid}
                step={qrisStep}
            />
        </>
    );
};

export default DonatePage;
