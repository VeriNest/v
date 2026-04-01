import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, Trash2, KeyRound, Mail, Activity, MapPin, Heart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const activityLog = [
  { action: "Posted need: 3 Bed in Lekki", time: "2 hours ago", type: "Post" },
  { action: "Viewed offer from Adebayo Johnson", time: "4 hours ago", type: "Offer" },
  { action: "Scheduled viewing for Studio, Wuse 2", time: "1 day ago", type: "Viewing" },
  { action: "Saved property: 2 Bed Serviced, VI", time: "2 days ago", type: "Save" },
  { action: "Completed booking BK-003", time: "3 days ago", type: "Booking" },
];

const typeStyles: Record<string, string> = {
  Post: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
  Offer: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Viewing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Save: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Booking: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function SeekerSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl"><Settings className="h-5 w-5" /></div>
          <div>
            <h2 className="text-xl font-bold">Account Settings</h2>
            <p className="text-white/70 text-sm">Manage your profile, preferences, and activity.</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Profile</CardTitle></div>
          <CardDescription>Your tenant account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[hsl(263,70%,58%)]/20">
              <AvatarFallback className="text-lg bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-semibold">TN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Tenant User</p>
              <p className="text-sm text-muted-foreground">tenant@dwello.ng</p>
              <Badge className="mt-1 bg-slate-100 text-slate-600 border-slate-200" variant="outline">Tenant</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5"><label className="text-sm font-medium">Full Name</label><Input defaultValue="Tenant User" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Email</label><Input defaultValue="tenant@dwello.ng" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Phone</label><Input defaultValue="+234 801 234 5678" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Preferred Location</label><Input defaultValue="Lagos, Nigeria" /></div>
          </div>
          <Button className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Search Preferences */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Search Preferences</CardTitle></div>
          <CardDescription>Customize how you receive property matches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Auto-match new listings</p><p className="text-xs text-muted-foreground">Receive offers from new listings matching your needs</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Show short-let results</p><p className="text-xs text-muted-foreground">Include short-let properties in search results</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Verified providers only</p><p className="text-xs text-muted-foreground">Only show offers from verified agents/landlords</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-lg">Notifications</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">New offer alerts</p><p className="text-xs text-muted-foreground">Notify when providers send you offers</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Booking updates</p><p className="text-xs text-muted-foreground">Escrow status and booking confirmations</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium text-sm">Weekly property digest</p><p className="text-xs text-muted-foreground">Curated listings based on your preferences</p></div>
            <Switch />
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
              <div><p className="font-medium text-sm">Change Password</p><p className="text-xs text-muted-foreground">Last changed 14 days ago</p></div>
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
            <div><p className="font-medium text-sm text-red-800">Delete Account</p><p className="text-xs text-red-600">Permanently delete your account and all data.</p></div>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
