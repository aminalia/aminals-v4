import { Button, ButtonProps } from './button';
import { useAccount } from 'wagmi';

interface Web3ButtonProps extends ButtonProps {
  connectMessage?: string;
  actionMessage: string;
  onAction: () => Promise<void>;
}

export function Web3Button({ 
  connectMessage = "Connect wallet", 
  actionMessage, 
  onAction,
  variant = "default",
  size = "default",
  className = "",
  ...props 
}: Web3ButtonProps) {
  const { isConnected, chain } = useAccount();
  const enabled = isConnected && chain;

  return (
    <Button
      type="button"
      onClick={onAction}
      disabled={!enabled}
      variant={enabled ? variant : "outline"}
      size={size}
      className={!enabled ? "text-gray-400 cursor-not-allowed" : className}
      {...props}
    >
      {enabled ? actionMessage : connectMessage}
    </Button>
  );
} 