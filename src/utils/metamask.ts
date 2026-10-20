import type { EIP1193Provider } from "viem";

export function getMetaMaskProvider(): EIP1193Provider {
  const ethereum = window.ethereum;
  if (!ethereum) {
    throw new Error("Please install MetaMask.");
  }

  return ethereum;
}
