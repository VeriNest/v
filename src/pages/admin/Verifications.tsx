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

const stats = [
  { label: "Pending Review", value: "18", icon: Clock, iconBg: "bg-amber-50", accent: "text-amber-600" },
  { label: "Verified", value: "284", icon: ShieldCheck, iconBg: "bg-emerald-50", accent: "text-emerald-600" },
  { label: "Rejected", value: "12", icon: XCircle, iconBg: "bg-red-50", accent: "text-red-500" },
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
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-red-50 text-red-700 border-red-200",
};

const typeColors: Record<string, string> = {
  Agent: "bg-primary/10 text-primary border-primary/20",
  Landlord: "bg-blue-50 text-blue-600 border-blue-200",
  Corporate: "bg-violet-50 text-violet-600 border-violet-200",
};

export default function AdminVerifications() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">KYC & Verifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage provider identity verification</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 h-9 w-full sm:w-[200px] text-sm" />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-sm shrink-0">
            <Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
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

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
            <Clock className="h-3.5 w-3.5" /> Pending
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">{pendingVerifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="verified" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {pendingVerifications.map((v) => (
            <Card key={v.id} className="border border-border/60 shadow-sm hover:shadow-md transition-all">
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
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                      <Eye className="h-3 w-3" /> Review
                    </Button>
                    <Button size="sm" className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/5">
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
            <CardContent className="p-0">
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
                            <AvatarFallback className="text-[10px] bg-emerald-50 text-emerald-700 font-medium">{v.initials}</AvatarFallback>
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
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
