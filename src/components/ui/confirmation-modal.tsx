import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive" | "success";
  icon?: LucideIcon;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: "text-primary bg-primary/10",
    buttonClass: "btn-gradient",
  },
  destructive: {
    icon: AlertTriangle,
    iconClass: "text-destructive bg-destructive/10",
    buttonClass: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-primary bg-primary/10",
    buttonClass: "btn-gradient",
  },
};

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  icon,
  isLoading = false,
  children,
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-border/50 max-w-md">
        <DialogHeader className="space-y-4">
          <div className={cn("mx-auto p-4 rounded-2xl", config.iconClass)}>
            <Icon className="h-8 w-8" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children && <div className="py-4">{children}</div>}
        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={cn("w-full sm:w-auto", config.buttonClass)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
