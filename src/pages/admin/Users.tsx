import { Search, MoreHorizontal, ShieldCheck, Clock, ShieldX, UserPlus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const users = [
  { id: "U-001", name: "Adebayo Johnson", email: "adebayo@mail.com", role: "Agent", verification: "Verified", joined: "2024-01-10", activity: "Active now" },
  { id: "U-002", name: "Chioma Okafor", email: "chioma@mail.com", role: "Landlord", verification: "Pending", joined: "2024-02-15", activity: "2h ago" },
  { id: "U-003", name: "Emeka Nwankwo", email: "emeka@mail.com", role: "Tenant", verification: "Verified", joined: "2024-01-22", activity: "1d ago" },
  { id: "U-004", name: "Fatima Abdullahi", email: "fatima@mail.com", role: "Tenant", verification: "Unverified", joined: "2024-03-01", activity: "5m ago" },
  { id: "U-005", name: "Oluwaseun Bakare", email: "seun@mail.com", role: "Agent", verification: "Verified", joined: "2023-11-05", activity: "3h ago" },
  { id: "U-006", name: "Ibrahim Yusuf", email: "ibrahim@mail.com", role: "Landlord", verification: "Pending", joined: "2024-02-28", activity: "Active now" },
];

const verificationStyles: Record<string, { icon: typeof ShieldCheck; color: string; bg: string }> = {
  Verified: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  Unverified: { icon: ShieldX, color: "text-red-500", bg: "bg-red-50" },
};

const roleStyles: Record<string, string> = {
  Agent: "bg-primary/10 text-primary border-primary/20",
  Landlord: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Tenant: "bg-slate-100 text-slate-600 border-slate-200",
};

const avatarColors: Record<string, string> = {
  Agent: "bg-primary/10 text-primary",
  Landlord: "bg-blue-500/10 text-blue-600",
  Tenant: "bg-slate-100 text-slate-600",
};

const summaryCards = [
  { label: "Total Users", value: "18,392", sub: "+312 this month", color: "text-primary", bg: "bg-primary/10", progress: 85 },
  { label: "Verified", value: "14,208", sub: "77.2% verified", color: "text-emerald-600", bg: "bg-emerald-500/10", progress: 77 },
  { label: "Pending KYC", value: "2,847", sub: "6 urgent reviews", color: "text-amber-600", bg: "bg-amber-500/10", progress: 45 },
  { label: "Suspended", value: "142", sub: "3 new this week", color: "text-red-600", bg: "bg-red-500/10", progress: 8 },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Users & Providers</h2>
          <p className="text-muted-foreground">Manage tenants, agents, and landlords</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1 mb-2">{c.sub}</p>
              <Progress value={c.progress} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg">All Users</CardTitle>
              <CardDescription>Showing 6 of 18,392 users</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9 w-[260px]" />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
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
              {users.map((u) => {
                const vStyle = verificationStyles[u.verification];
                const VIcon = vStyle.icon;
                return (
                  <TableRow key={u.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                            <AvatarFallback className={`text-xs font-medium ${avatarColors[u.role]}`}>
                              {u.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {u.activity === "Active now" && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleStyles[u.role]}`}>
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${vStyle.bg} ${vStyle.color}`}>
                        <VIcon className="h-3.5 w-3.5" />
                        {u.verification}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${u.activity === "Active now" ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}>
                        {u.activity}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{u.joined}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
