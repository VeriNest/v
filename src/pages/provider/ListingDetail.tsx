import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Eye,
  Images,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { Button } from "@/components/ui/button";
import { getPropertyImage, propertiesApi, titleCase, maskPhoneNumber } from "@/lib/api";

const videoExtensions = [".mp4", ".mov", ".webm", ".ogg", ".m4v", ".avi", ".mkv"];

function isVideoUrl(url: string) {
  const normalized = url.split("?")[0].toLowerCase();
  return videoExtensions.some((extension) => normalized.endsWith(extension));
}

function formatPrice(value: unknown, listingType: unknown) {
  const amount = Number(value ?? 0).toLocaleString("en-NG");
  if (listingType === "sale") return `NGN ${amount}`;
  if (listingType === "shortlet") return `NGN ${amount}/day`;
  return `NGN ${amount}/yr`;
}

function statusTone(status: string) {
  switch (status.toLowerCase()) {
    case "published":
    case "verified":
      return "success" as const;
    case "pending_verification":
      return "warning" as const;
    case "suspended":
      return "danger" as const;
    case "hidden":
      return "neutral" as const;
    default:
      return "warning" as const;
  }
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["/properties", id],
    queryFn: () => propertiesApi.getById(id!),
    enabled: Boolean(id),
  });

  const gallery = useMemo(() => {
    const media = Array.isArray(data?.images) && data.images.length ? data.images.map(String) : [getPropertyImage([], 0)];
    return media;
  }, [data]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20">
        <Building2 className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">Listing not found</p>
        <Button variant="outline" onClick={() => navigate("/provider/listings")}>Back to Listings</Button>
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, Math.max(gallery.length - 1, 0));
  const activeMedia = gallery[safeIndex];
  const status = titleCase(String(data.status ?? "draft"));
  const listingType = titleCase(String(data.listing_type ?? (data.is_service_apartment ? "shortlet" : "rent")));
  const summaryCards = [
    {
      label: "Listing status",
      value: status,
      icon: ShieldCheck,
    },
    {
      label: "Media files",
      value: String(gallery.length),
      icon: Images,
    },
    {
      label: "Views tracked",
      value: String(Number(data.view_count ?? data.viewCount ?? 0)),
      icon: Eye,
    },
    {
      label: "Offers received",
      value: String(Number(data.offer_count ?? data.offerCount ?? 0)),
      icon: Sparkles,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <DashboardPageHeader
        title={String(data.title ?? "Listing")}
        description="Review your listing quality, media, contact details, and publishing state in one operational view."
        badge={
          <DashboardStatusBadge tone={statusTone(status)} dot>
            {status}
          </DashboardStatusBadge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate("/provider/listings")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/50 bg-gradient-to-br from-[#f4ede4] via-background to-[#f3f0ea] p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <DashboardStatusBadge tone="info">{listingType}</DashboardStatusBadge>
                  <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {String(data.title ?? "Listing")}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {String(data.location ?? "-")}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {data.created_at ? new Date(String(data.created_at)).toLocaleDateString() : "-"}
                    </span>
                  </div>
                </div>
                <div className="rounded-3xl bg-[#171411] px-5 py-4 text-white shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Current asking</p>
                  <p className="mt-2 text-2xl font-semibold">{formatPrice(data.price, data.listing_type)}</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <div className="overflow-hidden rounded-[24px] border border-border/50 bg-secondary/10">
                {isVideoUrl(activeMedia) ? (
                  <video
                    src={activeMedia}
                    controls
                    preload="metadata"
                    className="h-[250px] w-full bg-black object-cover sm:h-[360px] xl:h-[500px]"
                  />
                ) : (
                  <img
                    src={activeMedia}
                    alt={String(data.title ?? "Listing")}
                    className="h-[250px] w-full object-cover sm:h-[360px] xl:h-[500px]"
                  />
                )}
              </div>

              {gallery.length > 1 ? (
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-7">
                  {gallery.map((media, index) => (
                    <button
                      key={`${media}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`overflow-hidden rounded-2xl border transition ${
                        index === safeIndex
                          ? "border-primary shadow-sm ring-2 ring-primary/15"
                          : "border-border/50 hover:border-border"
                      }`}
                    >
                      {isVideoUrl(media) ? (
                        <div className="flex h-20 items-center justify-center bg-black text-[11px] font-medium text-white/80">
                          Video
                        </div>
                      ) : (
                        <img
                          src={media}
                          alt={`Listing preview ${index + 1}`}
                          className="h-20 w-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <DashboardSectionCard
            title="Listing Description"
            description="The full property story and positioning seen in your inventory."
            className="min-h-0"
          >
            <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4 sm:p-5">
              <p className="text-sm leading-7 text-muted-foreground">
                {String(data.description ?? "No description available.")}
              </p>
            </div>
          </DashboardSectionCard>
        </div>

        <div className="space-y-6 xl:sticky xl:top-20 xl:self-start">
          <DashboardSectionCard
            title="Operational Snapshot"
            description="The key facts you check before editing, publishing, or following up."
            contentClassName="space-y-3"
            className="min-h-0"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { label: "Listing type", value: listingType },
                { label: "Location", value: String(data.location ?? "-") },
                { label: "Published status", value: status },
                { label: "Created", value: data.created_at ? new Date(String(data.created_at)).toLocaleDateString() : "-" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border/60 bg-background px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Contact Record"
            description="The direct contact fields saved on this listing."
            contentClassName="space-y-3"
            className="min-h-0"
          >
            <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Contact name</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <UserRound className="h-4 w-4 text-primary" />
                {String(data.contact_name ?? "-")}
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Contact phone</p>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {maskPhoneNumber(String(data.contact_phone ?? "-"))}
              </div>
            </div>
          </DashboardSectionCard>

          <div className="rounded-[26px] border border-border/60 bg-card p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Provider reminder</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep the title, media, contact fields, and description aligned. Listings with clearer presentation are easier for admin review and easier for seekers to trust.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DashboardStatusBadge tone="info">Inventory view</DashboardStatusBadge>
              <DashboardStatusBadge tone={statusTone(status)}>{status}</DashboardStatusBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
