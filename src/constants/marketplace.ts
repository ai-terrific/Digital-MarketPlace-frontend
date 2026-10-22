import { getAddress } from "ethers";

import { MARKETPLACE_CONTRACT_ADDRESS } from "./config";

export const MARKETPLACE_ADDRESS = getAddress(MARKETPLACE_CONTRACT_ADDRESS);
export const MARKETPLACE_PAGE_SIZE = 12;
