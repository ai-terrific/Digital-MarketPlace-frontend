export const BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://172.20.5.112:8001";
export const VITE_MARKETPLACE_CONTRACT_ADDRESS =
  import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS ||
  "0xD8e1487D3c060d590ba3B9b129B2c84bfBf7948f";
export const VITE_PIMLICO_API_KEY =
  import.meta.env.VITE_PIMLICO_API_KEY || "pim_USsTkCDDEx1gtQZzSLkqiL";
export const VITE_PHX_TOKEN_ADDRESS =
  import.meta.env.VITE_PHX_TOKEN_ADDRESS ||
  "0xEb063f6Bc7e7adefF94468aEedA296cCde39D722";
export const WEB_RPC_URL =
  import.meta.env.VITE_SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/alch_iUYnjy1E9YPVLyme9Wplu";
export const VITE_PIMLICO_RPC_URL = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${VITE_PIMLICO_API_KEY}`;
