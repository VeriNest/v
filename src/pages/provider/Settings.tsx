import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Activity, Camera } from "lucide-react";
import { InlineSpinner, OrbitLoader } from "@/components/Loaders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAvatar } from "@/contexts/AvatarContext";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSettingsRow, DashboardSettingsSection } from "@/components/dashboard/DashboardSettingsSection";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { agentSettingsApi, authApi, onboardingApi, clearStoredSession } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

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
  const navigate = useNavigate();
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAlerts, setSavingAlerts] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experienceRange, setExperienceRange] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [operatingCity, setOperatingCity] = useState("");
  const [operatingState, setOperatingState] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { data: me } = useQuery({
    queryKey: ["/auth/me"],
    queryFn: () => authApi.me(),
  });

  const { data: notificationSettings } = useQuery({
    queryKey: ["/agent/notification-settings"],
    queryFn: () => agentSettingsApi.get(),
  });

  useEffect(() => {
    if (!me) return;
    setPhone(me.profile?.phone ?? "");
    setCity(me.profile?.city ?? "");
    setBio(me.profile?.bio ?? me.user.bio ?? "");
    setCompanyName(String(me.roleProfile?.company_name ?? ""));
    setExperienceRange(String(me.roleProfile?.experience_range ?? ""));
    if (me.profile?.avatarUrl) {
      setAvatarUrl(me.profile.avatarUrl);
    }
  }, [me, setAvatarUrl]);

  useEffect(() => {
    if (!notificationSettings) return;
    setNotificationsEnabled(notificationSettings.notifications_enabled);
    setOperatingCity(notificationSettings.operating_city ?? "");
    setOperatingState(notificationSettings.operating_state ?? "");
  }, [notificationSettings]);

  const initials = useMemo(() => {
    const source = me?.user.full_name?.trim() || me?.user.email?.trim() || "Agent";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "AG";
  }, [me]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !me) return;

    try {
      setUploadingAvatar(true);
      const uploaded = await uploadToCloudinary(file, "avatar");
      setAvatarUrl(uploaded.secureUrl);
      await onboardingApi.saveProfile({
        role: "agent",
        phone,
        city,
        operatingState,
        avatar_url: uploaded.secureUrl,
        companyName,
        experienceRange,
        specializations: Array.isArray(me.roleProfile?.specializations_json) ? me.roleProfile.specializations_json : [],
        bio,
      });
      toast.success("Profile image updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update profile image";
      toast.error(message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    if (!me) return;
    try {
      setSavingProfile(true);
      await onboardingApi.saveProfile({
        role: "agent",
        phone,
        city,
        operatingState,
        avatar_url: avatarUrl,
        companyName,
        experienceRange,
        specializations: Array.isArray(me.roleProfile?.specializations_json) ? me.roleProfile.specializations_json : [],
        bio,
      });
      toast.success("Profile updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save profile";
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAlerts = async () => {
    try {
      setSavingAlerts(true);
      await agentSettingsApi.update({
        notifications_enabled: notificationsEnabled,
        operating_city: operatingCity,
        operating_state: operatingState,
      });
      toast.success("Alert settings updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save alert settings";
      toast.error(message);
    } finally {
      setSavingAlerts(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      return;
    }

    setDeletingAccount(true);
    try {
      await authApi.deleteAccount();
      toast.success("Account deleted successfully");
      clearStoredSession();
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete account";
      toast.error(message);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 min-w-0">
      <DashboardPageHeader
        title="Settings"
        description="Manage your provider profile, lead routing details, alerts, and account controls."
      />

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative group shrink-0">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
              )}
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 cursor-pointer"
            >
              {uploadingAvatar ? <OrbitLoader size="sm" /> : <Camera className="h-4 w-4 text-background" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">{me?.user.full_name ?? "Agent"}</p>
            <p className="text-sm text-muted-foreground truncate">{me?.user.email ?? "-"}</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-1.5 sm:justify-end">
            <DashboardStatusBadge tone="info">Agent</DashboardStatusBadge>
            <DashboardStatusBadge tone={me?.user.verification_status === "verified" ? "success" : "warning"}>
              {me?.user.verification_status === "verified" ? "Verified" : "Pending"}
            </DashboardStatusBadge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="general" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
          <TabsTrigger value="business" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Business</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Alerts</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <DashboardSettingsSection title="Profile Information" description="Update the details attached to your provider profile.">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Full Name</label><Input value={me?.user.full_name ?? ""} disabled /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Email</label><Input value={me?.user.email ?? ""} disabled /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Phone</label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Primary City</label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Company</label><Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Experience Range</label><Input value={experienceRange} onChange={(e) => setExperienceRange(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
              </div>
              <div className="flex justify-end pt-2"><Button onClick={() => void handleSaveProfile()} disabled={savingProfile || !me}>{savingProfile ? <><InlineSpinner variant="solid" /> Saving...</> : "Save Changes"}</Button></div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="business">
          <DashboardSettingsSection title="Lead Routing Details" description="These onboarding details determine which seeker posts are routed to your queue.">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Operating City</label><Input value={operatingCity} disabled /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Operating State</label><Input value={operatingState} disabled /></div>
              </div>
              <p className="text-xs text-muted-foreground">Operating location is locked after onboarding and is used to route matching seeker needs to your lead inbox.</p>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="notifications">
          <DashboardSettingsSection title="Notification Preferences" description="Control whether matching seeker posts and provider alerts are routed to you.">
            <CardContent className="space-y-4">
              <DashboardSettingsRow
                label="Matching seeker post alerts"
                description="Enable routing for seeker needs that match your operating city or state."
                control={<Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />}
              />
              <DashboardSettingsRow
                label="Operating City"
                description={operatingCity || "Not set during onboarding"}
                control={<span className="text-xs text-muted-foreground">Read only</span>}
              />
              <DashboardSettingsRow
                label="Operating State"
                description={operatingState || "Not set during onboarding"}
                control={<span className="text-xs text-muted-foreground">Read only</span>}
              />
              <div className="flex justify-end pt-2"><Button onClick={() => void handleSaveAlerts()} disabled={savingAlerts}>{savingAlerts ? <><InlineSpinner variant="solid" /> Saving...</> : "Save Alert Settings"}</Button></div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <DashboardSettingsSection title="Security" description="Manage the sign-in and protection controls for your provider account.">
            <DashboardSettingsRow
              label="Change Password"
              description="Use your account security flow to update your password."
              control={<Button variant="outline" size="sm">Update</Button>}
            />
          </DashboardSettingsSection>

          <DashboardSettingsSection title="Danger Zone" description="These actions are irreversible and affect your listings and account history." className="border-destructive/30">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 gap-3">
                <div className="min-w-0"><p className="font-medium text-sm text-foreground">Delete Account</p><p className="text-xs text-muted-foreground">Permanently delete your provider account and all listings.</p></div>
                <Button variant="destructive" size="sm" className="shrink-0" onClick={handleDeleteAccount} disabled={deletingAccount}>{deletingAccount ? <><InlineSpinner variant="solid" /> Deleting...</> : "Delete Account"}</Button>
              </div>
            </CardContent>
          </DashboardSettingsSection>
        </TabsContent>

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
