import { Chain } from "wagmi";

export const ftmChain: Chain = {
  id: 250,
  name: "Fantom",
  network: "Fantom Opera",
  rpcUrls: {
    default: "https://rpc.ankr.com/fantom	",
  },
  blockExplorers: { default: { name: "ftmscan", url: "https://ftmscan.com" } },
  nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
};
