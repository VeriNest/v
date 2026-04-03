import { Search, MoreHorizontal, ShieldCheck, Clock, ShieldX, UserPlus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const users = [
  { id: "U-001", name: "Adebayo Johnson", email: "adebayo@mail.com", role: "Agent", verification: "Verified", joined: "Jan 10, 2024", activity: "Active now" },
  { id: "U-002", name: "Chioma Okafor", email: "chioma@mail.com", role: "Landlord", verification: "Pending", joined: "Feb 15, 2024", activity: "2h ago" },
  { id: "U-003", name: "Emeka Nwankwo", email: "emeka@mail.com", role: "Tenant", verification: "Verified", joined: "Jan 22, 2024", activity: "1d ago" },
  { id: "U-004", name: "Fatima Abdullahi", email: "fatima@mail.com", role: "Tenant", verification: "Unverified", joined: "Mar 01, 2024", activity: "5m ago" },
  { id: "U-005", name: "Oluwaseun Bakare", email: "seun@mail.com", role: "Agent", verification: "Verified", joined: "Nov 05, 2023", activity: "3h ago" },
  { id: "U-006", name: "Ibrahim Yusuf", email: "ibrahim@mail.com", role: "Landlord", verification: "Pending", joined: "Feb 28, 2024", activity: "Active now" },
];

const verificationStyles: Record<string, { icon: typeof ShieldCheck; color: string; bg: string }> = {
  Verified: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  Unverified: { icon: ShieldX, color: "text-destructive", bg: "bg-destructive/5" },
};

const roleStyles: Record<string, string> = {
  Agent: "bg-primary/10 text-primary border-primary/20",
  Landlord: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Tenant: "bg-muted text-muted-foreground border-border",
};

const avatarColors: Record<string, string> = {
  Agent: "bg-primary/10 text-primary",
  Landlord: "bg-blue-500/10 text-blue-600",
  Tenant: "bg-muted text-muted-foreground",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users & Providers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage tenants, agents, and landlords on the platform.</p>
        </div>
        <Button size="sm" className="gap-2"><UserPlus className="h-4 w-4" /> Invite User</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: "18,392", sub: "+312 this month", accent: "text-foreground" },
          { label: "Verified", value: "14,208", sub: "77.2%", accent: "text-emerald-600" },
          { label: "Pending KYC", value: "2,847", sub: "6 urgent", accent: "text-amber-600" },
          { label: "Suspended", value: "142", sub: "3 new this week", accent: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.accent}`}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({users.length})</TabsTrigger>
          <TabsTrigger value="agents" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Agents</TabsTrigger>
          <TabsTrigger value="landlords" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Landlords</TabsTrigger>
          <TabsTrigger value="tenants" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Tenants</TabsTrigger>
        </TabsList>

        {["all", "agents", "landlords", "tenants"].map((tab) => {
          const roleMap: Record<string, string> = { agents: "Agent", landlords: "Landlord", tenants: "Tenant" };
          const items = tab === "all" ? users : users.filter(u => u.role === roleMap[tab]);
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div><CardTitle className="text-base">Users</CardTitle><CardDescription>Showing {items.length} users</CardDescription></div>
                    <div className="flex items-center gap-3">
                      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9 w-[200px] h-9" /></div>
                      <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filter</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">User</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Role</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Verification</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Last Active</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Joined</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((u) => {
                        const vStyle = verificationStyles[u.verification];
                        const VIcon = vStyle.icon;
                        return (
                          <TableRow key={u.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-9 w-9 border border-border/60">
                                    <AvatarFallback className={`text-xs font-medium ${avatarColors[u.role]}`}>
                                      {u.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  {u.activity === "Active now" && (
                                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">{u.name}</p>
                                  <p className="text-xs text-muted-foreground">{u.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleStyles[u.role]}`}>{u.role}</span>
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${vStyle.bg} ${vStyle.color}`}>
                                <VIcon className="h-3.5 w-3.5" />{u.verification}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`text-sm ${u.activity === "Active now" ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}>{u.activity}</span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{u.joined}</TableCell>
                            <TableCell><Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
