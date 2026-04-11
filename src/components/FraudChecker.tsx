import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Brain, ShieldCheck, ShieldAlert, AlertTriangle,
  ChevronUp, ChevronDown, Minus, Loader2, UserCheck, UserX,
} from "lucide-react";
import { assessFraudRisk, FraudAssessment } from "@/lib/gemini";
import { lookupUser } from "@/lib/store";
import { toast } from "sonner";

function RiskBadge({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low")
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Low Risk</Badge>;
  if (level === "medium")
    return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Medium Risk</Badge>;
  return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">High Risk</Badge>;
}

function RiskIcon({ level }: { level: "low" | "medium" | "high" }) {
  if (level === "low") return <ShieldCheck className="w-5 h-5 text-green-500" />;
  if (level === "medium") return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  return <ShieldAlert className="w-5 h-5 text-red-500" />;
}

function ImpactIcon({ impact }: { impact: "positive" | "negative" | "neutral" }) {
  if (impact === "positive") return <ChevronDown className="w-4 h-4 text-green-500" />;
  if (impact === "negative") return <ChevronUp className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
}

function riskBarColor(score: number) {
  if (score < 31) return "bg-green-500";
  if (score < 66) return "bg-yellow-500";
  return "bg-red-500";
}

export default function FraudChecker() {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [result, setResult] = useState<FraudAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  // Live profile preview as user types
  const preview = nameOrEmail.trim().length > 2 ? lookupUser(nameOrEmail) : null;

  const runCheck = async () => {
    if (!nameOrEmail.trim()) {
      toast.error("Please enter a name or email address.");
      return;
    }
    const amount = parseFloat(amountUSD) || 0;
    setLoading(true);
    setResult(null);
    try {
      const assessment = await assessFraudRisk(nameOrEmail.trim(), amount);
      setResult(assessment);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Gemini API error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> AI Fraud Risk Checker
          </CardTitle>
          <CardDescription>
            Enter a recipient's name or email. Their profile will be looked up automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Recipient Name or Email</Label>
              <Input
                placeholder="e.g. Erik Müller or erik@example.com"
                value={nameOrEmail}
                onChange={(e) => { setNameOrEmail(e.target.value); setResult(null); }}
              />
              {/* Live profile preview */}
              {nameOrEmail.trim().length > 2 && (
                <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-md ${
                  preview
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}>
                  {preview ? (
                    <><UserCheck className="w-3.5 h-3.5" /> Found: {preview.name} · {preview.totalTrades} trades · {preview.rating}/5 rating</>
                  ) : (
                    <><UserX className="w-3.5 h-3.5" /> User not in database — will use conservative defaults</>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Escrow Amount (USD) <span className="text-muted-foreground font-normal">— optional</span></Label>
              <Input
                type="number"
                placeholder="e.g. 2500"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={runCheck} disabled={loading}>
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing with Gemini…</>
            ) : (
              <><Brain className="w-4 h-4 mr-2" /> Run Fraud Assessment</>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <RiskIcon level={result.riskLevel} />
                {result.resolvedName ? `Assessment for ${result.resolvedName}` : "Assessment Result"}
              </CardTitle>
              <RiskBadge level={result.riskLevel} />
            </div>
            {!result.userFound && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                This user was not found in the database. Results are based on conservative default values.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Score bar */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold text-foreground">{result.riskScore}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all ${riskBarColor(result.riskScore)}`}
                  style={{ width: `${result.riskScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span><span>Medium</span><span>High</span>
              </div>
            </div>

            {/* Factors */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Contributing Factors</p>
              <div className="divide-y divide-border rounded-lg border overflow-hidden">
                {result.factors.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 bg-background">
                    <ImpactIcon impact={f.impact} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{f.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{f.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className={`p-4 rounded-lg border-l-4 ${
              result.riskLevel === "low"
                ? "bg-green-50 border-green-500 dark:bg-green-900/10"
                : result.riskLevel === "medium"
                ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/10"
                : "bg-red-50 border-red-500 dark:bg-red-900/10"
            }`}>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                Gemini AI Summary
              </p>
              <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
            </div>

            <p className="text-xs text-muted-foreground">
              This assessment is advisory only. Always use your own judgment before releasing escrow funds.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
