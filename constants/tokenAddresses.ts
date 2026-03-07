import { dtcTokenAddress as globalDtcTokenAddress } from "@/lib/contracts/DTCSwap";
import { dtcTokenAddress } from "@/lib/contracts/DTCYieldFarm";


export const YIELD_TOKEN_ADDRESS = (dtcTokenAddress as string) !== "0x0000000000000000000000000000000000000000" ? dtcTokenAddress : globalDtcTokenAddress;