import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, Trash2, KeyRound, Building2, Activity, CreditCard, Percent } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const activityLog = [
  { action: "Sent offer for 3 Bed in Lekki", time: "1 hour ago", type: "Offer" },
  { action: "Published listing: Studio, Wuse 2", time: "3 hours ago", type: "Listing" },
  { action: "Received payout PO-301: ₦2.3M", time: "1 day ago", type: "Payout" },
  { action: "Responded to lead from Anonymous Tenant", time: "1 day ago", type: "Lead" },
  { action: "Updated calendar availability", time: "2 days ago", type: "Calendar" },
];

const typeStyles: Record<string, string> = {
  Offer: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
  Listing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Payout: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Lead: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Calendar: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function ProviderSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl"><Settings className="h-5 w-5" /></div>
          <div>
            <h2 className="text-xl font-bold">Account Settings</h2>
            <p className="text-white/70 text-sm">Manage your provider profile, payouts, and preferences.</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Profile</CardTitle></div>
          <CardDescription>Your provider account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[hsl(263,70%,58%)]/20">
              <AvatarFallback className="text-lg bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-semibold">AJ</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Adebayo Johnson</p>
              <p className="text-sm text-muted-foreground">adebayo@dwello.ng</p>
              <div className="flex gap-1.5 mt-1">
                <Badge className="bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20" variant="outline">Agent</Badge>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200" variant="outline">Verified</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5"><label className="text-sm font-medium">Full Name</label><Input defaultValue="Adebayo Johnson" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Email</label><Input defaultValue="adebayo@dwello.ng" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Phone</label><Input defaultValue="+234 803 456 7890" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Company</label><Input defaultValue="Lagos Homes Ltd" /></div>
          </div>
          <Button className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Business Settings</CardTitle></div>
          <CardDescription>Configure how you operate on the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Auto-respond to matching leads</p><p className="text-xs text-muted-foreground">Send template offers to leads matching your listings</p></div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Accept short-let bookings</p><p className="text-xs text-muted-foreground">Show your listings in short-let search results</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Instant booking</p><p className="text-xs text-muted-foreground">Allow tenants to book without manual approval</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Payout Settings</CardTitle></div>
          <CardDescription>Manage how you receive payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-medium">Bank Name</label><Input defaultValue="GTBank" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Account Number</label><Input defaultValue="0123456789" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Account Name</label><Input defaultValue="Adebayo Johnson" /></div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Payout Frequency</label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
          <Button className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">Update Payout Details</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Notifications</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">New lead alerts</p><p className="text-xs text-muted-foreground">Get notified when new leads match your listings</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Payout notifications</p><p className="text-xs text-muted-foreground">Notify when payouts are released from escrow</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">SLA warnings</p><p className="text-xs text-muted-foreground">Alert when response time SLA is close to expiring</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Recent Activity</CardTitle></div>
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
                  <TableCell><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeStyles[item.type]}`}>{item.type}</span></TableCell>
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
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Security</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10"><KeyRound className="h-4 w-4 text-blue-600" /></div>
              <div><p className="font-medium text-sm">Change Password</p><p className="text-xs text-muted-foreground">Last changed 7 days ago</p></div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10"><Shield className="h-4 w-4 text-emerald-600" /></div>
              <div><p className="font-medium text-sm">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Secure your account</p></div>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-red-500" /><CardTitle className="text-lg text-red-600">Danger Zone</CardTitle></div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50">
            <div><p className="font-medium text-sm text-red-800">Delete Account</p><p className="text-xs text-red-600">Permanently delete your provider account and all listings.</p></div>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
