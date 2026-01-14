import * as React from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation, usePrefersReducedMotion } from "@/hooks/use-animations";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function AnimatedWrapper({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 500,
  once = true,
}: AnimatedWrapperProps) {
  const { ref, isVisible } = useScrollAnimation();
  const prefersReducedMotion = usePrefersReducedMotion();

  const animationStyles: Record<string, string> = {
    "fade-up": "translate-y-8 opacity-0",
    "fade-in": "opacity-0",
    "scale-in": "scale-95 opacity-0",
    "slide-left": "-translate-x-8 opacity-0",
    "slide-right": "translate-x-8 opacity-0",
  };

  const visibleStyles = "translate-y-0 translate-x-0 scale-100 opacity-100";

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all will-change-transform",
        isVisible ? visibleStyles : animationStyles[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}

// Staggered animation container
interface StaggeredContainerProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: "fade-up" | "fade-in" | "scale-in";
}

export function StaggeredContainer({
  children,
  className,
  staggerDelay = 100,
  animation = "fade-up",
}: StaggeredContainerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedWrapper
          animation={animation}
          delay={index * staggerDelay}
          key={index}
        >
          {child}
        </AnimatedWrapper>
      ))}
    </div>
  );
}
