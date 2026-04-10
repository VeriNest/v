import ContentLoader from "react-content-loader";

import {
  DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS,
  DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS,
} from "@/components/dashboard/overview";

type DashboardVariant = "admin" | "provider" | "landlord" | "seeker";

function DashboardLoaderFrame({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-border/60 bg-card ${className}`}>
      {children}
    </div>
  );
}

function SkeletonSvg({
  height,
  children,
  className = "",
}: {
  height: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ContentLoader
      speed={1.6}
      width="100%"
      height={height}
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      backgroundColor="hsl(var(--muted))"
      foregroundColor="hsl(var(--accent))"
      className={className}
    >
      {children}
    </ContentLoader>
  );
}

function HeaderSkeleton({ withBanner }: { withBanner: boolean }) {
  return (
    <div className="space-y-6">
      {withBanner ? (
        <DashboardLoaderFrame>
          <SkeletonSvg height={48}>
            <rect x="0" y="0" rx="12" ry="12" width="1000" height="48" />
          </SkeletonSvg>
        </DashboardLoaderFrame>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <DashboardLoaderFrame className="flex-1">
          <SkeletonSvg height={72}>
            <rect x="0" y="12" rx="8" ry="8" width="240" height="18" />
            <rect x="0" y="42" rx="6" ry="6" width="320" height="12" />
          </SkeletonSvg>
        </DashboardLoaderFrame>
        <div className="flex gap-2">
          <DashboardLoaderFrame className="w-36">
            <SkeletonSvg height={40}>
              <rect x="0" y="0" rx="10" ry="10" width="1000" height="40" />
            </SkeletonSvg>
          </DashboardLoaderFrame>
          <DashboardLoaderFrame className="w-36">
            <SkeletonSvg height={40}>
              <rect x="0" y="0" rx="10" ry="10" width="1000" height="40" />
            </SkeletonSvg>
          </DashboardLoaderFrame>
        </div>
      </div>
    </div>
  );
}

function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <DashboardLoaderFrame key={index}>
          <SkeletonSvg height={132}>
            <rect x="20" y="20" rx="16" ry="16" width="56" height="56" />
            <rect x="840" y="28" rx="6" ry="6" width="120" height="10" />
            <rect x="20" y="88" rx="8" ry="8" width="180" height="20" />
            <rect x="20" y="114" rx="6" ry="6" width="220" height="10" />
          </SkeletonSvg>
        </DashboardLoaderFrame>
      ))}
    </div>
  );
}

function ProviderEarningsOverviewSkeleton() {
  return (
    <DashboardLoaderFrame className={`${DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS} lg:col-span-2`}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="180" height="18" />
        <rect x="24" y="52" rx="6" ry="6" width="260" height="12" />
        <rect x="940" y="24" rx="10" ry="10" width="36" height="28" />

        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x="88" y={96 + i * 42} rx="2" ry="2" width="860" height="2" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={`y-${i}`} x="24" y={92 + i * 42} rx="4" ry="4" width="42" height="10" />
        ))}
        <path d="M100 262 C240 232, 300 170, 430 182 S670 112, 810 126 S900 138, 950 126" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M100 262 C240 232, 300 170, 430 182 S670 112, 810 126 S900 138, 950 126 L950 312 L100 312 Z" opacity="0.12" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={`x-${i}`} x={110 + i * 128} y="320" rx="4" ry="4" width="30" height="10" />
        ))}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function SeekerMatchTrendsSkeleton() {
  return (
    <DashboardLoaderFrame className={`${DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS} lg:col-span-2`}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="160" height="18" />
        <rect x="24" y="52" rx="6" ry="6" width="290" height="12" />
        <rect x="940" y="24" rx="10" ry="10" width="36" height="28" />

        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x="88" y={96 + i * 42} rx="2" ry="2" width="860" height="2" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={`y-${i}`} x="24" y={92 + i * 42} rx="4" ry="4" width="28" height="10" />
        ))}
        <path d="M100 266 C210 248, 280 216, 360 194 S520 216, 610 178 S760 120, 850 132 S920 150, 950 140" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M100 266 C210 248, 280 216, 360 194 S520 216, 610 178 S760 120, 850 132 S920 150, 950 140 L950 312 L100 312 Z" opacity="0.12" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={`x-${i}`} x={110 + i * 128} y="320" rx="4" ry="4" width="24" height="10" />
        ))}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function AdminRevenueOverviewSkeleton() {
  return (
    <DashboardLoaderFrame className={`${DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS} lg:col-span-2`}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="170" height="18" />
        <rect x="24" y="52" rx="6" ry="6" width="240" height="12" />
        <rect x="940" y="24" rx="10" ry="10" width="36" height="28" />

        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x="88" y={96 + i * 42} rx="2" ry="2" width="860" height="2" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={`y-${i}`} x="24" y={92 + i * 42} rx="4" ry="4" width="42" height="10" />
        ))}
        <path d="M100 262 C220 236, 300 198, 390 184 S560 146, 660 130 S810 118, 950 136" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M100 262 C220 236, 300 198, 390 184 S560 146, 660 130 S810 118, 950 136 L950 312 L100 312 Z" opacity="0.12" />
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={`x-${i}`} x={110 + i * 128} y="320" rx="4" ry="4" width="28" height="10" />
        ))}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function WidgetBarChartSkeleton({
  titleWidth,
  descriptionWidth,
  monthLabelCount = 7,
}: {
  titleWidth: number;
  descriptionWidth: number;
  monthLabelCount?: number;
}) {
  return (
    <DashboardLoaderFrame className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width={titleWidth} height="18" />
        <rect x="24" y="52" rx="6" ry="6" width={descriptionWidth} height="12" />
        <rect x="940" y="24" rx="10" ry="10" width="36" height="28" />

        {Array.from({ length: monthLabelCount }).map((_, i) => {
          const heights = [90, 140, 118, 170, 186, 144, 88];
          const h = heights[i] ?? 110;
          const step = monthLabelCount === 6 ? 146 : 124;
          const x = monthLabelCount === 6 ? 116 + i * step : 96 + i * step;
          const y = 298 - h;
          return (
            <g key={i}>
              <rect x={x} y={y + 26} rx="4" ry="4" width="22" height={h - 26} />
              <rect x={x + 28} y={y} rx="4" ry="4" width="22" height={h} />
              <rect x={x + 4} y="320" rx="4" ry="4" width="24" height="10" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function AdminPropertyActivitySkeleton() {
  return <WidgetBarChartSkeleton titleWidth={170} descriptionWidth={180} />;
}

function LandlordCollectionsSkeleton() {
  return <WidgetBarChartSkeleton titleWidth={150} descriptionWidth={190} monthLabelCount={6} />;
}

function LandlordOccupancyTrendSkeleton() {
  return (
    <DashboardLoaderFrame className={`${DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS} lg:col-span-2`}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="170" height="18" />
        <rect x="24" y="52" rx="6" ry="6" width="250" height="12" />
        <rect x="940" y="24" rx="10" ry="10" width="36" height="28" />

        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x="88" y={96 + i * 42} rx="2" ry="2" width="860" height="2" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={`y-${i}`} x="24" y={92 + i * 42} rx="4" ry="4" width="34" height="10" />
        ))}
        <path d="M100 250 C220 214, 300 178, 390 164 S560 178, 670 146 S820 120, 950 126" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M100 250 C220 214, 300 178, 390 164 S560 178, 670 146 S820 120, 950 126 L950 312 L100 312 Z" opacity="0.12" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={`x-${i}`} x={132 + i * 150} y="320" rx="4" ry="4" width="28" height="10" />
        ))}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function ProviderTopListingsSkeleton() {
  return (
    <DashboardLoaderFrame className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="150" height="18" />
        <rect x="900" y="26" rx="8" ry="8" width="80" height="14" />

        {Array.from({ length: 3 }).map((_, i) => {
          const y = 72 + i * 86;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="16" ry="16" width="952" height="70" />
              <rect x="52" y={y + 18} rx="6" ry="6" width="250" height="14" />
              <rect x="52" y={y + 44} rx="5" ry="5" width="60" height="10" />
              <rect x="126" y={y + 44} rx="5" ry="5" width="50" height="10" />
              <rect x="190" y={y + 44} rx="5" ry="5" width="40" height="10" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function SeekerSavedPropertiesSkeleton() {
  return (
    <DashboardLoaderFrame className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="190" height="18" />
        <rect x="900" y="26" rx="8" ry="8" width="80" height="14" />

        {Array.from({ length: 3 }).map((_, i) => {
          const y = 72 + i * 86;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="16" ry="16" width="952" height="70" />
              <rect x="44" y={y + 14} rx="10" ry="10" width="52" height="52" />
              <rect x="116" y={y + 18} rx="6" ry="6" width="220" height="14" />
              <rect x="116" y={y + 40} rx="5" ry="5" width="150" height="10" />
              <rect x="116" y={y + 56} rx="5" ry="5" width="70" height="10" />
              <circle cx="944" cy={y + 22} r="8" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function ProviderRecentLeadsSkeleton() {
  return (
    <DashboardLoaderFrame>
      <SkeletonSvg height={424}>
        <rect x="24" y="24" rx="8" ry="8" width="160" height="18" />
        <rect x="194" y="26" rx="10" ry="10" width="70" height="18" />
        <rect x="900" y="26" rx="8" ry="8" width="80" height="14" />

        {Array.from({ length: 4 }).map((_, i) => {
          const y = 72 + i * 86;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="16" ry="16" width="952" height="66" />
              <circle cx="56" cy={y + 33} r="18" />
              <rect x="88" y={y + 16} rx="6" ry="6" width="310" height="14" />
              <rect x="88" y={y + 38} rx="5" ry="5" width="180" height="10" />
              {i === 0 ? <rect x="812" y={y + 20} rx="10" ry="10" width="66" height="20" /> : null}
              <rect x="892" y={y + 16} rx="10" ry="10" width="74" height="28" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function SeekerRecentOffersSkeleton() {
  return (
    <DashboardLoaderFrame className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}>
      <SkeletonSvg height={424}>
        <rect x="24" y="24" rx="8" ry="8" width="150" height="18" />
        <rect x="184" y="26" rx="10" ry="10" width="70" height="18" />
        <rect x="900" y="26" rx="8" ry="8" width="80" height="14" />

        {Array.from({ length: 4 }).map((_, i) => {
          const y = 72 + i * 86;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="16" ry="16" width="952" height="66" />
              <circle cx="56" cy={y + 33} r="18" />
              <rect x="88" y={y + 16} rx="6" ry="6" width="250" height="14" />
              <rect x="88" y={y + 38} rx="5" ry="5" width="150" height="10" />
              <rect x="760" y={y + 20} rx="10" ry="10" width="64" height="20" />
              <rect x="836" y={y + 20} rx="10" ry="10" width="48" height="20" />
              <rect x="896" y={y + 22} rx="6" ry="6" width="70" height="14" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function AdminQuickActionsSkeleton() {
  return (
    <DashboardLoaderFrame className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="170" height="18" />
        {Array.from({ length: 4 }).map((_, i) => {
          const y = 72 + i * 54;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="14" ry="14" width="952" height="42" />
              <rect x="42" y={y + 7} rx="10" ry="10" width="28" height="28" />
              <rect x="86" y={y + 14} rx="6" ry="6" width="140" height="14" />
              <rect x="940" y={y + 14} rx="5" ry="5" width="12" height="12" />
            </g>
          );
        })}

        <rect x="24" y="292" rx="16" ry="16" width="952" height="32" />
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function AdminRecentActivitySkeleton() {
  return (
    <DashboardLoaderFrame className="lg:col-span-2">
      <SkeletonSvg height={440}>
        <rect x="24" y="24" rx="8" ry="8" width="170" height="18" />
        <rect x="206" y="26" rx="10" ry="10" width="56" height="18" />
        <rect x="900" y="26" rx="8" ry="8" width="80" height="14" />

        {Array.from({ length: 5 }).map((_, i) => {
          const y = 72 + i * 72;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="16" ry="16" width="952" height="54" />
              <circle cx="56" cy={y + 27} r="18" />
              <rect x="88" y={y + 14} rx="6" ry="6" width="300" height="14" />
              <rect x="88" y={y + 34} rx="5" ry="5" width="120" height="10" />
              <rect x="926" y={y + 22} rx="5" ry="5" width="28" height="10" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function LandlordLeaseExpiriesSkeleton() {
  return (
    <DashboardLoaderFrame className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="160" height="18" />
        <rect x="900" y="26" rx="8" ry="8" width="80" height="14" />

        {Array.from({ length: 3 }).map((_, i) => {
          const y = 72 + i * 86;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="16" ry="16" width="952" height="70" />
              <rect x="44" y={y + 18} rx="6" ry="6" width="180" height="14" />
              <rect x="44" y={y + 40} rx="5" ry="5" width="150" height="10" />
              <rect x="860" y={y + 18} rx="10" ry="10" width="90" height="20" />
              <rect x="44" y={y + 56} rx="5" ry="5" width="90" height="10" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function LandlordMaintenanceQueueSkeleton() {
  return (
    <DashboardLoaderFrame className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}>
      <SkeletonSvg height={348}>
        <rect x="24" y="24" rx="8" ry="8" width="190" height="18" />
        <rect x="900" y="26" rx="8" ry="8" width="72" height="14" />

        {Array.from({ length: 3 }).map((_, i) => {
          const y = 72 + i * 86;
          return (
            <g key={i}>
              <rect x="24" y={y} rx="16" ry="16" width="952" height="70" />
              <rect x="44" y={y + 18} rx="6" ry="6" width="210" height="14" />
              <rect x="44" y={y + 40} rx="5" ry="5" width="120" height="10" />
              <rect x="840" y={y + 18} rx="10" ry="10" width="110" height="20" />
              <rect x="44" y={y + 56} rx="5" ry="5" width="170" height="10" />
              <rect x="904" y={y + 56} rx="5" ry="5" width="46" height="10" />
            </g>
          );
        })}
      </SkeletonSvg>
    </DashboardLoaderFrame>
  );
}

function ProviderSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ProviderEarningsOverviewSkeleton />
        <ProviderTopListingsSkeleton />
      </div>
      <ProviderRecentLeadsSkeleton />
    </>
  );
}

function SeekerSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SeekerMatchTrendsSkeleton />
        <SeekerSavedPropertiesSkeleton />
      </div>
      <SeekerRecentOffersSkeleton />
    </>
  );
}

function AdminSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AdminRevenueOverviewSkeleton />
        <AdminPropertyActivitySkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AdminRecentActivitySkeleton />
        <AdminQuickActionsSkeleton />
      </div>
    </>
  );
}

function LandlordSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LandlordOccupancyTrendSkeleton />
        <LandlordCollectionsSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LandlordLeaseExpiriesSkeleton />
        <LandlordMaintenanceQueueSkeleton />
      </div>
    </>
  );
}

export function DashboardSkeleton({ variant }: { variant: DashboardVariant }) {
  return (
    <div className="space-y-6">
      <HeaderSkeleton withBanner={variant !== "admin"} />
      <StatsRowSkeleton />

      {variant === "provider" ? <ProviderSkeleton /> : null}
      {variant === "seeker" ? <SeekerSkeleton /> : null}
      {variant === "admin" ? <AdminSkeleton /> : null}
      {variant === "landlord" ? <LandlordSkeleton /> : null}
    </div>
  );
}
