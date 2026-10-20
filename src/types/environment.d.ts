/// <reference types="vite/client" />

import type { EIP1193Provider } from "viem";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_BASE_URL?: string;
      [key: string]: string | undefined;
    }
  }

  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export {};
