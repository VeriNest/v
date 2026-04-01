import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, Globe, Trash2, KeyRound, Mail, Building2, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const activityLog = [
  { action: "Approved property listing P-003", time: "2 hours ago", type: "Property" },
  { action: "Suspended user U-104 for fraud", time: "5 hours ago", type: "Moderation" },
  { action: "Resolved dispute D-102", time: "1 day ago", type: "Dispute" },
  { action: "Updated platform commission to 5%", time: "2 days ago", type: "Settings" },
  { action: "Exported transaction report", time: "3 days ago", type: "Report" },
];

const typeStyles: Record<string, string> = {
  Property: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
  Moderation: "bg-red-500/10 text-red-600 border-red-500/20",
  Dispute: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Settings: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Report: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Settings</h2>
            <p className="text-white/70 text-sm">Manage your account, platform settings, and activity log.</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
          <CardDescription>Your admin account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[hsl(263,70%,58%)]/20">
              <AvatarFallback className="text-lg bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-semibold">AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-sm text-muted-foreground">admin@dwello.ng</p>
              <Badge className="mt-1 bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20" variant="outline">Super Admin</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="Admin User" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="admin@dwello.ng" />
            </div>
          </div>
          <Button className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Platform Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Platform Settings</CardTitle>
          </div>
          <CardDescription>Configure platform-wide options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-approve verified agents</p>
              <p className="text-xs text-muted-foreground">Automatically approve listings from verified agents</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Escrow enforcement</p>
              <p className="text-xs text-muted-foreground">Require all transactions to go through escrow</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">KYC verification required</p>
              <p className="text-xs text-muted-foreground">Require KYC before providers can receive payouts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Platform Commission (%)</label>
              <Input type="number" defaultValue="5" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">SLA Response Time (minutes)</label>
              <Input type="number" defaultValue="60" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">New dispute alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when new disputes are opened</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Failed transaction alerts</p>
              <p className="text-xs text-muted-foreground">Notify when transactions fail or get flagged</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Weekly summary email</p>
              <p className="text-xs text-muted-foreground">Receive a weekly platform performance digest</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </div>
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
                  <TableCell className="text-sm font-medium">{item.action}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeStyles[item.type]}`}>{item.type}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><KeyRound className="h-4 w-4 text-blue-600" /></div>
              <div>
                <p className="font-medium text-sm">Change Password</p>
                <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10"><Shield className="h-4 w-4 text-emerald-600" /></div>
              <div>
                <p className="font-medium text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Mail className="h-4 w-4 text-amber-600" /></div>
              <div>
                <p className="font-medium text-sm">Login Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified of new login sessions</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-sm border-red-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-red-500" />
            <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
            <div>
              <p className="font-medium text-sm text-red-800">Delete Account</p>
              <p className="text-xs text-red-600">Permanently delete your admin account. This action cannot be undone.</p>
            </div>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
