import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, Clock, ArrowDownLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { transactions, updateTransactionStatus } from "@/lib/store";
import { flaskApi } from "@/lib/api";

export default function ReceiveMoney() {
  const [paymentLink] = useState("https://vaultpay.com/pay/jd-29x8k4m");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  const incomingEscrow = transactions.filter((t) => t.type === "received" && t.status === "in_escrow");

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success("Payment link copied!");
  };

  async function handleConfirm(txId: string, escrowId: string | undefined) {
    setLoadingId(txId);
    try {
      if (escrowId) await flaskApi.releaseEscrow(escrowId);
      updateTransactionStatus(txId, "completed");
      forceUpdate((n) => n + 1);
      toast.success("Receipt confirmed — funds released!");
    } catch {
      updateTransactionStatus(txId, "completed");
      forceUpdate((n) => n + 1);
      toast.success("Receipt confirmed (demo mode).");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Receive Money</h1>
        <p className="text-sm text-muted-foreground">Share your payment link or manage incoming escrow payments.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Payment Link</CardTitle>
          <CardDescription>Share this link with anyone who wants to send you a secure escrow payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input readOnly value={paymentLink} className="font-mono text-sm" />
            <Button variant="outline" onClick={copyLink}><Copy className="w-4 h-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Incoming Payments</CardTitle>
          <CardDescription>Payments currently held in escrow for you.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {incomingEscrow.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">No incoming escrow payments right now.</p>
            )}
            {incomingEscrow.map((p) => {
              const isLoading = loadingId === p.id;
              return (
                <div key={p.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.party}</p>
                      <p className="text-xs text-muted-foreground">{p.id} · Escrow {p.escrowDays}d hold</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-warning/10 text-warning">
                      <Clock className="w-3 h-3 mr-1" /> Awaiting
                    </Badge>
                    <span className="text-sm font-semibold text-success">+{p.amount}</span>
                    <Button size="sm" disabled={isLoading} onClick={() => handleConfirm(p.id, p.escrowId)}>
                      {isLoading
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <><CheckCircle2 className="w-3 h-3 mr-1" /> Confirm</>}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
