import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ShieldCheck, Clock, XCircle, CheckCircle2, Eye, FileText,
  UserCheck, AlertTriangle, Search, Filter, Building2
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import { adminApi, titleCase } from "@/lib/api";
import { toast } from "sonner";

const stats = [
  { label: "Pending Review", value: "18", icon: Clock, iconBg: "bg-amber-500/10 dark:bg-amber-500/15", accent: "text-amber-600 dark:text-amber-300" },
  { label: "Verified", value: "284", icon: ShieldCheck, iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15", accent: "text-emerald-600 dark:text-emerald-300" },
  { label: "Rejected", value: "12", icon: XCircle, iconBg: "bg-red-500/10 dark:bg-red-500/15", accent: "text-red-500 dark:text-red-300" },
  { label: "Avg. Review Time", value: "2.4h", icon: UserCheck, iconBg: "bg-primary/10", accent: "text-primary" },
];

// Keep fallback data in case API fails
const fallbackPendingVerifications = [
  { id: "V-401", name: "Adebayo Johnson", email: "adebayo@email.com", type: "Agent", submitted: "Mar 20, 2024", docs: ["NIN", "CAC Certificate", "Utility Bill"], initials: "AJ", risk: "Low" },
  { id: "V-402", name: "Chioma Okafor", email: "chioma@email.com", type: "Landlord", submitted: "Mar 19, 2024", docs: ["NIN", "Property Deed"], initials: "CO", risk: "Medium" },
  { id: "V-403", name: "Emeka Enterprises", email: "info@emeka.com", type: "Corporate", submitted: "Mar 18, 2024", docs: ["CAC Certificate", "Tax Clearance", "Director NIN"], initials: "EE", risk: "Low" },
  { id: "V-404", name: "Fatima Abdullahi", email: "fatima@email.com", type: "Agent", submitted: "Mar 17, 2024", docs: ["NIN", "Utility Bill"], initials: "FA", risk: "High" },
  { id: "V-405", name: "George Adekunle", email: "george@email.com", type: "Landlord", submitted: "Mar 16, 2024", docs: ["NIN", "Property Deed", "Utility Bill"], initials: "GA", risk: "Low" },
];

const fallbackRecentlyVerified = [
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

const propertyStatusColors: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  Pending: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  Rejected: "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
};

function normalizeType(value?: string | null) {
  const role = titleCase(value ?? "agent");
  if (role === "Seeker" || role === "Unassigned") return "Tenant";
  if (role === "Admin") return "Admin";
  return role;
}

function typeColorFor(value: string) {
  return typeColors[value] ?? "bg-muted text-muted-foreground border-border";
}

function riskFor(status?: string | null) {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized === "rejected") return "High";
  if (["submitted", "pending", "in_review"].includes(normalized)) return "Medium";
  return "Low";
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "N/A";
}

function initialsFor(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "User";
  const parts = source.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";
}

function isImageDocument(url?: string, mimeType?: string) {
  if (mimeType?.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url ?? "");
}

