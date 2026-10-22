/// <reference types="vite/client" />

import type { EIP1193Provider } from "viem";

declare global {
  interface ImportMetaEnv {
    readonly REACT_APP_API_BASE_URL?: string;
    readonly MARKETPLACE_CONTRACT_ADDRESS?: string;
    readonly PHX_TOKEN_ADDRESS?: string;
    readonly WEB_RPC_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export {};
