import {
  Contract,
  formatEther,
  formatUnits,
  getAddress,
  JsonRpcProvider,
  parseUnits,
} from "ethers";
import type { JsonRpcSigner } from "ethers";

import type {
  ContractProduct,
  ImageUploadResponse,
  Product,
  ProductActivity,
  ProductType,
  WalletActivity,
} from "@/types";
import {
  ACTIVITY_LOOKBACK_BLOCKS,
  API_ENDPOINTS,
  MARKETPLACE_ADDRESS,
  VITE_PHX_TOKEN_ADDRESS,
  VITE_SEPOLIA_RPC_URL,
} from "@/constants";
import { getMarketplace } from "@/web3/marketplace";
import phoenixTokenArtifact from "@/abi/PhoenixToken.json";
import apiRequest from "./axios";

export async function uploadProductImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);

  const result = await apiRequest<ImageUploadResponse>({
    method: "POST",
    url: API_ENDPOINTS.IPFS.CREATE_UPLOAD_URL,
    data: body,
    errorMessage: "Image upload to IPFS failed.",
  });

  if (!result.url) {
    throw new Error("Image upload response did not include a URL.");
  }

  return result.url;
}

const readProvider = new JsonRpcProvider(VITE_SEPOLIA_RPC_URL, 11155111);
const readMarketplace = getMarketplace(readProvider);
function mapContractProduct(item: ContractProduct): Product {
  return {
    id: item.productId.toString(),
    name: item.name,
    description: item.description,
    price: Number(formatUnits(item.price, 18)),
    currency: "PHX",
    seller: `${item.currentOwner.slice(0, 6)}...${item.currentOwner.slice(-4)}`,
    image: item.imageURI.startsWith("ipfs://")
      ? `https://harlequin-voluntary-carp-306.mypinata.cloud/ipfs/${item.imageURI.slice(7).replace(/^ipfs\//, "")}`
      : item.imageURI,
    status: item.listed ? "Active" : "Inactive",
    owner: item.currentOwner,
  };
}

export async function getProducts(
  start: number,
  limit: number,
): Promise<Product[]> {
  if (!Number.isSafeInteger(start) || start < 0) {
    throw new Error("Product page start must be a non-negative integer.");
  }
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new Error("Product page limit must be a positive integer.");
  }

  const result = (await readMarketplace.getProducts(
    start,
    limit,
  )) as unknown as ContractProduct[];

  return result.map(mapContractProduct);
}

export async function getProductCount(): Promise<number> {
  const count = (await readMarketplace.getProductCount()) as bigint;

  return Number(count);
}

export async function getWalletBalances(owner: string): Promise<{
  phx: number;
  eth: number;
}> {
  const normalizedOwner = getAddress(owner);
  const token = new Contract(
    VITE_PHX_TOKEN_ADDRESS,
    phoenixTokenArtifact,
    readProvider,
  );
  const [nativeBalance, tokenBalance, decimals] = await Promise.all([
    readProvider.getBalance(normalizedOwner),
    token.balanceOf(normalizedOwner) as Promise<bigint>,
    token.decimals() as Promise<bigint>,
  ]);

  return {
    eth: Number(formatEther(nativeBalance)),
    phx: Number(formatUnits(tokenBalance, Number(decimals))),
  };
}

export async function getProductsByOwner(owner: string): Promise<Product[]> {
  const normalizedOwner = getAddress(owner).toLowerCase();
  const count = await getProductCount();
  const pageSize = 50;
  const ownedProducts: Product[] = [];

  for (let start = 0; start < count; start += pageSize) {
    const products = await getProducts(
      start,
      Math.min(pageSize, count - start),
    );
    ownedProducts.push(
      ...products.filter(
        (product) => product.owner?.toLowerCase() === normalizedOwner,
      ),
    );
  }

  return ownedProducts;
}

export async function getProductActivity(owner: string): Promise<{
  sold: ProductActivity[];
  transferred: ProductActivity[];
}> {
  const normalizedOwner = getAddress(owner);
  const toBlock = await readProvider.getBlockNumber();
  const fromBlock = Math.max(0, toBlock - ACTIVITY_LOOKBACK_BLOCKS + 1);
  const [soldEvents, transferEvents] = await Promise.all([
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductSold(null, null, normalizedOwner),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.OwnershipTransferred(null, normalizedOwner, null),
      fromBlock,
      toBlock,
    ),
  ]);
  const saleTransactions = new Set(
    soldEvents.map((event) => event.transactionHash),
  );
  const transferOnlyEvents = transferEvents.filter(
    (event) => !saleTransactions.has(event.transactionHash),
  );

  const loadActivities = async (
    events: typeof soldEvents,
    kind: "sold" | "transferred",
  ): Promise<ProductActivity[]> => {
    const activities = await Promise.all(
      events.map(async (event) => {
        const parsed = readMarketplace.interface.parseLog({
          topics: event.topics,
          data: event.data,
        });
        if (!parsed) return null;

        const productId = parsed.args.productId as bigint;
        const rawProduct = (await readMarketplace.getProduct(
          productId,
        )) as ContractProduct;
        const product = mapContractProduct(rawProduct);
        const counterparty =
          kind === "sold"
            ? (parsed.args.buyer as string)
            : (parsed.args.newOwner as string);

        return {
          product,
          counterparty,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          ...(kind === "sold"
            ? { value: Number(formatUnits(parsed.args.price as bigint, 18)) }
            : {}),
        };
      }),
    );

    return activities
      .filter((activity): activity is ProductActivity => activity !== null)
      .sort((a, b) => b.blockNumber - a.blockNumber);
  };

  const [sold, transferred] = await Promise.all([
    loadActivities(soldEvents, "sold"),
    loadActivities(transferOnlyEvents, "transferred"),
  ]);

  return { sold, transferred };
}

