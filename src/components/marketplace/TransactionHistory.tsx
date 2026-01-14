import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { HoverLiftCard } from "@/components/ui/tilt-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/hooks/use-transaction-history";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  History 
} from "lucide-react";
import { format } from "date-fns";

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
  shortenAddress: (addr: string) => string;
}

export function TransactionHistory({ 
  transactions, 
  loading, 
  shortenAddress 
}: TransactionHistoryProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground">No transactions yet</p>
        <p className="text-sm text-muted-foreground/70">
          Your marketplace purchases will appear here
        </p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ArrowDownLeft className="h-4 w-4 text-primary" />;
      case "sale":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "purchase":
        return <Badge variant="default">Purchase</Badge>;
      case "sale":
        return <Badge variant="secondary">Sale</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => (
        <AnimatedWrapper key={tx.id} animation="fade-up" delay={index * 50}>
          <HoverLiftCard className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  {getTypeIcon(tx.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(tx.type)}
                    <span className="font-semibold">{tx.amount} SRC</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(tx.created_at), "MMM d, yyyy HH:mm")}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {tx.tx_hash && (
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${tx.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {shortenAddress(tx.tx_hash)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {tx.to_address && (
                  <p className="text-xs text-muted-foreground mt-1">
                    To: {shortenAddress(tx.to_address)}
                  </p>
                )}
              </div>
            </div>
          </HoverLiftCard>
        </AnimatedWrapper>
      ))}
    </div>
  );
}
