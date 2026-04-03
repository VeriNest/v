import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Trash2, KeyRound, MapPin, Activity, Camera } from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "@/contexts/AvatarContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, preferences, and activity.</p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="relative group">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">TN</AvatarFallback>
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
            <p className="font-semibold text-foreground">Tenant User</p>
            <p className="text-sm text-muted-foreground">tenant@dwello.ng</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">Tenant</Badge>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="general" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
          <TabsTrigger value="preferences" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          <TabsTrigger value="activity" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Profile Information</CardTitle></div>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
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
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Search Preferences</CardTitle></div>
              <CardDescription>Customize how you receive property matches</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div><p className="font-medium text-sm text-foreground">Auto-match new listings</p><p className="text-xs text-muted-foreground">Receive offers from new listings matching your needs</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4">
                <div><p className="font-medium text-sm text-foreground">Show short-let results</p><p className="text-xs text-muted-foreground">Include short-let properties in search results</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Verified providers only</p><p className="text-xs text-muted-foreground">Only show offers from verified agents/landlords</p></div>
                <Switch />
              </div>
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
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div><p className="font-medium text-sm text-foreground">New offer alerts</p><p className="text-xs text-muted-foreground">Notify when providers send you offers</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4">
                <div><p className="font-medium text-sm text-foreground">Booking updates</p><p className="text-xs text-muted-foreground">Escrow status and booking confirmations</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Weekly property digest</p><p className="text-xs text-muted-foreground">Curated listings based on your preferences</p></div>
                <Switch />
              </div>
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
                  <div><p className="font-medium text-sm text-foreground">Change Password</p><p className="text-xs text-muted-foreground">Last changed 14 days ago</p></div>
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
                <div><p className="font-medium text-sm text-foreground">Delete Account</p><p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p></div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Recent Activity</CardTitle></div>
              <CardDescription>Your recent actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
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
                        <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">{item.action}</TableCell>
                        <TableCell><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeStyles[item.type]}`}>{item.type}</span></TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{item.time}</TableCell>
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
