import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";

interface WalletButtonProps {
  className?: string;
}

export function WalletButton({ className }: WalletButtonProps) {
  const {
    address,
    balance,
    isConnected,
    isConnecting,
    network,
    connect,
    disconnect,
    switchNetwork,
    shortenAddress,
  } = useWallet();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://sepolia.arbiscan.io/address/${address}`, "_blank");
    }
  };

  const isWrongNetwork = network === "Wrong Network";

  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        className={cn("btn-gradient gap-2", className)}
      >
        {isConnecting ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "gap-2 glass-card border-primary/30",
            isWrongNetwork && "border-destructive/50",
            className
          )}
        >
          <div className={cn(
            "h-2 w-2 rounded-full animate-pulse",
            isWrongNetwork ? "bg-destructive" : "bg-primary"
          )} />
          <span className="font-mono text-sm">{shortenAddress(address || "")}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 glass-card border-border/50">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ETH Balance</span>
            <span className="font-bold text-primary">{balance} ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network</span>
            <div className="flex items-center gap-1.5">
              {isWrongNetwork ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  <span className="text-sm text-destructive">{network}</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{network}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        {isWrongNetwork && (
          <>
            <DropdownMenuItem onClick={switchNetwork} className="gap-2 cursor-pointer text-primary">
              <RefreshCw className="h-4 w-4" />
              Switch to Arbitrum Sepolia
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer">
          <Copy className="h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openExplorer} className="gap-2 cursor-pointer">
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={switchNetwork} className="gap-2 cursor-pointer">
          <RefreshCw className="h-4 w-4" />
          Switch Network
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="gap-2 cursor-pointer text-destructive">
          <LogOut className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
