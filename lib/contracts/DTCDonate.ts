import { getContract } from "thirdweb";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";

import donateAbiRaw from "../../abi/DTCDonate.json";
import tokenAbiRaw from "../../abi/DTCToken.json";

export const dtcDonateAddress = process.env.NEXT_PUBLIC_DTC_DONATE_ADDRESS || "0xeeb21f40710940Cc7deA997a02EF4C91CD45a908";
export const dtcTokenAddress = process.env.NEXT_PUBLIC_DTC_TOKEN_ADDRESS || "0xc133D14fbdaD77384282046B2347115c2518235D";

export const dtcDonateContract = getContract({
    address: dtcDonateAddress,
    chain: ganacheChain,
    client,
    abi: donateAbiRaw as any,
});

export const dtcTokenContract = getContract({
    address: dtcTokenAddress,
    chain: ganacheChain,
    client,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: tokenAbiRaw as any,
});
