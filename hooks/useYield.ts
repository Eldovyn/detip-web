import { useSendTransaction, useReadContract, useWalletBalance } from "thirdweb/react";
import { prepareContractCall, toWei, toEther } from "thirdweb";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";
import { dtcYieldFarmContract, dtcTokenContract, dtcYieldFarmAddress } from "@/lib/contracts/DTCYieldFarm";
import { YIELD_TOKEN_ADDRESS } from "@/constants/tokenAddresses";

/** Approve DTC ke yield contract sebelum deposit */
export function useApproveForYield() {
    const { mutateAsync: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const approve = async (amount: string) => {
        const amountInWei = toWei(amount);
        const transaction = prepareContractCall({
            contract: dtcTokenContract,
            method: "function approve(address spender, uint256 amount) returns (bool)",
            params: [dtcYieldFarmAddress, amountInWei],
        });
        return await sendTransaction(transaction);
    };

    return { approve, isPending, isSuccess, error };
}

/** Stake DTC ke staking contract */
export function useStakeDTC() {
    const { mutateAsync: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const stake = async (amount: string) => {
        const amountInWei = toWei(amount);
        const transaction = prepareContractCall({
            contract: dtcYieldFarmContract,
            method: "function stake(uint256 amount)",
            params: [amountInWei],
            gas: BigInt(500000),
        });
        return await sendTransaction(transaction);
    };

    return { stake, isPending, isSuccess, error };
}

/** Unstake DTC dari staking contract */
export function useUnstakeDTC() {
    const { mutateAsync: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const unstake = async (amount: string) => {
        const amountInWei = toWei(amount);
        const transaction = prepareContractCall({
            contract: dtcYieldFarmContract,
            method: "function withdraw(uint256 amount)",
            params: [amountInWei],
            gas: BigInt(500000), // Manual high gas limit to resolve "Out of Gas" on withdraw
        });
        return await sendTransaction(transaction);
    };

    return { unstake, isPending, isSuccess, error };
}

/** Claim reward dari staking */
export function useClaimReward() {
    const { mutateAsync: sendTransaction, isPending, isSuccess, error } = useSendTransaction();

    const claim = async () => {
        const transaction = prepareContractCall({
            contract: dtcYieldFarmContract,
            method: "function getReward()",
            params: [],
            gas: BigInt(500000),
        });
        return await sendTransaction(transaction);
    };

    return { claim, isPending, isSuccess, error };
}

/** Baca deposited balance dan pending yield */
export function useYieldInfo(address?: string) {
    // Gunakan useWalletBalance untuk balance di dompet agar sinkron dengan Navbar
    const { data: walletBalanceData, isLoading: isWalletLoading, refetch: refetchWallet } = useWalletBalance({
        client,
        chain: ganacheChain,
        address,
        tokenAddress: YIELD_TOKEN_ADDRESS,
    });

    // Read Staked Balance
    const { data: stakedBalanceRaw, refetch: refetchStaked } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "balanceOf",
        params: [address || "0x0000000000000000000000000000000000000000"],
    });

    // Read Pending Reward
    const { data: pendingRewardRaw, refetch: refetchReward } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "earned",
        params: [address || "0x0000000000000000000000000000000000000000"],
    });

    // Read User Debt
    const { data: userDebtRaw, refetch: refetchUserDebt } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "userDebt",
        params: [address || "0x0000000000000000000000000000000000000000"],
    });

    // Read Borrow Limit Percentage
    const { data: borrowLimitPercentage, refetch: refetchBorrowLimitPercentage } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "borrowLimitPercentage",
        params: [],
    });

    // Read Pool Liquidity (Contract Balance of DTC for borrowing/rewards)
    const { data: poolLiquidityRaw, refetch: refetchPoolLiquidity } = useReadContract({
        contract: dtcTokenContract,
        method: "function balanceOf(address account) view returns (uint256)",
        params: [dtcYieldFarmAddress],
    });

    // Read Total Staked in Pool
    const { data: totalStakedRaw, refetch: refetchTotalStaked } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "totalSupply",
        params: [],
    });

    // Read Reward Rate
    const { data: rewardRateRaw, refetch: refetchRewardRate } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "rewardRate",
        params: [],
    });
    // Read Asset Token Address
    const { data: assetTokenAddressRaw, refetch: refetchAssetToken } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "assetToken",
        params: [],
    });

    // Read Dynamic Borrow Rate
    const { data: borrowRateRaw, refetch: refetchBorrowRate } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "getBorrowRate",
        params: [],
    });

    // Read Utilization
    const { data: utilizationRaw, refetch: refetchUtilization } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "getUtilization",
        params: [],
    });

    // Read Total Borrowed
    const { data: totalBorrowedRaw, refetch: refetchTotalBorrowed } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "totalBorrowed",
        params: [],
    });

    // Read Max Stake Per User
    const { data: maxStakePerUserRaw, refetch: refetchMaxStakePerUser } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "maxStakePerUser",
        params: [],
    });

    // Read Pool Hard Cap
    const { data: poolHardCapRaw, refetch: refetchPoolHardCap } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "poolHardCap",
        params: [],
    });

    // Read Period Finish
    const { data: periodFinishRaw, refetch: refetchPeriodFinish } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "periodFinish",
        params: [],
    });

    // Read Rewards Duration
    const { data: rewardsDurationRaw, refetch: refetchRewardsDuration } = useReadContract({
        contract: dtcYieldFarmContract,
        method: "rewardsDuration",
        params: [],
    });

    const walletBalance = walletBalanceData?.displayValue || "0";
    const stakedBalance = stakedBalanceRaw ? toEther(stakedBalanceRaw) : "0.000000";
    const pendingReward = pendingRewardRaw ? toEther(pendingRewardRaw) : "0.000000";
    const userDebt = userDebtRaw ? toEther(userDebtRaw) : "0.000000";
    const poolLiquidity = poolLiquidityRaw ? toEther(poolLiquidityRaw) : "0.000000";
    const borrowRate = borrowRateRaw ? (Number(borrowRateRaw) / 100).toFixed(2) : "0.00";
    const utilization = utilizationRaw ? (Number(utilizationRaw) / 100).toFixed(2) : "0.00";
    const rewardRate = rewardRateRaw ? toEther(rewardRateRaw) : "0";
    const totalStaked = totalStakedRaw ? toEther(totalStakedRaw) : "0";
    const assetTokenAddressFromContract = assetTokenAddressRaw as string;
    const totalBorrowed = totalBorrowedRaw ? toEther(totalBorrowedRaw) : "0";
    const maxStakePerUser = maxStakePerUserRaw ? toEther(maxStakePerUserRaw) : "0";
    const poolHardCap = poolHardCapRaw ? toEther(poolHardCapRaw) : "0";
    const periodFinish = periodFinishRaw ? Number(periodFinishRaw) : 0;
    const rewardsDuration = rewardsDurationRaw ? Number(rewardsDurationRaw) : 0;

    // Calculate Borrow Limit based on staked balance and percentage
    // borrowLimit = stakedBalance * borrowLimitPercentage / 100
    const borrowLimitRaw = (stakedBalanceRaw && borrowLimitPercentage)
        ? (BigInt(stakedBalanceRaw) * BigInt(borrowLimitPercentage)) / BigInt(100)
        : BigInt(0);
    const borrowLimit = toEther(borrowLimitRaw);

    const isLoading = isWalletLoading;

    const refetch = async () => {
        await Promise.all([
            refetchWallet(),
            refetchStaked(),
            refetchReward(),
            refetchUserDebt(),
            refetchBorrowLimitPercentage(),
            refetchPoolLiquidity(),
            refetchBorrowRate(),
            refetchUtilization(),
            refetchRewardRate(),
            refetchTotalStaked(),
            refetchAssetToken(),
            refetchTotalBorrowed(),
            refetchMaxStakePerUser(),
            refetchPoolHardCap(),
            refetchPeriodFinish(),
            refetchRewardsDuration(),
        ]);
    };

    return {
        walletBalance,
        stakedBalance,
        pendingReward,
        userDebt,
        borrowLimit,
        poolLiquidity,
        borrowRate,
        utilization,
        rewardRate,
        totalStaked,
        assetTokenAddressFromContract,
        totalBorrowed,
        maxStakePerUser,
        poolHardCap,
        periodFinish,
        rewardsDuration,
        isLoading,
        refetch
    };
}

