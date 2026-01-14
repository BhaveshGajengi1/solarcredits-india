import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUpload } from "@/components/ui/file-upload";
import { StatusBadge } from "@/components/ui/status-badge";
import { RippleButton } from "@/components/ui/ripple-button";
import { Confetti } from "@/components/ui/confetti";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { TiltCard, HoverLiftCard } from "@/components/ui/tilt-card";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { CountUp } from "@/components/ui/animated-gradient-text";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import {
  Zap,
  Coins,
  Shield,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Copy,
  RefreshCw,
  Wallet,
  AlertTriangle,
} from "lucide-react";

type VerificationState = "idle" | "uploading" | "verifying" | "verified" | "error";

interface VerificationResult {
  consumptionKwh: number;
  exportedKwh: number;
  creditsEarned: number;
  confidenceScore: number;
  hash: string;
  status: "verified" | "flagged";
}

const statIcons = [Zap, Coins, Shield, TrendingUp];

export default function Dashboard() {
  const [state, setState] = useState<VerificationState>("idle");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    isConnected,
    connect,
    address,
    balance,
    srcBalance,
    isCorrectNetwork,
    switchNetwork,
    mintSRC,
    isContractReady,
    shortenAddress
  } = useWallet();

  const stats = [
    { title: "Monthly Generation", value: 1250, suffix: " kWh", icon: Zap, trend: { value: 12, positive: true } },
    { title: "Credits Earned", value: parseFloat(srcBalance) || 12.5, suffix: " SRC", icon: Coins, trend: { value: 8, positive: true }, decimals: 1 },
    { title: "Verification Status", value: "Active", icon: Shield, isText: true },
    { title: "Market Value (ETH)", value: parseFloat(srcBalance) || 12.5, suffix: " ETH", icon: TrendingUp, trend: { value: 5, positive: true }, decimals: 2 },
  ];

  const handleFileSelect = async (file: File) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setState("uploading");

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setState("verifying");

    // Simulate AI verification
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock result
    setResult({
      consumptionKwh: 450,
      exportedKwh: 1250,
      creditsEarned: 12.5,
      confidenceScore: 98.5,
      hash: "8f14e45fceea167a5a36dedd4bea2543c3d2e1f0a8b9c6d7e5f4a3b2c1d0e9f8",
      status: "verified",
    });
    setState("verified");

    toast({
      title: "Verification Complete",
      description: "Your solar generation has been verified successfully!",
    });
  };

  const handleMint = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint credits",
        variant: "destructive",
      });
      return;
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Arbitrum Sepolia",
        variant: "destructive",
      });
      await switchNetwork();
      return;
    }

    // Check ETH balance for gas
    if (parseFloat(balance) < 0.001) {
      toast({
        title: "Insufficient ETH",
        description: "You need ETH for gas fees. Get testnet ETH from a faucet.",
        variant: "destructive",
      });
      return;
    }

    setIsMinting(true);

    try {
      const txResult = await mintSRC(result?.creditsEarned || 12.5, result?.hash || "");

      if (txResult.success) {
        setShowMintModal(false);
        setShowConfetti(true);

        toast({
          title: "Credits Minted Successfully! 🎉",
          description: `${result?.creditsEarned} SRC tokens have been minted. TX: ${shortenAddress(txResult.txHash || "")}`,
        });

        setTimeout(() => setShowConfetti(false), 4000);
      } else {
        toast({
          title: "Minting Failed",
          description: txResult.error || "Transaction was not completed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mint credits",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const copyHash = () => {
    if (result) {
      navigator.clipboard.writeText(result.hash);
      toast({
        title: "Hash Copied",
        description: "Verification hash copied to clipboard",
      });
    }
  };

  const resetState = () => {
    setState("idle");
    setResult(null);
  };

  return (
    <Layout>
      <Confetti active={showConfetti} />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <AnimatedWrapper animation="fade-up" className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Producer Dashboard</h1>
          <p className="text-muted-foreground">
            Upload your electricity bill to verify solar generation and mint carbon credits
          </p>
        </AnimatedWrapper>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <AnimatedWrapper key={stat.title} animation="scale-in" delay={index * 100}>
              <TiltCard className="glass-card p-6" intensity={5}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  {stat.trend && (
                    <span className={`text-xs font-medium ${stat.trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.trend.positive ? '+' : '-'}{stat.trend.value}%
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mb-1">
                  {stat.isText ? (
                    stat.value
                  ) : (
                    <>
                      <CountUp end={stat.value as number} decimals={stat.decimals || 0} duration={2000} />
                      {stat.suffix}
                    </>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </TiltCard>
            </AnimatedWrapper>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <AnimatedWrapper animation="fade-up" delay={200}>
              <HoverLiftCard className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Electricity Bill</h2>

                {state === "idle" && (
                  <FileUpload onFileSelect={handleFileSelect} />
                )}

                {(state === "uploading" || state === "verifying") && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                      <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                      <div>
                        <p className="font-medium">
                          {state === "uploading" ? "Uploading document..." : "AI is verifying your data..."}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {state === "uploading"
                            ? "Securely uploading your electricity bill"
                            : "Analyzing solar generation patterns"}
                        </p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 animate-[shimmer_2s_linear_infinite]"
                        style={{ width: state === "uploading" ? "40%" : "80%" }}
                      />
                    </div>
                  </div>
                )}

                {state === "verified" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={result?.status || "verified"} />
                        <span className="text-sm text-muted-foreground">
                          AI Confidence: {result?.confidenceScore}%
                        </span>
                      </div>
                      <RippleButton variant="ghost" size="sm" onClick={resetState}>
                        Upload New
                      </RippleButton>
                    </div>
                  </div>
                )}

                {state === "error" && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                    <p className="text-destructive font-medium">Verification Failed</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please check your document and try again
                    </p>
                    <RippleButton variant="outline" className="mt-4" onClick={resetState}>
                      Try Again
                    </RippleButton>
                  </div>
                )}
              </HoverLiftCard>
            </AnimatedWrapper>

            {/* Quick Actions */}
            <AnimatedWrapper animation="fade-up" delay={300}>
              <HoverLiftCard className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <RippleButton variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                    <Link to="/history">
                      <ExternalLink className="h-5 w-5" />
                      <span>View History</span>
                    </Link>
                  </RippleButton>
                  <RippleButton variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                    <Link to="/portfolio">
                      <TrendingUp className="h-5 w-5" />
                      <span>Analytics</span>
                    </Link>
                  </RippleButton>
                </div>
              </HoverLiftCard>
            </AnimatedWrapper>
          </div>

          {/* Verification Result */}
          <div className="space-y-6">
            {state === "idle" && (
              <AnimatedWrapper animation="fade-up" delay={200}>
                <div className="glass-card p-6 h-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload your electricity bill to see verification results</p>
                  </div>
                </div>
              </AnimatedWrapper>
            )}

            {(state === "uploading" || state === "verifying") && (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}

            {state === "verified" && result && (
              <AnimatedWrapper animation="scale-in">
                <TiltCard className="glass-card p-6 space-y-6" intensity={4}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Verification Result</h2>
                    <StatusBadge status={result.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Consumption</p>
                      <p className="text-2xl font-bold">
                        <CountUp end={result.consumptionKwh} duration={1500} /> kWh
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Solar Export</p>
                      <p className="text-2xl font-bold text-primary">
                        <CountUp end={result.exportedKwh} duration={1500} /> kWh
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <p className="text-sm text-muted-foreground mb-1">Credits Earned</p>
                    <p className="text-3xl font-bold text-primary">
                      <CountUp end={result.creditsEarned} decimals={1} duration={1500} /> SRC
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      100 kWh = 1 SRC token
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${result.confidenceScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-primary">{result.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Verification Hash</p>
                      <RippleButton variant="ghost" size="sm" onClick={copyHash}>
                        <Copy className="h-4 w-4" />
                      </RippleButton>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground break-all">
                      SHA256: {result.hash}
                    </p>
                  </div>

                  <RippleButton
                    className="w-full btn-gradient gap-2"
                    size="lg"
                    variant="glow"
                    onClick={() => setShowMintModal(true)}
                  >
                    Mint Credits on Blockchain
                    <ArrowRight className="h-5 w-5" />
                  </RippleButton>
                </TiltCard>
              </AnimatedWrapper>
            )}
          </div>
        </div>
      </div>

      {/* Mint Confirmation Modal */}
      <ConfirmationModal
        open={showMintModal}
        onOpenChange={setShowMintModal}
        title="Mint Carbon Credits"
        description="You're about to mint SRC tokens on Arbitrum Sepolia"
        confirmText={isMinting ? "Confirming in MetaMask..." : "Confirm Mint"}
        onConfirm={handleMint}
        isLoading={isMinting}
        variant="success"
      >
        <div className="space-y-4">
          {!isConnected && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm text-destructive">Please connect your wallet first</span>
            </div>
          )}

          {isConnected && !isCorrectNetwork && (
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">Please switch to Arbitrum Sepolia</span>
            </div>
          )}

          {!isContractReady && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-blue-600 dark:text-blue-400">Contract not deployed - transaction will be simulated</span>
            </div>
          )}

          <div className="space-y-3 p-4 rounded-xl bg-muted/30">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credits to Mint</span>
              <span className="font-semibold">{result?.creditsEarned} SRC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span className="font-semibold">Arbitrum Sepolia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your ETH Balance</span>
              <span className="font-semibold">{balance} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Gas Fee</span>
              <span className="font-semibold text-primary">~0.0001 ETH</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            MetaMask will open for you to confirm this transaction
          </p>
        </div>
      </ConfirmationModal>
    </Layout>
  );
}
