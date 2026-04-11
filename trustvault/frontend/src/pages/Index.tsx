import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Zap, Lock, Timer, ShieldCheck } from "lucide-react";
import { useTransactions } from "@/contexts/TransactionContext";
import Navbar from "@/components/Navbar";

const Index = () => {
  const { wallet, connectWallet } = useTransactions();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Wallet Balance */}
        {wallet.connected && (
          <div className="mb-8 flex items-center gap-4 p-4 rounded-xl glass neon-glow-sm">
            <div className="text-center px-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">ETH Balance</p>
              <p className="text-2xl font-bold text-primary neon-text">{wallet.balanceETH.toFixed(4)}</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center px-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">USDT Balance</p>
              <p className="text-2xl font-bold text-foreground">${wallet.balanceUSDT.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="text-center mb-12 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-3">
            Welcome to <span className="text-primary neon-text">TrustVault</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Decentralized escrow payments powered by smart contracts. Secure, transparent, trustless.
          </p>
        </div>

        {!wallet.connected ? (
          <Button onClick={connectWallet} size="lg" className="neon-glow text-lg px-8 py-6">
            Connect Wallet to Start
          </Button>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-md relative z-10">
            <Link to="/create" className="block">
              <div className="group rounded-xl border border-border bg-card p-8 text-center hover:border-primary/60 transition-all cursor-pointer hover:neon-glow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <ArrowUpRight className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Send Crypto</h2>
                <p className="text-sm text-muted-foreground">Pay securely via escrow</p>
              </div>
            </Link>

            <Link to="/transactions" className="block">
              <div className="group rounded-xl border border-border bg-card p-8 text-center hover:border-accent/60 transition-all cursor-pointer hover:neon-purple-glow">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <ArrowDownLeft className="h-7 w-7 text-accent" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Receive Crypto</h2>
                <p className="text-sm text-muted-foreground">Track incoming payments</p>
              </div>
            </Link>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-2xl relative z-10">
          {[
            { icon: Lock, label: "Escrow Lock" },
            { icon: ShieldCheck, label: "Smart Contract" },
            { icon: Timer, label: "Auto-Release" },
            { icon: Zap, label: "Instant Settlement" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/50 border border-border/50">
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 TrustVault. Decentralized escrow on Ethereum.
        </div>
      </footer>
    </div>
  );
};

export default Index;
