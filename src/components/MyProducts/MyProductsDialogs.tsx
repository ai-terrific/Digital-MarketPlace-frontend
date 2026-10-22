import type { Product } from "@/types";
import ActivationDialog from "./ActivationDialog";
import EditDialog from "./EditDialog";
import TransferDialog from "./TransferDialog";

interface MyProductsDialogsProps {
  transferProductId: string | null;
  transferAddress: string;
  editProduct: Product | null;
  editName: string;
  editDescription: string;
  activationProduct: Product | null;
  activationPrice: string;
  actionBusy: boolean;
  actionError: string;
  onTransferAddressChange: (address: string) => void;
  onEditNameChange: (name: string) => void;
  onEditDescriptionChange: (description: string) => void;
  onActivationPriceChange: (price: string) => void;
  onCloseTransfer: () => void;
  onCloseEdit: () => void;
  onCloseActivation: () => void;
  onConfirmTransfer: () => void;
  onConfirmEdit: () => void;
  onConfirmActivation: () => void;
}

const MyProductsDialogs: React.FC<MyProductsDialogsProps> = ({
  transferProductId,
  transferAddress,
  editProduct,
  editName,
  editDescription,
  activationProduct,
  activationPrice,
  actionBusy,
  actionError,
  onTransferAddressChange,
  onEditNameChange,
  onEditDescriptionChange,
  onActivationPriceChange,
  onCloseTransfer,
  onCloseEdit,
  onCloseActivation,
  onConfirmTransfer,
  onConfirmEdit,
  onConfirmActivation,
}) => (
  <>
    <TransferDialog
      open={Boolean(transferProductId)}
      address={transferAddress}
      actionBusy={actionBusy}
      actionError={actionError}
      onAddressChange={onTransferAddressChange}
      onClose={onCloseTransfer}
      onConfirm={onConfirmTransfer}
    />
    <ActivationDialog
      open={Boolean(activationProduct)}
      productName={activationProduct?.name ?? ""}
      price={activationPrice}
      actionBusy={actionBusy}
      actionError={actionError}
      onPriceChange={onActivationPriceChange}
      onClose={onCloseActivation}
      onConfirm={onConfirmActivation}
    />
    <EditDialog
      open={Boolean(editProduct)}
      name={editName}
      description={editDescription}
      actionBusy={actionBusy}
      actionError={actionError}
      onNameChange={onEditNameChange}
      onDescriptionChange={onEditDescriptionChange}
      onClose={onCloseEdit}
      onConfirm={onConfirmEdit}
    />
  </>
);

export default MyProductsDialogs;
