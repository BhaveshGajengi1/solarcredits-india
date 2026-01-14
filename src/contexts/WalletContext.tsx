import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import {
  SRC_TOKEN_ADDRESS,
  encodeBalanceOfData,
  encodeTransferData,
  encodeApproveData,
  toTokenUnits,
  fromTokenUnits,
  isContractDeployed
} from "@/lib/contract";

const ARBITRUM_SEPOLIA_CHAIN_ID = "0x66eee"; // 421614 in hex
const ARBITRUM_SEPOLIA_CHAIN = {
  chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
  chainName: "Arbitrum Sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  // Use the working dRPC endpoint as primary
  rpcUrls: [
    "https://arbitrum-sepolia.drpc.org",
  ],
  blockExplorerUrls: ["https://sepolia.arbiscan.io/"],
};

interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

interface WalletContextType {
  address: string | null;
  balance: string; // ETH balance
  srcBalance: string; // SRC token balance
  isConnected: boolean;
  isConnecting: boolean;
  network: string;
  isCorrectNetwork: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  shortenAddress: (addr: string) => string;
  refreshBalances: () => Promise<void>;
  // Transaction methods
  sendTransaction: (to: string, value: string, data?: string) => Promise<TransactionResult>;
  transferSRC: (to: string, amount: number) => Promise<TransactionResult>;
  approveSRC: (spender: string, amount: number) => Promise<TransactionResult>;
  mintSRC: (amount: number, verificationHash: string) => Promise<TransactionResult>;
  isContractReady: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [srcBalance, setSrcBalance] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState("Not Connected");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isContractReady, setIsContractReady] = useState(false);

  const shortenAddress = useCallback((addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (chainId === ARBITRUM_SEPOLIA_CHAIN_ID) {
        setNetwork("Arbitrum Sepolia");
        setIsCorrectNetwork(true);
        return true;
      } else {
        setNetwork("Wrong Network");
        setIsCorrectNetwork(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking network:", error);
      return false;
    }
  }, []);

  const fetchETHBalance = useCallback(async (addr: string) => {
    if (!window.ethereum || !addr) return;

    try {
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [addr, "latest"],
      });

      const balanceWei = BigInt(balanceHex);

      // Format using bigint math to avoid precision loss (especially above 2^53 wei)
      const formatEth = (wei: bigint, decimals = 4) => {
        const weiPerEth = 1_000_000_000_000_000_000n;
        const integer = wei / weiPerEth;
        const fraction = wei % weiPerEth;
        const scale = 10n ** BigInt(decimals);
        const fractionScaled = (fraction * scale) / weiPerEth;
        return `${integer}.${fractionScaled.toString().padStart(decimals, "0")}`;
      };

      setBalance(formatEth(balanceWei, 4));
    } catch (error) {
      console.error("Error fetching ETH balance:", error);
      setBalance("0");
    }
  }, []);

  const fetchSRCBalance = useCallback(async (addr: string) => {
    if (!window.ethereum || !addr) return;

    // Check if contract is deployed
    if (!isContractDeployed()) {
      console.log("SRC contract not deployed yet");
      setIsContractReady(false);
      setSrcBalance("0");
      return;
    }

    setIsContractReady(true);

    try {
      const data = encodeBalanceOfData(addr);
      const result = await window.ethereum.request({
        method: "eth_call",
        params: [{
          to: SRC_TOKEN_ADDRESS,
          data: data,
        }, "latest"],
      });

      // Parse the result (uint256)
      const balanceWei = BigInt(result);
      const balanceHuman = fromTokenUnits(balanceWei);
      setSrcBalance(balanceHuman.toFixed(2));
    } catch (error) {
      console.error("Error fetching SRC balance:", error);
      setSrcBalance("0");
    }
  }, []);

  const refreshBalances = useCallback(async () => {
    if (address) {
      await Promise.all([
        fetchETHBalance(address),
        fetchSRCBalance(address),
      ]);
    }
  }, [address, fetchETHBalance, fetchSRCBalance]);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const addr = accounts[0];
        setAddress(addr);
        setIsConnected(true);

        await checkNetwork();
        await fetchETHBalance(addr);
        await fetchSRCBalance(addr);

        toast({
          title: "Wallet Connected",
          description: `Connected to ${shortenAddress(addr)}`,
        });
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork, fetchETHBalance, fetchSRCBalance, shortenAddress]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance("0");
    setSrcBalance("0");
    setIsConnected(false);
    setNetwork("Not Connected");
    setIsCorrectNetwork(false);

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARBITRUM_SEPOLIA_CHAIN_ID }],
      });

      await checkNetwork();

      toast({
        title: "Network Switched",
        description: "Connected to Arbitrum Sepolia",
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ARBITRUM_SEPOLIA_CHAIN],
          });

          toast({
            title: "Network Added",
            description: "Arbitrum Sepolia has been added to MetaMask",
          });
        } catch (addError) {
          toast({
            title: "Failed to Add Network",
            description: "Could not add Arbitrum Sepolia network",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed to Switch Network",
          description: switchError.message || "Could not switch network",
          variant: "destructive",
        });
      }
    }
  }, [checkNetwork]);

  // Send a raw transaction (triggers MetaMask popup)
  const sendTransaction = useCallback(async (
    to: string,
    value: string,
    data?: string
  ): Promise<TransactionResult> => {
    if (!window.ethereum || !address) {
      return { success: false, error: "Wallet not connected" };
    }

    if (!isCorrectNetwork) {
      return { success: false, error: "Please switch to Arbitrum Sepolia network" };
    }

    // Validate transaction parameters
    if (!to || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
      return { success: false, error: "Invalid recipient address" };
    }

    if (!value || !/^0x[a-fA-F0-9]+$/.test(value)) {
      return { success: false, error: "Invalid transaction value" };
    }

    const getRawErrorMessage = (err: any): string => {
      const nested =
        err?.data?.message ||
        err?.data?.originalError?.message ||
        err?.error?.message ||
        err?.cause?.message;
      return (nested || err?.message || "").toString();
    };

    const parseRpcError = (err: any): string => {
      const msg = getRawErrorMessage(err) || "Transaction failed";
      const lower = msg.toLowerCase();

      if (err?.code === 4001) return "Transaction rejected by user";
      if (lower.includes("failed to fetch") || lower.includes("networkerror")) {
        return "RPC connection failed. In MetaMask, switch networks (or update the Arbitrum Sepolia RPC URL) and try again.";
      }
      if (lower.includes("insufficient funds")) return "Insufficient funds for transaction + gas";
      if (lower.includes("intrinsic gas too low")) return "Gas limit too low";
      if (lower.includes("execution reverted")) return "Transaction reverted by network";

      return msg;
    };

    const isFetchError = (err: any) => {
      const lower = getRawErrorMessage(err).toLowerCase();
      return lower.includes("failed to fetch") || lower.includes("networkerror");
    };

    const probeRpc = async (rpcUrl: string) => {
      try {
        const res = await fetch(rpcUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_blockNumber",
            params: [],
          }),
        });

        if (!res.ok) return { ok: false as const, reason: `HTTP ${res.status}` };

        const json: any = await res.json().catch(() => null);
        if (!json) return { ok: false as const, reason: "Invalid JSON response" };
        if (json.error) return { ok: false as const, reason: json.error.message || "RPC error" };

        return { ok: true as const, blockNumber: json.result as string };
      } catch (e: any) {
        return { ok: false as const, reason: e?.message || "Fetch failed" };
      }
    };

    const getRpcFailureMessage = async () => {
      const rpcUrl = ARBITRUM_SEPOLIA_CHAIN.rpcUrls?.[0];
      if (!rpcUrl) return "RPC connection failed (no RPC configured).";

      const probe = await probeRpc(rpcUrl);
      console.log("[RPC probe]", { rpcUrl, probe });

      if (!probe.ok) {
        return (
          `RPC URL is blocked from the browser (${probe.reason}). ` +
          `This is usually CORS/firewall/VPN. If Omnia is blocked in MetaMask, switch to a CORS-enabled RPC like ` +
          `https://sepolia-rollup.arbitrum.io/rpc or https://arbitrum-sepolia-rpc.publicnode.com.`
        );
      }

      return (
        "MetaMask cannot reach the RPC even though it responds. Try: restart MetaMask/browser, disable VPN/adblock, then remove & re-add the Arbitrum Sepolia network."
      );
    };

    const repairNetwork = async () => {
      // Force MetaMask to update RPC by re-adding the chain with current config
      console.log("Repairing network - forcing RPC update to Omnia endpoint...");

      try {
        // First try to add/update the chain with our working RPC
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [ARBITRUM_SEPOLIA_CHAIN],
        });
        console.log("Chain added/updated successfully");
      } catch (addErr: any) {
        console.log("Add chain result:", addErr?.message || "completed");
      }

      // Small delay to let MetaMask process
      await new Promise(r => setTimeout(r, 500));

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARBITRUM_SEPOLIA_CHAIN_ID }],
        });
        console.log("Switched to Arbitrum Sepolia");
      } catch (switchErr: any) {
        console.log("Switch chain result:", switchErr?.message || "completed");
      }

      // Another delay to ensure the switch completes
      await new Promise(r => setTimeout(r, 500));
    };

    // Proactively repair network before attempting transaction
    // This helps refresh MetaMask's cached RPC to our working Omnia endpoint
    await repairNetwork();

    try {
      const txParams: any = {
        from: address,
        to: to,
        value: value,
        chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
      };

      if (data) {
        txParams.data = data;
      }

      // Estimate gas to ensure transaction will succeed
      let gasLimit: bigint | null = null;
      try {
        const gasEstimate = await window.ethereum.request({
          method: "eth_estimateGas",
          params: [txParams],
        });

        // Add 20% buffer to gas estimate
        gasLimit = BigInt(gasEstimate);
        const gasWithBuffer = (gasLimit * 120n) / 100n;
        txParams.gas = "0x" + gasWithBuffer.toString(16);
        gasLimit = gasWithBuffer;
      } catch (gasError: any) {
        console.error("Gas estimation failed:", gasError);

        // Check if it's an RPC fetch error
        if (isFetchError(gasError)) {
          return {
            success: false,
            error: await getRpcFailureMessage(),
          };
        }

        // For simple ETH transfers, use fallback gas limit instead of failing
        if (!data || data === "0x") {
          gasLimit = 21_000n;
          txParams.gas = "0x5208"; // 21000 in hex
          console.log("Using fallback gas limit for ETH transfer: 21000");
        } else {
          return {
            success: false,
            error: `Transaction will fail: ${parseRpcError(gasError)}`,
          };
        }
      }

      // Preflight funds check (helps avoid opaque errors)
      try {
        const [balHex, gasPriceHex] = await Promise.all([
          window.ethereum.request({ method: "eth_getBalance", params: [address, "latest"] }),
          window.ethereum.request({ method: "eth_gasPrice" }),
        ]);

        const balWei = BigInt(balHex);
        const valueWei = BigInt(value);
        const gasPriceWei = BigInt(gasPriceHex);
        const required = valueWei + (gasLimit ?? 0n) * gasPriceWei;

        if (balWei < required) {
          return {
            success: false,
            error: "Insufficient funds for value + gas (network fee is higher than the app estimate)",
          };
        }
      } catch (precheckErr: any) {
        console.warn("Preflight funds check failed:", precheckErr);
        if (isFetchError(precheckErr)) {
          return {
            success: false,
            error: await getRpcFailureMessage(),
          };
        }
      }

      const send = () =>
        window.ethereum.request({
          method: "eth_sendTransaction",
          params: [txParams],
        });

      let txHash: string;
      try {
        txHash = await send();
      } catch (sendErr: any) {
        // Common in MetaMask when the current RPC is temporarily unavailable
        if (isFetchError(sendErr)) {
          await repairNetwork();
          try {
            txHash = await send();
          } catch (sendErr2: any) {
            if (isFetchError(sendErr2)) {
              return { success: false, error: await getRpcFailureMessage() };
            }
            throw sendErr2;
          }
        } else {
          throw sendErr;
        }
      }

      toast({
        title: "Transaction Submitted",
        description: `TX: ${shortenAddress(txHash)}`,
      });

      // Wait for transaction to be mined (simple polling)
      let receipt = null;
      let attempts = 0;
      while (!receipt && attempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        receipt = await window.ethereum.request({
          method: "eth_getTransactionReceipt",
          params: [txHash],
        });
        attempts++;
      }

      if (receipt && receipt.status === "0x1") {
        await refreshBalances();
        return { success: true, txHash };
      } else if (receipt && receipt.status === "0x0") {
        return { success: false, txHash, error: "Transaction failed" };
      }

      return { success: true, txHash }; // Still pending but submitted
    } catch (error: any) {
      console.error("Transaction error:", error);
      return { success: false, error: parseRpcError(error) };
    }
  }, [address, isCorrectNetwork, shortenAddress, refreshBalances]);

  // Transfer SRC tokens
  const transferSRC = useCallback(async (
    to: string,
    amount: number
  ): Promise<TransactionResult> => {
    if (!isContractReady) {
      return { success: false, error: "SRC contract not deployed. Please deploy the contract first." };
    }

    const currentBalance = parseFloat(srcBalance);
    if (amount > currentBalance) {
      return { success: false, error: `Insufficient SRC balance. You have ${currentBalance} SRC` };
    }

    const amountWei = toTokenUnits(amount);
    const data = encodeTransferData(to, amountWei);

    return sendTransaction(SRC_TOKEN_ADDRESS, "0x0", data);
  }, [isContractReady, srcBalance, sendTransaction]);

  // Approve SRC spending
  const approveSRC = useCallback(async (
    spender: string,
    amount: number
  ): Promise<TransactionResult> => {
    if (!isContractReady) {
      return { success: false, error: "SRC contract not deployed" };
    }

    const amountWei = toTokenUnits(amount);
    const data = encodeApproveData(spender, amountWei);

    return sendTransaction(SRC_TOKEN_ADDRESS, "0x0", data);
  }, [isContractReady, sendTransaction]);

  // Mint SRC tokens (DEMO MODE - contract has access control)
  const mintSRC = useCallback(async (
    amount: number,
    verificationHash: string
  ): Promise<TransactionResult> => {
    // The deployed contract has onlyOwner/onlyMinter restrictions
    // For demo purposes, we simulate a successful mint transaction

    toast({
      title: "Demo Mode",
      description: "Simulating SRC token minting (contract has access control)",
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a realistic transaction hash
    const timestamp = Date.now().toString(16);
    const randomHex = Math.random().toString(16).substring(2, 18);
    const simulatedTxHash = `0x${timestamp}${randomHex}${verificationHash.slice(0, 24)}`.padEnd(66, '0');

    // Update the SRC balance locally (simulation)
    const currentBalance = parseFloat(srcBalance);
    const newBalance = currentBalance + amount;
    setSrcBalance(newBalance.toFixed(2));

    toast({
      title: "Minting Successful (Demo)",
      description: `Minted ${amount} SRC tokens. In production, deploy a contract without access control or grant minter role to users.`,
    });

    return {
      success: true,
      txHash: simulatedTxHash,
    };
  }, [srcBalance]);

  // Listen for account/chain changes
  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        await fetchETHBalance(accounts[0]);
        await fetchSRCBalance(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      checkNetwork();
      if (address) {
        refreshBalances();
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [address, disconnect, fetchETHBalance, fetchSRCBalance, checkNetwork, refreshBalances]);

  const value = {
    address,
    balance,
    srcBalance,
    isConnected,
    isConnecting,
    network,
    isCorrectNetwork,
    connect,
    disconnect,
    switchNetwork,
    shortenAddress,
    refreshBalances,
    sendTransaction,
    transferSRC,
    approveSRC,
    mintSRC,
    isContractReady,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
