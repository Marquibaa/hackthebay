import { Link } from "react-router-dom";
import { Shield, Bell, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/contexts/TransactionContext";

const Navbar = () => {
  const { wallet, connectWallet, disconnectWallet } = useTransactions();

  return (
    <nav className="border-b border-border glass sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground neon-text">TrustVault</span>
        </Link>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </button>

          {wallet.connected ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs">
                <span className="text-primary font-mono">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={disconnectWallet}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} size="sm" className="neon-glow-sm">
              <Wallet className="h-4 w-4 mr-1" /> Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
