import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Globe, Trash2, KeyRound, Mail, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const activityLog = [
  { action: "Approved property listing P-003", time: "2 hours ago", type: "Property" },
  { action: "Suspended user U-104 for fraud", time: "5 hours ago", type: "Moderation" },
  { action: "Resolved dispute D-102", time: "1 day ago", type: "Dispute" },
  { action: "Updated platform commission to 5%", time: "2 days ago", type: "Settings" },
  { action: "Exported transaction report", time: "3 days ago", type: "Report" },
];

const typeStyles: Record<string, string> = {
  Property: "bg-primary/10 text-primary border-primary/20",
  Moderation: "bg-destructive/10 text-destructive border-destructive/20",
  Dispute: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Settings: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Report: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, platform settings, and activity log.</p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Admin User</p>
            <p className="text-sm text-muted-foreground">admin@dwello.ng</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Super Admin</Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="general" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
          <TabsTrigger value="platform" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Platform</TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          <TabsTrigger value="activity" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

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
              </div>
              <div className="flex justify-end pt-2"><Button>Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Platform Settings</CardTitle></div>
              <CardDescription>Configure platform-wide options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="divide-y divide-border/60">
                <div className="flex items-center justify-between py-4 first:pt-0">
                  <div><p className="font-medium text-sm text-foreground">Auto-approve verified agents</p><p className="text-xs text-muted-foreground">Automatically approve listings from verified agents</p></div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div><p className="font-medium text-sm text-foreground">Escrow enforcement</p><p className="text-xs text-muted-foreground">Require all transactions to go through escrow</p></div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div><p className="font-medium text-sm text-foreground">KYC verification required</p><p className="text-xs text-muted-foreground">Require KYC before providers can receive payouts</p></div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Platform Commission (%)</label><Input type="number" defaultValue="5" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">SLA Response Time (minutes)</label><Input type="number" defaultValue="60" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Notification Preferences</CardTitle></div>
              <CardDescription>Choose what alerts you receive</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div><p className="font-medium text-sm text-foreground">New dispute alerts</p><p className="text-xs text-muted-foreground">Get notified when new disputes are opened</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4">
                <div><p className="font-medium text-sm text-foreground">Failed transaction alerts</p><p className="text-xs text-muted-foreground">Notify when transactions fail or get flagged</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Weekly summary email</p><p className="text-xs text-muted-foreground">Receive a weekly platform performance digest</p></div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Mail className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium text-sm text-foreground">Login Notifications</p><p className="text-xs text-muted-foreground">Get notified of new login sessions</p></div>
                </div>
                <Switch defaultChecked />
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

        <TabsContent value="activity">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Recent Activity</CardTitle></div>
              <CardDescription>Your recent actions on the platform</CardDescription>
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
