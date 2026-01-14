import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { RippleButton } from "@/components/ui/ripple-button";
import { TiltCard, HoverLiftCard } from "@/components/ui/tilt-card";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { AnimatedGradientText, CountUp } from "@/components/ui/animated-gradient-text";
import { CursorGradientBackground, GradientOrbs, FloatingParticles } from "@/components/ui/animated-background";
import { ParallaxHero, ParallaxSection, ScrollReveal } from "@/components/ui/parallax-section";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import heroImage from "@/assets/hero-solar.jpg";
import {
  Sun,
  Zap,
  Shield,
  ArrowRight,
  Upload,
  Cpu,
  Coins,
  ShoppingCart,
  Leaf,
  TrendingUp,
  Clock,
  IndianRupee,
} from "lucide-react";

const stats = [
  { value: 100, suffix: "M+", label: "Solar Installations", icon: Sun },
  { value: 50000, prefix: "₹", suffix: " Cr", label: "Market Potential", icon: TrendingUp },
  { value: 0.1, prefix: "₹", label: "Avg Gas Fee", icon: IndianRupee, decimals: 2 },
  { value: 1, prefix: "<", suffix: "s", label: "AI Verification", icon: Clock },
];

const steps = [
  { icon: Upload, title: "Upload Bill", description: "Simply upload your electricity bill showing solar export data" },
  { icon: Cpu, title: "AI Verifies", description: "Our AI instantly analyzes and verifies your solar generation" },
  { icon: Coins, title: "Mint Credits", description: "Convert verified kWh into tradeable SRC tokens on Arbitrum" },
  { icon: ShoppingCart, title: "Sell or Retire", description: "Trade credits on marketplace or retire them for ESG compliance" },
];

const features = [
  { icon: Zap, title: "Ultra-Low Gas Fees", description: "Powered by Arbitrum Stylus, mint credits for less than ₹0.10 per transaction" },
  { icon: Shield, title: "AI-Powered Verification", description: "Advanced machine learning validates your solar generation data instantly" },
  { icon: Leaf, title: "Real Climate Impact", description: "Every credit represents genuine carbon offset from renewable energy" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section with Parallax */}
      <ParallaxHero 
        backgroundImage={heroImage}
        className="flex items-center justify-center"
      >
        <CursorGradientBackground className="relative min-h-[90vh] flex items-center justify-center w-full">
          <GradientOrbs />
          <FloatingParticles particleCount={30} />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 flex flex-col items-center w-full">
              <AnimatedWrapper animation="fade-up" delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
                  <Leaf className="h-4 w-4" />
                  Powered by Arbitrum Stylus
                </div>
              </AnimatedWrapper>

              <AnimatedWrapper animation="fade-up" delay={100}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-center w-full">
                  AI-Verified Carbon Credits for{" "}
                  <AnimatedGradientText className="font-bold">
                    India's Solar Producers
                  </AnimatedGradientText>
                </h1>
              </AnimatedWrapper>

              <AnimatedWrapper animation="fade-up" delay={200}>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-center w-full">
                  Mint carbon credits in seconds. Sell to ESG buyers worldwide. Join the solar revolution with ultra-low gas fees on Arbitrum.
                </p>
              </AnimatedWrapper>

              <AnimatedWrapper animation="fade-up" delay={300}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <RippleButton asChild size="xl" variant="glow" className="text-lg px-8 py-6 rounded-2xl gap-2">
                    <Link to="/dashboard">Get Started <ArrowRight className="h-5 w-5" /></Link>
                  </RippleButton>
                  <RippleButton asChild variant="outline" size="xl" className="text-lg px-8 py-6 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm">
                    <Link to="/marketplace">View Marketplace</Link>
                  </RippleButton>
                </div>
              </AnimatedWrapper>
            </div>
          </div>
        </CursorGradientBackground>
      </ParallaxHero>

      {/* Stats Section */}
      <section className="py-16 md:py-24 border-y border-border/50 bg-card/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label}>
                <HoverLiftCard className="glass-card p-6 text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-bold mb-1 text-foreground tabular-nums">
                    {stat.prefix}
                    <CountUp end={stat.value} decimals={stat.decimals || 0} duration={2000} />
                    {stat.suffix}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </HoverLiftCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <ParallaxSection speed={0.2} className="absolute inset-0 pointer-events-none">
          <GradientOrbs />
        </ParallaxSection>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal className="text-center mb-12 md:mb-16">
            <h2 className="section-heading mb-4 text-foreground">
              How It <AnimatedGradientText>Works</AnimatedGradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From electricity bill to carbon credits in four simple steps</p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <ScrollReveal key={step.title}>
                <TiltCard className="glass-card-hover p-6 text-center relative group h-full" intensity={6}>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-card/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <h2 className="section-heading mb-6 text-foreground">
                  Built for <AnimatedGradientText>Scale</AnimatedGradientText>
                </h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-muted-foreground mb-8">
                  SolarCredits India is designed to democratize carbon markets for 100 million+ small solar installations across the country.
                </p>
              </ScrollReveal>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <ScrollReveal key={feature.title}>
                    <HoverLiftCard className="flex gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="p-3 rounded-xl bg-primary/10 h-fit">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </HoverLiftCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            <ParallaxSection speed={0.15}>
              <div className="relative">
                <TiltCard className="glass-card p-8" intensity={5} glare>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Verification Result</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">✓ Verified</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Solar Export</p>
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                          <CountUp end={1250} duration={2500} /> kWh
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-1">Credits Earned</p>
                        <p className="text-2xl font-bold text-primary tabular-nums">
                          <CountUp end={12.5} decimals={1} duration={2500} /> SRC
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                          <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-primary to-secondary animate-[gradient-shift_3s_ease-in-out_infinite]" />
                        </div>
                        <span className="font-bold text-primary">98%</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
            </ParallaxSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
              <GradientOrbs />
              <div className="relative z-10">
                <h2 className="section-heading mb-4 text-foreground">
                  Ready to Start <AnimatedGradientText>Earning</AnimatedGradientText>?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Join thousands of solar producers across India who are already monetizing their clean energy with carbon credits.
                </p>
                <RippleButton asChild size="xl" variant="glow" className="text-lg px-8 py-6 rounded-2xl gap-2">
                  <Link to="/dashboard">Start Minting Credits <ArrowRight className="h-5 w-5" /></Link>
                </RippleButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </Layout>
  );
}
