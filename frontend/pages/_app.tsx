import { configureChains, createClient, WagmiConfig } from "wagmi";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ftmChain } from "../config/network";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/theme";
import Navbar from "../components/Navbar";

const { provider, chains } = configureChains(
  [ftmChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== ftmChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Suggested",
    wallets: [wallet.metaMask({ chains }), wallet.walletConnect({ chains })],
  },
  {
    groupName: "Others",
    wallets: [
      wallet.brave({ chains }),
      wallet.trust({ chains }),
      wallet.rainbow({ chains }),
      wallet.argent({ chains }),
      wallet.coinbase({ appName: "Void Token", chains }),
      wallet.imToken({ chains }),
      wallet.injected({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions
        appInfo={{
          appName: "Void Token",
          learnMoreUrl: "https://void.money",
        }}
      >
        <ChakraProvider theme={customTheme}>
          <Navbar />
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
