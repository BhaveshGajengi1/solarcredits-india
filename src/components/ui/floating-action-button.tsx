import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Upload, LayoutDashboard, X, ShoppingCart, Wallet } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-animations";

interface FABAction {
  icon: React.ElementType;
  label: string;
  href: string;
  color?: string;
}

const defaultActions: FABAction[] = [
  { icon: Upload, label: "Upload Bill", href: "/dashboard", color: "bg-primary" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", color: "bg-secondary" },
  { icon: ShoppingCart, label: "Marketplace", href: "/marketplace", color: "bg-accent" },
  { icon: Wallet, label: "Portfolio", href: "/portfolio", color: "bg-primary" },
];

interface FloatingActionButtonProps {
  actions?: FABAction[];
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  className?: string;
}

export function FloatingActionButton({
  actions = defaultActions,
  position = "bottom-right",
  className,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const location = useLocation();

  // Don't show on auth page
  if (location.pathname === "/auth") {
    return null;
  }

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };

  const actionVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.8,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: prefersReducedMotion ? 0 : i * 0.05,
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    }),
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.8,
      transition: { duration: 0.15 },
    },
  };

  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col-reverse items-end gap-3 mb-2">
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                custom={index}
                variants={actionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center gap-3"
              >
                <span className="px-3 py-1.5 rounded-lg bg-card/95 backdrop-blur-sm text-sm font-medium shadow-lg border border-border/50 whitespace-nowrap">
                  {action.label}
                </span>
                <Link
                  to={action.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:scale-110 transition-transform",
                    action.color || "bg-primary"
                  )}
                >
                  <action.icon className="h-5 w-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground shadow-xl",
          "bg-gradient-to-br from-primary via-secondary to-accent",
          "hover:shadow-2xl hover:shadow-primary/30 transition-shadow",
          !prefersReducedMotion && !isOpen && "animate-pulse-glow"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </motion.button>

      {/* Backdrop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/20 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
