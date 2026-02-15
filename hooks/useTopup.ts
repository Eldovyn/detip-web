import { useState, useMemo } from "react";
import { parseDtcInt, TOPUP_RATE_IDR_PER_DTC } from "@/utils/currency";

type TopupStep = "form" | "payment";

export function useTopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<TopupStep>("form");
    const [amount, setAmount] = useState<string>("");

    const dtcAmount = useMemo(() => parseDtcInt(amount), [amount]);
    const isValidAmount = dtcAmount > 0;
    const estimatedIDR = useMemo(
        () => dtcAmount * TOPUP_RATE_IDR_PER_DTC,
        [dtcAmount]
    );

    const reset = () => {
        setStep("form");
        setAmount("");
    };

    const open = () => {
        setStep("form");
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        reset();
    };

    const goToPayment = () => {
        if (!isValidAmount) return;
        setStep("payment");
    };

    const handlePaid = () => {
        close();
    };

    return {
        isOpen,
        step,
        amount,
        dtcAmount,
        isValidAmount,
        estimatedIDR,
        setIsOpen,
        setStep,
        setAmount,
        open,
        close,
        reset,
        goToPayment,
        handlePaid,
    };
}
