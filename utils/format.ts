// utils/format.ts
export function formatCompactNumber(value: string | number) {
    const num = Number(value);

    if (isNaN(num)) return "0";

    return new Intl.NumberFormat("id-ID", {
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(num);
}
