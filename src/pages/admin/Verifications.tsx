import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ShieldCheck, Clock, XCircle, CheckCircle2, Eye, FileText,
  UserCheck, AlertTriangle, Search, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

const stats = [
  { label: "Pending Review", value: "18", icon: Clock, iconBg: "bg-amber-500/10 dark:bg-amber-500/15", accent: "text-amber-600 dark:text-amber-300" },
  { label: "Verified", value: "284", icon: ShieldCheck, iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15", accent: "text-emerald-600 dark:text-emerald-300" },
  { label: "Rejected", value: "12", icon: XCircle, iconBg: "bg-red-500/10 dark:bg-red-500/15", accent: "text-red-500 dark:text-red-300" },
  { label: "Avg. Review Time", value: "2.4h", icon: UserCheck, iconBg: "bg-primary/10", accent: "text-primary" },
];

const pendingVerifications = [
  { id: "V-401", name: "Adebayo Johnson", email: "adebayo@email.com", type: "Agent", submitted: "Mar 20, 2024", docs: ["NIN", "CAC Certificate", "Utility Bill"], initials: "AJ", risk: "Low" },
  { id: "V-402", name: "Chioma Okafor", email: "chioma@email.com", type: "Landlord", submitted: "Mar 19, 2024", docs: ["NIN", "Property Deed"], initials: "CO", risk: "Medium" },
  { id: "V-403", name: "Emeka Enterprises", email: "info@emeka.com", type: "Corporate", submitted: "Mar 18, 2024", docs: ["CAC Certificate", "Tax Clearance", "Director NIN"], initials: "EE", risk: "Low" },
  { id: "V-404", name: "Fatima Abdullahi", email: "fatima@email.com", type: "Agent", submitted: "Mar 17, 2024", docs: ["NIN", "Utility Bill"], initials: "FA", risk: "High" },
  { id: "V-405", name: "George Adekunle", email: "george@email.com", type: "Landlord", submitted: "Mar 16, 2024", docs: ["NIN", "Property Deed", "Utility Bill"], initials: "GA", risk: "Low" },
];

const recentlyVerified = [
  { id: "V-398", name: "Sarah Kolawole", type: "Agent", verified: "Mar 15, 2024", reviewer: "Admin", initials: "SK" },
  { id: "V-397", name: "Lagos Homes Ltd", type: "Corporate", verified: "Mar 14, 2024", reviewer: "Admin", initials: "LH" },
  { id: "V-396", name: "Ibrahim Mohammed", type: "Landlord", verified: "Mar 13, 2024", reviewer: "Admin", initials: "IM" },
];

const riskColors: Record<string, string> = {
  Low: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  High: "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
};

const typeColors: Record<string, string> = {
  Agent: "bg-primary/10 text-primary border-primary/20",
  Landlord: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
  Corporate: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/30",
};

export default function AdminVerifications() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="KYC & Verifications"
        description="Review and manage provider identity verification."
      />

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

      <Tabs defaultValue="pending" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="bg-muted/50 p-1 h-auto">
              <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
                <Clock className="h-3.5 w-3.5" /> Pending
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">{pendingVerifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="verified" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified
              </TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 h-9 w-full min-w-0 text-sm lg:w-[200px]" />
              </div>
              <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 text-sm sm:px-3.5">
                <Filter className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span>
              </Button>
            </>
          }
        />

        <TabsContent value="pending" className="space-y-3">
          {pendingVerifications.map((v) => (
            <Card key={v.id} className="border border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border border-border/60 shrink-0 mt-0.5">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">{v.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-foreground">{v.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeColors[v.type]}`}>{v.type}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${riskColors[v.risk]}`}>
                          {v.risk === "High" && <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />}
                          {v.risk} Risk
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.email} · Submitted {v.submitted}</p>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {v.docs.map((doc) => (
                          <span key={doc} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-medium text-muted-foreground border border-border/60">
                            <FileText className="h-2.5 w-2.5" />{doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                      <Eye className="h-3 w-3" /> Review
                    </Button>
                    <Button size="sm" className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs text-destructive border-destructive/30">
                      <XCircle className="h-3 w-3" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="verified">
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Provider</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Verified Date</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Reviewed By</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentlyVerified.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarFallback className="bg-emerald-500/10 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{v.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">{v.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeColors[v.type]}`}>{v.type}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.verified}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.reviewer}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full border bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                          <ShieldCheck className="h-2.5 w-2.5" /> Verified
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
