import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
  animationDuration?: number;
}

export function AnimatedGradientText({
  children,
  className,
  gradientColors = ["hsl(250 84% 65%)", "hsl(280 75% 60%)", "hsl(175 80% 50%)", "hsl(250 84% 65%)"],
  animationDuration = 3,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-[length:300%_auto] animate-[gradient-shift_var(--duration)_ease-in-out_infinite]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
        ["--duration" as string]: `${animationDuration}s`,
      }}
    >
      {children}
    </span>
  );
}

// Typewriter text effect
interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function TypewriterText({
  text,
  className,
  speed = 50,
  delay = 0,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  React.useEffect(() => {
    if (!started) return;
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, started]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// Counting number animation
interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hasAnimated]);

  React.useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = eased * end;
      
      setCount(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we end on exact value
        setCount(end);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hasAnimated, end, duration]);

  // Format number to avoid layout shift
  const formattedCount = React.useMemo(() => {
    return count.toFixed(decimals);
  }, [count, decimals]);

  return (
    <span 
      ref={ref} 
      className={cn("tabular-nums", className)}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}
