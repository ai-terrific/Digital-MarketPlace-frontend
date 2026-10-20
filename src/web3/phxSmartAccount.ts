import { createPublicClient, http } from "viem";

import { sepolia } from "viem/chains";
import { toSimpleSmartAccount } from "permissionless/accounts";
import { createSmartAccountClient } from "permissionless";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import {
  VITE_MARKETPLACE_CONTRACT_ADDRESS,
  VITE_PIMLICO_API_KEY,
  VITE_PIMLICO_RPC_URL,
  VITE_SEPOLIA_RPC_URL,
} from "@/constants";
import { getMetaMaskProvider } from "@/utils/metamask";

export async function connectPhxSmartAccount() {
  const ethereum = getMetaMaskProvider();

  if (!VITE_PIMLICO_API_KEY) {
    throw new Error("Missing Pimlico API key.");
  }

  // Ask MetaMask to connect the user.
  await ethereum.request({ method: "eth_requestAccounts" });

  const targetChainId = `0x${sepolia.id.toString(16)}`;
  const currentChainId = await ethereum.request({
    method: "eth_chainId",
  });

  if (Number(currentChainId) !== sepolia.id) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (error) {
      const errorCode = (error as { code?: number }).code;
      if (errorCode !== 4902) {
        throw new Error("Please approve switching MetaMask to Sepolia.");
      }

      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: targetChainId,
            chainName: sepolia.name,
            nativeCurrency: sepolia.nativeCurrency,
            rpcUrls: [VITE_SEPOLIA_RPC_URL],
          },
        ],
      });
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    }
  }

  const activeChainId = await ethereum.request({
    method: "eth_chainId",
  });

  if (Number(activeChainId) !== sepolia.id) {
    throw new Error("MetaMask did not switch to Sepolia. Please try again.");
  }

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(VITE_SEPOLIA_RPC_URL),
  });

  const pimlicoClient = createPimlicoClient({
    transport: http(VITE_PIMLICO_RPC_URL),
  });

  // MetaMask remains the owner/signer of this smart account.
  const account = await toSimpleSmartAccount({
    client: publicClient,
    owner: ethereum,
  });

  const smartAccountClient = createSmartAccountClient({
    account,
    chain: sepolia,
    client: publicClient,
    bundlerTransport: http(VITE_PIMLICO_RPC_URL),
    paymaster: pimlicoClient,
  });

  return {
    account,
    smartAccountClient,
    marketplaceAddress: VITE_MARKETPLACE_CONTRACT_ADDRESS,
  };
}
