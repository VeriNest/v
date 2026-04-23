import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MoreHorizontal, ShieldCheck, Clock, ShieldX, UserPlus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { adminApi, titleCase } from "@/lib/api";

export const users = [] as any[];

const verificationStyles: Record<string, { icon: typeof ShieldCheck; color: string; bg: string }> = {
  Verified: { icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-300", bg: "bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-500/15 dark:border-emerald-500/30" },
  Pending: { icon: Clock, color: "text-amber-600 dark:text-amber-300", bg: "bg-amber-500/10 border border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30" },
  Unverified: { icon: ShieldX, color: "text-destructive", bg: "bg-destructive/10 border border-destructive/20" },
};

const roleStyles: Record<string, string> = {
  Agent: "bg-primary/10 text-primary border-primary/20",
  Landlord: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
  Tenant: "bg-muted text-muted-foreground border-border",
};

const avatarColors: Record<string, string> = {
  Agent: "bg-primary/10 text-primary",
  Landlord: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  Tenant: "bg-muted text-muted-foreground",
};

function normalizeRole(value?: string | null) {
  const role = titleCase(value ?? "seeker");
  if (role === "Seeker" || role === "Unassigned") return "Tenant";
  if (role === "Admin") return "Admin";
  return role;
}

function normalizeVerification(value?: string | null, emailVerified?: boolean) {
  const status = String(value ?? "").toLowerCase();
  if (["verified", "approved"].includes(status)) return "Verified";
  if (["submitted", "pending", "in_review"].includes(status)) return "Pending";
  if (emailVerified) return "Verified";
  return "Unverified";
}

function verificationStyleFor(value: string) {
  return verificationStyles[value] ?? verificationStyles.Unverified;
}

function roleStyleFor(value: string) {
  return roleStyles[value] ?? "bg-muted text-muted-foreground border-border";
}

function avatarColorFor(value: string) {
  return avatarColors[value] ?? "bg-muted text-muted-foreground";
}

export default function UsersPage() {
  useSearchFocus();
  const [search, setSearch] = useState("");
  const { data = [] } = useQuery({ queryKey: ["/admin/users"], queryFn: () => adminApi.users() });
  const users = useMemo(() => data.map((u: any) => {
    const role = normalizeRole(u.role);
    return {
      id: u.id,
      name: u.full_name ?? "User",
      email: u.email ?? "",
      avatarUrl: u.avatar_url ?? u.avatarUrl ?? null,
      role,
      verification: normalizeVerification(u.verification_status, u.email_verified),
      joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
      activity: u.is_banned ? "Suspended" : "Active now",
    };
  }), [data]);
  const stats = useMemo(() => ({
    total: users.length,
    verified: users.filter((item) => item.verification === "Verified").length,
    pending: users.filter((item) => item.verification === "Pending").length,
    suspended: users.filter((item) => item.activity === "Suspended").length,
  }), [users]);
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users & Providers"
        description="Manage tenants, agents, and landlords on the platform."
        actions={<Button size="sm" className="gap-2"><UserPlus className="h-4 w-4" /> Invite User</Button>}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: String(stats.total), sub: "Live total", accent: "text-foreground" },
          { label: "Verified", value: String(stats.verified), sub: `${stats.total ? Math.round((stats.verified / stats.total) * 100) : 0}%`, accent: "text-emerald-600" },
          { label: "Pending KYC", value: String(stats.pending), sub: "Needs review", accent: "text-amber-600" },
          { label: "Suspended", value: String(stats.suspended), sub: "Banned accounts", accent: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-lg sm:text-xl font-bold mt-0.5 ${s.accent}`}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="agents" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Agents</TabsTrigger>
              <TabsTrigger value="landlords" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Landlords</TabsTrigger>
              <TabsTrigger value="tenants" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Tenants</TabsTrigger>
            </TabsList>
          }
        />

        {["all", "agents", "landlords", "tenants"].map((tab) => {
          const roleMap: Record<string, string> = { agents: "Agent", landlords: "Landlord", tenants: "Tenant" };
          const items = tab === "all" ? filtered : filtered.filter(u => u.role === roleMap[tab]);
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <DashboardControlRow
                    left={<div><CardTitle className="text-base">Users</CardTitle><CardDescription>Showing {items.length} users</CardDescription></div>}
                    right={
                      <>
                        <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9 w-full min-w-0 h-9 lg:w-[220px]" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                        <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5"><Filter className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span></Button>
                      </>
                    }
                  />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  {/* Mobile card list */}
                  <div className="sm:hidden space-y-3">
                    {items.map((u) => {
                      const vStyle = verificationStyleFor(u.verification);
                      const VIcon = vStyle.icon;
                      return (
                        <div key={u.id} data-search-id={`admin-user-${u.id}`} className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-background">
                          <div className="relative shrink-0">
                            <Avatar className="h-9 w-9 border border-border/60">
                              {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} className="h-full w-full rounded-full object-cover" /> : (
                                <AvatarFallback className={`text-xs font-medium ${avatarColorFor(u.role)}`}>
                                  {u.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            {u.activity === "Active now" && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{u.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${roleStyleFor(u.role)}`}>{u.role}</span>
                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${vStyle.bg} ${vStyle.color}`}>
                                <VIcon className="h-3 w-3" />{u.verification}
                              </div>
                              <span className={`text-[10px] ${u.activity === "Active now" ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}>{u.activity}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/60">
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">User</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Role</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Verification</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Last Active</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Joined</th>
                          <th className="py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((u) => {
                          const vStyle = verificationStyleFor(u.verification);
                          const VIcon = vStyle.icon;
                          return (
                            <tr key={u.id} data-search-id={`admin-user-${u.id}`} className="border-b border-border/40">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <Avatar className="h-9 w-9 border border-border/60">
                                      {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} className="h-full w-full rounded-full object-cover" /> : (
                                        <AvatarFallback className={`text-xs font-medium ${avatarColorFor(u.role)}`}>
                                          {u.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                      )}
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
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleStyleFor(u.role)}`}>{u.role}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${vStyle.bg} ${vStyle.color}`}>
                                  <VIcon className="h-3.5 w-3.5" />{u.verification}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-sm ${u.activity === "Active now" ? "text-emerald-600 font-medium" : "text-muted-foreground"}`}>{u.activity}</span>
                              </td>
                              <td className="text-muted-foreground text-sm py-3 px-4">{u.joined}</td>
                              <td className="py-3 px-4"><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
