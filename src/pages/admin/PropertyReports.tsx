import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Calendar, FileWarning, Filter, MapPin, Search, User } from "lucide-react";
import { toast } from "sonner";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { InlineSpinner } from "@/components/Loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminApi } from "@/lib/api";
import { useSearchFocus } from "@/hooks/use-search-focus";

const statusStyles: Record<string, string> = {
  open: "bg-destructive/10 text-destructive border-destructive/20",
  upheld: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  dismissed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
};

const propertyStatusStyles: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  hidden: "bg-muted text-muted-foreground border-border",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
  verified: "bg-primary/10 text-primary border-primary/20",
};

function titleCase(value?: string | null) {
  if (!value) return "Unknown";
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PropertyReports() {
  useSearchFocus();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "upheld" | "dismissed">("all");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [decision, setDecision] = useState<"dismissed" | "upheld">("upheld");
  const [propertyAction, setPropertyAction] = useState<"" | "hide" | "suspend">("hide");

  const { data, isLoading } = useQuery({
    queryKey: ["/admin/reports"],
    queryFn: () => adminApi.reports(),
  });
  const rows = data?.items ?? [];

  const propertyReports = useMemo(
    () => rows.filter((report: any) => report.property_id || report.propertyId),
    [rows],
  );

  const filteredReports = useMemo(() => {
    return propertyReports.filter((report: any) => {
      const propertyTitle = String(report.property_title ?? report.propertyTitle ?? "Property").toLowerCase();
      const reporter = String(report.reporter_name ?? report.reporterName ?? "").toLowerCase();
      const reason = String(report.reason ?? "").toLowerCase();
      const details = String(report.details ?? "").toLowerCase();
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        propertyTitle.includes(normalizedSearch) ||
        reporter.includes(normalizedSearch) ||
        reason.includes(normalizedSearch) ||
        details.includes(normalizedSearch);
      const reportStatus = String(report.status ?? "open").toLowerCase();
      const matchesStatus = filterStatus === "all" || reportStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [filterStatus, propertyReports, search]);

  const moderationMutation = useMutation({
    mutationFn: (reportId: string) =>
      adminApi.moderateReport(reportId, {
        status: decision,
        reviewNotes,
        propertyAction: decision === "upheld" ? propertyAction || undefined : undefined,
      }),
    onSuccess: () => {
      toast.success("Report decision saved");
      setSelectedReport(null);
      setReviewNotes("");
      setDecision("upheld");
      setPropertyAction("hide");
      queryClient.invalidateQueries({ queryKey: ["/admin/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/admin/properties"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to moderate report";
      toast.error(message);
    },
  });

  const stats = {
    total: propertyReports.length,
    open: propertyReports.filter((report: any) => String(report.status).toLowerCase() === "open").length,
    upheld: propertyReports.filter((report: any) => String(report.status).toLowerCase() === "upheld").length,
    dismissed: propertyReports.filter((report: any) => String(report.status).toLowerCase() === "dismissed").length,
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Property Issue Reports"
        description="Review seeker-submitted property issues and hide or suspend listings when necessary."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total reports", value: stats.total, tone: "text-foreground" },
          { label: "Open", value: stats.open, tone: "text-destructive" },
          { label: "Upheld", value: stats.upheld, tone: "text-amber-700" },
          { label: "Dismissed", value: stats.dismissed, tone: "text-emerald-700" },
        ].map((item) => (
          <Card key={item.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`mt-1 text-2xl font-bold ${item.tone}`}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as typeof filterStatus)} className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto bg-muted/50 p-1">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="open">Open ({stats.open})</TabsTrigger>
              <TabsTrigger value="upheld">Upheld ({stats.upheld})</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed ({stats.dismissed})</TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search property, reporter, or issue..."
                  className="h-9 w-full min-w-0 pl-9 lg:w-[280px]"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
            </>
          }
        />

        <TabsContent value={filterStatus} className="space-y-4">
          {isLoading ? (
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="flex h-36 items-center justify-center">
                <InlineSpinner variant="solid" />
              </CardContent>
            </Card>
          ) : filteredReports.length === 0 ? (
            <Card className="border border-dashed">
              <CardContent className="p-8 text-center">
                <AlertCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No property reports found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report: any) => {
              const reportStatus = String(report.status ?? "open").toLowerCase();
              const propertyStatus = String(report.property_status ?? report.propertyStatus ?? "published").toLowerCase();
              const canModerate = reportStatus === "open";
              return (
                <Card key={String(report.id)} className="border border-border/60 shadow-sm">
                  <CardContent className="space-y-4 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-foreground">
                            {String(report.property_title ?? report.propertyTitle ?? "Property")}
                          </h3>
                          <Badge variant="outline" className={statusStyles[reportStatus] ?? statusStyles.open}>
                            {titleCase(reportStatus)}
                          </Badge>
                          <Badge variant="outline" className={propertyStatusStyles[propertyStatus] ?? propertyStatusStyles.verified}>
                            Listing: {titleCase(propertyStatus)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {String(report.property_location ?? report.propertyLocation ?? "Unknown location")}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Reporter: {String(report.reporter_name ?? report.reporterName ?? "Unknown")}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.created_at ? new Date(String(report.created_at)).toLocaleString() : "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{titleCase(String(report.violation_type ?? "other"))}</Badge>
                        <Badge variant="outline">Reason: {String(report.reason ?? "Issue")}</Badge>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-secondary/15 p-3 text-sm text-muted-foreground">
                      {String(report.details ?? "No issue details provided.")}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-background p-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Property manager</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{String(report.property_manager_name ?? "Unknown")}</p>
                        <p className="text-xs text-muted-foreground">{String(report.property_manager_email ?? "-")}</p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-background p-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Report id</p>
                        <p className="mt-1 break-all text-sm font-medium text-foreground">{String(report.id)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-border/50 pt-3">
                      <Button
                        size="sm"
                        variant={canModerate ? "default" : "outline"}
                        className="h-8"
                        onClick={() => {
                          setSelectedReport(report);
                          setReviewNotes(String(report.review_notes ?? ""));
                          setDecision("upheld");
                          setPropertyAction("hide");
                        }}
                      >
                        {canModerate ? "Review report" : "View decision"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={Boolean(selectedReport)} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Moderate property report</DialogTitle>
            <DialogDescription>
              Decide whether to dismiss the report or uphold it and apply a listing action.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-border/60 bg-secondary/15 p-3 text-sm">
              <p className="font-medium text-foreground">{String(selectedReport?.property_title ?? "Property")}</p>
              <p className="mt-1 text-muted-foreground">{String(selectedReport?.details ?? "")}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Decision</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant={decision === "upheld" ? "default" : "outline"} size="sm" onClick={() => setDecision("upheld")}>
                  Uphold
                </Button>
                <Button type="button" variant={decision === "dismissed" ? "default" : "outline"} size="sm" onClick={() => setDecision("dismissed")}>
                  Dismiss
                </Button>
              </div>
            </div>

            {decision === "upheld" ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Property action</p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant={propertyAction === "hide" ? "default" : "outline"} size="sm" onClick={() => setPropertyAction("hide")}>
                    Hide property
                  </Button>
                  <Button type="button" variant={propertyAction === "suspend" ? "default" : "outline"} size="sm" onClick={() => setPropertyAction("suspend")}>
                    Suspend property
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Review notes</p>
              <Textarea
                rows={5}
                value={reviewNotes}
                onChange={(event) => setReviewNotes(event.target.value)}
                placeholder="Explain the decision clearly. These notes are used in the provider notification."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedReport && moderationMutation.mutate(String(selectedReport.id))}
              disabled={moderationMutation.isPending || reviewNotes.trim().length < 8}
            >
              {moderationMutation.isPending ? <><InlineSpinner variant="solid" /> Saving...</> : "Save decision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
