import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, CheckCircle2, Clock, ArrowDownLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const pendingPayments = [
  { id: "RCV-001", sender: "Alice Johnson", amount: "$2,500.00", escrowExpires: "5 days", status: "awaiting_confirmation" },
  { id: "RCV-002", sender: "Carlos Martinez", amount: "$4,800.00", escrowExpires: "12 days", status: "awaiting_confirmation" },
  { id: "RCV-003", sender: "Erik Müller", amount: "$1,600.00", escrowExpires: "2 days", status: "ready_to_release" },
];

const ReceiveMoney = () => {
  const [paymentLink] = useState("https://vaultpay.com/pay/jd-29x8k4m");

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success("Payment link copied!");
  };

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
            <Button variant="outline" onClick={copyLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Download QR Code
            </Button>
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
            {pendingPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.sender}</p>
                    <p className="text-xs text-muted-foreground">{p.id} · Expires in {p.escrowExpires}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.status === "ready_to_release" ? (
                    <Badge className="bg-success/10 text-success">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-warning/10 text-warning">
                      <Clock className="w-3 h-3 mr-1" /> Awaiting
                    </Badge>
                  )}
                  <span className="text-sm font-semibold text-success">+{p.amount}</span>
                  {p.status === "ready_to_release" && (
                    <Button size="sm">Release</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiveMoney;
