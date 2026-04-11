import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, ShieldAlert, Eye, Activity, Brain, TrendingDown } from "lucide-react";

const alerts = [
  { id: 1, title: "Unusual transfer pattern detected", description: "TXN-005 to Erik Müller — $3,200 sent to a new recipient in a high-risk region.", severity: "high", time: "2 hours ago" },
  { id: 2, title: "Potential account takeover attempt", description: "Multiple failed login attempts from unrecognized IP (185.xx.xx.xx).", severity: "critical", time: "5 hours ago" },
  { id: 3, title: "Velocity check triggered", description: "3 transactions initiated within 10 minutes — exceeds normal behavior.", severity: "medium", time: "1 day ago" },
  { id: 4, title: "Recipient mismatch flagged", description: "TXN-008 — recipient name doesn't match account holder.", severity: "medium", time: "2 days ago" },
];

const severityStyles: Record<string, { badge: string; icon: typeof ShieldCheck }> = {
  critical: { badge: "bg-destructive/10 text-destructive", icon: ShieldAlert },
  high: { badge: "bg-destructive/10 text-destructive", icon: AlertTriangle },
  medium: { badge: "bg-warning/10 text-warning", icon: Eye },
  low: { badge: "bg-success/10 text-success", icon: ShieldCheck },
};

const metrics = [
  { label: "Transactions Scanned", value: "1,284", icon: Activity },
  { label: "Threats Blocked", value: "7", icon: ShieldAlert },
  { label: "AI Model Accuracy", value: "99.2%", icon: Brain },
  { label: "False Positive Rate", value: "0.3%", icon: TrendingDown },
];

const FraudDetection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Fraud Detection</h1>
        <p className="text-sm text-muted-foreground">Real-time AI monitoring protects every transaction on VaultPay.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <m.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Fraud Alerts</CardTitle>
            <CardDescription>Active alerts detected by our AI engine.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
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
                  <span className="text-muted-foreground">Overall Risk</span>
                  <span className="font-medium text-warning">Low-Medium</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Network Trust</span>
                  <span className="font-medium text-success">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Identity Confidence</span>
                  <span className="font-medium text-primary">88%</span>
                </div>
                <Progress value={88} className="h-2" />
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
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="text-foreground">2 minutes ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model version</span>
                  <span className="text-foreground">v3.8.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Training data</span>
                  <span className="text-foreground">12M+ transactions</span>
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
