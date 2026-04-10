import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Building2, Camera, CreditCard, FileText, Shield, User, Wrench, Activity, Clock, ReceiptText, KeyRound, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useAvatar } from "@/contexts/AvatarContext";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSettingsSection, DashboardSettingsRow } from "@/components/dashboard/DashboardSettingsSection";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";

const activityLog = [
  { action: "Recorded rent payment for Palm Residence A1", time: "1 hour ago", type: "Collection" },
  { action: "Marked Lekki Court B2 as vacant-ready", time: "4 hours ago", type: "Portfolio" },
  { action: "Uploaded updated ownership file", time: "Yesterday", type: "Document" },
  { action: "Escalated water heater replacement", time: "Yesterday", type: "Maintenance" },
  { action: "Sent overdue reminder to Admiralty Suites 5B", time: "2 days ago", type: "Collection" },
];

const activityStyles: Record<string, string> = {
  Collection: "bg-primary/10 text-primary border-primary/20",
  Portfolio: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
  Document: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  Maintenance: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
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
      <DashboardPageHeader
        title="Settings"
        description="Manage your landlord identity, portfolio operations, and collection preferences."
      />

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="relative group shrink-0">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/20">
              {avatarUrl ? <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" /> : <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">LO</AvatarFallback>}
            </Avatar>
            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 cursor-pointer">
              <Camera className="h-4 w-4 text-background" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">Landlord Account</p>
            <p className="text-sm text-muted-foreground truncate">owner@dwello.ng</p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-1.5 sm:justify-end">
            <DashboardStatusBadge tone="info">Landlord</DashboardStatusBadge>
            <DashboardStatusBadge tone="success">Verified</DashboardStatusBadge>
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
          <DashboardSettingsSection
            title="Profile Information"
            description="Update the core identity used across your owned properties."
          >
            <div className="space-y-4 px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Full Name</label><Input defaultValue="Landlord Account" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Email</label><Input defaultValue="owner@dwello.ng" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Phone</label><Input defaultValue="+234 803 456 7890" /></div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground">Primary City</label><Input defaultValue="Lagos" /></div>
              </div>
              <div className="flex justify-end pt-2"><Button>Save Changes</Button></div>
            </div>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="portfolio">
          <DashboardSettingsSection
            title="Portfolio Preferences"
            description="Define how you operate properties and occupancy."
          >
            <DashboardSettingsRow
              label="Allow direct tenant inquiries"
              description="Let tenants contact you without routing through an agent."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Track unit-level occupancy"
              description="Show occupied, vacant, and notice-given units in the dashboard."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Maintenance approval required"
              description="Require landlord sign-off before vendors can start work."
              control={<Switch className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Publish vacancies automatically"
              description="Push vacant-ready units to your marketing inventory without manual relisting."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Allow agent collaboration"
              description="Let assigned agents manage inspections and tenant conversations on your behalf."
              control={<Switch defaultChecked className="shrink-0" />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="collections">
          <DashboardSettingsSection
            title="Collection Preferences"
            description="Control how rent reminders and payment records are handled."
          >
            <div className="space-y-4 px-6 pb-6">
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
            </div>
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="alerts">
          <DashboardSettingsSection
            title="Alerts"
            description="Choose which landlord operations trigger notifications."
          >
            <DashboardSettingsRow
              label="Lease expiry reminders"
              description="Notify 30, 14, and 7 days before lease end."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Overdue rent alerts"
              description="Flag missed or partial collections immediately."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Maintenance escalation alerts"
              description="Notify when issues are marked urgent or unresolved."
              control={<Switch defaultChecked className="shrink-0" />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="documents">
          <DashboardSettingsSection
            title="Documents and Verification"
            description="Keep ownership and compliance records current."
          >
            <DashboardSettingsRow
              label="Ownership verification"
              description="National ID and title deed currently on file."
              control={<DashboardStatusBadge tone="success">Verified</DashboardStatusBadge>}
            />
            <DashboardSettingsRow
              label="Property compliance documents"
              description="Track expiring C of O, tax receipts, and inspection records."
              control={<Button variant="outline" size="sm" className="shrink-0"><Shield className="h-3.5 w-3.5 mr-1.5" /> Review</Button>}
            />
            <DashboardSettingsRow
              label="Maintenance vendor files"
              description="Store invoices, receipts, and service reports per issue."
              control={<Button variant="outline" size="sm" className="shrink-0"><Wrench className="h-3.5 w-3.5 mr-1.5" /> Manage</Button>}
            />
            <DashboardSettingsRow
              label="Expiry reminders"
              description="Get alerted before compliance certificates, tenancy files, or receipts lapse."
              control={<Switch defaultChecked className="shrink-0" />}
            />
          </DashboardSettingsSection>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <DashboardSettingsSection
            title="Security"
            description="Protect your landlord account, payment access, and portfolio controls."
          >
            <DashboardSettingsRow
              label="Change Password"
              description="Last updated 12 days ago."
              control={<Button variant="outline" size="sm" className="shrink-0">Update</Button>}
            />
            <DashboardSettingsRow
              label="Two-Factor Authentication"
              description="Require a second verification step for sign-in and rent disbursement changes."
              control={<Button variant="outline" size="sm" className="shrink-0">Enable</Button>}
            />
            <DashboardSettingsRow
              label="Login notifications"
              description="Alert when a new browser or device accesses your portfolio."
              control={<Switch defaultChecked className="shrink-0" />}
            />
            <DashboardSettingsRow
              label="Require approval for bank detail changes"
              description="Pause disbursement updates until you confirm them by email."
              control={<Switch defaultChecked className="shrink-0" />}
            />
          </DashboardSettingsSection>

          <DashboardSettingsSection
            title="Danger Zone"
            description="Take care with irreversible account actions."
            className="border-destructive/30"
          >
            <DashboardSettingsRow
              label="Delete Account"
              description="Permanently remove your landlord account, portfolio history, and rent collection records."
              control={<Button variant="destructive" size="sm" className="shrink-0">Delete Account</Button>}
            />
          </DashboardSettingsSection>
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
