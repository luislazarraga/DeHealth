import { configureChains, createConfig, WagmiConfig } from "wagmi";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { EB_Garamond } from "next/font/google";

import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import "@rainbow-me/rainbowkit/styles.css";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ftmChain } from "../config/network";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/theme";
import Navbar from "../components/Navbar";

const ebGaramond = EB_Garamond({ subsets: ["latin"] });

const { publicClient, chains } = configureChains(
  [ftmChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== ftmChain.id) return null;
        return { http: chain.rpcUrls.default.http[0] };
      },
    }),
  ]
);

const { wallets } = getDefaultWallets({
  appName: "",
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Suggested",
    wallets: [metaMaskWallet({ chains }), walletConnectWallet({ chains })],
  },
  {
    groupName: "Others",
    wallets: [
      braveWallet({ chains }),
      trustWallet({ chains }),
      rainbowWallet({ chains }),
      argentWallet({ chains }),
      coinbaseWallet({ appName: "Void Token", chains }),
      imTokenWallet({ chains }),
      injectedWallet({ chains }),
    ],
  },
]);

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={customTheme}>
          <main className={ebGaramond.className}>
            <Navbar />
            <Component {...pageProps} />
          </main>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
