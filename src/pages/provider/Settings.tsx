import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Trash2, KeyRound, Building2, Activity, CreditCard, Camera } from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "@/contexts/AvatarContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your provider profile, payouts, and preferences.</p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="relative group">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">AJ</AvatarFallback>
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
            <p className="font-semibold text-foreground">Adebayo Johnson</p>
            <p className="text-sm text-muted-foreground">adebayo@dwello.ng</p>
          </div>
          <div className="flex gap-1.5">
            <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Agent</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20" variant="outline">Verified</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="general" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
          <TabsTrigger value="business" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Business</TabsTrigger>
          <TabsTrigger value="payouts" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Payouts</TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          <TabsTrigger value="activity" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Profile Information</CardTitle></div>
              <CardDescription>Update your provider details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Full Name</label><Input defaultValue="Adebayo Johnson" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Email</label><Input defaultValue="adebayo@dwello.ng" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Phone</label><Input defaultValue="+234 803 456 7890" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Company</label><Input defaultValue="Lagos Homes Ltd" /></div>
              </div>
              <div className="flex justify-end pt-2"><Button>Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Business Settings</CardTitle></div>
              <CardDescription>Configure how you operate on the platform</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div><p className="font-medium text-sm text-foreground">Auto-respond to matching leads</p><p className="text-xs text-muted-foreground">Send template offers to leads matching your listings</p></div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-4">
                <div><p className="font-medium text-sm text-foreground">Accept short-let bookings</p><p className="text-xs text-muted-foreground">Show your listings in short-let search results</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Instant booking</p><p className="text-xs text-muted-foreground">Allow tenants to book without manual approval</p></div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Payout Settings</CardTitle></div>
              <CardDescription>Manage how you receive payments</CardDescription>
            </CardHeader>
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
                <div><p className="font-medium text-sm text-foreground">New lead alerts</p><p className="text-xs text-muted-foreground">Get notified when new leads match your listings</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4">
                <div><p className="font-medium text-sm text-foreground">Payout notifications</p><p className="text-xs text-muted-foreground">Notify when payouts are released from escrow</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">SLA warnings</p><p className="text-xs text-muted-foreground">Alert when response time SLA is close to expiring</p></div>
                <Switch defaultChecked />
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
                  <div><p className="font-medium text-sm text-foreground">Change Password</p><p className="text-xs text-muted-foreground">Last changed 7 days ago</p></div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Shield className="h-4 w-4 text-primary" /></div>
                  <div><p className="font-medium text-sm text-foreground">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Secure your account with 2FA</p></div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-destructive/30 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-destructive" /><CardTitle className="text-base text-destructive">Danger Zone</CardTitle></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <div><p className="font-medium text-sm text-foreground">Delete Account</p><p className="text-xs text-muted-foreground">Permanently delete your provider account and all listings.</p></div>
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