/** Cek allowance DTC untuk yield contract */
export function useYieldAllowance(address?: string) {
    const { data: allowance, isLoading, refetch } = useReadContract({
        contract: dtcTokenContract,
        method: "function allowance(address owner, address spender) view returns (uint256)",
        params: [address || "0x0000000000000000000000000000000000000000", dtcYieldFarmAddress],
    });

    return { allowance: allowance || BigInt(0), isLoading, refetch };
}

/** Hook untuk meminjam DTC */
export function useBorrowDTC() {
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();

    const borrow = async (amount: string) => {
        const amountWei = toWei(amount);
        const tx = prepareContractCall({
            contract: dtcYieldFarmContract,
            method: "borrow",
            params: [amountWei],
            gas: BigInt(500000), // Manual high gas limit to resolve "Out of Gas" estimation failure
        });
        return await sendTransaction(tx);
    };

    return { borrow, isPending };
}

/** Hook untuk membayar hutang DTC */
export function useRepayDTC() {
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();

    const repay = async (amount: string) => {
        const amountWei = toWei(amount);
        const tx = prepareContractCall({
            contract: dtcYieldFarmContract,
            method: "repay",
            params: [amountWei],
            gas: BigInt(500000),
        });
        return await sendTransaction(tx);
    };

    return { repay, isPending };
}

/** Hook untuk membayar SELURUH hutang DTC termasuk bunga yang terakumulasi */
export function useRepayAllDTC() {
    const { mutateAsync: sendTransaction, isPending } = useSendTransaction();

    const repayAll = async () => {
        const tx = prepareContractCall({
            contract: dtcYieldFarmContract,
            method: "repayAll",
            params: [],
            gas: BigInt(500000),
        });
        return await sendTransaction(tx);
    };

    return { repayAll, isPending };
}
