import { useState, useEffect } from "react";
import { prepareContractCall, toWei, toEther, waitForReceipt } from "thirdweb";
import { useReadContract, useSendTransaction, useActiveAccount, useWalletBalance } from "thirdweb/react";
import { dtcSwapContract, dtcTokenContract, dtcSwapAddress, dtcTokenAddress } from "@/lib/contracts/DTCSwap";
import { ganacheChain } from "@/lib/chains";
import { client } from "@/lib/client";
import { toast } from "sonner";

export function useSwap() {
    const account = useActiveAccount();
    const [direction, setDirection] = useState<Direction>("ETH_TO_DTC");
    const [amountIn, setAmountIn] = useState("");
    const [isSwapping, setIsSwapping] = useState(false);

    const { mutate: sendSwapTx } = useSendTransaction();
    const { mutate: sendApproveTx } = useSendTransaction();

    const isEthToDtc = direction === "ETH_TO_DTC";
    const inputSymbol = isEthToDtc ? "ETH" : "DTC";
    const outputSymbol = isEthToDtc ? "DTC" : "ETH";

    const { data: reserves } = useReadContract({
        contract: dtcSwapContract,
        method: "getReserves",
        params: [],
    }) as { data: readonly [bigint, bigint] | undefined };

    const { data: dtcBalanceData } = useWalletBalance({
        client,
        chain: ganacheChain,
        address: account?.address,
        tokenAddress: dtcTokenAddress,
    });
    const dtcBalance = dtcBalanceData?.value;

    const { data: ethBalanceData } = useWalletBalance({
        client,
        chain: ganacheChain,
        address: account?.address,
    });
    const ethBalance = ethBalanceData?.value;

    const { data: allowance, refetch: refetchAllowance, isLoading: isAllowanceLoading } = useReadContract({
        contract: dtcTokenContract,
        method: "allowance",
        params: [account?.address || "0x0000000000000000000000000000000000000000", dtcSwapAddress],
    }) as { data: bigint | undefined, refetch: () => void, isLoading: boolean };

    const amountInWei = amountIn && !Number.isNaN(Number(amountIn)) ? toWei(amountIn) : BigInt(0);

    const { data: expectedAmountOutWei } = useReadContract({
        contract: dtcSwapContract,
        method: "getAmountOut",
        params: reserves ? [
            amountInWei,
            isEthToDtc ? reserves[0] : reserves[1],
            isEthToDtc ? reserves[1] : reserves[0]
        ] : [BigInt(0), BigInt(1), BigInt(1)],
    }) as { data: bigint | undefined };

    const amountOut = amountInWei > BigInt(0) && expectedAmountOutWei ? toEther(expectedAmountOutWei) : "";

    const handleAmountChange = (value: string) => {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmountIn(value);
        }
    };

    const toggleDirection = () => {
        setDirection(isEthToDtc ? "DTC_TO_ETH" : "ETH_TO_DTC");
        setAmountIn("");
    };

    const handleSwap = async () => {
        if (!account || !amountInWei) return;

        setIsSwapping(true);
        try {
            if (isEthToDtc) {
                const minDtcOut = expectedAmountOutWei ? (expectedAmountOutWei * BigInt(95)) / BigInt(100) : BigInt(0);

                const tx = prepareContractCall({
                    contract: dtcSwapContract,
                    method: "swapEthToDtc",
                    params: [minDtcOut],
                    value: amountInWei,
                });

                sendSwapTx(tx, {
                    onSuccess: () => {
                        toast.success("Successfully swapped ETH to DTC!");
                        setAmountIn("");
                    },
                    onError: (err) => {
                        console.error(err);
                        toast.error("Swap failed. Please try again.");
                    }
                });
            } else {
                if (allowance === undefined) {
                    if (isAllowanceLoading) {
                        toast.info("Fetching allowance data... Please wait.");
                    } else {
                        toast.error("Could not fetch allowance. Please try again.");
                        refetchAllowance();
                    }
                    setIsSwapping(false);
                    return;
                }

                if (allowance < amountInWei) {
                    toast.info("Approving DTC token first...");
                    const approveTx = prepareContractCall({
                        contract: dtcTokenContract,
                        method: "approve",
                        params: [dtcSwapAddress, amountInWei],
                    });

                    sendApproveTx(approveTx, {
                        onSuccess: async (data) => {
                            toast.loading("Waiting for approval confirmation...", { id: "approve-toast" });
                            try {
                                const receipt = await waitForReceipt({
                                    client,
                                    chain: ganacheChain,
                                    transactionHash: data.transactionHash,
                                });

                                if (receipt.status === "reverted") {
                                    throw new Error("Approval transaction reverted");
                                }

                                toast.success("Token approved! Initiating swap...", { id: "approve-toast" });
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                refetchAllowance();
                                executeSwapDtcToEth();
                            } catch (err) {
                                console.error(err);
                                toast.error("Approval confirmation failed.", { id: "approve-toast" });
                                setIsSwapping(false);
                            }
                        },
                        onError: (err) => {
                            console.error(err);
                            toast.error("Approval failed.", { id: "approve-toast" });
                            setIsSwapping(false);
                        }
                    });
                    return;
                }

                executeSwapDtcToEth();
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred.");
            setIsSwapping(false);
        }
    };

    const executeSwapDtcToEth = () => {
        const minEthOut = expectedAmountOutWei ? (expectedAmountOutWei * BigInt(95)) / BigInt(100) : BigInt(0);

        const tx = prepareContractCall({
            contract: dtcSwapContract,
            method: "swapDtcToEth",
            params: [amountInWei!, minEthOut],
        });

        sendSwapTx(tx, {
            onSuccess: () => {
                toast.success("Successfully swapped DTC to ETH!");
                setAmountIn("");
            },
            onError: (err) => {
                console.error(err);
                toast.error("Swap failed. Please try again.");
            },
            onSettled: () => {
                setIsSwapping(false);
            }
        });
    };

        if (isEthToDtc && isSwapping) {
            const timeout = setTimeout(() => setIsSwapping(false), 3000);
            return () => clearTimeout(timeout);
        }

    const isButtonDisabled = !amountIn || Number(amountIn) <= 0 || isSwapping || !account;

    return {
        account,
        direction,
        amountIn,
        amountOut,
        isSwapping,
        isButtonDisabled,
        isEthToDtc,
        inputSymbol,
        outputSymbol,
        dtcBalance,
        ethBalance,
        allowance,
        amountInWei,
        handleAmountChange,
        toggleDirection,
        handleSwap,
    };
}
