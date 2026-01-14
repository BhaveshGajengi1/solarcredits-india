import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  variant?: "default" | "gradient" | "glow";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]",
        variant === "gradient" && "bg-gradient-to-br from-primary/10 to-secondary/10",
        variant === "glow" && "animate-pulse-glow",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-sm font-medium mb-1",
              trend.positive ? "text-primary" : "text-destructive"
            )}
          >
            {trend.positive ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      )}
    </div>
  );
}
