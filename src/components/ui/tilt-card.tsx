import * as React from "react";
import { cn } from "@/lib/utils";
import { useCardTilt, usePrefersReducedMotion } from "@/hooks/use-animations";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: number;
  glare?: boolean;
  className?: string;
}

export function TiltCard({
  children,
  intensity = 8,
  glare = true,
  className,
  ...props
}: TiltCardProps) {
  const { ref, transform } = useCardTilt(intensity);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = React.useState(false);

  if (prefersReducedMotion) {
    return (
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative transition-transform duration-200 ease-out will-change-transform",
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
      {glare && (
        <div
          className={cn(
            "absolute inset-0 rounded-inherit pointer-events-none transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(circle at ${50 + transform.rotateY * 5}% ${50 - transform.rotateX * 5}%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
            borderRadius: "inherit",
          }}
        />
      )}
    </div>
  );
}

// Hover lift card - simpler effect
interface HoverLiftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  liftAmount?: string;
}

export function HoverLiftCard({
  children,
  className,
  liftAmount = "-8px",
  ...props
}: HoverLiftCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        !prefersReducedMotion && [
          "hover:shadow-xl hover:shadow-primary/10",
          "hover:-translate-y-2",
        ],
        className
      )}
      style={
        !prefersReducedMotion
          ? {
              ["--lift-amount" as string]: liftAmount,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}
