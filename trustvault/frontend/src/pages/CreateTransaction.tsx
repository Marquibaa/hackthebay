import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Zap } from "lucide-react";
import { useTransactions, CryptoType } from "@/contexts/TransactionContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const CreateTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction, wallet } = useTransactions();
  const [form, setForm] = useState({
    senderName: "",
    receiverName: "",
    receiverWallet: "",
    amount: "",
    crypto: "ETH" as CryptoType,
    description: "",
  });

  if (!wallet.connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4 border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Connect your wallet to create a transaction</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.senderName || !form.receiverName || !form.amount || !form.description || !form.receiverWallet) {
      toast.error("Please fill in all fields");
      return;
    }
    const amount = parseFloat(form.amount);
    if (form.crypto === "ETH" && amount > wallet.balanceETH) {
      toast.error("Insufficient ETH balance");
      return;
    }
    if (form.crypto === "USDT" && amount > wallet.balanceUSDT) {
      toast.error("Insufficient USDT balance");
      return;
    }
    const id = addTransaction({
      senderName: form.senderName,
      senderWallet: wallet.address,
      receiverName: form.receiverName,
      receiverWallet: form.receiverWallet,
      amount,
      crypto: form.crypto,
      description: form.description,
    });
    toast.success("Transaction locked in escrow!");
    navigate(`/transaction/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <Card className="border-border neon-glow-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" /> Create Transaction
            </CardTitle>
            <CardDescription>Send crypto securely through smart contract escrow</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="senderName">Your Name</Label>
                <Input id="senderName" placeholder="John Doe" value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiverName">Receiver Name</Label>
                <Input id="receiverName" placeholder="Jane Smith" value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiverWallet">Receiver Wallet Address</Label>
                <Input id="receiverWallet" placeholder="0x..." value={form.receiverWallet} onChange={(e) => setForm({ ...form, receiverWallet: e.target.value })} className="bg-secondary border-border font-mono text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" min="0.0001" step="0.0001" placeholder="0.5" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={form.crypto} onValueChange={(v) => setForm({ ...form, crypto: v as CryptoType })}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Available: {form.crypto === "ETH" ? `${wallet.balanceETH.toFixed(4)} ETH` : `$${wallet.balanceUSDT.toFixed(2)} USDT`}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="What is this payment for?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary border-border" />
              </div>
              <Button type="submit" className="w-full neon-glow" size="lg">
                <Zap className="h-4 w-4 mr-2" /> Lock in Escrow
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTransaction;
