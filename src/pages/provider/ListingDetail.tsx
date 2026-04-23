import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { Button } from "@/components/ui/button";
import { getPropertyImage, propertiesApi, titleCase } from "@/lib/api";

const videoExtensions = [".mp4", ".mov", ".webm", ".ogg", ".m4v", ".avi", ".mkv"];

function isVideoUrl(url: string) {
  const normalized = url.split("?")[0].toLowerCase();
  return videoExtensions.some((extension) => normalized.endsWith(extension));
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["/properties", id],
    queryFn: () => propertiesApi.getById(id!),
    enabled: Boolean(id),
  });

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20">
        <Building2 className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">Listing not found</p>
        <Button variant="outline" onClick={() => navigate("/provider/listings")}>Back to Listings</Button>
      </div>
    );
  }

  const images = Array.isArray(data.images) ? data.images : [];
  const status = titleCase(String(data.status ?? "draft"));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageHeader
        title={String(data.title ?? "Listing")}
        description="Review the full property record as it appears in your provider inventory."
        badge={<DashboardStatusBadge tone={status === "Published" ? "success" : "warning"}>{status}</DashboardStatusBadge>}
        actions={<Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/provider/listings")}><ArrowLeft className="h-4 w-4" /> Back to Listings</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
        <DashboardSectionCard title="Media" description="Uploaded property media">
          <div className="grid gap-3 md:grid-cols-2">
            {(images.length ? images : [getPropertyImage([], 0)]).map((image, index) => (
              isVideoUrl(String(image)) ? (
                <video
                  key={`${image}-${index}`}
                  src={String(image)}
                  controls
                  preload="metadata"
                  className="h-64 w-full rounded-xl bg-black object-cover"
                />
              ) : (
                <img key={`${image}-${index}`} src={String(image)} alt={String(data.title ?? "Listing")} className="h-64 w-full rounded-xl object-cover" />
              )
            ))}
          </div>
        </DashboardSectionCard>

        <div className="space-y-6">
          <DashboardSectionCard title="Property Details" description="Primary listing information" contentClassName="space-y-3">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Location</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground"><MapPin className="h-4 w-4" /> {String(data.location ?? "-")}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Price</p>
              <p className="mt-1 text-sm font-medium text-foreground">NGN {Number(data.price ?? 0).toLocaleString("en-NG")}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Listed</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground"><CalendarDays className="h-4 w-4" /> {data.created_at ? new Date(String(data.created_at)).toLocaleDateString() : "-"}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Verification</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground"><ShieldCheck className="h-4 w-4" /> {status}</p>
            </div>
          </DashboardSectionCard>

          <DashboardSectionCard title="Contact" description="Contact fields stored on the listing" contentClassName="space-y-2">
            <p className="text-sm text-foreground">{String(data.contact_name ?? "-")}</p>
            <p className="text-sm text-muted-foreground">{String(data.contact_phone ?? "-")}</p>
          </DashboardSectionCard>
        </div>
      </div>

      <DashboardSectionCard title="Description" description="Full listing copy">
        <p className="text-sm leading-6 text-muted-foreground">{String(data.description ?? "No description available.")}</p>
      </DashboardSectionCard>
    </div>
  );
}
