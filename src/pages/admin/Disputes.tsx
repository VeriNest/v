import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Filter,
  Flame,
  MapPin,
  MoreHorizontal,
  Search,
  Shield,
  User,
} from "lucide-react";

import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { InlineSpinner } from "@/components/Loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminApi } from "@/lib/api";

const priorityStyles: Record<string, { color: string; bg: string; dot: string }> = {
  critical: { color: "text-background", bg: "bg-destructive", dot: "bg-background" },
  high: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
  medium: { color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30", dot: "bg-amber-500" },
  low: { color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/15 dark:border-emerald-500/30", dot: "bg-emerald-500" },
};

const statusStyles: Record<string, string> = {
  open: "bg-destructive/10 text-destructive border-destructive/20",
  in_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  escalated: "bg-primary/10 text-primary border-primary/20",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-border",
};

const typeIcon: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  fraud: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/5" },
  quality: { icon: AlertCircle, color: "text-amber-500 dark:text-amber-300", bg: "bg-amber-500/10 dark:bg-amber-500/15" },
  cancellation: { icon: FileWarning, color: "text-blue-500 dark:text-blue-300", bg: "bg-blue-500/10 dark:bg-blue-500/15" },
  payment: { icon: Shield, color: "text-violet-500 dark:text-violet-300", bg: "bg-violet-500/10 dark:bg-violet-500/15" },
  impersonation: { icon: AlertTriangle, color: "text-rose-500 dark:text-rose-300", bg: "bg-rose-500/10 dark:bg-rose-500/15" },
  listing_misrepresentation: { icon: FileWarning, color: "text-orange-500 dark:text-orange-300", bg: "bg-orange-500/10 dark:bg-orange-500/15" },
};

function titleCase(value?: string | null) {
  if (!value) return "Unknown";
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Disputes() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "open" | "review" | "resolved">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["/admin/disputes"],
    queryFn: () => adminApi.disputes(),
  });

  const rows = data?.items ?? [];
  const cases = useMemo(
    () =>
      rows.map((item: any) => ({
        id: String(item.id),
        reference: String(item.reference ?? ""),
        title: String(item.title ?? "Dispute"),
        type: String(item.type ?? "quality").toLowerCase(),
        priority: String(item.priority ?? "medium").toLowerCase(),
        status: String(item.status ?? "open").toLowerCase(),
        reporter: String(item.reporter_name ?? item.reporterName ?? "Unknown"),
        reporterEmail: String(item.reporter_email ?? item.reporterEmail ?? ""),
        assigned: String(item.assigned_admin_name ?? item.assignedAdminName ?? "Unassigned"),
        subject: String(item.subject_name ?? item.subjectName ?? ""),
        propertyTitle: String(item.property_title ?? item.propertyTitle ?? ""),
        propertyLocation: String(item.property_location ?? item.propertyLocation ?? ""),
        description: String(item.description ?? ""),
        date: item.created_at ? new Date(String(item.created_at)).toLocaleDateString() : "",
        createdAt: item.created_at ? new Date(String(item.created_at)).toLocaleString() : "",
      })),
    [rows],
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return cases.filter((item) => {
      const matchesTab =
        tab === "all" ? true : tab === "open" ? ["open", "escalated"].includes(item.status) : tab === "review" ? item.status === "in_review" : ["resolved", "closed"].includes(item.status);
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.type.toLowerCase().includes(normalizedSearch) ||
        item.reference.toLowerCase().includes(normalizedSearch) ||
        item.reporter.toLowerCase().includes(normalizedSearch) ||
        item.propertyTitle.toLowerCase().includes(normalizedSearch);
      return matchesTab && matchesSearch;
    });
  }, [cases, search, tab]);

  const stats = {
    open: cases.filter((item) => item.status === "open").length,
    inReview: cases.filter((item) => item.status === "in_review").length,
    escalated: cases.filter((item) => item.status === "escalated").length,
    resolved: cases.filter((item) => ["resolved", "closed"].includes(item.status)).length,
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Disputes & Cases"
        description="Handle conflict-resolution cases separately from moderation reports, with clear dispute-type tags."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Open", value: stats.open, icon: Flame, accent: "text-destructive", bg: "bg-destructive/10" },
          { label: "In Review", value: stats.inReview, icon: Shield, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Escalated", value: stats.escalated, icon: AlertTriangle, accent: "text-primary", bg: "bg-primary/10" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
        ].map((card) => (
          <Card key={card.label} className="border border-border/60 shadow-sm">
            <CardContent className="flex items-start gap-2 p-3 sm:gap-3 sm:p-4">
              <div className={`rounded-lg ${card.bg} p-1.5 sm:p-2 shrink-0`}>
                <card.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${card.accent}`} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground sm:text-xs">{card.label}</p>
                <p className={`text-lg font-bold sm:text-xl ${card.accent}`}>{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)} className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({cases.length})</TabsTrigger>
              <TabsTrigger value="open" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Open ({cases.filter((item) => ["open", "escalated"].includes(item.status)).length})</TabsTrigger>
              <TabsTrigger value="review" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Review ({stats.inReview})</TabsTrigger>
              <TabsTrigger value="resolved" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Resolved ({stats.resolved})</TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  className="pl-9 w-full min-w-0 h-9 lg:w-[220px]"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5">
                <Filter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span>
              </Button>
            </>
          }
        />

        <TabsContent value={tab}>
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dispute Cases</CardTitle>
              <CardDescription>{filtered.length} live backend disputes</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
              {isLoading ? (
                <div className="flex h-36 items-center justify-center">
                  <InlineSpinner variant="solid" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No disputes found.
                </div>
              ) : (
                <>
                  <div className="sm:hidden space-y-3">
                    {filtered.map((item) => {
                      const priority = priorityStyles[item.priority] ?? priorityStyles.medium;
                      const caseType = typeIcon[item.type] ?? typeIcon.quality;
                      const TypeIcon = caseType.icon;
                      return (
                        <div key={item.id} className="p-3 rounded-lg border border-border/40 bg-background space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground leading-tight">{item.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{item.reference} · {item.reporter}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">Dispute</Badge>
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${caseType.bg} ${caseType.color}`}>
                              <TypeIcon className="h-3 w-3" />{titleCase(item.type)}
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${priority.bg} ${priority.color}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />{titleCase(item.priority)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyles[item.status] ?? statusStyles.open}`}>{titleCase(item.status)}</span>
                          </div>
                          {item.propertyTitle ? (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.propertyTitle}{item.propertyLocation ? ` · ${item.propertyLocation}` : ""}
                            </p>
                          ) : null}
                          <p className="text-xs text-muted-foreground">{item.createdAt}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/60">
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Case</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Tag</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Priority</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Status</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Assigned</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Date</th>
                          <th className="py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((item) => {
                          const priority = priorityStyles[item.priority] ?? priorityStyles.medium;
                          const caseType = typeIcon[item.type] ?? typeIcon.quality;
                          const TypeIcon = caseType.icon;
                          return (
                            <tr key={item.id} className="border-b border-border/40">
                              <td className="py-3 px-4">
                                <div className="max-w-[260px]">
                                  <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                                  <p className="text-xs text-muted-foreground">{item.reference} · {item.reporter}</p>
                                  {item.propertyTitle ? (
                                    <p className="text-xs text-muted-foreground mt-1">{item.propertyTitle}</p>
                                  ) : null}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline">Dispute</Badge>
                                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${caseType.bg} ${caseType.color}`}>
                                    <TypeIcon className="h-3.5 w-3.5" />{titleCase(item.type)}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />{titleCase(item.priority)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[item.status] ?? statusStyles.open}`}>{titleCase(item.status)}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-sm ${item.assigned === "Unassigned" ? "text-destructive font-medium" : "text-muted-foreground"}`}>{item.assigned}</span>
                              </td>
                              <td className="text-muted-foreground text-sm py-3 px-4">{item.date}</td>
                              <td className="py-3 px-4">
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
