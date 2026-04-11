import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, ShieldAlert, Eye, Brain } from "lucide-react";
import FraudChecker from "@/components/FraudChecker";
import { transactions } from "@/lib/store";

const severityStyles: Record<string, { badge: string; icon: typeof ShieldCheck }> = {
  critical: { badge: "bg-destructive/10 text-destructive", icon: ShieldAlert },
  high: { badge: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  medium: { badge: "bg-warning/10 text-warning", icon: Eye },
  low: { badge: "bg-success/10 text-success", icon: ShieldCheck },
};

// Derive alerts from flagged/disputed transactions in the store
function getAlerts() {
  return transactions
    .filter((t) => t.status === "flagged" || t.status === "disputed" || t.fraudScore > 40)
    .map((t) => ({
      id: t.id,
      title: t.fraudScore > 65
        ? "High fraud risk detected"
        : t.status === "disputed"
        ? "Transaction disputed"
        : "Elevated risk flagged",
      description: `${t.id} with ${t.party} — ${t.amount} · Fraud score: ${t.fraudScore}/100`,
      severity: t.fraudScore > 65 ? "high" : "medium",
      time: t.date,
    }));
}

const FraudDetection = () => {
  const alerts = getAlerts();
  const flaggedCount = transactions.filter((t) => t.status === "flagged" || t.status === "disputed").length;
  const totalScanned = transactions.length;
  const avgScore = Math.round(transactions.reduce((a, t) => a + t.fraudScore, 0) / totalScanned);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Fraud Detection</h1>
        <p className="text-sm text-muted-foreground">Real-time AI monitoring protects every transaction on VaultPay.</p>
      </div>

      {/* Live Gemini AI Checker */}
      <FraudChecker />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Fraud Alerts</CardTitle>
            <CardDescription>Transactions with elevated risk scores from your history.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {alerts.length === 0 && (
                <p className="px-6 py-8 text-center text-sm text-muted-foreground">No alerts — all transactions look clean.</p>
              )}
              {alerts.map((alert) => {
                const style = severityStyles[alert.severity];
                return (
                  <div key={alert.id} className="px-6 py-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.badge}`}>
                          <style.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{alert.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className={style.badge}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Transactions Scanned</span>
                  <span className="font-medium text-foreground">{totalScanned}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Flagged / Disputed</span>
                  <span className="font-medium text-destructive">{flaggedCount}</span>
                </div>
                <Progress value={(flaggedCount / totalScanned) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Avg Fraud Score</span>
                  <span className={`font-medium ${avgScore > 40 ? "text-warning" : "text-success"}`}>{avgScore}/100</span>
                </div>
                <Progress value={avgScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-foreground">AI Model Status</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="text-foreground">Google Gemini 1.5 Flash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lookup source</span>
                  <span className="text-foreground">VaultPay user database</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="text-foreground">On-demand assessment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;
