import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Lock, User, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [profile, setProfile] = useState({ firstName: "John", lastName: "Doe", email: "john.doe@email.com" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [security, setSecurity] = useState({ twoFactor: true, biometric: false, loginAlerts: true });
  const [notifications, setNotifications] = useState({ transactions: true, fraud: true, ratings: false });
  const [escrowPrefs, setEscrowPrefs] = useState({ autoRelease: true, requireFraudScan: true });

  async function handleSaveProfile() {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavingProfile(false);
    toast.success("Profile updated successfully.");
  }

  function handleToggle<T extends object>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T,
    label: string
  ) {
    setter((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(`${label} ${next[key] ? "enabled" : "disabled"}.`);
      return next;
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and security preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><User className="w-4 h-4" /> Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <Button size="sm" disabled={savingProfile} onClick={handleSaveProfile}>
            {savingProfile
              ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Saving…</>
              : <><CheckCircle2 className="w-3 h-3 mr-1" /> Save Changes</>}
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Lock className="w-4 h-4" /> Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch
              checked={security.twoFactor}
              onCheckedChange={() => handleToggle(setSecurity, "twoFactor", "Two-Factor Authentication")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Biometric Login</p>
              <p className="text-xs text-muted-foreground">Use fingerprint or face recognition</p>
            </div>
            <Switch
              checked={security.biometric}
              onCheckedChange={() => handleToggle(setSecurity, "biometric", "Biometric Login")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Login Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified of new sign-ins</p>
            </div>
            <Switch
              checked={security.loginAlerts}
              onCheckedChange={() => handleToggle(setSecurity, "loginAlerts", "Login Alerts")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Transaction Updates</p>
              <p className="text-xs text-muted-foreground">Escrow status changes</p>
            </div>
            <Switch
              checked={notifications.transactions}
              onCheckedChange={() => handleToggle(setNotifications, "transactions", "Transaction Updates")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Fraud Alerts</p>
              <p className="text-xs text-muted-foreground">Immediate security notifications</p>
            </div>
            <Switch
              checked={notifications.fraud}
              onCheckedChange={() => handleToggle(setNotifications, "fraud", "Fraud Alerts")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Rating Reminders</p>
              <p className="text-xs text-muted-foreground">Remind to rate completed transactions</p>
            </div>
            <Switch
              checked={notifications.ratings}
              onCheckedChange={() => handleToggle(setNotifications, "ratings", "Rating Reminders")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Escrow Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Shield className="w-4 h-4" /> Escrow Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-release after confirmation</p>
              <p className="text-xs text-muted-foreground">Automatically release funds when both parties confirm</p>
            </div>
            <Switch
              checked={escrowPrefs.autoRelease}
              onCheckedChange={() => handleToggle(setEscrowPrefs, "autoRelease", "Auto-release")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Require AI fraud scan</p>
              <p className="text-xs text-muted-foreground">Run AI check before every transaction</p>
            </div>
            <Switch
              checked={escrowPrefs.requireFraudScan}
              onCheckedChange={() => handleToggle(setEscrowPrefs, "requireFraudScan", "AI Fraud Scan requirement")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
