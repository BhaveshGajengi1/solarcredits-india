import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { RippleButton } from "@/components/ui/ripple-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { CountUp } from "@/components/ui/animated-gradient-text";
import { GradientOrbs } from "@/components/ui/animated-background";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Leaf, Mail, Lock, User, ArrowRight, RefreshCw } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Account Created! 🎉",
            description: "Welcome to SolarCredits India!",
          });
          navigate("/dashboard");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast({
              title: "Invalid Credentials",
              description: "Please check your email and password.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign In Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome Back!",
            description: "Successfully signed in.",
          });
          navigate("/dashboard");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <GradientOrbs className="opacity-50" />
        
        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <AnimatedWrapper animation="fade-up" className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 animate-float">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Join India's carbon credit revolution"
                : "Sign in to manage your carbon credits"}
            </p>
          </AnimatedWrapper>

          {/* Form */}
          <AnimatedWrapper animation="scale-in" delay={100}>
            <div className="glass-card p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-muted/30 border-border/50 transition-all focus:scale-[1.01]"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`bg-muted/30 border-border/50 transition-all focus:scale-[1.01] ${
                      errors.email ? "border-destructive animate-shake" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`bg-muted/30 border-border/50 transition-all focus:scale-[1.01] ${
                      errors.password ? "border-destructive animate-shake" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
                  )}
                </div>

                <RippleButton
                  type="submit"
                  className="w-full btn-gradient gap-2"
                  size="lg"
                  variant="glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </RippleButton>
              </form>

              <div className="mt-6 pt-6 border-t border-border/50 text-center">
                <p className="text-muted-foreground">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrors({});
                    }}
                    className="text-primary font-medium hover:underline transition-colors"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </div>
          </AnimatedWrapper>

          {/* Features */}
          <AnimatedWrapper animation="fade-up" delay={200}>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="hover-lift p-4 rounded-xl">
                <p className="text-2xl font-bold text-primary">
                  <CountUp end={100} suffix="M+" duration={2000} />
                </p>
                <p className="text-xs text-muted-foreground">Solar Installations</p>
              </div>
              <div className="hover-lift p-4 rounded-xl">
                <p className="text-2xl font-bold text-primary">₹0.10</p>
                <p className="text-xs text-muted-foreground">Avg Gas Fee</p>
              </div>
              <div className="hover-lift p-4 rounded-xl">
                <p className="text-2xl font-bold text-primary">&lt;1s</p>
                <p className="text-xs text-muted-foreground">Verification</p>
              </div>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </Layout>
  );
}
