import { Package, Wallet } from "lucide-react";
import WalletConnectPrompt from "@/components/core/WalletConnectPrompt";

interface MyProductsConnectPromptProps {
  connecting: boolean;
  onConnect: () => void;
}

const MyProductsConnectPrompt: React.FC<MyProductsConnectPromptProps> = ({
  connecting,
  onConnect,
}) => (
  <WalletConnectPrompt
    title="My Products"
    description="Connect your wallet to manage your listings and owned products."
    connecting={connecting}
    icon={<Package size={36} color="#0EA5E9" />}
    connectIcon={<Wallet size={16} />}
    onConnect={onConnect}
  />
);

export default MyProductsConnectPrompt;
