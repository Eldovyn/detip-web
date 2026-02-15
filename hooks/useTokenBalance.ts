import { useWalletBalance } from "thirdweb/react";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";

export function useTokenBalance(address?: string) {
    const { data } = useWalletBalance({
        client,
        chain: ganacheChain,
        address,
        tokenAddress: "0x8E182D338Ed16d3d80d96103D54a6477DFC98C75",
    });

    return {
        balance: data?.displayValue || "0",
        symbol: data?.symbol || ""
    };
}
