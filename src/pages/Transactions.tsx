import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ShieldCheck, AlertTriangle } from "lucide-react";

const allTransactions = [
  { id: "TXN-001", party: "Alice Johnson", amount: "$2,500.00", type: "sent", status: "in_escrow", date: "Apr 10, 2026", country: "US", fraudScore: 5 },
  { id: "TXN-002", party: "Bob Williams", amount: "$1,200.00", type: "received", status: "completed", date: "Apr 10, 2026", country: "UK", fraudScore: 2 },
  { id: "TXN-003", party: "Carlos Martinez", amount: "$4,800.00", type: "sent", status: "pending", date: "Apr 9, 2026", country: "MX", fraudScore: 15 },
  { id: "TXN-004", party: "Diana Chen", amount: "$890.00", type: "received", status: "completed", date: "Apr 8, 2026", country: "CN", fraudScore: 3 },
  { id: "TXN-005", party: "Erik Müller", amount: "$3,200.00", type: "sent", status: "flagged", date: "Apr 7, 2026", country: "DE", fraudScore: 78 },
  { id: "TXN-006", party: "Fatima Al-Rashid", amount: "$5,100.00", type: "received", status: "completed", date: "Apr 6, 2026", country: "AE", fraudScore: 1 },
  { id: "TXN-007", party: "George Okafor", amount: "$750.00", type: "sent", status: "in_escrow", date: "Apr 5, 2026", country: "NG", fraudScore: 8 },
  { id: "TXN-008", party: "Hana Tanaka", amount: "$2,100.00", type: "received", status: "disputed", date: "Apr 4, 2026", country: "JP", fraudScore: 45 },
];

const statusStyles: Record<string, string> = {
  in_escrow: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  flagged: "bg-destructive/10 text-destructive",
  disputed: "bg-destructive/10 text-destructive",
};

const Transactions = () => {
  const [search, setSearch] = useState("");

  const filtered = allTransactions.filter(
    (t) => t.party.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">View and manage all your escrow transactions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-1" /> Filter
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in_escrow">In Escrow</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filtered.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === "sent" ? "bg-destructive/10" : "bg-success/10"
                      }`}>
                        {tx.type === "sent" ? (
                          <ArrowUpRight className="w-4 h-4 text-destructive" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-success" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.party}</p>
                        <p className="text-xs text-muted-foreground">{tx.id} · {tx.date} · {tx.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {tx.fraudScore > 50 ? (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-success" />
                      )}
                      <Badge variant="secondary" className={statusStyles[tx.status]}>
                        {tx.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Badge>
                      <span className={`text-sm font-semibold min-w-[100px] text-right ${
                        tx.type === "sent" ? "text-foreground" : "text-success"
                      }`}>
                        {tx.type === "sent" ? "-" : "+"}{tx.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {["in_escrow", "completed", "flagged"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filtered.filter((t) => t.status === tab).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === "sent" ? "bg-destructive/10" : "bg-success/10"
                        }`}>
                          {tx.type === "sent" ? <ArrowUpRight className="w-4 h-4 text-destructive" /> : <ArrowDownLeft className="w-4 h-4 text-success" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{tx.party}</p>
                          <p className="text-xs text-muted-foreground">{tx.id} · {tx.date}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${tx.type === "sent" ? "text-foreground" : "text-success"}`}>
                        {tx.type === "sent" ? "-" : "+"}{tx.amount}
                      </span>
                    </div>
                  ))}
                  {filtered.filter((t) => t.status === tab).length === 0 && (
                    <p className="px-6 py-8 text-center text-sm text-muted-foreground">No transactions found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Transactions;
