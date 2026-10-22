import type { JsonRpcSigner } from "ethers";

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
  chainId: number | null;
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  connecting: boolean;
  getSigner: () => Promise<JsonRpcSigner>;
}

export interface balanceType {
  phx: number;
  eth: number;
}
