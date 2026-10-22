import { formatUnits, getAddress, JsonRpcProvider } from "ethers";
import type { JsonRpcSigner } from "ethers";

import { ACTIVITY_LOOK_BACK_BLOCKS, WEB_RPC_URL } from "@/constants";
import type { AdminActivity, MarketplaceAdminData } from "@/types";
import { getMarketplace } from "@/web3/marketplace";

const readProvider = new JsonRpcProvider(WEB_RPC_URL, 11155111);
const readMarketplace = getMarketplace(readProvider);
export async function getMarketplaceAdminData(): Promise<MarketplaceAdminData> {
  const [
    owner,
    fixedListingFee,
    platformFeeBps,
    maxFeeBps,
    pendingPlatformFees,
    toBlock,
  ] = await Promise.all([
    readMarketplace.owner(),
    readMarketplace.listingFee(),
    readMarketplace.platformFeeBps(),
    readMarketplace.MAX_FEE_BPS(),
    readMarketplace.pendingPlatformFees(),
    readProvider.getBlockNumber(),
  ]);
  const fromBlock = Math.max(0, toBlock - ACTIVITY_LOOK_BACK_BLOCKS + 1);
  const [
    created,
    listed,
    updated,
    sold,
    transferred,
    withdrawals,
    feeChanges,
    listingFeeChanges,
  ] = await Promise.all([
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductCreated(),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductListed(),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductDetailsUpdated(),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductSold(),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.OwnershipTransferred(),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.Withdrawal(),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.PlatformFeeUpdated(),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.ListingFeeUpdated(),
      fromBlock,
      toBlock,
    ),
  ]);

  const logs = [
    ...created.map((log) => ({ log, event: "Product created" })),
    ...listed.map((log) => ({ log, event: "Product relisted" })),
    ...updated.map((log) => ({ log, event: "Product updated" })),
    ...sold.map((log) => ({ log, event: "Product sold" })),
    ...transferred.map((log) => ({ log, event: "Ownership transferred" })),
    ...withdrawals.map((log) => ({ log, event: "Withdrawal" })),
    ...feeChanges.map((log) => ({ log, event: "Platform fee updated" })),
    ...listingFeeChanges.map((log) => ({
      log,
      event: "Listing fee updated",
    })),
  ];
  const activity = logs
    .map(({ log, event }): AdminActivity | null => {
      const parsed = readMarketplace.interface.parseLog({
        topics: log.topics,
        data: log.data,
      });
      if (!parsed) return null;

      const args = parsed.args;
      let description = event;
      let amount: number | undefined;
      if (parsed.name === "ProductCreated") {
        description = `Created ${args.name} (#${args.productId})`;
        amount = Number(formatUnits(args.price, 18));
      } else if (parsed.name === "ProductListed") {
        description = `Relisted product #${args.productId}`;
        amount = Number(formatUnits(args.price, 18));
      } else if (parsed.name === "ProductDetailsUpdated") {
        description = `Updated product #${args.productId}`;
      } else if (parsed.name === "ProductSold") {
        description = `Product #${args.productId} sold`;
        amount = Number(formatUnits(args.price, 18));
      } else if (parsed.name === "OwnershipTransferred") {
        description = `Product #${args.productId} ownership transferred`;
      } else if (parsed.name === "Withdrawal") {
        description = `PHX withdrawn to ${args.recipient}`;
        amount = Number(formatUnits(args.amount, 18));
      } else if (parsed.name === "PlatformFeeUpdated") {
        description = `Platform fee changed from ${Number(args.oldFeeBps) / 100}% to ${Number(args.newFeeBps) / 100}%`;
      } else if (parsed.name === "ListingFeeUpdated") {
        description = `Fixed listing fee changed from ${formatUnits(args.oldFee, 18)} PHX to ${formatUnits(args.newFee, 18)} PHX`;
      }

      return {
        id: `${log.transactionHash}-${log.index}`,
        event,
        description,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        ...(amount === undefined ? {} : { amount }),
      };
    })
    .filter((item): item is AdminActivity => item !== null)
    .sort((a, b) => b.blockNumber - a.blockNumber)
    .slice(0, 10);

  return {
    owner: getAddress(owner),
    fixedListingFee: formatUnits(fixedListingFee, 18),
    platformFeeBps: Number(platformFeeBps),
    maxFeeBps: Number(maxFeeBps),
    pendingPlatformFees: Number(formatUnits(pendingPlatformFees, 18)),
    activity,
  };
}

export async function getMarketplaceOwner(): Promise<string> {
  const owner = (await readMarketplace.owner()) as string;

  return getAddress(owner);
}

export async function updateFixedListingFee(
  fee: bigint,
  signer: JsonRpcSigner,
): Promise<string> {
  await assertOwnerAndNetwork(signer);
  if (fee < 0n) {
    throw new Error("Fixed listing fee cannot be negative.");
  }

  const marketplace = getMarketplace(signer);
  const transaction = await marketplace.setListingFee(fee);
  const receipt = await transaction.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("Fixed listing fee update transaction failed.");
  }

  return receipt.hash;
}

export async function updateMarketplaceFee(
  feeBps: bigint,
  signer: JsonRpcSigner,
): Promise<string> {
  await assertOwnerAndNetwork(signer);
  const marketplace = getMarketplace(signer);
  const maxFeeBps = (await marketplace.MAX_FEE_BPS()) as bigint;
  if (feeBps < 0n || feeBps > maxFeeBps) {
    throw new Error(`Fee must be between 0 and ${Number(maxFeeBps) / 100}%.`);
  }

  const transaction = await marketplace.setPlatformFee(feeBps);
  const receipt = await transaction.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("Platform fee update transaction failed.");
  }

  return receipt.hash;
}

export async function withdrawMarketplaceFees(
  signer: JsonRpcSigner,
): Promise<string> {
  await assertOwnerAndNetwork(signer);
  const marketplace = getMarketplace(signer);
  const pendingFees = (await marketplace.pendingPlatformFees()) as bigint;
  if (pendingFees === 0n) {
    throw new Error("There are no platform fees to withdraw.");
  }

  const transaction = await marketplace.withdrawPlatformFees();
  const receipt = await transaction.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("Platform fee withdrawal transaction failed.");
  }

  return receipt.hash;
}

async function assertOwnerAndNetwork(signer: JsonRpcSigner) {
  const network = await signer.provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error("Switch MetaMask to Sepolia before using admin controls.");
  }

  const [owner, sender] = await Promise.all([
    readMarketplace.owner() as Promise<string>,
    signer.getAddress(),
  ]);
  if (getAddress(owner) !== getAddress(sender)) {
    throw new Error(
      `Only the marketplace owner (${getAddress(owner)}) can perform this action.`,
    );
  }
}
