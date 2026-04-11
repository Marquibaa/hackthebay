import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Search, ShieldCheck, AlertTriangle, Lock, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { transactions, updateTransactionStatus } from "@/lib/store";
import { flaskApi } from "@/lib/api";
import { toast } from "sonner";

const statusStyles: Record<string, string> = {
  in_escrow: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  flagged: "bg-destructive/10 text-destructive",
  disputed: "bg-destructive/10 text-destructive",
};

function StatusLabel({ status }: { status: string }) {
  const label = status === "in_escrow" ? "In Escrow" : status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge variant="secondary" className={statusStyles[status]}>{label}</Badge>;
}

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  const filtered = transactions.filter(
    (t) => t.party.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  );

  async function handleRelease(txId: string, escrowId: string | undefined) {
    setLoadingId(txId);
    try {
      if (escrowId) {
        await flaskApi.releaseEscrow(escrowId);
      }
      updateTransactionStatus(txId, "completed");
      forceUpdate((n) => n + 1);
      toast.success("Escrow released — funds sent to recipient.");
    } catch {
      // Flask not running — update local state anyway for demo
      updateTransactionStatus(txId, "completed");
      forceUpdate((n) => n + 1);
      toast.success("Escrow released (demo mode).");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRefund(txId: string, escrowId: string | undefined) {
    setLoadingId(txId);
    try {
      if (escrowId) {
        await flaskApi.refundEscrow(escrowId);
      }
      updateTransactionStatus(txId, "completed");
      forceUpdate((n) => n + 1);
      toast.success("Escrow refunded — funds returned to you.");
    } catch {
      updateTransactionStatus(txId, "completed");
      forceUpdate((n) => n + 1);
      toast.success("Refund processed (demo mode).");
    } finally {
      setLoadingId(null);
    }
  }

  function TxRow({ tx }: { tx: typeof transactions[0] }) {
    const isLoading = loadingId === tx.id;
    return (
      <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "sent" ? "bg-destructive/10" : "bg-success/10"}`}>
            {tx.type === "sent" ? <ArrowUpRight className="w-4 h-4 text-destructive" /> : <ArrowDownLeft className="w-4 h-4 text-success" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{tx.party}</p>
            <p className="text-xs text-muted-foreground">{tx.id} · {tx.date} · {tx.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {tx.fraudScore > 50
            ? <AlertTriangle className="w-4 h-4 text-destructive" />
            : <ShieldCheck className="w-4 h-4 text-success" />}
          <StatusLabel status={tx.status} />
          <span className={`text-sm font-semibold min-w-[90px] text-right ${tx.type === "sent" ? "text-foreground" : "text-success"}`}>
            {tx.type === "sent" ? "-" : "+"}{tx.amount}
          </span>
          {tx.status === "in_escrow" && tx.type === "sent" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={isLoading} onClick={() => handleRefund(tx.id, tx.escrowId)}>
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3 mr-1" />}
                Refund
              </Button>
              <Button size="sm" disabled={isLoading} onClick={() => handleRelease(tx.id, tx.escrowId)}>
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                Release
              </Button>
            </div>
          )}
          {tx.status === "in_escrow" && tx.type === "received" && (
            <Button size="sm" variant="outline" disabled={isLoading} onClick={() => handleRelease(tx.id, tx.escrowId)}>
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3 mr-1" />}
              Confirm Receipt
            </Button>
          )}
        </div>
      </div>
    );
  }

  function TxList({ items }: { items: typeof transactions }) {
    if (items.length === 0) return <p className="px-6 py-8 text-center text-sm text-muted-foreground">No transactions found.</p>;
    return <div className="divide-y divide-border">{items.map((tx) => <TxRow key={tx.id} tx={tx} />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">View and manage all your escrow transactions.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or ID..." className="pl-10 max-w-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="in_escrow">In Escrow ({filtered.filter(t => t.status === "in_escrow").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filtered.filter(t => t.status === "completed").length})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({filtered.filter(t => t.status === "flagged" || t.status === "disputed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card><CardContent className="p-0"><TxList items={filtered} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="in_escrow">
          <Card><CardContent className="p-0"><TxList items={filtered.filter(t => t.status === "in_escrow")} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card><CardContent className="p-0"><TxList items={filtered.filter(t => t.status === "completed")} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="flagged">
          <Card><CardContent className="p-0"><TxList items={filtered.filter(t => t.status === "flagged" || t.status === "disputed")} /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
