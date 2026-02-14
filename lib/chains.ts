import { defineChain } from "thirdweb";

export const ganacheChain = defineChain({
    id: 1337,
    rpc: "http://127.0.0.1:7545",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
});
