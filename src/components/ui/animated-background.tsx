import * as React from "react";
import { cn } from "@/lib/utils";
import { useCursorGradient, usePrefersReducedMotion } from "@/hooks/use-animations";

interface CursorGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  intensity?: number;
}

export function CursorGradientBackground({
  children,
  className,
  gradientColor = "hsl(250 84% 65%)",
  intensity = 0.15,
}: CursorGradientBackgroundProps) {
  const { ref, position } = useCursorGradient();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 400px at ${position.x}% ${position.y}%, ${gradientColor} / ${intensity}, transparent)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Floating particles background
interface FloatingParticlesProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
}

export function FloatingParticles({
  className,
  particleCount = 20,
  particleColor = "hsl(var(--primary))",
}: FloatingParticlesProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: particleColor,
            animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

// Animated geometric patterns
interface GeometricPatternProps {
  className?: string;
  patternColor?: string;
}

export function GeometricPattern({
  className,
  patternColor = "hsl(var(--primary) / 0.05)",
}: GeometricPatternProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `
          linear-gradient(30deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}),
          linear-gradient(150deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}),
          linear-gradient(30deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}),
          linear-gradient(150deg, ${patternColor} 12%, transparent 12.5%, transparent 87%, ${patternColor} 87.5%, ${patternColor}),
          linear-gradient(60deg, hsl(var(--primary) / 0.03) 25%, transparent 25.5%, transparent 75%, hsl(var(--primary) / 0.03) 75%, hsl(var(--primary) / 0.03)),
          linear-gradient(60deg, hsl(var(--primary) / 0.03) 25%, transparent 25.5%, transparent 75%, hsl(var(--primary) / 0.03) 75%, hsl(var(--primary) / 0.03))
        `,
        backgroundSize: "80px 140px",
        backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
      }}
    />
  );
}

// Gradient orbs background
interface GradientOrbsProps {
  className?: string;
}

export function GradientOrbs({ className }: GradientOrbsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Deep purple orb */}
      <div
        className={cn(
          "absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl opacity-25",
          !prefersReducedMotion && "animate-[float_20s_ease-in-out_infinite]"
        )}
        style={{ background: "hsl(250 84% 65%)" }}
      />
      {/* Vibrant secondary orb */}
      <div
        className={cn(
          "absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl opacity-20",
          !prefersReducedMotion && "animate-[float_25s_ease-in-out_infinite_reverse]"
        )}
        style={{ background: "hsl(280 75% 60%)" }}
      />
      {/* Electric cyan accent orb */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full blur-3xl opacity-15",
          !prefersReducedMotion && "animate-[pulse_8s_ease-in-out_infinite]"
        )}
        style={{ background: "hsl(175 80% 50%)" }}
      />
      {/* Coral accent orb */}
      <div
        className={cn(
          "absolute top-1/4 right-1/3 w-1/4 h-1/4 rounded-full blur-3xl opacity-10",
          !prefersReducedMotion && "animate-[float_15s_ease-in-out_infinite]"
        )}
        style={{ background: "hsl(340 85% 65%)" }}
      />
    </div>
  );
}