export async function getWalletActivity(
  owner: string,
): Promise<WalletActivity[]> {
  const normalizedOwner = getAddress(owner);
  const toBlock = await readProvider.getBlockNumber();
  const fromBlock = Math.max(0, toBlock - ACTIVITY_LOOKBACK_BLOCKS + 1);
  const [created, bought, sold, sent, received] = await Promise.all([
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductCreated(null, normalizedOwner),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductSold(null, normalizedOwner, null),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.ProductSold(null, null, normalizedOwner),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.OwnershipTransferred(null, normalizedOwner, null),
      fromBlock,
      toBlock,
    ),
    readMarketplace.queryFilter(
      readMarketplace.filters.OwnershipTransferred(null, null, normalizedOwner),
      fromBlock,
      toBlock,
    ),
  ]);

  const saleTransactions = new Set(
    [...bought, ...sold].map((event) => event.transactionHash),
  );
  const events = [
    ...created.map((event) => ({ event, type: "listing" as const })),
    ...bought.map((event) => ({ event, type: "purchase" as const })),
    ...sold.map((event) => ({ event, type: "sale" as const })),
    ...sent
      .filter((event) => !saleTransactions.has(event.transactionHash))
      .map((event) => ({ event, type: "transfer" as const })),
    ...received
      .filter((event) => !saleTransactions.has(event.transactionHash))
      .map((event) => ({ event, type: "transfer" as const })),
  ];
  const productNames = new Map<string, Promise<string>>();

  const activities = await Promise.all(
    events.map(async ({ event, type }) => {
      const parsed = readMarketplace.interface.parseLog({
        topics: event.topics,
        data: event.data,
      });
      if (!parsed) return null;

      const productId = parsed.args.productId as bigint;
      const id = productId.toString();
      let productName =
        type === "listing" ? (parsed.args.name as string) : undefined;
      if (!productName) {
        if (!productNames.has(id)) {
          productNames.set(
            id,
            readMarketplace
              .getProduct(productId)
              .then((product: ContractProduct) => product.name),
          );
        }
        productName = await productNames.get(id);
      }

      const counterparty =
        type === "purchase"
          ? (parsed.args.seller as string)
          : type === "sale"
            ? (parsed.args.buyer as string)
            : type === "transfer"
              ? (parsed.args.previousOwner as string) === normalizedOwner
                ? (parsed.args.newOwner as string)
                : (parsed.args.previousOwner as string)
              : "";
      const value =
        type === "transfer"
          ? undefined
          : Number(formatUnits(parsed.args.price as bigint, 18));

      return {
        id: `${event.transactionHash}-${event.index}`,
        type,
        productId: id,
        productName: productName ?? `Product ${id}`,
        counterparty,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        ...(value === undefined ? {} : { value }),
      } satisfies WalletActivity;
    }),
  );

  return activities
    .filter((activity): activity is WalletActivity => activity !== null)
    .sort((a, b) => b.blockNumber - a.blockNumber)
    .slice(0, 5);
}

export async function getProductDetails(productId: string) {
  const id = BigInt(productId);
  if (id < 0n) throw new Error("Invalid product ID.");

  const [rawProduct, feeBps] = await Promise.all([
    readMarketplace.getProduct(id),
    readMarketplace.platformFeeBps(),
  ]);

  return {
    product: mapContractProduct(rawProduct as unknown as ContractProduct),
    platformFeeBps: Number(feeBps),
  };
}

export async function transferProduct(
  productId: string,
  recipient: string,
  signer: JsonRpcSigner,
): Promise<string> {
  const id = BigInt(productId);
  if (id < 0n) throw new Error("Invalid product ID.");

  const normalizedRecipient = getAddress(recipient);
  await requireSepolia(signer);

  const marketplace = getMarketplace(signer);
  const sender = await signer.getAddress();
  const product = (await marketplace.getProduct(id)) as ContractProduct;
  if (product.currentOwner.toLowerCase() !== sender.toLowerCase()) {
    throw new Error("Only the current product owner can transfer it.");
  }
  if (normalizedRecipient.toLowerCase() === sender.toLowerCase()) {
    throw new Error("Choose a different recipient wallet.");
  }

  const transaction = await marketplace.transferOwnership(
    id,
    normalizedRecipient,
  );
  const receipt = await transaction.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("Product transfer transaction failed.");
  }

  return receipt.hash;
}

