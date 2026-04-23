import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSettingsSection, DashboardSettingsRow } from "@/components/dashboard/DashboardSettingsSection";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { useAvatar } from "@/contexts/AvatarContext";
import { authApi, clearStoredSession } from "@/lib/api";
import {
  Activity,
  Bell,
  Camera,
  CreditCard,
  FileText,
  Globe,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react";

const activityLog = [
  { action: "Approved property listing P-003", time: "2 hours ago", type: "Property" },
  { action: "Suspended user U-104 for fraud", time: "5 hours ago", type: "Moderation" },
  { action: "Resolved dispute D-102", time: "1 day ago", type: "Dispute" },
  { action: "Updated platform commission to 5%", time: "2 days ago", type: "Settings" },
  { action: "Exported transaction report", time: "3 days ago", type: "Report" },
  { action: "Approved KYC for V-398", time: "3 days ago", type: "Property" },
  { action: "Updated escrow settlement rules", time: "4 days ago", type: "Settings" },
];

const typeTone: Record<string, "info" | "danger" | "warning" | "success" | "neutral"> = {
  Property: "info",
  Moderation: "danger",
  Dispute: "warning",
  Settings: "neutral",
  Report: "success",
};

const adminTeam = [
  { name: "Admin User", email: "admin@verinest.ng", role: "Super Admin", status: "Active", initials: "AD" },
  { name: "Bola Tinubu", email: "bola@verinest.ng", role: "Moderator", status: "Active", initials: "BT" },
  { name: "Chidi Eze", email: "chidi@verinest.ng", role: "Support", status: "Inactive", initials: "CE" },
];

const roleTone: Record<string, "info" | "success" | "neutral"> = {
  "Super Admin": "info",
  Moderator: "success",
  Support: "neutral",
};

export default function AdminSettings() {
  const navigate = useNavigate();
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to permanently delete your admin account? This action cannot be undone.")) {
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
    <div className="mx-auto min-w-0 max-w-5xl space-y-6">
      <DashboardPageHeader
        title="Admin Settings"
        description="Manage your account, platform configuration, payment rules, and team access."
      />

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="group relative shrink-0">
            <Avatar className="h-14 w-14 border-2 border-primary/20 sm:h-16 sm:w-16">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">AD</AvatarFallback>
              )}
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50"
            >
              <Camera className="h-4 w-4 text-background" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">Admin User</p>
            <p className="truncate text-sm text-muted-foreground">admin@verinest.ng</p>
          </div>

          <div className="flex shrink-0 justify-center sm:justify-end">
            <DashboardStatusBadge tone="info">Super Admin</DashboardStatusBadge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="h-auto flex-wrap bg-muted/50 p-1">
          <TabsTrigger value="general" className="gap-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm">
            <User className="hidden h-3.5 w-3.5 sm:inline" /> General
          </TabsTrigger>
          <TabsTrigger value="platform" className="gap-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm">
            <Globe className="hidden h-3.5 w-3.5 sm:inline" /> Platform
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm">
            <CreditCard className="hidden h-3.5 w-3.5 sm:inline" /> Payments
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm">
            <Users className="hidden h-3.5 w-3.5 sm:inline" /> Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm">
            <Bell className="hidden h-3.5 w-3.5 sm:inline" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm">
            <Shield className="hidden h-3.5 w-3.5 sm:inline" /> Security
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm">
            <Activity className="hidden h-3.5 w-3.5 sm:inline" /> Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <DashboardSettingsSection title="Profile Information" description="Update your admin identity and regional preferences.">
            <div className="space-y-4 px-6 pb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input defaultValue="Admin User" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input defaultValue="admin@verinest.ng" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <Input defaultValue="+234 801 234 5678" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <Select defaultValue="wat">
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wat">WAT (UTC+1)</SelectItem>
                      <SelectItem value="gmt">GMT (UTC+0)</SelectItem>
                      <SelectItem value="est">EST (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button>Save Changes</Button>
              </div>
            </div>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="platform" className="space-y-4">
          <DashboardSettingsSection
            title="Platform Configuration"
            description="Control publishing rules, compliance requirements, and global marketplace behavior."
          >
            <DashboardSettingsRow
              label="Auto-approve verified agents"
              description="Automatically approve listings from verified agents."
              control={<Switch className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Escrow enforcement"
              description="Require all transactions to go through escrow."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="KYC verification required"
              description="Require KYC before providers can receive payouts."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Maintenance mode"
              description="Temporarily disable the platform for maintenance."
              control={<Switch className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Allow guest browsing"
              description="Let unregistered users browse property listings."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Review before publish"
              description="Manually review all new listings before they go live."
              control={<Switch defaultChecked className="shrink-0" />}
            />
          </DashboardSettingsSection>

          <DashboardSettingsSection
            title="Operational Limits"
            description="Control commission, booking thresholds, escrow timing, and dispute windows."
          >
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">Commission (%)</label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">SLA (min)</label>
                  <Input type="number" defaultValue="60" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">Max Listings</label>
                  <Input type="number" defaultValue="50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">Min Booking (NGN)</label>
                  <Input type="number" defaultValue="10000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">Escrow (days)</label>
                  <Input type="number" defaultValue="3" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground sm:text-sm">Dispute (days)</label>
                  <Input type="number" defaultValue="7" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button>Save Configuration</Button>
              </div>
            </div>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="payments">
          <DashboardSettingsSection
            title="Payment Settings"
            description="Configure payment processors, settlement timing, and payout rules."
          >
            <DashboardSettingsRow
              label="Paystack Integration"
              description="Process payments via Paystack."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Flutterwave Fallback"
              description="Use Flutterwave as a secondary processor."
              control={<Switch className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Auto Payout"
              description="Automatically send payouts after completion."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Instant Settlement"
              description="Enable instant payout for premium providers."
              control={<Switch className="shrink-0" />}
            />
            <div className="grid grid-cols-1 gap-4 px-6 pb-6 pt-2 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Paystack Public Key</label>
                <Input defaultValue="pk_live_hidden" type="password" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Paystack Secret Key</label>
                <Input defaultValue="sk_live_hidden" type="password" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Payout Schedule</label>
                <Select defaultValue="daily">
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Settlement Currency</label>
                <Select defaultValue="ngn">
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngn">NGN</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end px-6 pb-6">
              <Button>Save Payment Settings</Button>
            </div>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="team">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Admin Team</CardTitle>
                  </div>
                  <CardDescription>Manage team members and their access levels.</CardDescription>
                </div>
                <Button size="sm" className="w-full gap-1.5 text-sm sm:w-auto">
                  <Users className="h-3.5 w-3.5" /> Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:hidden">
                {adminTeam.map((member) => (
                  <div key={member.email} className="space-y-3 rounded-lg border border-border/60 bg-secondary/30 p-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 shrink-0 border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{member.email}</p>
                      </div>
                      <DashboardStatusBadge tone={member.status === "Active" ? "success" : "neutral"}>
                        {member.status}
                      </DashboardStatusBadge>
                    </div>
                    <div className="flex items-center justify-between">
                      <DashboardStatusBadge tone={roleTone[member.role]}>{member.role}</DashboardStatusBadge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">Remove</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto px-6 sm:-mx-6 sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Member</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Role</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                      <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground/70">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminTeam.map((member) => (
                      <TableRow key={member.email}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 border border-border/60">
                              <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                                {member.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{member.name}</p>
                              <p className="text-[11px] text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DashboardStatusBadge tone={roleTone[member.role]}>{member.role}</DashboardStatusBadge>
                        </TableCell>
                        <TableCell>
                          <DashboardStatusBadge tone={member.status === "Active" ? "success" : "neutral"}>
                            {member.status}
                          </DashboardStatusBadge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <DashboardSettingsSection title="Notification Preferences" description="Choose the operational alerts that should reach the admin workspace.">
            <DashboardSettingsRow
              label="New dispute alerts"
              description="Get notified when new disputes are opened."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Failed transaction alerts"
              description="Notify when transactions fail or get flagged."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="KYC submissions"
              description="Get notified when new KYC documents are submitted."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Property reports"
              description="Alert when users report a listing."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Weekly summary email"
              description="Receive a weekly platform performance digest."
              control={<Switch className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Monthly analytics report"
              description="Receive the detailed monthly operational report."
              control={<Switch defaultChecked className="shrink-0" />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <DashboardSettingsSection title="Security" description="Protect admin access, sessions, and high-impact platform controls.">
            <DashboardSettingsRow
              label="Change Password"
              description="Last changed 30 days ago."
              control={<Button variant="outline" size="sm" className="shrink-0">Update</Button>}
            />
            <DashboardSettingsRow
              label="Two-Factor Authentication"
              description="Add an extra verification step for sign-in."
              control={<Button variant="outline" size="sm" className="shrink-0">Enable</Button>}
            />
            <DashboardSettingsRow
              label="Login Notifications"
              description="Get notified when a new device accesses the admin account."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Session Timeout"
              description="Auto-logout after inactivity."
              control={
                <Select defaultValue="30">
                  <SelectTrigger className="h-8 w-[100px] shrink-0 text-sm sm:w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
          </DashboardSettingsSection>

          <DashboardSettingsSection
            title="Danger Zone"
            description="Take care with irreversible account actions."
            className="border-destructive/30"
          >
            <DashboardSettingsRow
              label="Delete Account"
              description="Permanently delete your admin account. This action cannot be undone."
              control={<Button variant="destructive" size="sm" className="shrink-0" onClick={handleDeleteAccount} disabled={deletingAccount}>{deletingAccount ? "Deleting..." : "Delete Account"}</Button>}
            />
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </div>
                  <CardDescription>Your recent actions on the platform.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-1 text-xs sm:w-auto">
                  <FileText className="h-3 w-3" /> Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:hidden">
                {activityLog.map((item) => (
                  <div key={`${item.action}-${item.time}`} className="space-y-2 rounded-lg border border-border/60 bg-secondary/30 p-3">
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <div className="flex items-center justify-between gap-2">
                      <DashboardStatusBadge tone={typeTone[item.type]}>{item.type}</DashboardStatusBadge>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Action</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLog.map((item) => (
                      <TableRow key={`${item.action}-${item.time}`}>
                        <TableCell className="text-sm font-medium text-foreground">{item.action}</TableCell>
                        <TableCell>
                          <DashboardStatusBadge tone={typeTone[item.type]}>{item.type}</DashboardStatusBadge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
