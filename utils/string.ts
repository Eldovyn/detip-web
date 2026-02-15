export const truncateMiddle = (str: string, front = 14, back = 4): string => {
    if (!str) return "";
    if (str.length <= front + back + 3) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
};