export async function updateProductDetails(
  productId: string,
  name: string,
  description: string,
  signer: JsonRpcSigner,
): Promise<string> {
  const id = BigInt(productId);
  if (id < 0n) throw new Error("Invalid product ID.");
  if (!name.trim()) throw new Error("Product name is required.");

  await requireSepolia(signer);

  const marketplace = getMarketplace(signer);
  const sender = await signer.getAddress();
  const product = (await marketplace.getProduct(id)) as ContractProduct;
  if (product.currentOwner.toLowerCase() !== sender.toLowerCase()) {
    throw new Error("Only the current product owner can edit it.");
  }

  const transaction = await marketplace.updateProductDetails(
    id,
    name.trim(),
    description.trim(),
    product.imageURI,
  );
  const receipt = await transaction.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("Product update transaction failed.");
  }

  return receipt.hash;
}

export async function buyProduct(productId: string, signer: JsonRpcSigner) {
  const id = BigInt(productId);
  if (id < 0n) throw new Error("Invalid product ID.");

  const network = await signer.provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error("Switch MetaMask to Sepolia before buying a product.");
  }

  const marketplace = getMarketplace(signer);
  const buyer = await signer.getAddress();
  const [storedProduct, tokenAddress] = await Promise.all([
    marketplace.products(id),
    marketplace.paymentToken(),
  ]);
  const price = storedProduct.price as bigint;

  if (!storedProduct.listed) {
    throw new Error("This product is not currently listed for sale.");
  }
  if (storedProduct.currentOwner.toLowerCase() === buyer.toLowerCase()) {
    throw new Error("You already own this product.");
  }

  const token = new Contract(tokenAddress, phoenixTokenArtifact, signer);
  const [balance, allowance] = await Promise.all([
    token.balanceOf(buyer) as Promise<bigint>,
    token.allowance(buyer, MARKETPLACE_ADDRESS) as Promise<bigint>,
  ]);

  if (balance < price) {
    throw new Error("Insufficient PHX balance to purchase this product.");
  }

  if (allowance < price) {
    const approval = await token.approve(MARKETPLACE_ADDRESS, price);
    const approvalReceipt = await approval.wait();
    if (!approvalReceipt || approvalReceipt.status !== 1) {
      throw new Error("PHX approval transaction failed.");
    }
  }

  const transaction = await marketplace.buyProduct(id);
  const receipt = await transaction.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("Purchase transaction failed.");
  }

  return receipt.hash;
}

async function requireSepolia(signer: JsonRpcSigner) {
  const network = await signer.provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error("Switch MetaMask to Sepolia before managing products.");
  }
}

export async function listProduct(product: ProductType, signer: JsonRpcSigner) {
  if (!product.name.trim()) {
    throw new Error("Product name is required");
  }

  if (!product.imageURI.startsWith("ipfs://")) {
    throw new Error("Please provide a valid IPFS URI");
  }

  // PHX has 18 decimals.
  const price = parseUnits(product.pricePHX, 18);
  const network = await signer.provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error("Switch MetaMask to Sepolia before creating a product.");
  }

  const contractCode = await signer.provider.getCode(MARKETPLACE_ADDRESS);
  if (contractCode === "0x") {
    throw new Error(
      "No marketplace contract was found at the configured address on Sepolia.",
    );
  }

  const marketplace = getMarketplace(signer);
  const walletAddress = await signer.getAddress();
  const platformFeeBps = (await marketplace.platformFeeBps()) as bigint;
  const creationFee = (price * platformFeeBps) / 10_000n;

  if (creationFee > 0n) {
    const tokenAddress = (await marketplace.paymentToken()) as string;
    const token = new Contract(tokenAddress, phoenixTokenArtifact, signer);
    const [balance, allowance] = await Promise.all([
      token.balanceOf(walletAddress) as Promise<bigint>,
      token.allowance(walletAddress, MARKETPLACE_ADDRESS) as Promise<bigint>,
    ]);

    if (balance < creationFee) {
      throw new Error(
        "Insufficient PHX balance to pay the product creation fee.",
      );
    }

    if (allowance < creationFee) {
      const approval = await token.approve(MARKETPLACE_ADDRESS, creationFee);
      const approvalReceipt = await approval.wait();
      if (!approvalReceipt || approvalReceipt.status !== 1) {
        throw new Error("PHX approval transaction failed.");
      }
    }
  }

  const transaction = await marketplace.createProduct(
    walletAddress,
    product.name,
    product.description,
    price,
    product.imageURI,
  );
  const receipt = await transaction.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Product creation transaction failed.");
  }

  return receipt.hash;
}
