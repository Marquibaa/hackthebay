import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Send, Lock, Truck, Package, CheckCircle, AlertTriangle } from "lucide-react";
import { useTransactions, TransactionStatus } from "@/contexts/TransactionContext";
import Navbar from "@/components/Navbar";

const statusConfig: Record<TransactionStatus, { label: string; color: string; icon: React.ElementType }> = {
  sent: { label: "Sent", color: "bg-primary/10 text-primary border-primary/30", icon: Send },
  locked: { label: "Locked", color: "bg-accent/10 text-accent border-accent/30", icon: Lock },
  shipped: { label: "Shipped", color: "bg-primary/10 text-primary border-primary/30", icon: Truck },
  delivered: { label: "Delivered", color: "bg-primary/20 text-primary border-primary/40", icon: Package },
  released: { label: "Released", color: "bg-primary/20 text-primary border-primary/50", icon: CheckCircle },
  disputed: { label: "Disputed", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle },
};

const TransactionsList = () => {
  const { transactions } = useTransactions();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <Link to="/create"><Button size="sm" className="neon-glow-sm"><Plus className="h-4 w-4 mr-1" /> New</Button></Link>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-6">Transactions</h1>

        {transactions.length === 0 ? (
          <Card className="border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No transactions yet</p>
              <Link to="/create"><Button className="neon-glow-sm">Create Your First Transaction</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const config = statusConfig[tx.status];
              const Icon = config.icon;
              return (
                <Link to={`/transaction/${tx.id}`} key={tx.id}>
                  <Card className="border-border hover:border-primary/30 transition-all cursor-pointer hover:neon-glow-sm">
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {tx.senderName} → {tx.receiverName}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{tx.txHash.slice(0, 18)}...</p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="font-semibold text-primary">{tx.amount} {tx.crypto}</span>
                        <Badge variant="outline" className={config.color}>
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
