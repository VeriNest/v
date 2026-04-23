import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone, Plus, Send, Clock, Users,
  AlertTriangle, Info, Eye
} from "lucide-react";
import { adminApi } from "@/lib/api";

const typeConfig: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  info: { icon: Info, color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/15 dark:border-blue-500/30" },
  warning: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-300", bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30" },
  critical: { icon: AlertTriangle, color: "text-red-600 dark:text-red-300", bg: "bg-red-500/10 border-red-500/20 dark:bg-red-500/15 dark:border-red-500/30" },
};

const statusConfig: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  draft: "bg-muted text-muted-foreground border-border/60",
};

function audienceLabel(value?: string | null) {
  if (!value) return "All Users";
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

// Export for dashboard-search.ts
export const announcements = [] as any[];

export default function AdminAnnouncements() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data = [] } = useQuery({ queryKey: ["/admin/announcements"], queryFn: () => adminApi.announcements() });

  const announcements = useMemo(() => data.map((item: any) => ({
    id: String(item.id),
    title: item.title ?? "Announcement",
    message: item.body ?? "",
    audience: audienceLabel(item.audience),
    type: String(item.type ?? "info").toLowerCase(),
    status: String(item.status ?? "published").toLowerCase(),
    date: item.created_at || item.createdAt ? new Date(String(item.created_at ?? item.createdAt)).toLocaleDateString() : "",
  })), [data]);

  const stats = [
    { label: "Total Sent", value: String(announcements.length), icon: Send, iconBg: "bg-primary/10", accent: "text-primary" },
    { label: "Active", value: String(announcements.filter((item) => item.status === "published").length), icon: Megaphone, iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15", accent: "text-emerald-600 dark:text-emerald-300" },
    { label: "Drafts", value: String(announcements.filter((item) => item.status === "draft").length), icon: Clock, iconBg: "bg-amber-500/10 dark:bg-amber-500/15", accent: "text-amber-600 dark:text-amber-300" },
    { label: "Notifications", value: String(announcements.filter((item) => item.status === "published").length), icon: Eye, iconBg: "bg-blue-500/10 dark:bg-blue-500/15", accent: "text-blue-600 dark:text-blue-300" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">Send in-app notifications to the selected audience.</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5 text-sm" asChild>
          <Link to="/admin/announcements/new">
            <Plus className="h-3.5 w-3.5" /> New Announcement
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className={`text-xl font-bold leading-tight ${s.accent}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">All</TabsTrigger>
          <TabsTrigger value="published" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Published</TabsTrigger>
          <TabsTrigger value="drafts" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Drafts</TabsTrigger>
        </TabsList>

        {["all", "published", "drafts"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {announcements
              .filter((a) => tab === "all" || (tab === "published" && a.status === "published") || (tab === "drafts" && a.status === "draft"))
              .map((a) => {
                const t = typeConfig[a.type] ?? typeConfig.info;
                const TypeIcon = t.icon;
                const expanded = expandedId === a.id;
                const shouldClamp = a.message.length > 160;
                return (
                  <Card key={a.id} className="border border-border/60 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`h-9 w-9 rounded-lg ${t.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
                            <TypeIcon className={`h-4 w-4 ${t.color}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-foreground">{a.title}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig[a.status] ?? statusConfig.draft}`}>{audienceLabel(a.status)}</span>
                            </div>
                            <p className={`text-xs text-muted-foreground mt-1 ${expanded ? "" : "line-clamp-2"}`}>{a.message}</p>
                            {shouldClamp ? (
                              <button
                                type="button"
                                className="mt-2 text-xs font-medium text-primary"
                                onClick={() => setExpandedId(expanded ? null : a.id)}
                              >
                                {expanded ? "Collapse" : "Expand"}
                              </button>
                            ) : null}
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{a.audience}</span>
                              <span>{a.date}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{a.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
