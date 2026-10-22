import { Wallet } from "lucide-react";
import WalletConnectPrompt from "@/components/core/WalletConnectPrompt";

interface AccountConnectPromptProps {
  connecting: boolean;
  onConnect: () => void;
}

const AccountConnectPrompt: React.FC<AccountConnectPromptProps> = ({
  connecting,
  onConnect,
}) => (
  <WalletConnectPrompt
    title="Connect Your Wallet"
    description="Connect your Web3 wallet to view your account, manage products, and track transactions."
    connecting={connecting}
    icon={<Wallet size={36} color="#0EA5E9" />}
    connectIcon={<Wallet size={18} />}
    buttonSize="large"
    onConnect={onConnect}
  />
);

export default AccountConnectPrompt;
