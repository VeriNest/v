import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, Building2, Calendar, Download, FileText, PieChart, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi } from "@/lib/api";

export default function AdminReports() {
  const [range, setRange] = useState("6months");
  const { data, isLoading } = useQuery({
    queryKey: ["/admin/reports/needs"],
    queryFn: () => adminApi.needAnalytics(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const trend = useMemo(() => {
    const points = data?.monthlyTrend ?? [];
    const limits: Record<string, number> = {
      "7days": 1,
      "30days": 2,
      "6months": 6,
      "1year": points.length,
    };
    const limit = limits[range] ?? points.length;
    return points.slice(Math.max(points.length - limit, 0));
  }, [data?.monthlyTrend, range]);

  const summaryStats = useMemo(
    () => [
      {
        label: "Total Needs",
        value: String(data?.totalNeeds ?? 0),
        change: "Live",
        up: true,
        icon: FileText,
        iconBg: "bg-primary/10",
        accent: "text-primary",
      },
      {
        label: "Answered Needs",
        value: String(data?.answeredNeeds ?? 0),
        change: "Live",
        up: true,
        icon: Building2,
        iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        accent: "text-emerald-600 dark:text-emerald-300",
      },
      {
        label: "Open Needs",
        value: String(data?.openNeeds ?? 0),
        change: "Needs follow-up",
        up: false,
        icon: Users,
        iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
        accent: "text-amber-600 dark:text-amber-300",
      },
      {
        label: "Answer Rate",
        value: `${Number(data?.answerRate ?? 0).toFixed(1)}%`,
        change: `${data?.responseCount ?? 0} responses`,
        up: true,
        icon: PieChart,
        iconBg: "bg-blue-500/10 dark:bg-blue-500/15",
        accent: "text-blue-600 dark:text-blue-300",
      },
    ],
    [data],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Needs & Responses Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track how many needs users post and how many agents answer.</p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="h-9 w-full text-sm sm:w-[150px]">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-sm">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="border border-border/60 shadow-sm">
            <CardContent className="flex items-start gap-3 p-4">
              <div className={`h-9 w-9 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`h-4 w-4 ${stat.accent}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className={`text-xl font-bold leading-tight ${stat.accent}`}>{stat.value}</p>
                <p className={`mt-0.5 flex items-center gap-0.5 text-[11px] font-medium ${stat.up ? "text-emerald-600" : "text-red-500"}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Needs vs Responses</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly need posts and answered needs</p>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="needsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="needsCreated" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#needsGrad)" name="Needs Created" />
                  <Area type="monotone" dataKey="needsAnswered" stroke="hsl(142, 40%, 48%)" strokeWidth={2} fill="none" name="Needs Answered" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Answer Volume</CardTitle>
            <p className="text-xs text-muted-foreground">Need answers by month</p>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }} />
                  <Legend />
                  <Bar dataKey="needsAnswered" fill="hsl(18, 55%, 58%)" radius={[4, 4, 0, 0]} barSize={18} name="Answered" />
                  <Bar dataKey="needsCreated" fill="hsl(18, 55%, 42%)" radius={[4, 4, 0, 0]} barSize={18} name="Created" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Need Summary</CardTitle>
          <p className="text-xs text-muted-foreground">Current platform-wide needs status</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Total needs</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{data?.totalNeeds ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Answered needs</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{data?.answeredNeeds ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-xs text-muted-foreground">Open needs</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{data?.openNeeds ?? 0}</p>
          </div>
        </CardContent>
      </Card>
      {isLoading ? null : null}
    </div>
  );
}
