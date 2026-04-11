import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Star, Globe, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { transactions, getBalance, getInEscrowTotal, getActiveEscrowCount } from "@/lib/store";

const statusStyles: Record<string, string> = {
  in_escrow: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  flagged: "bg-destructive/10 text-destructive",
  disputed: "bg-destructive/10 text-destructive",
};

const Index = () => {
  const balance = getBalance();
  const inEscrow = getInEscrowTotal();
  const escrowCount = getActiveEscrowCount();
  const recentTransactions = transactions.slice(0, 5);
  const avgFraudScore = Math.round(transactions.reduce((a, t) => a + t.fraudScore, 0) / transactions.length);

  const stats = [
    { label: "Total Balance", value: `$${balance.toLocaleString()}`, change: "+12.5%", color: "text-success" },
    { label: "In Escrow", value: `$${inEscrow.toLocaleString()}`, change: `${escrowCount} active`, color: "text-primary" },
    { label: "Trust Score", value: "4.8/5.0", change: "96%", color: "text-warning" },
    { label: "Avg Fraud Score", value: `${avgFraudScore}/100`, change: avgFraudScore < 30 ? "All clear" : "Review needed", color: avgFraudScore < 30 ? "text-success" : "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, John. Here's your escrow overview.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/send"><ArrowUpRight className="w-4 h-4 mr-1" /> Send Money</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/receive"><ArrowDownLeft className="w-4 h-4 mr-1" /> Receive</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/transactions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "sent" ? "bg-destructive/10" : "bg-success/10"}`}>
                      {tx.type === "sent"
                        ? <ArrowUpRight className="w-4 h-4 text-destructive" />
                        : <ArrowDownLeft className="w-4 h-4 text-success" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.party}</p>
                      <p className="text-xs text-muted-foreground">{tx.id} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={statusStyles[tx.status]}>
                      {tx.status === "in_escrow" ? "In Escrow" : tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                    <span className={`text-sm font-semibold ${tx.type === "sent" ? "text-foreground" : "text-success"}`}>
                      {tx.type === "sent" ? "-" : "+"}{tx.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" /> AI Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Avg Risk Score</span>
                  <span className="font-medium text-success">{avgFraudScore}/100</span>
                </div>
                <Progress value={avgFraudScore} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Clean Transactions</span>
                  <span className="font-medium text-foreground">
                    {transactions.filter(t => t.fraudScore < 40).length}/{transactions.length}
                  </span>
                </div>
                <Progress value={(transactions.filter(t => t.fraudScore < 40).length / transactions.length) * 100} className="h-2" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-xs text-success">Powered by Google Gemini</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/international"><Globe className="w-4 h-4 mr-2" /> International Transfer</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/fraud-detection"><AlertTriangle className="w-4 h-4 mr-2" /> View Fraud Reports</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/ratings"><Star className="w-4 h-4 mr-2" /> Rate a Transaction</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
