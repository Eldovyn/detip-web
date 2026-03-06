import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, getContract, readContract } from "thirdweb";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";
import { useAuth } from "./useAuth";
import { useState, useEffect, useCallback } from "react";

// Ganti dengan address smart contract staking yang sudah di-deploy
const STAKING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as string;
const DTC_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DTC_TOKEN_ADDRESS as string;

function getStakingContract() {
    return getContract({
        client,
        chain: ganacheChain,
        address: STAKING_CONTRACT_ADDRESS,
    });
}

function getDTCContract() {
    return getContract({
        client,
        chain: ganacheChain,
        address: DTC_TOKEN_ADDRESS,
    });
}

/** Approve DTC ke yield contract sebelum deposit */
export function useApproveForYield() {
    const { mutate: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const approve = async (amount: string) => {
        const amountInWei = BigInt(parseFloat(amount) * 10 ** 18);
        const transaction = prepareContractCall({
            contract: getDTCContract(),
            method: "function approve(address spender, uint256 amount) returns (bool)",
            params: [STAKING_CONTRACT_ADDRESS, amountInWei],
        });
        sendTransaction(transaction);
    };

    return { approve, isPending, isSuccess, error };
}

/** Stake DTC ke staking contract */
export function useStakeDTC() {
    const { mutate: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const stake = async (amount: string) => {
        const amountInWei = BigInt(parseFloat(amount) * 10 ** 18);
        const transaction = prepareContractCall({
            contract: getStakingContract(),
            method: "function stake(uint256 amount)",
            params: [amountInWei],
        });
        sendTransaction(transaction);
    };

    return { stake, isPending, isSuccess, error };
}

/** Unstake DTC dari staking contract */
export function useUnstakeDTC() {
    const { mutate: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const unstake = async (amount: string) => {
        const amountInWei = BigInt(parseFloat(amount) * 10 ** 18);
        const transaction = prepareContractCall({
            contract: getStakingContract(),
            method: "function unstake(uint256 amount)",
            params: [amountInWei],
        });
        sendTransaction(transaction);
    };

    return { unstake, isPending, isSuccess, error };
}

/** Claim reward dari staking */
export function useClaimReward() {
    const { mutate: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const claim = async () => {
        const transaction = prepareContractCall({
            contract: getStakingContract(),
            method: "function claimReward()",
            params: [],
        });
        sendTransaction(transaction);
    };

    return { claim, isPending, isSuccess, error };
}

/** Baca deposited balance dan pending yield */
export function useYieldInfo(address?: string) {
    const [stakedBalance, setStakedBalance] = useState("0");
    const [pendingReward, setPendingReward] = useState("0");
    const [isLoading, setIsLoading] = useState(false);

    const fetchInfo = useCallback(async () => {
        if (!address || !STAKING_CONTRACT_ADDRESS) return;

        setIsLoading(true);
        try {
            const contract = getStakingContract();

            const [staked, reward] = await Promise.all([
                readContract({
                    contract,
                    method: "function stakedBalance(address account) view returns (uint256)",
                    params: [address],
                }),
                readContract({
                    contract,
                    method: "function pendingReward(address account) view returns (uint256)",
                    params: [address],
                }),
            ]);

            setStakedBalance((Number(staked) / 10 ** 18).toFixed(6));
            setPendingReward((Number(reward) / 10 ** 18).toFixed(6));
        } catch (error) {
            console.error("Error fetching staking info:", error);
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    useEffect(() => {
        fetchInfo();
        const interval = setInterval(fetchInfo, 15000); // refresh tiap 15 detik
        return () => clearInterval(interval);
    }, [fetchInfo]);

    return { stakedBalance, pendingReward, isLoading, refetch: fetchInfo };
}
