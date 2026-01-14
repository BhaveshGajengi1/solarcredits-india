import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react";

type Status = "verified" | "pending" | "flagged" | "error";

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  verified: {
    label: "Verified",
    icon: CheckCircle,
    className: "bg-primary/10 text-primary border-primary/30",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  },
  flagged: {
    label: "Flagged",
    icon: AlertTriangle,
    className: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  },
  error: {
    label: "Error",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4" />}
      {config.label}
    </span>
  );
}
