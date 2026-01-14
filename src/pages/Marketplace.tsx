import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { RippleButton } from "@/components/ui/ripple-button";
import { Input } from "@/components/ui/input";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { TiltCard, HoverLiftCard } from "@/components/ui/tilt-card";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { CountUp } from "@/components/ui/animated-gradient-text";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { TransactionHistory } from "@/components/marketplace/TransactionHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  ShoppingCart,
  Leaf,
  Sun,
  TrendingUp,
  Wallet,
  AlertTriangle,
  History,
} from "lucide-react";

interface Listing {
  id: string;
  producer: string;
  producerAddress: string; // Wallet address of seller
  location: string;
  credits: number;
  pricePerCredit: number; // Price in ETH (1 SRC = 1 ETH)
  rating: number;
  verified: boolean;
  solarCapacity: string;
}

// Valid testnet addresses for demo (Arbitrum Sepolia faucet addresses)
const listings: Listing[] = [
  {
    id: "1",
    producer: "Rajesh Solar Farm",
    producerAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    location: "Rajasthan",
    credits: 125.5,
    pricePerCredit: 1.0, // 1 SRC = 1 ETH
    rating: 4.9,
    verified: true,
    solarCapacity: "50 kW",
  },
  {
    id: "2",
    producer: "Green Energy Gujarat",
    producerAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    location: "Gujarat",
    credits: 85.25,
    pricePerCredit: 1.0, // 1 SRC = 1 ETH
    rating: 4.7,
    verified: true,
    solarCapacity: "35 kW",
  },
  {
    id: "3",
    producer: "Tamil Nadu Renewables",
    producerAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    location: "Tamil Nadu",
    credits: 200.75,
    pricePerCredit: 1.0, // 1 SRC = 1 ETH
    rating: 4.8,
    verified: true,
    solarCapacity: "75 kW",
  },
  {
    id: "4",
    producer: "Karnataka Sun Power",
    producerAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    location: "Karnataka",
    credits: 65.1,
    pricePerCredit: 1.0, // 1 SRC = 1 ETH
    rating: 4.6,
    verified: true,
    solarCapacity: "25 kW",
  },
  {
    id: "5",
    producer: "Maharashtra Solar Co",
    producerAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    location: "Maharashtra",
    credits: 150.333,
    pricePerCredit: 1.0, // 1 SRC = 1 ETH
    rating: 4.8,
    verified: true,
    solarCapacity: "55 kW",
  },
  {
    id: "6",
    producer: "Punjab Green Energy",
    producerAddress: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    location: "Punjab",
    credits: 95.888,
    pricePerCredit: 1.0, // 1 SRC = 1 ETH
    rating: 4.5,
    verified: true,
    solarCapacity: "40 kW",
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [buyAmount, setBuyAmount] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const {
    isConnected,
    connect,
    address,
    balance,
    srcBalance,
    isCorrectNetwork,
    switchNetwork,
    sendTransaction,
    shortenAddress,
    isContractReady,
    refreshBalances,
  } = useWallet();

  const { user } = useAuth();
  const { transactions, loading: txLoading, addTransaction } = useTransactionHistory();

  const filteredListings = listings.filter(
    (listing) =>
      listing.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validate Ethereum address format
  const isValidAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleBuy = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to purchase credits",
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

    if (!selectedListing) return;

    // Validate producer address
    if (!isValidAddress(selectedListing.producerAddress)) {
      toast({
        title: "Invalid Seller Address",
        description: "This listing has an invalid wallet address. Demo mode only.",
        variant: "destructive",
      });
      return;
    }

    // Prevent sending to self
    if (selectedListing.producerAddress.toLowerCase() === address?.toLowerCase()) {
      toast({
        title: "Cannot Buy From Yourself",
        description: "You cannot purchase credits from your own listing",
        variant: "destructive",
      });
      return;
    }

    const totalCostETH = selectedListing.pricePerCredit * buyAmount;
    const userBalance = parseFloat(balance);

    // Validate ETH balance (include buffer for gas)
    const gasBuffer = 0.002; // Buffer for L2 + L1 fee variability
    if (totalCostETH + gasBuffer > userBalance) {
      toast({
        title: "Insufficient ETH Balance",
        description: `You need ~${(totalCostETH + gasBuffer).toFixed(6)} ETH (including gas) but have ${userBalance.toFixed(6)} ETH`,
        variant: "destructive",
      });
      return;
    }

    setIsBuying(true);

    try {
      // Convert ETH to wei using safe string conversion (avoids float overflow)
      const [intPartRaw, fracPartRaw = ""] = totalCostETH.toString().split(".");
      const intPart = intPartRaw || "0";
      const fracPart = fracPartRaw.padEnd(18, "0").slice(0, 18);
      const weiAmount = BigInt(intPart) * 1_000_000_000_000_000_000n + BigInt(fracPart);

      // Ensure we have a valid hex value (must be > 0)
      if (weiAmount <= BigInt(0)) {
        toast({
          title: "Invalid Amount",
          description: "Transaction amount must be greater than 0",
          variant: "destructive",
        });
        setIsBuying(false);
        return;
      }

      const valueHex = "0x" + weiAmount.toString(16);

      console.log("Transaction details:", {
        totalCostETH,
        weiAmount: weiAmount.toString(),
        valueHex,
        to: selectedListing.producerAddress
      });

      // Send ETH to producer (this triggers MetaMask popup)
      const txResult = await sendTransaction(
        selectedListing.producerAddress,
        valueHex
      );

      if (txResult.success) {
        setShowBuyModal(false);

        // Save transaction to database if user is authenticated
        if (user) {
          await addTransaction({
            type: "purchase",
            amount: buyAmount,
            tx_hash: txResult.txHash,
            from_address: address || undefined,
            to_address: selectedListing.producerAddress,
            price_inr: totalCostETH * 250000, // Approximate ETH to INR
          });
        }

        // Refresh balances immediately
        await refreshBalances();

        toast({
          title: "Purchase Successful! 🎉",
          description: `You bought ${buyAmount} SRC from ${selectedListing.producer}. TX: ${shortenAddress(txResult.txHash || "")}`,
        });
      } else {
        toast({
          title: "Purchase Failed",
          description: txResult.error || "Transaction was not completed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Purchase error:", error);

      // Parse common MetaMask errors
      let errorMessage = "Failed to complete purchase";
      if (error.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (error.code === -32603) {
        errorMessage = "Transaction failed - check your balance and try again";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  const openBuyModal = (listing: Listing) => {
    setSelectedListing(listing);
    setBuyAmount(0.001); // Start with small decimal amount
    setShowBuyModal(true);
  };

  const totalCostETH = selectedListing ? selectedListing.pricePerCredit * buyAmount : 0;
  const hasEnoughBalance = parseFloat(balance) >= totalCostETH;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <AnimatedWrapper animation="fade-up" className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Buy verified carbon credits directly from solar producers across India
          </p>
        </AnimatedWrapper>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Leaf, value: 720, label: "Available Credits", color: "primary", suffix: " SRC" },
            { icon: Sun, value: 156, label: "Active Producers", color: "secondary" },
            { icon: TrendingUp, value: 1.0, label: "Price per Credit", color: "primary", suffix: " ETH" },
          ].map((stat, index) => (
            <AnimatedWrapper key={stat.label} animation="scale-in" delay={index * 100}>
              <HoverLiftCard className="glass-card p-4 flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-${stat.color}/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    <CountUp end={stat.value} duration={2000} />
                    {stat.suffix || ''}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </HoverLiftCard>
            </AnimatedWrapper>
          ))}
        </div>

        {/* Search and Filters */}
        <AnimatedWrapper animation="fade-up" delay={200}>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by producer or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input-glass transition-all focus:scale-[1.01]"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40 input-glass">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="price-low">
              <SelectTrigger className="w-full sm:w-40 input-glass">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="credits">Most Credits</SelectItem>
              </SelectContent>
            </Select>
            <RippleButton variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </RippleButton>
          </div>
        </AnimatedWrapper>

        {/* Tabs for Listings and History */}
        <Tabs defaultValue="listings" className="mb-8">
          <TabsList className="glass-card mb-6">
            <TabsTrigger value="listings" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              My Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {/* Listings Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, index) => (
                <AnimatedWrapper key={listing.id} animation="fade-up" delay={100 + index * 50}>
                  <TiltCard className="glass-card-hover p-6 h-full" intensity={6}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{listing.producer}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {listing.location}
                        </div>
                      </div>
                      {listing.verified && (
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground">Available</p>
                        <p className="text-xl font-bold">{listing.credits} SRC</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-xl font-bold text-primary">{listing.pricePerCredit} ETH</p>
                      </div>
                    </div>

                    {/* Rating & Capacity */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{listing.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Sun className="h-4 w-4" />
                        {listing.solarCapacity}
                      </div>
                    </div>

                    {/* Buy Button */}
                    <RippleButton
                      className="w-full btn-gradient gap-2"
                      variant="glow"
                      onClick={() => openBuyModal(listing)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy Credits
                    </RippleButton>
                  </TiltCard>
                </AnimatedWrapper>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No listings found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <AnimatedWrapper animation="fade-up">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <p className="text-sm text-muted-foreground">
                      Your recent marketplace purchases
                    </p>
                  </div>
                  {isConnected && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="font-semibold text-primary">{balance} ETH</p>
                    </div>
                  )}
                </div>
                
                {!user ? (
                  <div className="text-center py-12 glass-card rounded-xl">
                    <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground mb-4">
                      Sign in to view your transaction history
                    </p>
                    <RippleButton variant="outline" onClick={() => window.location.href = '/auth'}>
                      Sign In
                    </RippleButton>
                  </div>
                ) : (
                  <TransactionHistory
                    transactions={transactions}
                    loading={txLoading}
                    shortenAddress={shortenAddress}
                  />
                )}
              </div>
            </AnimatedWrapper>
          </TabsContent>
        </Tabs>
      </div>
      {/* Buy Modal */}
      <ConfirmationModal
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        title="Buy Carbon Credits"
        description={`Purchase SRC tokens from ${selectedListing?.producer}`}
        confirmText={isBuying ? "Confirming in MetaMask..." : "Confirm Purchase"}
        onConfirm={handleBuy}
        isLoading={isBuying}
        variant="success"
      >
        {selectedListing && (
          <div className="space-y-4">
            {!isConnected && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <span className="text-sm text-destructive font-medium">Wallet not connected</span>
                  <RippleButton size="sm" className="ml-2" onClick={connect}>
                    <Wallet className="h-4 w-4 mr-1" /> Connect
                  </RippleButton>
                </div>
              </div>
            )}

            {isConnected && !isCorrectNetwork && (
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">Please switch to Arbitrum Sepolia</span>
              </div>
            )}

            {isConnected && !hasEnoughBalance && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-destructive">
                  Insufficient ETH. You need {totalCostETH.toFixed(6)} ETH
                </span>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Number of Credits (Decimal values supported)
              </label>
              <Input
                type="number"
                step="any"
                min={0.000001}
                max={selectedListing.credits}
                value={buyAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBuyAmount(isNaN(val) || val < 0.000001 ? 0.000001 : val);
                }}
                className="input-glass"
                placeholder="Enter amount (e.g., 0.5, 1.25, 10)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max available: {selectedListing.credits} SRC
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-muted/30">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per Credit</span>
                <span className="font-semibold">{selectedListing.pricePerCredit} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span>{buyAmount} SRC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your ETH Balance</span>
                <span className={!hasEnoughBalance ? "text-destructive" : ""}>{balance} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Fee (est.)</span>
                <span>~0.0001 ETH</span>
              </div>
              <div className="border-t border-border/50 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    {totalCostETH.toFixed(6)} ETH
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              MetaMask will open for you to approve this transaction
            </p>
          </div>
        )}
      </ConfirmationModal>
    </Layout>
  );
}
