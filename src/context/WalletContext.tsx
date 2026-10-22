import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  useMemo,
} from "react";
import { BrowserProvider } from "ethers";
import {
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_ID_HEX,
  WEB_RPC_URL,
  WALLET_DISCONNECTED_STORAGE_KEY,
} from "@/constants";
import type { WalletContextType, WalletState } from "@/types";
import { getMetaMaskProvider } from "@/utils";
import { errorHandler } from "@/utils";

function isWalletDisconnected() {
  try {
    return (
      window.localStorage.getItem(WALLET_DISCONNECTED_STORAGE_KEY) === "true"
    );
  } catch {
    return false;
  }
}

function setWalletDisconnected(disconnected: boolean) {
  try {
    if (disconnected) {
      window.localStorage.setItem(WALLET_DISCONNECTED_STORAGE_KEY, "true");
    } else {
      window.localStorage.removeItem(WALLET_DISCONNECTED_STORAGE_KEY);
    }
  } catch {
    // Keep the in-memory wallet state usable if browser storage is unavailable.
  }
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  network: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  connecting: false,
  getSigner: async () => {
    throw new Error("Connect a wallet first.");
  },
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
    chainId: null,
  });
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum) return;

    let active = true;
    const syncWallet = async (accounts?: string[]) => {
      if (isWalletDisconnected()) return;

      try {
        const [availableAccounts, chainId] = await Promise.all([
          accounts ?? ethereum.request({ method: "eth_accounts" }),
          ethereum.request({ method: "eth_chainId" }),
        ]);
        if (!active || isWalletDisconnected()) return;

        const address = availableAccounts[0] ?? null;
        const numericChainId = Number(chainId);
        setState({
          connected: Boolean(address),
          address,
          network: address
            ? numericChainId === SEPOLIA_CHAIN_ID
              ? "Ethereum Sepolia"
              : `Chain ID ${numericChainId}`
            : null,
          chainId: address ? numericChainId : null,
        });
      } catch {
        if (active) {
          setState({
            connected: false,
            address: null,
            network: null,
            chainId: null,
          });
        }
      }
    };

    const handleAccountsChanged = (accounts: string[]) => {
      void syncWallet(accounts);
    };
    const handleChainChanged = () => {
      void syncWallet();
    };

    void syncWallet();
    ethereum.on?.("accountsChanged", handleAccountsChanged);
    ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      active = false;
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      // Simulate wallet connection - in production, use ethers.js with MetaMask
      const ethereum = getMetaMaskProvider();

      // Connecting always requires an explicit request from the app UI.
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (!accounts?.length) {
        throw new Error("No wallet account was authorized.");
      }

      await ensureSepolia(ethereum);
      const provider = new BrowserProvider(ethereum);
      const network = await provider.getNetwork();

      setWalletDisconnected(false);
      setState({
        connected: true,
        address: accounts[0],
        network: "Ethereum Sepolia",
        chainId: Number(network.chainId),
      });
    } catch (error) {
      console.error(
        "Wallet connection failed:",
        errorHandler(error, "Unknown wallet connection error."),
      );
    } finally {
      setConnecting(false);
    }
  }, []);

  const getSigner = useCallback(async () => {
    const ethereum = getMetaMaskProvider();
    await ensureSepolia(ethereum);
    const provider = new BrowserProvider(ethereum);

    return provider.getSigner();
  }, []);

  const disconnect = useCallback(() => {
    setWalletDisconnected(true);
    setState({
      connected: false,
      address: null,
      network: null,
      chainId: null,
    });
  }, []);

  const value = useMemo(
    () => ({ ...state, connect, disconnect, connecting, getSigner }),
    [state, connect, disconnect, connecting, getSigner],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

async function ensureSepolia(ethereum: ReturnType<typeof getMetaMaskProvider>) {
  const chainId = await ethereum.request({ method: "eth_chainId" });
  if (Number(chainId) === SEPOLIA_CHAIN_ID) return;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (error) {
    if ((error as { code?: number }).code !== 4902) {
      throw Object.assign(
        new Error("Please approve switching MetaMask to Sepolia."),
        { cause: error },
      );
    }

    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: "Sepolia",
          nativeCurrency: {
            name: "Sepolia Ether",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: [WEB_RPC_URL],
        },
      ],
    });
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  }
}
