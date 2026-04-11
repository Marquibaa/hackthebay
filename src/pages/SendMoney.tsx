import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ArrowRight, Lock, Clock, CheckCircle2 } from "lucide-react";

const steps = ["Recipient", "Amount", "Review"];

const SendMoney = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    recipient: "",
    email: "",
    amount: "",
    currency: "USD",
    description: "",
    escrowDays: "7",
  });

  const updateForm = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Send Money</h1>
        <p className="text-sm text-muted-foreground">Protected by escrow — funds are held securely until confirmed.</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
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
                  <Input placeholder="e.g. Alice Johnson" value={form.recipient} onChange={(e) => updateForm("recipient", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="alice@example.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
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
                    <Input type="number" placeholder="0.00" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={form.currency} onValueChange={(v) => updateForm("currency", v)}>
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
                  <Select value={form.escrowDays} onValueChange={(v) => updateForm("escrowDays", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea placeholder="What's this payment for?" value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
                </div>
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-medium text-foreground">{form.recipient || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{form.email || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">{form.currency} {form.amount || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Escrow Period</span>
                  <span className="font-medium text-foreground">{form.escrowDays} Days</span>
                </div>
                {form.description && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Note</span>
                    <span className="font-medium text-foreground">{form.description}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-xs text-success">AI fraud scan passed — transaction looks safe</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary">Funds held in secure escrow until recipient confirms delivery</span>
              </div>
            </>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Button className="bg-success hover:bg-success/90 text-success-foreground">
                <Lock className="w-4 h-4 mr-1" /> Send to Escrow
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMoney;
