import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Lock, Truck, Package, CheckCircle, AlertTriangle, Copy, Timer } from "lucide-react";
import { useTransactions, TransactionStatus as TxStatus } from "@/contexts/TransactionContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const statusConfig: Record<TxStatus, { label: string; color: string; icon: React.ElementType }> = {
  sent: { label: "Sent", color: "bg-primary/10 text-primary border-primary/30", icon: Send },
  locked: { label: "Locked in Escrow", color: "bg-accent/10 text-accent border-accent/30", icon: Lock },
  shipped: { label: "Shipped", color: "bg-primary/10 text-primary border-primary/30", icon: Truck },
  delivered: { label: "Delivered", color: "bg-primary/20 text-primary border-primary/40", icon: Package },
  released: { label: "Released", color: "bg-primary/20 text-primary border-primary/50", icon: CheckCircle },
  disputed: { label: "Disputed", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle },
};

const steps: TxStatus[] = ["sent", "locked", "shipped", "delivered", "released"];

const TransactionStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransaction, updateStatus, disputeTransaction } = useTransactions();
  const tx = id ? getTransaction(id) : undefined;
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!tx || tx.status === "released" || tx.disputed) return;
    const interval = setInterval(() => {
      const diff = tx.autoReleaseAt.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Auto-releasing...");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [tx]);

  if (!tx) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4 border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Transaction not found</p>
              <Link to="/create"><Button>Create New Transaction</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const config = statusConfig[tx.status];
  const StatusIcon = config.icon;
  const currentStep = tx.disputed ? -1 : steps.indexOf(tx.status);

  const copyHash = () => {
    navigator.clipboard.writeText(tx.txHash);
    toast.success("Transaction hash copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Link to="/transactions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> All transactions
        </Link>

        {/* Status Card */}
        <Card className="border-border neon-glow-sm mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Transaction Details</CardTitle>
            <Badge variant="outline" className={config.color}>
              <StatusIcon className="h-3.5 w-3.5 mr-1" />
              {config.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timeline */}
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {steps.map((step, i) => {
                  const active = i <= currentStep;
                  return (
                    <div key={step} className="flex-1">
                      <div className={`h-2 rounded-full transition-all ${active ? "bg-primary neon-glow-sm" : "bg-secondary"}`} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-0.5">
                {steps.map((s) => (
                  <span key={s} className="capitalize">{s}</span>
                ))}
              </div>
            </div>

            {/* Tx Hash */}
            <div className="p-3 rounded-lg bg-secondary border border-border">
              <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-primary font-mono flex-1 truncate">{tx.txHash}</code>
                <button onClick={copyHash} className="p-1 rounded hover:bg-muted transition-colors">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Auto-release timer */}
            {tx.status !== "released" && !tx.disputed && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                <Timer className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">Auto-release in:</span>
                <span className="text-sm font-mono text-accent font-bold">{timeLeft}</span>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Sender</p>
                <p className="font-medium text-foreground">{tx.senderName}</p>
                <p className="text-xs text-primary font-mono mt-0.5">{tx.senderWallet.slice(0, 10)}...</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Receiver</p>
                <p className="font-medium text-foreground">{tx.receiverName}</p>
                <p className="text-xs text-primary font-mono mt-0.5">{tx.receiverWallet.slice(0, 10)}...</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-semibold text-foreground text-lg">{tx.amount} {tx.crypto}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium text-foreground">{tx.createdAt.toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-foreground">{tx.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {tx.status === "locked" && (
          <Card className="border-border mb-3">
            <CardContent className="pt-6 text-center space-y-3">
              <p className="text-muted-foreground text-sm">Has the product been shipped?</p>
              <Button onClick={() => updateStatus(tx.id, "shipped")} className="w-full neon-glow" size="lg">
                <Truck className="h-4 w-4 mr-2" /> Mark as Shipped
              </Button>
            </CardContent>
          </Card>
        )}

        {tx.status === "shipped" && (
          <Card className="border-border mb-3">
            <CardContent className="pt-6 text-center space-y-3">
              <p className="text-muted-foreground text-sm">Has the product been delivered?</p>
              <Button onClick={() => updateStatus(tx.id, "delivered")} className="w-full neon-glow" size="lg">
                <Package className="h-4 w-4 mr-2" /> Mark as Delivered
              </Button>
            </CardContent>
          </Card>
        )}

        {tx.status === "delivered" && (
          <Card className="border-border mb-3">
            <CardContent className="pt-6 text-center space-y-3">
              <p className="text-muted-foreground text-sm">Confirm receipt to release funds from escrow.</p>
              <Button onClick={() => navigate(`/confirm/${tx.id}`)} className="w-full neon-glow" size="lg">
                <CheckCircle className="h-4 w-4 mr-2" /> Confirm & Release Funds
              </Button>
            </CardContent>
          </Card>
        )}

        {tx.status === "released" && (
          <Card className="border-primary/30 neon-glow-sm">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-primary neon-text">Funds Released!</p>
              <p className="text-muted-foreground text-sm">Transaction completed successfully on-chain.</p>
            </CardContent>
          </Card>
        )}

        {tx.disputed && (
          <Card className="border-destructive/30">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="font-semibold text-destructive">Dispute Raised</p>
              <p className="text-muted-foreground text-sm">This transaction is under review.</p>
            </CardContent>
          </Card>
        )}

        {/* Dispute Button */}
        {!tx.disputed && tx.status !== "released" && (
          <div className="mt-4 text-center">
            <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { disputeTransaction(tx.id); toast.info("Dispute raised. Transaction frozen."); }}>
              <AlertTriangle className="h-4 w-4 mr-1" /> Raise Dispute
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatusPage;
