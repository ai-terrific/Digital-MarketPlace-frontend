import { motion } from "framer-motion";
import type { AdminActivity as AdminActivityItem, statusType } from "@/types";
import { PageDescription, PageTitle } from "@/components/core/Common";
import AdminActivity from "./AdminActivity";
import AdminFeeSetting from "./AdminFeeSetting";
import AdminStats from "./AdminStats";
import AdminWithdraw from "./AdminWithdraw";

interface AdminDashboardProps {
  address: string | null;
  network: string | null;
  currentFee: number;
  currentListingFee: string;
  maxFee: number;
  withdrawableBalance: number;
  ownerAddress: string;
  activity: AdminActivityItem[];
  newListingFee: string;
  setNewListingFee: (value: string) => void;
  updateListingFee: () => void;
  listingFeeUpdating: boolean;
  listingFeeStatus: statusType;
  listingFeeError: string;
  listingFeeTransactionHash: string;
  listingFeeDisabled: boolean;
  newFee: string;
  setNewFee: (value: string) => void;
  updateFee: () => void;
  feeUpdating: boolean;
  feeStatus: statusType;
  feeError: string;
  feeTransactionHash: string;
  feeDisabled: boolean;
  withdrawing: boolean;
  withdrawStatus: statusType;
  withdrawError: string;
  withdrawTransactionHash: string;
  withdraw: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  address,
  network,
  currentFee,
  currentListingFee,
  maxFee,
  withdrawableBalance,
  ownerAddress,
  activity,
  newListingFee,
  setNewListingFee,
  updateListingFee,
  listingFeeUpdating,
  listingFeeStatus,
  listingFeeError,
  listingFeeTransactionHash,
  listingFeeDisabled,
  newFee,
  setNewFee,
  updateFee,
  feeUpdating,
  feeStatus,
  feeError,
  feeTransactionHash,
  feeDisabled,
  withdrawing,
  withdrawStatus,
  withdrawError,
  withdrawTransactionHash,
  withdraw,
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <PageTitle title="Admin Settings" />
    <PageDescription description="Manage marketplace configuration. All changes require on-chain transactions." />
    <AdminStats
      address={address}
      currentFee={currentFee}
      withdrawableBalance={withdrawableBalance}
      network={network}
    />
    <AdminFeeSetting
      title="Update Fixed Listing Fee"
      description="Sellers pay this fixed PHX fee once when creating a product. It does not change with the product price. Buyers pay the percentage platform fee separately when purchasing."
      label="New Listing Fee (PHX)"
      value={newListingFee}
      onChange={setNewListingFee}
      onSubmit={updateListingFee}
      buttonLabel="Update Listing Fee"
      updatingLabel="Updating..."
      updating={listingFeeUpdating}
      status={listingFeeStatus}
      error={listingFeeError}
      successMessage="Fixed listing fee updated."
      transactionHash={listingFeeTransactionHash}
      currentValue={currentListingFee}
      inputWidth={190}
      inputProps={{ min: 0, step: "any" }}
      disabled={listingFeeDisabled}
    />
    <AdminFeeSetting
      title="Update Buyer Platform Fee"
      description={`Buyers pay this percentage in addition to the listed price; sellers receive the full listed price. Current fee: ${currentFee}%. Allowed range: 0-${maxFee}%. Updating requires a wallet transaction and gas fees.`}
      label="Buyer Fee (%)"
      value={newFee}
      onChange={setNewFee}
      onSubmit={updateFee}
      buttonLabel="Update Fee"
      updatingLabel="Updating..."
      updating={feeUpdating}
      status={feeStatus}
      error={feeError}
      successMessage="Fee updated successfully."
      transactionHash={feeTransactionHash}
      inputWidth={150}
      inputProps={{ min: 0, max: maxFee, step: 0.01 }}
      disabled={feeDisabled}
    />
    <AdminWithdraw
      balance={withdrawableBalance}
      ownerAddress={ownerAddress}
      withdrawing={withdrawing}
      status={withdrawStatus}
      error={withdrawError}
      transactionHash={withdrawTransactionHash}
      onWithdraw={withdraw}
    />
    <AdminActivity activity={activity} />
  </motion.div>
);

export default AdminDashboard;
