import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatCardSkeleton() {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-7 w-20 mb-2" />
        <Skeleton className="h-3 w-28" />
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`border border-border/60 shadow-none ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[240px] flex items-end gap-3 pt-8 pb-4 px-2">
          {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
            <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityListSkeleton({ rows = 5, className = "" }: { rows?: number; className?: string }) {
  return (
    <Card className={`border border-border/60 shadow-none ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ListItemSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-border/60 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SavedPropertySkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-3 p-2 rounded-xl border border-border/60">
            <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <Card className="border border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/60">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
        <Skeleton className="h-28 w-full rounded-xl mt-4" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton({ variant }: { variant: "admin" | "provider" | "seeker" }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartSkeleton className="lg:col-span-2" />
        {variant === "admin" ? <ChartSkeleton /> : variant === "seeker" ? <SavedPropertySkeleton /> : <ListItemSkeleton />}
      </div>

      {/* Bottom row */}
      <div className={variant === "admin" ? "grid grid-cols-1 lg:grid-cols-3 gap-4" : ""}>
        <ActivityListSkeleton rows={4} className={variant === "admin" ? "lg:col-span-2" : ""} />
        {variant === "admin" && <QuickActionsSkeleton />}
      </div>
    </div>
  );
}
