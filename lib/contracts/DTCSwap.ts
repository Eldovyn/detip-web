import { getContract } from "thirdweb";
import { client } from "@/lib/client";
import { ganacheChain } from "@/lib/chains";

import swapAbiRaw from "../../abi/DTCSwap.json";
import tokenAbiRaw from "../../abi/DTCToken.json";

export const dtcSwapAddress = "0x0dECd1CC1FD3eb66bD8182eD456556C3e9EcB6E4";
export const dtcTokenAddress = "0xc133D14fbdaD77384282046B2347115c2518235D";

export const dtcSwapContract = getContract({
    address: dtcSwapAddress,
    chain: ganacheChain,
    client,
    abi: swapAbiRaw as any,
});

export const dtcTokenContract = getContract({
    address: dtcTokenAddress,
    chain: ganacheChain,
    client,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: tokenAbiRaw as any,
});
