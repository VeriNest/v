import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Building2, Camera, CreditCard, FileText, Shield, User, Wrench, Activity, Clock, ReceiptText, KeyRound, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "@/contexts/AvatarContext";

const activityLog = [
  { action: "Recorded rent payment for Palm Residence A1", time: "1 hour ago", type: "Collection" },
  { action: "Marked Lekki Court B2 as vacant-ready", time: "4 hours ago", type: "Portfolio" },
  { action: "Uploaded updated ownership file", time: "Yesterday", type: "Document" },
  { action: "Escalated water heater replacement", time: "Yesterday", type: "Maintenance" },
  { action: "Sent overdue reminder to Admiralty Suites 5B", time: "2 days ago", type: "Collection" },
];

const activityStyles: Record<string, string> = {
  Collection: "bg-primary/10 text-primary border-primary/20",
  Portfolio: "bg-blue-50 text-blue-600 border-blue-200",
  Document: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Maintenance: "bg-amber-50 text-amber-600 border-amber-200",
};

export default function LandlordSettings() {
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your landlord identity, portfolio operations, and collection preferences.</p>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
          <div className="relative group shrink-0">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/20">
              {avatarUrl ? <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" /> : <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">LO</AvatarFallback>}
            </Avatar>
            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 cursor-pointer">
              <Camera className="h-4 w-4 text-background" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">Landlord Account</p>
            <p className="text-sm text-muted-foreground truncate">owner@dwello.ng</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            <Badge className="whitespace-nowrap bg-primary/10 text-primary border-primary/20" variant="outline">Landlord</Badge>
            <Badge className="whitespace-nowrap bg-emerald-500/10 text-emerald-600 border-emerald-500/20" variant="outline">Verified</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="general" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Portfolio</TabsTrigger>
          <TabsTrigger value="collections" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Collections</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Alerts</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Documents</TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Security</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Profile Information</CardTitle></div>
              <CardDescription>Update the core identity used across your owned properties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Full Name</label><Input defaultValue="Landlord Account" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Email</label><Input defaultValue="owner@dwello.ng" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Phone</label><Input defaultValue="+234 803 456 7890" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Primary City</label><Input defaultValue="Lagos" /></div>
              </div>
              <div className="flex justify-end pt-2"><Button>Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Portfolio Preferences</CardTitle></div>
              <CardDescription>Define how you operate properties and occupancy.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between gap-3 py-4 first:pt-0">
                <div><p className="font-medium text-sm text-foreground">Allow direct tenant inquiries</p><p className="text-xs text-muted-foreground">Let tenants contact you without routing through an agent.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div><p className="font-medium text-sm text-foreground">Track unit-level occupancy</p><p className="text-xs text-muted-foreground">Show occupied, vacant, and notice-given units in the dashboard.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div><p className="font-medium text-sm text-foreground">Maintenance approval required</p><p className="text-xs text-muted-foreground">Require landlord sign-off before vendors can start work.</p></div>
                <Switch className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div><p className="font-medium text-sm text-foreground">Publish vacancies automatically</p><p className="text-xs text-muted-foreground">Push vacant-ready units to your marketing inventory without manual relisting.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Allow agent collaboration</p><p className="text-xs text-muted-foreground">Let assigned agents manage inspections and tenant conversations on your behalf.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Collection Preferences</CardTitle></div>
              <CardDescription>Control how rent reminders and payment records are handled.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Bank Name</label><Input defaultValue="GTBank" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Account Number</label><Input defaultValue="0123456789" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Account Name</label><Input defaultValue="Landlord Account" /></div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Settlement Schedule</label>
                  <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground">
                    <option>As payments clear</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Collection Cycle</label><Input defaultValue="Monthly" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Reminder Offset</label><Input defaultValue="3 days before due date" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Grace Period</label><Input defaultValue="2 days after due date" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Default Rent Due Day</label><Input defaultValue="1st of every month" /></div>
              </div>
              <div className="flex justify-end pt-2"><Button>Update Collection Settings</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Alerts</CardTitle></div>
              <CardDescription>Choose which landlord operations trigger notifications.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between gap-3 py-4 first:pt-0">
                <div><p className="font-medium text-sm text-foreground">Lease expiry reminders</p><p className="text-xs text-muted-foreground">Notify 30, 14, and 7 days before lease end.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div><p className="font-medium text-sm text-foreground">Overdue rent alerts</p><p className="text-xs text-muted-foreground">Flag missed or partial collections immediately.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Maintenance escalation alerts</p><p className="text-xs text-muted-foreground">Notify when issues are marked urgent or unresolved.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Documents and Verification</CardTitle></div>
              <CardDescription>Keep ownership and compliance records current.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between gap-3 py-4 first:pt-0">
                <div><p className="font-medium text-sm text-foreground">Ownership verification</p><p className="text-xs text-muted-foreground">National ID and title deed currently on file.</p></div>
                <Badge variant="outline" className="shrink-0 whitespace-nowrap text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Verified</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div><p className="font-medium text-sm text-foreground">Property compliance documents</p><p className="text-xs text-muted-foreground">Track expiring C of O, tax receipts, and inspection records.</p></div>
                <Button variant="outline" size="sm" className="shrink-0"><Shield className="h-3.5 w-3.5 mr-1.5" /> Review</Button>
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div><p className="font-medium text-sm text-foreground">Maintenance vendor files</p><p className="text-xs text-muted-foreground">Store invoices, receipts, and service reports per issue.</p></div>
                <Button variant="outline" size="sm" className="shrink-0"><Wrench className="h-3.5 w-3.5 mr-1.5" /> Manage</Button>
              </div>
              <div className="flex items-center justify-between gap-3 py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Expiry reminders</p><p className="text-xs text-muted-foreground">Get alerted before compliance certificates, tenancy files, or receipts lapse.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><CardTitle className="text-base">Security</CardTitle></div>
              <CardDescription>Protect your landlord account, payment access, and portfolio controls.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              <div className="flex items-center justify-between gap-2 py-4 first:pt-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0"><KeyRound className="h-4 w-4 text-primary" /></div>
                  <div className="min-w-0"><p className="font-medium text-sm text-foreground">Change Password</p><p className="text-xs text-muted-foreground">Last updated 12 days ago.</p></div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">Update</Button>
              </div>
              <div className="flex items-center justify-between gap-2 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0"><Shield className="h-4 w-4 text-primary" /></div>
                  <div className="min-w-0"><p className="font-medium text-sm text-foreground">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Require a second verification step for sign-in and rent disbursement changes.</p></div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">Enable</Button>
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div><p className="font-medium text-sm text-foreground">Login notifications</p><p className="text-xs text-muted-foreground">Alert when a new browser or device accesses your portfolio.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <div className="flex items-center justify-between gap-3 py-4 last:pb-0">
                <div><p className="font-medium text-sm text-foreground">Require approval for bank detail changes</p><p className="text-xs text-muted-foreground">Pause disbursement updates until you confirm them by email.</p></div>
                <Switch defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-destructive/30 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-destructive" /><CardTitle className="text-base text-destructive">Danger Zone</CardTitle></div>
              <CardDescription>Take care with irreversible account actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently remove your landlord account, portfolio history, and rent collection records.</p>
                </div>
                <Button variant="destructive" size="sm" className="shrink-0">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <div className="space-y-4">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                    </div>
                    <CardDescription>Track recent collection, portfolio, maintenance, and document actions.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
                    <ReceiptText className="h-3.5 w-3.5" /> Export Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {activityLog.map((item) => (
                  <div key={`${item.type}-${item.action}`} className="rounded-xl border border-border/60 bg-secondary/30 p-3 sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.action}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium ${activityStyles[item.type]}`}>
                            {item.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="justify-start sm:justify-center">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
