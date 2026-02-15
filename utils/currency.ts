export const parseDtcInt = (value: string): number => {
    const digits = value.replace(/[^\d]/g, "");
    const num = Number(digits);
    return Number.isFinite(num) ? num : 0;
};

export const formatIDR = (n: number): string =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);

export const TOPUP_RATE_IDR_PER_DTC = 1500;
