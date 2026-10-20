import { Contract } from "ethers";
import type { ContractRunner } from "ethers";

import marketplaceArtifact from "@/abi/DigitalMarketplace.json";
import { MARKETPLACE_ADDRESS } from "@/constants";

export function getMarketplace(runner: ContractRunner) {
  return new Contract(MARKETPLACE_ADDRESS, marketplaceArtifact, runner);
}
