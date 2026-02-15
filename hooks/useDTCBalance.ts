import { useWalletBalance } from "thirdweb/react";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";

export function useDTCBalance(address?: string) {
    const { data, isLoading, error } = useWalletBalance({
        client,
        chain: ganacheChain,
        address,
        tokenAddress: process.env.NEXT_PUBLIC_DTC_TOKEN_ADDRESS as string,
    });

    return {
        balance: data?.displayValue || "0",
        symbol: data?.symbol || "DTC",
        decimals: data?.decimals || 18,
        isLoading,
        error
    };
}
