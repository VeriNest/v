import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Trash2, KeyRound, Building2, Activity, CreditCard, Camera } from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "@/contexts/AvatarContext";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSettingsRow, DashboardSettingsSection } from "@/components/dashboard/DashboardSettingsSection";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";

const activityLog = [
  { action: "Sent offer for 3 Bed in Lekki", time: "1 hour ago", type: "Offer" },
  { action: "Published listing: Studio, Wuse 2", time: "3 hours ago", type: "Listing" },
  { action: "Received payout PO-301: ₦2.3M", time: "1 day ago", type: "Payout" },
  { action: "Responded to lead from Anonymous Tenant", time: "1 day ago", type: "Lead" },
  { action: "Updated calendar availability", time: "2 days ago", type: "Calendar" },
];

const typeStyles: Record<string, string> = {
  Offer: "bg-primary/10 text-primary border-primary/20",
  Listing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Payout: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Lead: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Calendar: "bg-muted text-muted-foreground border-border",
};

export default function ProviderSettings() {
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 min-w-0">
      <DashboardPageHeader
        title="Settings"
        description="Manage your provider profile, payouts, alerts, and security controls."
      />

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative group shrink-0">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">AJ</AvatarFallback>
              )}
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 cursor-pointer"
            >
              <Camera className="h-4 w-4 text-background" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">Adebayo Johnson</p>
            <p className="text-sm text-muted-foreground truncate">adebayo@dwello.ng</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-1.5 sm:justify-end">
            <DashboardStatusBadge tone="info">Agent</DashboardStatusBadge>
            <DashboardStatusBadge tone="success">Verified</DashboardStatusBadge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="general" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
          <TabsTrigger value="business" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Business</TabsTrigger>
          <TabsTrigger value="payouts" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Payouts</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Alerts</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <DashboardSettingsSection title="Profile Information" description="Update your provider identity and business contact details.">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Full Name</label><Input defaultValue="Adebayo Johnson" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Email</label><Input defaultValue="adebayo@dwello.ng" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Phone</label><Input defaultValue="+234 803 456 7890" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Company</label><Input defaultValue="Lagos Homes Ltd" /></div>
              </div>
              <div className="flex justify-end pt-2"><Button>Save Changes</Button></div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="business">
          <DashboardSettingsSection title="Business Settings" description="Configure how leads, bookings, and listing exposure are handled.">
            <DashboardSettingsRow
              label="Auto-respond to matching leads"
              description="Send template offers to leads matching your listings."
              control={<Switch />}
            />
            <DashboardSettingsRow
              label="Accept short-let bookings"
              description="Show your listings in short-let search results."
              control={<Switch defaultChecked />}
            />
            <DashboardSettingsRow
              label="Instant booking"
              description="Allow tenants to book without manual approval."
              control={<Switch />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="payouts">
          <DashboardSettingsSection title="Payout Settings" description="Manage the bank details and payout schedule used for provider settlements.">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Bank Name</label><Input defaultValue="GTBank" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Account Number</label><Input defaultValue="0123456789" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Account Name</label><Input defaultValue="Adebayo Johnson" /></div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Payout Frequency</label>
                  <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground">
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2"><Button>Update Payout Details</Button></div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="notifications">
          <DashboardSettingsSection title="Notification Preferences" description="Choose which provider alerts should interrupt your workflow.">
            <DashboardSettingsRow
              label="New lead alerts"
              description="Get notified when new leads match your listings."
              control={<Switch defaultChecked />}
            />
            <DashboardSettingsRow
              label="Payout notifications"
              description="Notify when payouts are released from escrow."
              control={<Switch defaultChecked />}
            />
            <DashboardSettingsRow
              label="SLA warnings"
              description="Alert when response time SLA is close to expiring."
              control={<Switch defaultChecked />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <DashboardSettingsSection title="Security" description="Manage the sign-in and protection controls for your provider account.">
            <DashboardSettingsRow
              label="Change Password"
              description="Last changed 7 days ago."
              control={<Button variant="outline" size="sm">Update</Button>}
            />
            <DashboardSettingsRow
              label="Two-Factor Auth"
              description="Secure your account with 2FA."
              control={<Button variant="outline" size="sm">Enable</Button>}
            />
          </DashboardSettingsSection>

          <DashboardSettingsSection title="Danger Zone" description="These actions are irreversible and affect your listings and account history." className="border-destructive/30">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 gap-3">
                <div className="min-w-0"><p className="font-medium text-sm text-foreground">Delete Account</p><p className="text-xs text-muted-foreground">Permanently delete your provider account and all listings.</p></div>
                <Button variant="destructive" size="sm" className="shrink-0">Delete Account</Button>
              </div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        {/* Activity - Mobile cards */}
        <TabsContent value="activity">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Recent Activity</CardTitle></div>
              <CardDescription>Your recent actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activityLog.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border/60 bg-secondary/30 space-y-2">
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeStyles[item.type]}`}>{item.type}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
