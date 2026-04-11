import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowRight, ShieldCheck, Clock, RefreshCw, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
];

const corridors = [
  { from: "USD", to: "EUR", rate: "0.92", fee: "$4.99", time: "1-2 days" },
  { from: "USD", to: "GBP", rate: "0.79", fee: "$4.99", time: "1-2 days" },
  { from: "USD", to: "NGN", rate: "1,550.00", fee: "$2.99", time: "Same day" },
  { from: "EUR", to: "GBP", rate: "0.86", fee: "€3.99", time: "Same day" },
  { from: "USD", to: "INR", rate: "83.50", fee: "$3.99", time: "1-2 days" },
  { from: "GBP", to: "JPY", rate: "191.20", fee: "£4.99", time: "1-3 days" },
];

const International = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const rate = 0.92; // Mock
  const converted = (parseFloat(amount || "0") * rate).toFixed(2);

  async function handleSend() {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (fromCurrency === toCurrency) {
      toast.error("Please select different currencies.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success(`International transfer of ${amount} ${fromCurrency} → ${converted} ${toCurrency} queued in escrow.`);
    navigate("/transactions");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">International Transfers</h1>
        <p className="text-sm text-muted-foreground">Send money across borders with escrow protection and competitive rates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
            <div className="space-y-2">
              <Label>You Send</Label>
              <div className="flex gap-2">
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1" />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center pb-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>They Receive</Label>
              <div className="flex gap-2">
                <Input readOnly value={converted} className="flex-1 bg-muted/50" />
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="w-3 h-3" />
              1 {fromCurrency} = {rate} {toCurrency} · Updated just now
            </div>
            <Button size="sm" disabled={sending} onClick={handleSend}>
              {sending
                ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing…</>
                : "Send International Transfer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Corridors</CardTitle>
          <CardDescription>Frequently used international transfer routes.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {corridors.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary">{c.from}</Badge>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <Badge variant="secondary">{c.to}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">1 {c.from} = {c.rate} {c.to}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-success" /> Escrow protected</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.time}</span>
                  <span>Fee: {c.fee}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs px-2"
                    onClick={() => {
                      setFromCurrency(c.from);
                      setToCurrency(c.to);
                      toast.info(`Corridor set to ${c.from} → ${c.to}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default International;
