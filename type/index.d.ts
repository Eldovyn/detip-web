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
    hash: string
    from: string
    to: string
    value_eth: number
    gas: number
    nonce: string
    block_number: string
    status: string
    datetime: string
    datetime: number
}

declare interface NonceInput {
    address: string;
}

declare interface DataProfile {
    username?: string;
    email?: string;
    location?: string;
    address?: string;
    bio?: string;
}

declare interface CreateNonceResponse {
    message: string;
    data: {
        nonce: string;
    }
}

declare interface UpdateProfileResponse {
    message: string;
    data: DataProfile;
}

declare interface MetaPage {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
}

declare interface LinksPage {
    next: string;
    prev: string;
}

declare interface GetTransactionsPageResponse {
    message: string;
    data: Transaction[],
    meta: MetaPage,
    links: LinksPage
}

declare interface GetTransactionResponse {
    message: string;
    data: Transaction;
}

declare interface TransactionDetailDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
}

declare interface SignInResponse {
    data?: {
        access_token: string;
        address: string;
    };
    message: string;
}

declare interface UserMeResponse {
    data?: DataProfile;
    message: string;
}

declare interface GetDonateResponse {
    message: string;
    data?: DataProfile;
}

declare type Direction = "ETH_TO_DTC" | "DTC_TO_ETH";