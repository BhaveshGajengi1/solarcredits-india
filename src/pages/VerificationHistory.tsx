import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { RippleButton } from "@/components/ui/ripple-button";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { HoverLiftCard } from "@/components/ui/tilt-card";
import { CountUp } from "@/components/ui/animated-gradient-text";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  FileCheck,
  Clock,
  Zap,
  Shield,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  History,
} from "lucide-react";
import { format } from "date-fns";

interface Verification {
  id: string;
  consumption_kwh: number;
  exported_kwh: number;
  credits_earned: number;
  confidence_score: number;
  verification_hash: string;
  status: string;
  bill_file_name: string | null;
  created_at: string;
}

export default function VerificationHistory() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchVerifications();
    }
  }, [user]);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch verifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Hash Copied",
      description: "Verification hash copied to clipboard",
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  const totalCredits = verifications.reduce((sum, v) => sum + Number(v.credits_earned), 0);
  const totalExported = verifications.reduce((sum, v) => sum + Number(v.exported_kwh), 0);
  const avgConfidence = verifications.length > 0
    ? verifications.reduce((sum, v) => sum + Number(v.confidence_score), 0) / verifications.length
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <AnimatedWrapper animation="fade-up" className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              Verification History
            </h1>
            <p className="text-muted-foreground">
              View all your past AI verifications and their detailed breakdowns
            </p>
          </div>
          <RippleButton onClick={fetchVerifications} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </RippleButton>
        </AnimatedWrapper>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Verifications", value: verifications.length },
            { label: "Total Credits Earned", value: totalCredits, suffix: " SRC", decimals: 2, isPrimary: true },
            { label: "Total kWh Exported", value: totalExported },
            { label: "Avg Confidence", value: avgConfidence, suffix: "%", decimals: 1 },
          ].map((stat, index) => (
            <AnimatedWrapper key={stat.label} animation="scale-in" delay={index * 100}>
              <HoverLiftCard className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.isPrimary ? 'text-primary' : ''}`}>
                  <CountUp end={stat.value} decimals={stat.decimals || 0} duration={2000} />
                  {stat.suffix}
                </p>
              </HoverLiftCard>
            </AnimatedWrapper>
          ))}
        </div>

        {/* Verifications List */}
        {verifications.length === 0 ? (
          <AnimatedWrapper animation="scale-in">
            <div className="glass-card p-12 text-center">
              <FileCheck className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Verifications Yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first electricity bill to get started with carbon credit verification.
              </p>
              <RippleButton onClick={() => navigate("/dashboard")} variant="glow" className="gap-2">
                Go to Dashboard
                <Zap className="h-4 w-4" />
              </RippleButton>
            </div>
          </AnimatedWrapper>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification, index) => (
              <AnimatedWrapper key={verification.id} animation="fade-up" delay={index * 50}>
                <HoverLiftCard className="glass-card overflow-hidden">
                  {/* Header Row */}
                  <div
                    className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleExpand(verification.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <FileCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold">
                            {format(new Date(verification.created_at), "MMM dd, yyyy")}
                          </span>
                          <StatusBadge
                            status={verification.status === "VERIFIED" ? "verified" : "flagged"}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(verification.created_at), "hh:mm a")}
                          {verification.bill_file_name && (
                            <>
                              <span>•</span>
                              <span>{verification.bill_file_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <p className="text-2xl font-bold text-primary">
                          {Number(verification.credits_earned).toFixed(2)} SRC
                        </p>
                        <p className="text-sm text-muted-foreground">Credits Earned</p>
                      </div>
                      {expandedId === verification.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === verification.id && (
                    <div className="px-4 md:px-6 pb-6 space-y-4 border-t border-border/50 pt-4 animate-fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Consumption</p>
                          <p className="text-xl font-bold">
                            {Number(verification.consumption_kwh).toLocaleString()} kWh
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Solar Export</p>
                          <p className="text-xl font-bold text-primary">
                            {Number(verification.exported_kwh).toLocaleString()} kWh
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Credits Earned</p>
                          <p className="text-xl font-bold text-primary">
                            {Number(verification.credits_earned).toFixed(2)} SRC
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-xl font-bold">
                              {Number(verification.confidence_score).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Bar */}
                      <div className="p-4 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-2">AI Confidence Level</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                              style={{ width: `${verification.confidence_score}%` }}
                            />
                          </div>
                          <span className="font-bold text-primary">
                            {Number(verification.confidence_score).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Verification Hash */}
                      <div className="p-4 rounded-xl bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">Verification Hash (SHA256)</p>
                          <div className="flex gap-2">
                            <RippleButton
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyHash(verification.verification_hash);
                              }}
                              className="gap-2"
                            >
                              <Copy className="h-4 w-4" />
                              Copy
                            </RippleButton>
                            <RippleButton variant="ghost" size="sm" className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              View on Chain
                            </RippleButton>
                          </div>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground break-all">
                          {verification.verification_hash}
                        </p>
                      </div>

                      {/* Credit Calculation */}
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                        <p className="text-sm text-muted-foreground mb-2">Credit Calculation</p>
                        <p className="text-lg">
                          <span className="font-bold text-primary">
                            {Number(verification.exported_kwh).toLocaleString()} kWh
                          </span>{" "}
                          ÷ 100 ={" "}
                          <span className="font-bold text-primary">
                            {Number(verification.credits_earned).toFixed(2)} SRC
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          1 Carbon Credit (SRC) = 100 kWh of exported solar energy
                        </p>
                      </div>
                    </div>
                  )}
                </HoverLiftCard>
              </AnimatedWrapper>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
