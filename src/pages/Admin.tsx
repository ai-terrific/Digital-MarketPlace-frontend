import React, { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { getMarketplaceAdminData } from "@/services/marketplaceAdminService";
import type { MarketplaceAdminData } from "@/types";
import { errorHandler } from "@/utils";
import AdminAccessView from "@/components/Admin/AdminAccessView";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import useAdminSettings from "@/components/Admin/useAdminSettings";

const AdminPage: React.FC = () => {
  const { connected, address, connect, connecting, network } = useWallet();
  const [adminData, setAdminData] = useState<MarketplaceAdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadIndex, setReloadIndex] = useState(0);
  const settings = useAdminSettings(adminData, () =>
    setReloadIndex((index) => index + 1),
  );

  useEffect(() => {
    if (!connected || !address) {
      setAdminData(null);
      setLoading(false);

      return;
    }

    let active = true;
    setLoading(true);
    setLoadError("");
    getMarketplaceAdminData()
      .then((data) => {
        if (active) setAdminData(data);
      })
      .catch((error) => {
        if (active) {
          setLoadError(
            errorHandler(error, "Could not load marketplace admin data."),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [connected, address, reloadIndex]);

  const ownerAddress = adminData?.owner ?? "";
  if (!connected || loading || loadError || !adminData) {
    return (
      <AdminAccessView
        connected={connected}
        connecting={connecting}
        loading={loading}
        error={
          loadError ||
          (!adminData && connected
            ? "Marketplace admin data is unavailable."
            : "")
        }
        address={address}
        ownerAddress={ownerAddress}
        onConnect={() => void connect()}
        onRetry={() => setReloadIndex((index) => index + 1)}
      />
    );
  }

  if (
    address &&
    ownerAddress &&
    address.toLowerCase() !== ownerAddress.toLowerCase()
  ) {
    return (
      <AdminAccessView
        connected={connected}
        connecting={connecting}
        loading={loading}
        error=""
        address={address}
        ownerAddress={ownerAddress}
        onConnect={() => void connect()}
        onRetry={() => setReloadIndex((index) => index + 1)}
      />
    );
  }

  return (
    <AdminDashboard
      address={address}
      network={network}
      currentFee={settings.currentFee}
      currentListingFee={settings.currentListingFee}
      maxFee={settings.maxFee}
      withdrawableBalance={settings.withdrawableBalance}
      ownerAddress={ownerAddress}
      activity={adminData.activity}
      newListingFee={settings.newListingFee}
      setNewListingFee={settings.setListingFee}
      updateListingFee={() => void settings.updateListingFee()}
      listingFeeUpdating={settings.listingFeeUpdating}
      listingFeeStatus={settings.listingFeeStatus}
      listingFeeError={settings.listingFeeError}
      listingFeeTransactionHash={settings.listingFeeTransactionHash}
      listingFeeDisabled={settings.listingFeeDisabled}
      newFee={settings.newFee}
      setNewFee={settings.setFee}
      updateFee={() => void settings.updateFee()}
      feeUpdating={settings.feeUpdating}
      feeStatus={settings.feeStatus}
      feeError={settings.feeError}
      feeTransactionHash={settings.feeTransactionHash}
      feeDisabled={settings.feeDisabled}
      withdrawing={settings.withdrawing}
      withdrawStatus={settings.withdrawStatus}
      withdrawError={settings.withdrawError}
      withdrawTransactionHash={settings.withdrawTransactionHash}
      withdraw={() => void settings.withdraw()}
    />
  );
};

export default AdminPage;
