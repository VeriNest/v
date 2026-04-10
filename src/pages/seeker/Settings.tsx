import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Trash2, KeyRound, MapPin, Activity, Camera } from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "@/contexts/AvatarContext";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSettingsRow, DashboardSettingsSection } from "@/components/dashboard/DashboardSettingsSection";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";

const activityLog = [
  { action: "Posted need: 3 Bed in Lekki", time: "2 hours ago", type: "Post" },
  { action: "Viewed offer from Adebayo Johnson", time: "4 hours ago", type: "Offer" },
  { action: "Scheduled viewing for Studio, Wuse 2", time: "1 day ago", type: "Viewing" },
  { action: "Saved property: 2 Bed Serviced, VI", time: "2 days ago", type: "Save" },
  { action: "Completed booking BK-003", time: "3 days ago", type: "Booking" },
];

const typeStyles: Record<string, string> = {
  Post: "bg-primary/10 text-primary border-primary/20",
  Offer: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Viewing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Save: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Booking: "bg-muted text-muted-foreground border-border",
};

export default function SeekerSettings() {
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
        description="Manage your profile, search preferences, notifications, and security."
      />

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative group shrink-0">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">TN</AvatarFallback>
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
            <p className="font-semibold text-foreground truncate">Tenant User</p>
            <p className="text-sm text-muted-foreground truncate">tenant@dwello.ng</p>
          </div>
          <div className="flex shrink-0 justify-center sm:justify-end">
            <DashboardStatusBadge tone="info">Tenant</DashboardStatusBadge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="general" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
          <TabsTrigger value="preferences" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Alerts</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <DashboardSettingsSection title="Profile Information" description="Update the personal details tied to your tenant account.">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Full Name</label><Input defaultValue="Tenant User" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Email</label><Input defaultValue="tenant@dwello.ng" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Phone</label><Input defaultValue="+234 801 234 5678" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Preferred Location</label><Input defaultValue="Lagos, Nigeria" /></div>
              </div>
              <div className="flex justify-end pt-2">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <DashboardSettingsSection title="Search Preferences" description="Customize how property matches and discovery behave.">
            <DashboardSettingsRow
              label="Auto-match new listings"
              description="Receive offers from new listings matching your needs."
              control={<Switch defaultChecked />}
            />
            <DashboardSettingsRow
              label="Show short-let results"
              description="Include short-let properties in search results."
              control={<Switch defaultChecked />}
            />
            <DashboardSettingsRow
              label="Verified providers only"
              description="Only show offers from verified agents and landlords."
              control={<Switch />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <DashboardSettingsSection title="Notification Preferences" description="Choose which alerts should reach you across offers, bookings, and discovery.">
            <DashboardSettingsRow
              label="New offer alerts"
              description="Notify when providers send you offers."
              control={<Switch defaultChecked />}
            />
            <DashboardSettingsRow
              label="Booking updates"
              description="Escrow status and booking confirmations."
              control={<Switch defaultChecked />}
            />
            <DashboardSettingsRow
              label="Weekly property digest"
              description="Curated listings based on your preferences."
              control={<Switch />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <DashboardSettingsSection title="Security" description="Manage the controls that protect your account and sign-in activity.">
            <DashboardSettingsRow
              label="Change Password"
              description="Last changed 14 days ago."
              control={<Button variant="outline" size="sm">Update</Button>}
            />
            <DashboardSettingsRow
              label="Two-Factor Auth"
              description="Secure your account with 2FA."
              control={<Button variant="outline" size="sm">Enable</Button>}
            />
          </DashboardSettingsSection>

          <DashboardSettingsSection title="Danger Zone" description="These actions are permanent and remove your tenant history." className="border-destructive/30">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 gap-3">
                <div className="min-w-0"><p className="font-medium text-sm text-foreground">Delete Account</p><p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p></div>
                <Button variant="destructive" size="sm" className="shrink-0">Delete Account</Button>
              </div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        {/* Activity - Mobile-friendly cards */}
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
