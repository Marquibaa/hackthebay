import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { useTransactions } from "@/contexts/TransactionContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const ConfirmTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransaction, updateStatus } = useTransactions();
  const tx = id ? getTransaction(id) : undefined;

  if (!tx || tx.status === "released") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4 border-border">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="font-semibold text-foreground mb-1">Already Completed</p>
              <p className="text-muted-foreground text-sm mb-4">This transaction has already been confirmed.</p>
              <Link to="/transactions"><Button variant="outline">View Transactions</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleRelease = () => {
    updateStatus(tx.id, "released");
    toast.success("Funds released to " + tx.receiverName + "!");
    navigate(`/transaction/${tx.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <Link to={`/transaction/${tx.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to transaction
        </Link>

        <Card className="border-border neon-glow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <AlertTriangle className="h-7 w-7 text-accent" />
            </div>
            <CardTitle className="text-2xl">Confirm Receipt</CardTitle>
            <CardDescription>
              By confirming, you authorize the smart contract to release escrowed funds to the receiver.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-secondary p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From</span>
                <span className="font-medium text-foreground">{tx.senderName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium text-foreground">{tx.receiverName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-primary text-lg">{tx.amount} {tx.crypto}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tx Hash</span>
                <span className="font-mono text-xs text-muted-foreground">{tx.txHash.slice(0, 16)}...</span>
              </div>
            </div>

            <Button onClick={handleRelease} className="w-full neon-glow" size="lg">
              <CheckCircle className="h-4 w-4 mr-2" />
              Release Funds from Escrow
            </Button>
            <Link to={`/transaction/${tx.id}`}>
              <Button variant="ghost" className="w-full">Cancel</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmTransaction;
