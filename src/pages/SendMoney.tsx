import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { addTransaction } from "@/lib/store";
import { flaskApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const steps = ["Recipient", "Amount", "Review"];

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1, EUR: 1.08, GBP: 1.27, JPY: 0.0067, NGN: 0.00065,
};

// Extended escrow periods — includes real-estate range
const ESCROW_OPTIONS = [
  { value: "3",   label: "3 Days",    hint: "Quick transactions" },
  { value: "7",   label: "7 Days",    hint: "Standard" },
  { value: "14",  label: "14 Days",   hint: "Extended review" },
  { value: "30",  label: "30 Days",   hint: "Monthly" },
  { value: "60",  label: "60 Days",   hint: "Two months" },
  { value: "90",  label: "90 Days",   hint: "Quarterly" },
  { value: "180", label: "180 Days",  hint: "Six months" },
  { value: "365", label: "1 Year",    hint: "Real estate / long-term" },
];

export default function SendMoney() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    recipient: "", email: "", amount: "", currency: "USD",
    description: "", escrowDays: "7",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const amountUSD = parseFloat(form.amount || "0") * (EXCHANGE_RATES[form.currency] ?? 1);

  // Step 0 valid: both name and email filled
  const step0Valid = form.recipient.trim().length > 0 && form.email.trim().length > 0;
  // Step 1 valid: amount > 0
  const step1Valid = parseFloat(form.amount || "0") > 0;

  async function handleSend() {
    setSubmitting(true);
    const escrowDaysInt = parseInt(form.escrowDays);

    let escrowId: string | undefined;
    try {
      await flaskApi.createEscrow({
        sender: "john.doe@email.com",
        recipient: form.email || form.recipient,
        amount: amountUSD,
        from_currency: form.currency,
        to_currency: "USD",
        exchange_rate: EXCHANGE_RATES[form.currency] ?? 1,
      });
      escrowId = `ESC-${Date.now()}`;
    } catch {
      escrowId = `ESC-${Date.now()}`;
    }

    const newTx = {
      id: `TXN-${String(Date.now()).slice(-4)}`,
      party: form.recipient,
      partyEmail: form.email,
      amount: `$${amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      amountRaw: amountUSD,
      currency: form.currency,
      type: "sent" as const,
      status: "in_escrow" as const,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      country: "—",
      fraudScore: 0,
      escrowDays: escrowDaysInt,
      description: form.description,
      escrowId,
    };

    addTransaction(newTx);
    setSubmitting(false);
    toast.success(`$${amountUSD.toFixed(2)} sent to escrow for ${form.recipient}`);
    navigate("/transactions");
  }

  const selectedEscrow = ESCROW_OPTIONS.find((o) => o.value === form.escrowDays);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Send Money</h1>
        <p className="text-sm text-muted-foreground">Protected by escrow — funds are held securely until confirmed.</p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          {step === 0 && (
            <>
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg">Recipient Details</CardTitle>
                <CardDescription>Enter the recipient's information.</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="e.g. Alice Johnson" value={form.recipient} onChange={(e) => update("recipient", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="alice@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg">Payment Details</CardTitle>
                <CardDescription>Set the amount and escrow terms.</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="0.00" value={form.amount} onChange={(e) => update("amount", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={form.currency} onValueChange={(v) => update("currency", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Escrow Hold Period</Label>
                  <Select value={form.escrowDays} onValueChange={(v) => update("escrowDays", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ESCROW_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label} <span className="text-muted-foreground text-xs ml-1">— {o.hint}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedEscrow && (
                    <p className="text-xs text-muted-foreground">
                      Funds will be held until recipient confirms, up to <strong>{selectedEscrow.label}</strong>.
                      {parseInt(form.escrowDays) >= 180 && " Suitable for real estate and long-term contracts."}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea placeholder="What's this payment for?" value={form.description} onChange={(e) => update("description", e.target.value)} />
                </div>
                {form.amount && (
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <span className="text-muted-foreground">Amount in USD: </span>
                    <span className="font-medium">${amountUSD.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-lg">Review & Confirm</CardTitle>
                <CardDescription>Double-check everything before sending.</CardDescription>
              </CardHeader>
              <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                {[
                  ["Recipient", form.recipient || "—"],
                  ["Email", form.email || "—"],
                  ["Amount", `${form.currency} ${form.amount || "0.00"} (≈ $${amountUSD.toFixed(2)} USD)`],
                  ["Escrow Period", `${selectedEscrow?.label ?? form.escrowDays + " Days"}`],
                  ...(form.description ? [["Note", form.description]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-xs text-warning">Run a fraud check on the recipient before sending from the Fraud Detection page.</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary">Funds held in secure escrow until recipient confirms delivery.</span>
              </div>
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={step === 0 || submitting} onClick={() => setStep(step - 1)}>Back</Button>
            {step < 2 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={(step === 0 && !step0Valid) || (step === 1 && !step1Valid)}
              >
                Continue
              </Button>
            ) : (
              <Button disabled={submitting} onClick={handleSend} className="bg-success hover:bg-success/90 text-success-foreground">
                {submitting ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Sending…</> : <><Lock className="w-4 h-4 mr-1" /> Send to Escrow</>}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
