import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useWallet } from "@/context/WalletContext";
import {
  activateProduct,
  getProductActivity,
  getProductsByOwner,
  transferProduct,
  updateProductDetails,
} from "@/services/productService";
import type { Product, ProductActivity } from "@/types";
import { errorHandler } from "@/utils";
import MyProductsBody from "@/components/MyProducts/MyProductsBody";
import MyProductsDialogs from "@/components/MyProducts/MyProductsDialogs";
import MyProductsConnectPrompt from "@/components/MyProducts/MyProductsConnectPrompt";

const MyProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { connected, address, connect, connecting, getSigner } = useWallet();
  const [tab, setTab] = useState(0);
  const [transferDialog, setTransferDialog] = useState<string | null>(null);
  const [transferAddress, setTransferAddress] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [activationProduct, setActivationProduct] = useState<Product | null>(
    null,
  );
  const [activationPrice, setActivationPrice] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [soldProducts, setSoldProducts] = useState<ProductActivity[]>([]);
  const [transferredProducts, setTransferredProducts] = useState<
    ProductActivity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!connected || !address) {
      setProducts([]);
      setSoldProducts([]);
      setTransferredProducts([]);
      setLoading(false);

      return;
    }

    let active = true;
    setLoading(true);
    setLoadError("");
    Promise.all([getProductsByOwner(address), getProductActivity(address)])
      .then(([ownedProducts, activity]) => {
        if (!active) return;
        setProducts(ownedProducts);
        setSoldProducts(activity.sold);
        setTransferredProducts(activity.transferred);
      })
      .catch((error) => {
        if (active) {
          setLoadError(errorHandler(error, "Could not load your products."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [connected, address, reloadIndex]);

  const runAction = async (
    action: (signer: Awaited<ReturnType<typeof getSigner>>) => Promise<unknown>,
    fallback: string,
  ): Promise<boolean> => {
    setActionBusy(true);
    setActionError("");
    try {
      await action(await getSigner());
      setReloadIndex((index) => index + 1);

      return true;
    } catch (error) {
      setActionError(errorHandler(error, fallback));

      return false;
    } finally {
      setActionBusy(false);
    }
  };

  const confirmTransfer = async () => {
    if (!transferDialog) return;
    const succeeded = await runAction(
      (signer) => transferProduct(transferDialog, transferAddress, signer),
      "Product transfer failed.",
    );
    if (succeeded) {
      setTransferDialog(null);
      setTransferAddress("");
    }
  };

  const confirmEdit = async () => {
    if (!editProduct) return;
    const succeeded = await runAction(
      (signer) =>
        updateProductDetails(editProduct.id, editName, editDescription, signer),
      "Product update failed.",
    );
    if (succeeded) setEditProduct(null);
  };

  const confirmActivate = async () => {
    if (!activationProduct) return;
    const succeeded = await runAction(
      (signer) =>
        activateProduct(activationProduct.id, activationPrice, signer),
      "Product activation failed.",
    );
    if (succeeded) setActivationProduct(null);
  };

  if (!connected) {
    return (
      <MyProductsConnectPrompt
        connecting={connecting}
        onConnect={() => void connect()}
      />
    );
  }

  const myListings = products.filter((product) => product.status === "Active");
  const ownedProducts = products.filter(({ status }) => status !== "Active");

  return (
    <Box>
      <MyProductsBody
        tab={tab}
        onTabChange={setTab}
        myListings={myListings}
        ownedProducts={ownedProducts}
        soldProducts={soldProducts}
        transferredProducts={transferredProducts}
        loading={loading}
        loadError={loadError}
        actionError={actionError}
        hasOpenDialog={Boolean(
          transferDialog || editProduct || activationProduct,
        )}
        actionBusy={actionBusy}
        onCreate={() => navigate("/create")}
        onRetry={() => setReloadIndex((index) => index + 1)}
        onView={(id) => navigate(`/product/${id}`)}
        onEdit={(product) => {
          setEditProduct(product);
          setEditName(product.name);
          setEditDescription(product.description);
          setActionError("");
        }}
        onTransfer={(product) => {
          setTransferDialog(product.id);
          setActionError("");
        }}
        onActivate={(product) => {
          setActivationProduct(product);
          setActivationPrice(String(product.price));
          setActionError("");
        }}
      />
      <MyProductsDialogs
        transferProductId={transferDialog}
        transferAddress={transferAddress}
        editProduct={editProduct}
        editName={editName}
        editDescription={editDescription}
        activationProduct={activationProduct}
        activationPrice={activationPrice}
        actionBusy={actionBusy}
        actionError={actionError}
        onTransferAddressChange={setTransferAddress}
        onEditNameChange={setEditName}
        onEditDescriptionChange={setEditDescription}
        onActivationPriceChange={setActivationPrice}
        onCloseTransfer={() => setTransferDialog(null)}
        onCloseEdit={() => setEditProduct(null)}
        onCloseActivation={() => setActivationProduct(null)}
        onConfirmTransfer={() => void confirmTransfer()}
        onConfirmEdit={() => void confirmEdit()}
        onConfirmActivation={() => void confirmActivate()}
      />
    </Box>
  );
};

export default MyProductsPage;
