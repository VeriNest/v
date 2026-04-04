import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/* ── Stat Card ── */
function StatCardSkeleton() {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-24 mb-1.5" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

/* ── Area Chart (wide) ── */
function AreaChartSkeleton() {
  return (
    <Card className="lg:col-span-2 border border-border/60 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-52" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[240px] flex flex-col justify-end px-4 pb-6 pt-4">
          {/* Y-axis labels + line hints */}
          <div className="flex-1 flex flex-col justify-between relative">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-10 shrink-0" />
                <Skeleton className="h-px flex-1" />
              </div>
            ))}
            {/* Curve simulation */}
            <div className="absolute inset-0 flex items-end px-12">
              <Skeleton className="w-full h-[60%] rounded-t-[40px] opacity-30" />
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between pt-3 px-8">
            {["", "", "", "", "", "", ""].map((_, i) => (
              <Skeleton key={i} className="h-3 w-7" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Bar Chart (narrow) ── */
function BarChartSkeleton() {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[240px] flex items-end gap-2 px-2 pb-6 pt-4">
          {[45, 70, 55, 85, 95, 65, 35].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end flex-1">
                <Skeleton className="flex-1 rounded-t-sm" style={{ height: `${h}%` }} />
                <Skeleton className="flex-1 rounded-t-sm" style={{ height: `${h * 0.7}%` }} />
              </div>
              <Skeleton className="h-3 w-6" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Activity List (admin) ── */
function ActivityListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="lg:col-span-2 border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-3 w-[40%]" />
            </div>
            <Skeleton className="h-3 w-8 shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ── Quick Actions (admin) ── */
function QuickActionsSkeleton() {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/60">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
        {/* Platform health box */}
        <div className="mt-4 p-4 rounded-xl border border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Top Listings (provider) ── */
function TopListingsSkeleton() {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-border/60 space-y-2">
            <Skeleton className="h-4 w-[80%]" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ── Saved Properties (seeker) ── */
function SavedPropertySkeleton() {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-2 rounded-xl border border-border/60">
            <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-3 w-[50%]" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ── Recent Leads / Recent Offers (bottom full-width card) ── */
function RecentLeadsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-[65%]" />
              <Skeleton className="h-3 w-[45%]" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ── Main Dashboard Skeleton ── */
export function DashboardSkeleton({ variant }: { variant: "admin" | "provider" | "landlord" | "seeker" }) {
  return (
    <div className="space-y-6">
      {/* KYC banner placeholder for provider/seeker */}
      {variant !== "admin" && <Skeleton className="h-12 w-full rounded-lg" />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-60" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AreaChartSkeleton />
        {variant === "admin" ? <BarChartSkeleton /> : variant === "seeker" ? <SavedPropertySkeleton /> : <TopListingsSkeleton />}
      </div>

      {/* Bottom row */}
      {variant === "admin" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ActivityListSkeleton rows={5} />
          <QuickActionsSkeleton />
        </div>
      ) : (
        <RecentLeadsSkeleton rows={4} />
      )}
    </div>
  );
}
