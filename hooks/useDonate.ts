import { useSendTransaction, useReadContract, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, toWei, toEther, waitForReceipt } from "thirdweb";
import { dtcDonateContract, dtcTokenContract, dtcDonateAddress, dtcTokenAddress } from "@/lib/contracts/DTCDonate";
import { ganacheChain } from "@/lib/chains";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { useState } from "react";

export function useDonate() {
    const account = useActiveAccount();
    const { mutate: sendApproveTx } = useSendTransaction();
    const { mutate: sendDonateTx } = useSendTransaction();
    const [isDonating, setIsDonating] = useState(false);

    // 1. Read Allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        contract: dtcTokenContract,
        method: "function allowance(address owner, address spender) view returns (uint256)",
        params: [account?.address || "0x0000000000000000000000000000000000000000", dtcDonateAddress],
    });

    // Function to execute the actual donation
    const executeDonation = async (toAddress: string, amountInWei: bigint, message: string, onSuccess?: () => void) => {
        try {
            const transaction = prepareContractCall({
                contract: dtcDonateContract,
                method: "function transferDTC(address _to, uint256 _amountDTC, string _message)",
                params: [toAddress, amountInWei, message],
            });

            sendDonateTx(transaction, {
                onSuccess: async (data) => {
                    try {
                        // Wait for donation confirmation
                        await waitForReceipt({
                            client,
                            chain: ganacheChain,
                            transactionHash: data.transactionHash,
                        });
                        
                        toast.success(`Successfully donated DTC!`, { id: "donation-status" });
                        setIsDonating(false);
                        if (onSuccess) onSuccess();
                    } catch (err) {
                        console.error("Donation confirmation error:", err);
                        toast.error("Failed to confirm donation transaction.", { id: "donation-status" });
                        setIsDonating(false);
                    }
                },
                onError: (err) => {
                    console.error("Donation failed:", err);
                    const errorMessage = (err as any).message || "";
                    if (errorMessage.includes("Insufficient token balance")) {
                        toast.error("Insufficient DTC balance.");
                    } else {
                        toast.error("Donation failed. Please try again.", { id: "donation-status" });
                    }
                    setIsDonating(false);
                }
            });
        } catch (err) {
            console.error("Error preparing donation:", err);
            setIsDonating(false);
        }
    };

    // Main donate function
    const donateDTC = async (toAddress: string, amount: string, message: string, onSuccess?: () => void) => {
        if (!account) {
            toast.error("Please connect your wallet first");
            return;
        }

        setIsDonating(true);
        try {
            const amountInWei = toWei(amount);
            
            // Re-fetch allowance to be sure it's up to date
            const { data: currentAllowance } = await refetchAllowance();
            
            // 2. Check Allowance
            if (currentAllowance === undefined || currentAllowance < amountInWei) {
                toast.info("Approving DTC token first...", { id: "donation-status" });
                
                const approveTx = prepareContractCall({
                    contract: dtcTokenContract,
                    method: "function approve(address spender, uint256 amount)",
                    params: [dtcDonateAddress, amountInWei],
                });

                sendApproveTx(approveTx, {
                    onSuccess: async (data) => {
                        toast.loading("Waiting for approval confirmation...", { id: "donation-status" });
                        try {
                            const receipt = await waitForReceipt({
                                client,
                                chain: ganacheChain,
                                transactionHash: data.transactionHash,
                            });

                            if (receipt.status === "reverted") {
                                throw new Error("Approval transaction reverted");
                            }

                            toast.success("Token approved! Initiating donation...", { id: "donation-status" });
                            // Proceed to donation
                            await executeDonation(toAddress, amountInWei, message, onSuccess);
                        } catch (err) {
                            console.error("Approval confirmation failed:", err);
                            toast.error("Approval failed.", { id: "donation-status" });
                            setIsDonating(false);
                        }
                    },
                    onError: (err) => {
                        console.error("Approval failed:", err);
                        toast.error("Approval failed.", { id: "donation-status" });
                        setIsDonating(false);
                    }
                });
                return;
            }

            // 3. Direct Donation if allowance is enough
            await executeDonation(toAddress, amountInWei, message, onSuccess);

        } catch (error) {
            console.error("Donation error:", error);
            toast.error("An error occurred during donation", { id: "donation-status" });
            setIsDonating(false);
        }
    };

    return {
        donateDTC,
        isDonating,
        account,
        allowance
    };
}

export function useUserDonationBalance(userAddress?: string) {
    const { data: balance, isLoading, refetch } = useReadContract({
        contract: dtcDonateContract,
        method: "function getUserTokenBalance(address _user) view returns (uint256)",
        params: [userAddress || "0x0000000000000000000000000000000000000000"],
    });

    const formattedBalance = balance ? toEther(balance) : "0";

    return {
        balance: formattedBalance,
        isLoading,
        refetch
    };
}
