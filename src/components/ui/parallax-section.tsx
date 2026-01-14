import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-animations";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Positive = slower than scroll, negative = faster
  direction?: "up" | "down";
}

export function ParallaxSection({
  children,
  className,
  speed = 0.3,
  direction = "up",
}: ParallaxSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

// Background parallax layer for decorative elements
interface ParallaxBackgroundProps {
  className?: string;
  speed?: number;
  children?: React.ReactNode;
}

export function ParallaxBackground({
  className,
  speed = 0.5,
  children,
}: ParallaxBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 50}%`]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div style={{ y: smoothY }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

// Hero section with built-in parallax
interface ParallaxHeroProps {
  children: React.ReactNode;
  backgroundImage?: string;
  overlayGradient?: string;
  className?: string;
}

export function ParallaxHero({
  children,
  backgroundImage,
  overlayGradient = "from-background via-background/80 to-background",
  className,
}: ParallaxHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  const smoothBackgroundY = useSpring(backgroundY, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Parallax background */}
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={
            prefersReducedMotion
              ? {}
              : { y: smoothBackgroundY, scale: smoothScale, opacity }
          }
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-b", overlayGradient)} />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Fade and scale on scroll
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, threshold, 1], [0, 0, 1]);
  const y = useTransform(scrollYProgress, [0, threshold, 1], [60, 60, 0]);
  const scale = useTransform(scrollYProgress, [0, threshold, 1], [0.95, 0.95, 1]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
