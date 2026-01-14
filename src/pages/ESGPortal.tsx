import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Confetti } from "@/components/ui/confetti";
import { toast } from "@/hooks/use-toast";
import {
  Leaf,
  TreeDeciduous,
  ShoppingCart,
  Flame,
  FileText,
  Shield,
  Building2,
  Target,
  Calculator,
  Download,
  ExternalLink,
} from "lucide-react";

export default function ESGPortal() {
  const [co2Target, setCo2Target] = useState("");
  const [creditsRequired, setCreditsRequired] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showBurnModal, setShowBurnModal] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ownedCredits] = useState(50);

  const stats = [
    { title: "Your Credits", value: "50 SRC", icon: Leaf, subtitle: "Available to retire" },
    { title: "CO₂ Offset", value: "5,000 kg", icon: Target, subtitle: "Lifetime total" },
    { title: "Trees Equivalent", value: "250", icon: TreeDeciduous },
    { title: "ESG Score Impact", value: "+15%", icon: Shield, trend: { value: 15, positive: true } },
  ];

  const handleCalculate = () => {
    const target = parseFloat(co2Target);
    if (target > 0) {
      // 1 SRC = 100 kWh = ~100 kg CO2 offset
      const credits = Math.ceil(target / 100);
      setCreditsRequired(credits);
    }
  };

  const handleBuyCredits = async () => {
    setIsBuying(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsBuying(false);
    setShowBuyModal(false);

    toast({
      title: "Credits Purchased! 🎉",
      description: `${creditsRequired} SRC added to your balance`,
    });
  };

  const handleBurnCredits = async () => {
    setIsBurning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsBurning(false);
    setShowBurnModal(false);
    setShowConfetti(true);

    toast({
      title: "Credits Retired Successfully! 🌍",
      description: "Your ESG certificate is ready for download",
    });

    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <Layout>
      <Confetti active={showConfetti} />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">ESG Buyer Portal</h1>
          </div>
          <p className="text-muted-foreground">
            Meet your sustainability targets with verified carbon credits from India's solar producers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Carbon Calculator */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Carbon Offset Calculator</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    CO₂ to Offset (kg)
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Enter amount in kg"
                      value={co2Target}
                      onChange={(e) => setCo2Target(e.target.value)}
                      className="input-glass flex-1"
                    />
                    <Button onClick={handleCalculate} className="btn-gradient">
                      Calculate
                    </Button>
                  </div>
                </div>

                {creditsRequired > 0 && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Credits Required</span>
                      <span className="text-2xl font-bold text-primary">{creditsRequired} SRC</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      To offset {co2Target} kg of CO₂ emissions
                    </p>

                    <div className="flex gap-3 mt-4">
                      <Button
                        className="flex-1 btn-gradient gap-2"
                        onClick={() => setShowBuyModal(true)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Buy Credits
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setShowBurnModal(true)}
                  disabled={ownedCredits === 0}
                >
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span>Retire Credits</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Download className="h-5 w-5" />
                  <span>Download Certificate</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Impact Dashboard */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Your Impact</h2>

              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <svg className="w-48 h-48" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/30"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${75 * 2.83} ${100 * 2.83}`}
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(160 80% 50%)" />
                        <stop offset="100%" stopColor="hsl(185 70% 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-primary">5.0</p>
                    <p className="text-sm text-muted-foreground">Tonnes CO₂</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <p className="text-2xl font-bold">20,350</p>
                  <p className="text-sm text-muted-foreground">km driving offset</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">flights offset</p>
                </div>
              </div>
            </div>

            {/* Blockchain Proof */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Blockchain Proof</h2>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Latest Retirement Hash</p>
                  <p className="font-mono text-xs break-all">
                    0x8f14e45fceea167a5a36dedd4bea2543c3d2e1f0a8b9c6d7e5f4a3b2c1d0
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View on Explorer
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" />
                    Get Report
                  </Button>
                </div>
              </div>
            </div>

            {/* ESG Certificate Preview */}
            <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">ESG Certificate Ready</h3>
                  <p className="text-sm text-muted-foreground">Last updated: 2 days ago</p>
                </div>
              </div>
              <Button className="w-full btn-gradient gap-2">
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <ConfirmationModal
        open={showBuyModal}
        onOpenChange={setShowBuyModal}
        title="Purchase Carbon Credits"
        description="Buy credits to offset your carbon footprint"
        confirmText="Confirm Purchase"
        onConfirm={handleBuyCredits}
        isLoading={isBuying}
        variant="success"
      >
        <div className="space-y-3 p-4 rounded-xl bg-muted/30">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Credits to Buy</span>
            <span className="font-semibold">{creditsRequired} SRC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price per Credit</span>
            <span>₹296 (avg)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gas Fee</span>
            <span>~₹0.15</span>
          </div>
          <div className="border-t border-border/50 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">₹{(creditsRequired * 296 + 0.15).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </ConfirmationModal>

      {/* Burn Modal */}
      <ConfirmationModal
        open={showBurnModal}
        onOpenChange={setShowBurnModal}
        title="Retire Carbon Credits"
        description="Permanently retire credits to claim the carbon offset for ESG compliance"
        confirmText="Retire Credits"
        onConfirm={handleBurnCredits}
        isLoading={isBurning}
        variant="default"
        icon={Flame}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Credits to Retire
            </label>
            <Input
              type="number"
              min={1}
              max={ownedCredits}
              defaultValue={10}
              className="input-glass"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available: {ownedCredits} SRC
            </p>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <p className="text-sm text-orange-400">
              ⚠️ This action is permanent. Retired credits cannot be recovered or resold.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-muted/30">
            <div className="flex justify-between">
              <span className="text-muted-foreground">CO₂ Offset Claimed</span>
              <span className="font-semibold">1,000 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas Fee</span>
              <span>~₹0.08</span>
            </div>
          </div>
        </div>
      </ConfirmationModal>
    </Layout>
  );
}
