import { getContract } from "thirdweb";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";

import yieldAbiRaw from "../../abi/DTCYieldFarm.json";
import tokenAbiRaw from "../../abi/DTCToken.json";

// PENTING: Ganti dengan address DTCYieldFarm yang sudah di-deploy
// Sementara menggunakan placeholder sampai user memberikan address resmi
export const dtcYieldFarmAddress = "0xce3c610FaB49BA1a63DD00537354a0E1C578f1f4";
export const dtcTokenAddress = "0xc133D14fbdaD77384282046B2347115c2518235D";

export const dtcYieldFarmContract = getContract({
    address: dtcYieldFarmAddress,
    chain: ganacheChain,
    client,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: yieldAbiRaw as any,
});

export const dtcTokenContract = getContract({
    address: dtcTokenAddress,
    chain: ganacheChain,
    client,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: tokenAbiRaw as any,
});
