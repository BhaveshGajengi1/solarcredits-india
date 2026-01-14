import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ShimmerSkeleton({ className, ...props }: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted/40",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent",
        "before:animate-shimmer before:bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

// Backward compatible LoadingSkeleton
interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "avatar" | "button";
}

export function LoadingSkeleton({ className, variant = "text" }: LoadingSkeletonProps) {
  const variants = {
    card: "h-32 w-full rounded-2xl",
    text: "h-4 w-full rounded-lg",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24 rounded-xl",
  };

  return (
    <ShimmerSkeleton
      className={cn(variants[variant], className)}
    />
  );
}

// Card skeleton for stats/dashboard cards
export function CardSkeleton({ className }: ShimmerSkeletonProps) {
  return (
    <div className={cn("glass-card p-6 space-y-4", className)}>
      <ShimmerSkeleton className="h-8 w-8 rounded-lg" />
      <ShimmerSkeleton className="h-8 w-24" />
      <ShimmerSkeleton className="h-4 w-32" />
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50">
      {Array.from({ length: columns }).map((_, i) => (
        <ShimmerSkeleton 
          key={i} 
          className={cn(
            "h-4",
            i === 0 ? "w-20" : i === columns - 1 ? "w-16" : "w-24"
          )} 
        />
      ))}
    </div>
  );
}

// Table skeleton (backward compatible)
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 glass-card">
          <LoadingSkeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <ShimmerSkeleton className="h-4 w-3/4" />
            <ShimmerSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton variant="button" />
        </div>
      ))}
    </div>
  );
}

// Full page loading skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <ShimmerSkeleton className="h-10 w-48" />
        <ShimmerSkeleton className="h-10 w-32 rounded-lg" />
      </div>
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="glass-card p-6 space-y-4">
        <ShimmerSkeleton className="h-6 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ className }: ShimmerSkeletonProps) {
  return (
    <div className={cn("glass-card p-6", className)}>
      <ShimmerSkeleton className="h-5 w-32 mb-4" />
      <div className="flex items-end justify-between h-48 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <ShimmerSkeleton 
            key={i} 
            className="flex-1 rounded-t-lg"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <ShimmerSkeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <ShimmerSkeleton className="h-4 w-3/4" />
        <ShimmerSkeleton className="h-3 w-1/2" />
      </div>
      <ShimmerSkeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
}

// Avatar skeleton
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };
  
  return <ShimmerSkeleton className={cn("rounded-full", sizeClasses[size])} />;
}

// Button skeleton
export function ButtonSkeleton({ className }: ShimmerSkeletonProps) {
  return <ShimmerSkeleton className={cn("h-10 w-24 rounded-lg", className)} />;
}

// Text skeleton
export function TextSkeleton({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerSkeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  );
}
