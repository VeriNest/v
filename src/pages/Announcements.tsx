import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronLeft, Megaphone, ShieldCheck, Sparkles, Users } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { announcementsApi, type AnnouncementItem } from "@/lib/api";

function audienceLabel(value?: string | null) {
  switch (String(value ?? "").toLowerCase()) {
    case "seekers":
      return "Seekers";
    case "agents":
      return "Agents";
    case "landlords":
      return "Landlords";
    case "admins":
      return "Admins";
    case "providers":
      return "Providers";
    default:
      return "All Users";
  }
}

function audienceIcon(value?: string | null) {
  switch (String(value ?? "").toLowerCase()) {
    case "seekers":
      return ShieldCheck;
    case "agents":
    case "landlords":
    case "providers":
      return Sparkles;
    case "admins":
      return Megaphone;
    default:
      return Users;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "Just now";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const announcementId = params.id ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["/announcements"],
    queryFn: () => announcementsApi.list({ page: 1, per_page: 100 }),
    staleTime: 2 * 60 * 1000,
  });

  const { data: selectedAnnouncement } = useQuery({
    queryKey: ["/announcements", announcementId],
    queryFn: () => announcementsApi.get(announcementId),
    enabled: Boolean(announcementId),
    staleTime: 2 * 60 * 1000,
  });

  const announcements = data?.items ?? [];
  const selected = useMemo<AnnouncementItem | null>(() => {
    if (selectedAnnouncement) return selectedAnnouncement;
    if (announcementId) {
      return announcements.find((item) => item.id === announcementId) ?? null;
    }
    return announcements[0] ?? null;
  }, [announcementId, announcements, selectedAnnouncement]);

  const selectedIcon = audienceIcon(selected?.audience);
  const SelectedIcon = selectedIcon;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Announcements"
        description="Read the announcements that were sent to your role."
        badge={
          <Badge variant="outline" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            {announcements.length} live
          </Badge>
        }
        actions={
          announcementId ? (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/announcements")}>
              <ChevronLeft className="h-4 w-4" />
              All announcements
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="space-y-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Latest updates</p>
                <p className="text-xs text-muted-foreground">Announcements published for your account role.</p>
              </div>
              <Badge variant="secondary">{announcements.length}</Badge>
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                Loading announcements...
              </div>
            ) : announcements.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                No announcements available right now.
              </div>
            ) : (
              <div className="space-y-2">
                {announcements.map((item) => {
                  const isActive = item.id === selected?.id;
                  const Icon = audienceIcon(item.audience);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(`/announcements/${item.id}`)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? "border-primary/30 bg-primary/5 shadow-sm"
                          : "border-border/60 bg-background/50 hover:border-primary/20 hover:bg-background"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em]">
                              {audienceLabel(item.audience)}
                            </Badge>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {item.body}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                            <span>{formatDate(item.publishedAt ?? item.createdAt)}</span>
                            <span>•</span>
                            <span>{String(item.createdByName ?? "Verinest")}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardContent className="space-y-4 p-4 sm:p-5">
            {selected ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <SelectedIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground">{selected.title}</h2>
                      <Badge variant="secondary">{audienceLabel(selected.audience)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Published {formatDate(selected.publishedAt ?? selected.createdAt)} by {selected.createdByName ?? "Verinest"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="uppercase tracking-[0.18em] text-[10px]">
                    {selected.status}
                  </Badge>
                  {selected.createdByRole ? (
                    <Badge variant="outline" className="uppercase tracking-[0.18em] text-[10px]">
                      {selected.createdByRole}
                    </Badge>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{selected.body}</p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                {isLoading ? "Loading announcement..." : "Select an announcement to read it here."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
