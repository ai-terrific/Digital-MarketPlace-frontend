import { useEffect, useState } from "react";
import { parseUnits } from "ethers";
import type { MarketplaceAdminData, statusType } from "@/types";
import { useWallet } from "@/context/WalletContext";
import {
  updateFixedListingFee,
  updateMarketplaceFee,
  withdrawMarketplaceFees,
} from "@/services/marketplaceAdminService";
import { errorHandler } from "@/utils";

const useAdminSettings = (
  adminData: MarketplaceAdminData | null,
  onUpdate: () => void,
) => {
  const { getSigner } = useWallet();
  const [newListingFee, setNewListingFee] = useState("25");
  const [newFee, setNewFee] = useState("5");
  const [feeUpdating, setFeeUpdating] = useState(false);
  const [listingFeeUpdating, setListingFeeUpdating] = useState(false);
  const [listingFeeStatus, setListingFeeStatus] = useState<statusType>("idle");
  const [feeStatus, setFeeStatus] = useState<statusType>("idle");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<statusType>("idle");
  const [feeError, setFeeError] = useState("");
  const [listingFeeError, setListingFeeError] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [feeTransactionHash, setFeeTransactionHash] = useState("");
  const [listingFeeTransactionHash, setListingFeeTransactionHash] =
    useState("");
  const [withdrawTransactionHash, setWithdrawTransactionHash] = useState("");

  useEffect(() => {
    if (adminData) setNewListingFee(adminData.fixedListingFee);
  }, [adminData]);

  const currentFee = adminData ? adminData.platformFeeBps / 100 : 0;
  const currentListingFee = adminData?.fixedListingFee ?? "0";
  const maxFee = adminData ? adminData.maxFeeBps / 100 : 10;
  const withdrawableBalance = adminData?.pendingPlatformFees ?? 0;

  const updateListingFee = async () => {
    if (!adminData || !/^\d+(\.\d{1,18})?$/.test(newListingFee.trim())) {
      setListingFeeError("Enter a valid PHX amount with up to 18 decimals.");
      setListingFeeStatus("error");

      return;
    }
    const amount = parseUnits(newListingFee.trim(), 18);
    if (amount === parseUnits(currentListingFee, 18)) return;

    setListingFeeUpdating(true);
    setListingFeeStatus("pending");
    setListingFeeError("");
    setListingFeeTransactionHash("");
    try {
      const hash = await updateFixedListingFee(amount, await getSigner());
      setListingFeeTransactionHash(hash);
      setListingFeeStatus("success");
      onUpdate();
    } catch (error) {
      setListingFeeError(
        errorHandler(error, "Fixed listing fee update failed."),
      );
      setListingFeeStatus("error");
    } finally {
      setListingFeeUpdating(false);
    }
  };

  const updateFee = async () => {
    if (!adminData) return;
    const fee = Number(newFee);
    if (!Number.isFinite(fee) || fee < 0 || fee > maxFee) {
      setFeeError(`Enter a fee between 0 and ${maxFee}%.`);
      setFeeStatus("error");

      return;
    }

    setFeeUpdating(true);
    setFeeStatus("pending");
    setFeeError("");
    setFeeTransactionHash("");
    try {
      const hash = await updateMarketplaceFee(
        parseUnits(newFee, 2),
        await getSigner(),
      );
      setFeeTransactionHash(hash);
      setFeeStatus("success");
      onUpdate();
    } catch (error) {
      setFeeError(errorHandler(error, "Platform fee update failed."));
      setFeeStatus("error");
    } finally {
      setFeeUpdating(false);
    }
  };

  const withdraw = async () => {
    if (withdrawableBalance <= 0) return;
    setWithdrawing(true);
    setWithdrawStatus("pending");
    setWithdrawError("");
    setWithdrawTransactionHash("");
    try {
      const hash = await withdrawMarketplaceFees(await getSigner());
      setWithdrawTransactionHash(hash);
      setWithdrawStatus("success");
      onUpdate();
    } catch (error) {
      setWithdrawError(errorHandler(error, "Platform fee withdrawal failed."));
      setWithdrawStatus("error");
    } finally {
      setWithdrawing(false);
    }
  };

  return {
    newListingFee,
    newFee,
    currentFee,
    currentListingFee,
    maxFee,
    withdrawableBalance,
    feeUpdating,
    listingFeeUpdating,
    listingFeeStatus,
    feeStatus,
    withdrawing,
    withdrawStatus,
    feeError,
    listingFeeError,
    withdrawError,
    feeTransactionHash,
    listingFeeTransactionHash,
    withdrawTransactionHash,
    setListingFee: (value: string) => {
      setNewListingFee(value);
      setListingFeeStatus("idle");
      setListingFeeError("");
    },
    setFee: (value: string) => {
      setNewFee(value);
      setFeeStatus("idle");
      setFeeError("");
    },
    updateListingFee,
    updateFee,
    withdraw,
    listingFeeDisabled:
      listingFeeUpdating ||
      !/^\d+(\.\d{1,18})?$/.test(newListingFee.trim()) ||
      (Number.isFinite(Number(newListingFee)) &&
        parseUnits(newListingFee || "0", 18) ===
          parseUnits(currentListingFee, 18)),
    feeDisabled:
      feeUpdating ||
      !/^\d+(\.\d{1,2})?$/.test(newFee.trim()) ||
      !Number.isFinite(Number(newFee)) ||
      Number(newFee) < 0 ||
      Number(newFee) > maxFee ||
      Number(newFee) === currentFee,
  };
};

export default useAdminSettings;
