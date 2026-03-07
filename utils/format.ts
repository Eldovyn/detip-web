export function formatCompactNumber(value: string | number) {
    const num = Number(value);

    if (isNaN(num)) return "0";

    return new Intl.NumberFormat("id-ID", {
        notation: "compact",
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format numbers with fixed precision (default 6) and locale support.
 * Useful for reward tokens or debt where precision is important.
 */
export function formatPreciseNumber(value: string | number, decimals: number = 6) {
    const num = Number(value);

    if (isNaN(num)) return "0," + "0".repeat(decimals);

    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
}

export function timeAgo(timestamp: string | number): string {
    const now = Date.now();
    const time = typeof timestamp === "number"
        ? timestamp * 1000
        : new Date(timestamp).getTime();

    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return `${diff}s ago`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function formatDateTime(timestamp: string | number): string {
    const time = typeof timestamp === "number"
        ? timestamp * 1000
        : new Date(timestamp).getTime();

    const date = new Date(time);

    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(date);
}



export const truncateMiddle = (str: string, front = 10, back = 6) => {
    if (!str) return "";
    if (str.length <= front + back + 3) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
};
