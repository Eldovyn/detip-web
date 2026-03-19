import { getContract } from "thirdweb";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";

import donateAbiRaw from "../../abi/DTCDonate.json";
import tokenAbiRaw from "../../abi/DTCToken.json";

export const dtcDonateAddress = process.env.NEXT_PUBLIC_DTC_DONATE_ADDRESS || "0x400c1347c3cFB65649FD16441D9eC4D9f51a0D36";
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
