declare interface LoginResponse {
    token?: string;
    message?: string;
    address?: string;
}

declare interface BalanceCardProps {
    symbol: string;
    balance: string;
    menuOpen: boolean;
    onMenuChange: (open: boolean) => void;
    onTopupClick: () => void;
}

declare interface Transaction {
    hash: string;
    status: string;
    time: string;
    amount: string;
    fee: string;
}

declare interface TransactionListProps {
    transactions: Transaction[];
}