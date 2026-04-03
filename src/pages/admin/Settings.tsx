import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User, Bell, Shield, Globe, Trash2, KeyRound, Mail, Activity, Camera,
  CreditCard, Palette, Database, Zap, Users, Clock, FileText, Lock
} from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "@/contexts/AvatarContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const activityLog = [
  { action: "Approved property listing P-003", time: "2 hours ago", type: "Property" },
  { action: "Suspended user U-104 for fraud", time: "5 hours ago", type: "Moderation" },
  { action: "Resolved dispute D-102", time: "1 day ago", type: "Dispute" },
  { action: "Updated platform commission to 5%", time: "2 days ago", type: "Settings" },
  { action: "Exported transaction report", time: "3 days ago", type: "Report" },
  { action: "Approved KYC for V-398", time: "3 days ago", type: "Property" },
  { action: "Updated escrow settlement rules", time: "4 days ago", type: "Settings" },
];

const typeStyles: Record<string, string> = {
  Property: "bg-primary/10 text-primary border-primary/20",
  Moderation: "bg-destructive/10 text-destructive border-destructive/20",
  Dispute: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Settings: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Report: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const adminTeam = [
  { name: "Admin User", email: "admin@dwello.ng", role: "Super Admin", status: "Active", initials: "AD" },
  { name: "Bola Tinubu", email: "bola@dwello.ng", role: "Moderator", status: "Active", initials: "BT" },
  { name: "Chidi Eze", email: "chidi@dwello.ng", role: "Support", status: "Inactive", initials: "CE" },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-primary/10 text-primary border-primary/20",
  Moderator: "bg-blue-50 text-blue-600 border-blue-200",
  Support: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

export default function AdminSettings() {
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, platform configuration, and team access.</p>
      </div>

      {/* Profile Card */}
      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="relative group">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">AD</AvatarFallback>
              )}
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="h-4 w-4 text-background" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Admin User</p>
            <p className="text-sm text-muted-foreground">admin@dwello.ng</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Super Admin</Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="general" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <User className="h-3.5 w-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="platform" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Globe className="h-3.5 w-3.5" /> Platform
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <CreditCard className="h-3.5 w-3.5" /> Payments
          </TabsTrigger>
          <TabsTrigger value="team" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Users className="h-3.5 w-3.5" /> Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Activity
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Profile Information</CardTitle></div>
              <CardDescription>Your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Full Name</label><Input defaultValue="Admin User" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Email</label><Input defaultValue="admin@dwello.ng" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Phone</label><Input defaultValue="+234 801 234 5678" /></div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <Select defaultValue="wat">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wat">WAT (UTC+1)</SelectItem>
                      <SelectItem value="gmt">GMT (UTC+0)</SelectItem>
                      <SelectItem value="est">EST (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end pt-2"><Button>Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform */}
        <TabsContent value="platform" className="space-y-4">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Platform Configuration</CardTitle></div>
              <CardDescription>Configure platform-wide rules and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="divide-y divide-border/60">
                {[
                  { title: "Auto-approve verified agents", desc: "Automatically approve listings from verified agents", checked: false },
                  { title: "Escrow enforcement", desc: "Require all transactions to go through escrow", checked: true },
                  { title: "KYC verification required", desc: "Require KYC before providers can receive payouts", checked: true },
                  { title: "Maintenance mode", desc: "Temporarily disable the platform for maintenance", checked: false },
                  { title: "Allow guest browsing", desc: "Let unregistered users browse property listings", checked: true },
                  { title: "Review before publish", desc: "Manually review all new listings before they go live", checked: true },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div><p className="font-medium text-sm text-foreground">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Operational Limits</CardTitle></div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Commission Rate (%)</label><Input type="number" defaultValue="5" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">SLA Response (min)</label><Input type="number" defaultValue="60" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Max Listings / Agent</label><Input type="number" defaultValue="50" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Min Booking Amount (₦)</label><Input type="number" defaultValue="10000" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Escrow Hold (days)</label><Input type="number" defaultValue="3" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Dispute Window (days)</label><Input type="number" defaultValue="7" /></div>
              </div>
              <div className="flex justify-end pt-4"><Button>Save Configuration</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Payment Settings</CardTitle></div>
              <CardDescription>Configure payment gateways and payout rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="divide-y divide-border/60">
                {[
                  { title: "Paystack Integration", desc: "Process payments via Paystack", checked: true },
                  { title: "Flutterwave Fallback", desc: "Use Flutterwave as secondary payment processor", checked: false },
                  { title: "Auto Payout", desc: "Automatically send payouts after booking completion", checked: true },
                  { title: "Instant Settlement", desc: "Enable instant payout for premium providers", checked: false },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div><p className="font-medium text-sm text-foreground">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Paystack Public Key</label><Input defaultValue="pk_live_••••••••••••" type="password" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Paystack Secret Key</label><Input defaultValue="sk_live_••••••••••••" type="password" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Payout Schedule</label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Settlement Currency</label>
                  <Select defaultValue="ngn">
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngn">NGN (₦)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end"><Button>Save Payment Settings</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Admin Team</CardTitle></div>
                  <CardDescription>Manage team members and their access levels</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 text-sm"><Users className="h-3.5 w-3.5" /> Invite Member</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Member</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Role</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminTeam.map((m) => (
                    <TableRow key={m.email}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">{m.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{m.name}</p>
                            <p className="text-[11px] text-muted-foreground">{m.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${roleColors[m.role]}`}>{m.role}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${m.status === "Active" ? "text-emerald-600" : "text-muted-foreground"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${m.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                          {m.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Notification Preferences</CardTitle></div>
              <CardDescription>Choose what alerts you receive</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {[
                { title: "New dispute alerts", desc: "Get notified when new disputes are opened", checked: true },
                { title: "Failed transaction alerts", desc: "Notify when transactions fail or get flagged", checked: true },
                { title: "KYC submissions", desc: "Get notified when new KYC documents are submitted", checked: true },
                { title: "Property reports", desc: "Alert when users report a listing", checked: true },
                { title: "Weekly summary email", desc: "Receive a weekly platform performance digest", checked: false },
                { title: "Monthly analytics report", desc: "Detailed monthly report sent to your email", checked: true },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div><p className="font-medium text-sm text-foreground">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                  <Switch defaultChecked={item.checked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Security</CardTitle></div>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><KeyRound className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium text-sm text-foreground">Change Password</p><p className="text-xs text-muted-foreground">Last changed 30 days ago</p></div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium text-sm text-foreground">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Mail className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium text-sm text-foreground">Login Notifications</p><p className="text-xs text-muted-foreground">Get notified of new login sessions</p></div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Lock className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium text-sm text-foreground">Session Timeout</p><p className="text-xs text-muted-foreground">Auto-logout after inactivity</p></div>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[120px] h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-destructive/30 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-destructive" /><CardTitle className="text-base text-destructive">Danger Zone</CardTitle></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <div><p className="font-medium text-sm text-foreground">Delete Account</p><p className="text-xs text-muted-foreground">Permanently delete your admin account. This action cannot be undone.</p></div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Recent Activity</CardTitle></div>
                  <CardDescription>Your recent actions on the platform</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1 text-xs"><FileText className="h-3 w-3" /> Export Log</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Action</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLog.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium text-foreground">{item.action}</TableCell>
                      <TableCell><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeStyles[item.type]}`}>{item.type}</span></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
