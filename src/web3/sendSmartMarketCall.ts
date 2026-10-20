import type { Address, Hex } from "viem";
import { connectPhxSmartAccount } from "./phxSmartAccount";

export async function sendMarketplaceCall(
  buildCalldata: (smartAccountAddress: Address) => Hex,
) {
  const { account, smartAccountClient, marketplaceAddress } =
    await connectPhxSmartAccount();

  const calldata = buildCalldata(account.address);

  const hash = await smartAccountClient.sendTransaction({
    to: marketplaceAddress,
    data: calldata,
    value: 0n,
  });

  return hash;
}