export default function AdminVerifications() {
  const queryClient = useQueryClient();
  const [selectedVerificationId, setSelectedVerificationId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const { data: verifications = [], isLoading, error: verError } = useQuery({
    queryKey: ["/admin/verifications"],
    queryFn: () => adminApi.verifications().catch((err) => {
      console.error("Failed to fetch verifications:", err);
      return [];
    }),
    retry: 1,
  });
  const { data: properties = [], error: propError } = useQuery({
    queryKey: ["/admin/properties"],
    queryFn: () => adminApi.properties().catch((err) => {
      console.error("Failed to fetch properties:", err);
      return [];
    }),
    retry: 1,
  });

  const normalizedVerifications = (Array.isArray(verifications) ? verifications : []).map((item: any) => {
    const type = normalizeType(item.userRole ?? item.user_role);
    const risk = riskFor(item.status);
    const docs = Array.isArray(item.documentTypes ?? item.document_types)
      ? (item.documentTypes ?? item.document_types).map((doc: string) => titleCase(doc))
      : [];
    const documents = Array.isArray(item.documents)
      ? item.documents
      : Array.isArray(item.documents?.data)
        ? item.documents.data
        : [];
    return {
      id: String(item.id),
      name: item.userName ?? item.user_name ?? item.userEmail ?? item.user_email ?? "Unknown User",
      email: item.userEmail ?? item.user_email ?? "",
      type,
      submitted: formatDate(item.submittedAt ?? item.submitted_at ?? item.createdAt ?? item.created_at),
      verified: formatDate(item.reviewedAt ?? item.reviewed_at),
      docs,
      initials: initialsFor(item.userName ?? item.user_name, item.userEmail ?? item.user_email),
      risk,
      reviewer: "Admin",
      status: String(item.status ?? ""),
      notes: String(item.notes ?? ""),
      propertyCount: Number(item.propertyCount ?? item.property_count ?? 0),
      documents: documents.map((doc: any) => ({
        id: String(doc.id ?? `${item.id}-${doc.fileKey ?? doc.file_key ?? doc.documentType ?? "document"}`),
        documentType: titleCase(doc.documentType ?? doc.document_type ?? "document"),
        fileUrl: String(doc.fileUrl ?? doc.file_url ?? ""),
        fileKey: String(doc.fileKey ?? doc.file_key ?? ""),
        mimeType: String(doc.mimeType ?? doc.mime_type ?? ""),
        status: String(doc.status ?? "uploaded"),
        createdAt: formatDate(doc.createdAt ?? doc.created_at),
      })),
    };
  });

  const normalizedProperties = (Array.isArray(properties) ? properties : []).map((item: any) => ({
    id: String(item.id),
    title: item.title ?? "Untitled Property",
    location: item.location ?? "Unknown location",
    price: item.price ? `NGN ${Number(item.price).toLocaleString("en-NG")}` : "NGN 0",
    status: titleCase(item.status ?? "pending"),
    created: formatDate(item.created_at ?? item.createdAt),
  }));

  const pendingCount = normalizedVerifications.filter((v) => ["submitted", "in_review", "pending"].includes(v.status.toLowerCase())).length;
  const verifiedCount = normalizedVerifications.filter((v) => ["approved", "verified"].includes(v.status.toLowerCase())).length;
  const rejectedCount = normalizedVerifications.filter((v) => v.status.toLowerCase() === "rejected").length;

  // Separate verifications into pending and approved
  const pendingVerifications = normalizedVerifications
    .filter((v) => ["submitted", "in_review", "pending"].includes(v.status.toLowerCase()))
    .slice(0, 5);

  const recentlyVerified = normalizedVerifications
    .filter((v) => ["approved", "verified"].includes(v.status.toLowerCase()))
    .slice(0, 8);

  const pendingRows = pendingVerifications.length ? pendingVerifications : fallbackPendingVerifications;
  const verifiedRows = recentlyVerified.length ? recentlyVerified : fallbackRecentlyVerified;
  const propertyRows = normalizedProperties;
  const selectedVerification = normalizedVerifications.find((item) => item.id === selectedVerificationId) ?? null;
  const { data: selectedVerificationDetail } = useQuery({
    queryKey: ["/admin/verifications/detail", selectedVerificationId],
    queryFn: () => adminApi.verificationDetail(selectedVerificationId!),
    enabled: Boolean(selectedVerificationId),
  });
  const selectedDocuments = useMemo(() => {
    const rows = Array.isArray((selectedVerificationDetail as any)?.documents) ? (selectedVerificationDetail as any).documents : [];
    return rows.map((doc: any) => ({
      id: String(doc.id ?? `${selectedVerificationId}-${doc.file_key ?? doc.fileKey ?? doc.document_type ?? "document"}`),
      documentType: titleCase(doc.documentType ?? doc.document_type ?? "document"),
      fileUrl: String(doc.fileUrl ?? doc.file_url ?? ""),
      fileKey: String(doc.fileKey ?? doc.file_key ?? ""),
      mimeType: String(doc.mimeType ?? doc.mime_type ?? ""),
      status: String(doc.status ?? "uploaded"),
      createdAt: formatDate(doc.createdAt ?? doc.created_at),
    }));
  }, [selectedVerificationDetail, selectedVerificationId]);

  const updateVerificationMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      adminApi.updateVerification(id, { status, notes, rejectionReason: status === "rejected" ? notes : undefined }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/admin/verifications"] });
      toast.success(variables.status === "verified" ? "Verification approved" : "Verification rejected");
      setSelectedVerificationId(null);
      setReviewNotes("");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to update verification";
      toast.error(message);
    },
  });

  const openReview = (verificationId: string) => {
    setSelectedVerificationId(verificationId);
    const existing = normalizedVerifications.find((item) => item.id === verificationId);
    setReviewNotes(existing?.notes ?? "");
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="KYC & Verifications"
        description="Review and manage provider identity verification."
      />

      {(verError || propError) && (
        <Card className="border border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <p className="text-destructive font-medium">Unable to load verifications</p>
            <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page or contact support</p>
          </CardContent>
        </Card>
      )}

      {isLoading && !verError && !propError && (
        <Card>
          <CardContent className="p-6">
            <BackendLoadingIndicator label="Loading verifications..." compact />
          </CardContent>
        </Card>
      )}

      {!isLoading && !verError && !propError && (
        <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const value =
            s.label === "Pending Review" ? String(pendingCount) :
            s.label === "Verified" ? String(verifiedCount) :
            s.label === "Rejected" ? String(rejectedCount) :
            isLoading ? "..." : `${normalizedVerifications.length ? Math.max(1, Math.round(normalizedVerifications.length / Math.max(pendingCount, 1))) : 0}h`;
          return (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className={`text-xl font-bold leading-tight ${s.accent}`}>{value}</p>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
      <DashboardControlRow
          left={
            <TabsList className="bg-muted/50 p-1 h-auto">
              <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
                <Clock className="h-3.5 w-3.5" /> Pending
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">{pendingRows.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="verified" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
                <Building2 className="h-3.5 w-3.5" /> Properties
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
          {pendingRows.map((v) => (
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeColorFor(v.type)}`}>{v.type}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${riskColors[v.risk] ?? riskColors.Low}`}>
                          {v.risk === "High" && <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />}
                          {v.risk} Risk
                        </span>
                        {"propertyCount" in v ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border bg-muted/50 text-muted-foreground border-border/60">
                            {v.propertyCount} Properties
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.email} · Submitted {v.submitted}</p>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {(v.docs.length ? v.docs : ["No documents uploaded"]).map((doc) => (
                          <span key={doc} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-medium text-muted-foreground border border-border/60">
                            <FileText className="h-2.5 w-2.5" />{doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={() => openReview(v.id)}>
                      <Eye className="h-3 w-3" /> Review
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => updateVerificationMutation.mutate({ id: v.id, status: "verified" })}
                      disabled={updateVerificationMutation.isPending}
                    >
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-xs text-destructive border-destructive/30"
                      onClick={() => openReview(v.id)}
                    >
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
                  {verifiedRows.map((v) => (
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
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${typeColorFor(v.type)}`}>{v.type}</span>
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

        <TabsContent value="properties" className="space-y-3">
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Location</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Price</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyRows.length ? propertyRows.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium text-foreground">{property.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{property.location}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{property.price}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${propertyStatusColors[property.status] ?? propertyStatusColors.Pending}`}>
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{property.created}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No properties found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </>
      )}

      <Dialog open={Boolean(selectedVerification)} onOpenChange={(open) => {
        if (!open) {
          setSelectedVerificationId(null);
          setReviewNotes("");
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Review Verification</DialogTitle>
            <DialogDescription>
              {selectedVerification ? `${selectedVerification.name} · ${selectedVerification.email}` : "Inspect uploaded verification files and approve or reject the request."}
            </DialogDescription>
          </DialogHeader>

          {selectedVerification ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{selectedVerification.type}</Badge>
                <Badge variant="secondary">{selectedVerification.propertyCount} Properties</Badge>
                <Badge variant="secondary">Submitted {selectedVerification.submitted}</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {selectedDocuments.length ? selectedDocuments.map((doc) => (
                  <Card key={doc.id} className="border border-border/60 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{doc.documentType}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {isImageDocument(doc.fileUrl, doc.mimeType) ? (
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-border/60">
                          <img src={doc.fileUrl} alt={doc.documentType} className="h-56 w-full object-cover" />
                        </a>
                      ) : (
                        <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-sm text-muted-foreground">
                          Preview unavailable for this file type
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>{doc.mimeType || "Unknown type"}</span>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                          Open file
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <Card className="border border-border/60 shadow-sm md:col-span-2">
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                      No uploaded documents found for this verification.
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(event) => setReviewNotes(event.target.value)}
                  placeholder="Add reviewer notes or a rejection reason"
                  rows={4}
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedVerificationId(null);
              setReviewNotes("");
            }}>
              Close
            </Button>
            <Button
              variant="outline"
              className="text-destructive border-destructive/30"
              onClick={() => selectedVerification && updateVerificationMutation.mutate({ id: selectedVerification.id, status: "rejected", notes: reviewNotes })}
              disabled={!selectedVerification || updateVerificationMutation.isPending}
            >
              <XCircle className="h-4 w-4" /> Reject
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => selectedVerification && updateVerificationMutation.mutate({ id: selectedVerification.id, status: "verified", notes: reviewNotes })}
              disabled={!selectedVerification || updateVerificationMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
