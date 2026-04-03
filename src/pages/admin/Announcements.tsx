import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Megaphone, Plus, Send, Clock, CheckCircle2, Users, Building2,
  AlertTriangle, Info, Trash2, Edit, Eye
} from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Platform Maintenance - March 30th",
    message: "We'll be performing scheduled maintenance on March 30th from 2:00 AM to 6:00 AM WAT. The platform may experience brief downtime.",
    audience: "All Users",
    type: "warning",
    status: "Published",
    date: "Mar 20, 2024",
    views: 1284,
  },
  {
    id: 2,
    title: "New Escrow Feature Launched",
    message: "We're excited to announce our enhanced escrow system with faster settlement times and better security.",
    audience: "Providers",
    type: "info",
    status: "Published",
    date: "Mar 18, 2024",
    views: 842,
  },
  {
    id: 3,
    title: "Updated Commission Structure",
    message: "Starting April 1st, platform commission will be reduced to 4.5% for verified agents with 10+ completed bookings.",
    audience: "Agents",
    type: "info",
    status: "Draft",
    date: "Mar 22, 2024",
    views: 0,
  },
  {
    id: 4,
    title: "Fraud Alert — Fake Listings Detected",
    message: "We've identified several fraudulent listings in the Lekki area. All affected listings have been removed and accounts suspended.",
    audience: "All Users",
    type: "critical",
    status: "Published",
    date: "Mar 15, 2024",
    views: 2103,
  },
];

const typeConfig: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  critical: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const statusConfig: Record<string, string> = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-muted text-muted-foreground border-border/60",
};

const stats = [
  { label: "Total Sent", value: "47", icon: Send, iconBg: "bg-primary/10", accent: "text-primary" },
  { label: "Active", value: "3", icon: Megaphone, iconBg: "bg-emerald-50", accent: "text-emerald-600" },
  { label: "Drafts", value: "2", icon: Clock, iconBg: "bg-amber-50", accent: "text-amber-600" },
  { label: "Total Views", value: "12.4K", icon: Eye, iconBg: "bg-blue-50", accent: "text-blue-600" },
];

export default function AdminAnnouncements() {
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">Broadcast messages and alerts to platform users</p>
        </div>
        <Button size="sm" className="h-9 gap-1.5 text-sm" onClick={() => setShowCompose(!showCompose)}>
          <Plus className="h-3.5 w-3.5" /> New Announcement
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

      {showCompose && (
        <Card className="border border-primary/20 shadow-sm bg-primary/[0.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" /> Compose Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input placeholder="Announcement title..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Audience</label>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="seekers">Seekers Only</SelectItem>
                      <SelectItem value="providers">Providers Only</SelectItem>
                      <SelectItem value="agents">Agents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <Select defaultValue="info">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea placeholder="Write your announcement..." rows={3} />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Switch />
                <span className="text-sm text-muted-foreground">Send push notification</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setShowCompose(false)}>Cancel</Button>
                <Button variant="outline" size="sm" className="gap-1"><Clock className="h-3 w-3" /> Save Draft</Button>
                <Button size="sm" className="gap-1"><Send className="h-3 w-3" /> Publish</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">All</TabsTrigger>
          <TabsTrigger value="published" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Published</TabsTrigger>
          <TabsTrigger value="drafts" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm px-4">Drafts</TabsTrigger>
        </TabsList>

        {["all", "published", "drafts"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {announcements
              .filter((a) => tab === "all" || (tab === "published" && a.status === "Published") || (tab === "drafts" && a.status === "Draft"))
              .map((a) => {
                const t = typeConfig[a.type];
                const TypeIcon = t.icon;
                return (
                  <Card key={a.id} className="border border-border/60 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`h-9 w-9 rounded-lg ${t.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
                            <TypeIcon className={`h-4 w-4 ${t.color}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-foreground">{a.title}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig[a.status]}`}>{a.status}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.message}</p>
                            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{a.audience}</span>
                              <span>{a.date}</span>
                              {a.views > 0 && <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{a.views.toLocaleString()} views</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                        </div>
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
