import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract, readContract } from "thirdweb";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";
import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";

export function useTransferDTC() {
    const { account } = useAuth();
    const { mutate: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const transferDTC = async (toAddress: string, amount: string) => {
        if (!account) {
            throw new Error("No wallet connected");
        }

        const contract = getContract({
            client,
            chain: ganacheChain,
            address: process.env.NEXT_PUBLIC_DTC_TOKEN_ADDRESS as string,
        });

        const amountInWei = BigInt(parseFloat(amount) * 10 ** 18);

        const transaction = prepareContractCall({
            contract,
            method: "function transfer(address to, uint256 amount) returns (bool)",
            params: [toAddress, amountInWei],
        });

        sendTransaction(transaction);
    };

    return {
        transferDTC,
        isPending,
        isSuccess,
        error
    };
}

export function useApproveDTC() {
    const { account } = useAuth();
    const { mutate: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const approveDTC = async (spenderAddress: string, amount: string) => {
        if (!account) {
            throw new Error("No wallet connected");
        }

        const contract = getContract({
            client,
            chain: ganacheChain,
            address: process.env.NEXT_PUBLIC_DTC_TOKEN_ADDRESS as string,
        });

        const amountInWei = BigInt(parseFloat(amount) * 10 ** 18);

        const transaction = prepareContractCall({
            contract,
            method: "function approve(address spender, uint256 amount) returns (bool)",
            params: [spenderAddress, amountInWei],
        });

        sendTransaction(transaction);
    };

    return {
        approveDTC,
        isPending,
        isSuccess,
        error
    };
}

export function useAllowance(ownerAddress?: string, spenderAddress?: string) {
    const [allowance, setAllowance] = useState<string>("0");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!ownerAddress || !spenderAddress) return;

        const fetchAllowance = async () => {
            setIsLoading(true);
            try {
                const contract = getContract({
                    client,
                    chain: ganacheChain,
                    address: process.env.NEXT_PUBLIC_DTC_TOKEN_ADDRESS as string,
                });

                const result = await readContract({
                    contract,
                    method: "function allowance(address owner, address spender) view returns (uint256)",
                    params: [ownerAddress, spenderAddress],
                });

                setAllowance((Number(result) / 10 ** 18).toString());
            } catch (error) {
                console.error("Error fetching allowance:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllowance();
    }, [ownerAddress, spenderAddress]);

    return { allowance, isLoading };
}
