import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  SendHorizontal,
  Download,
  History,
  ShieldCheck,
  Star,
  Globe,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/send", icon: SendHorizontal, label: "Send Money" },
  { to: "/receive", icon: Download, label: "Receive Money" },
  { to: "/transactions", icon: History, label: "Transactions" },
  { to: "/fraud-detection", icon: ShieldCheck, label: "AI Fraud Detection" },
  { to: "/ratings", icon: Star, label: "Ratings" },
  { to: "/international", icon: Globe, label: "International" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-primary-foreground">VaultPay</h1>
            <p className="text-xs text-sidebar-foreground/60">Secure Escrow</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold text-sidebar-primary">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-primary-foreground truncate">John Doe</p>
            <p className="text-xs text-sidebar-foreground/50">Verified</p>
          </div>
          <LogOut className="w-4 h-4 text-sidebar-foreground/50 cursor-pointer hover:text-sidebar-foreground" />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
