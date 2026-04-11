import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Star, Globe, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Balance", value: "$24,580.00", change: "+12.5%", icon: TrendingUp, color: "text-success" },
  { label: "In Escrow", value: "$8,350.00", change: "3 active", icon: Clock, color: "text-primary" },
  { label: "Trust Score", value: "4.8/5.0", change: "96%", icon: Star, color: "text-warning" },
  { label: "Fraud Risk", value: "Low", change: "All clear", icon: ShieldCheck, color: "text-success" },
];

const recentTransactions = [
  { id: "TXN-001", party: "Alice Johnson", amount: "$2,500.00", type: "sent", status: "in_escrow", date: "2 hours ago" },
  { id: "TXN-002", party: "Bob Williams", amount: "$1,200.00", type: "received", status: "completed", date: "5 hours ago" },
  { id: "TXN-003", party: "Carlos Martinez", amount: "$4,800.00", type: "sent", status: "pending", date: "1 day ago" },
  { id: "TXN-004", party: "Diana Chen", amount: "$890.00", type: "received", status: "completed", date: "2 days ago" },
  { id: "TXN-005", party: "Erik Müller", amount: "$3,200.00", type: "sent", status: "flagged", date: "3 days ago" },
];

const statusStyles: Record<string, string> = {
  in_escrow: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  flagged: "bg-destructive/10 text-destructive",
};

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, John. Here's your escrow overview.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/send">
              <ArrowUpRight className="w-4 h-4 mr-1" /> Send Money
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/receive">
              <ArrowDownLeft className="w-4 h-4 mr-1" /> Receive
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
                      <p className="text-xs text-muted-foreground">{tx.id} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={statusStyles[tx.status]}>
                      {tx.status === "in_escrow" ? "In Escrow" : tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Badge>
                    <span className={`text-sm font-semibold ${
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
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className="font-medium text-success">12/100</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Verified Transactions</span>
                  <span className="font-medium text-foreground">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-xs text-success">All systems operational</span>
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
                <Link to="/international">
                  <Globe className="w-4 h-4 mr-2" /> International Transfer
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/fraud-detection">
                  <AlertTriangle className="w-4 h-4 mr-2" /> View Fraud Reports
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/ratings">
                  <Star className="w-4 h-4 mr-2" /> Rate a Transaction
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
