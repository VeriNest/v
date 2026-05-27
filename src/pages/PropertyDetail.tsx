import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPropertyImage, getStoredSession, propertiesApi, seekerApi } from "@/lib/api";
import { CommentSection } from "@/components/CommentSection";
import { MessageSquare, CalendarDays, Heart, MapPin, ShieldCheck } from "lucide-react";
import { PageSeo } from "@/components/seo/PageSeo";

const videoExtensions = [".mp4", ".mov", ".webm", ".ogg", ".m4v", ".avi", ".mkv"];

function isVideoUrl(url: string) {
  const normalized = url.split("?")[0].toLowerCase();
  return videoExtensions.some((extension) => normalized.endsWith(extension));
}

function listingTypeLabel(property: Record<string, unknown>) {
  const listingType = String((property as any).listingType ?? (property as any).listing_type ?? "").toLowerCase();
  if (listingType === "sale") return "Sale";
  if (listingType === "shortlet" || Boolean((property as any).is_service_apartment)) return "Short-let";
  return "Rent";
}

function listingPriceLabel(property: Record<string, unknown>) {
  const listingType = String((property as any).listingType ?? (property as any).listing_type ?? "").toLowerCase();
  if (listingType === "sale") return "total price";
  if (listingType === "shortlet" || Boolean((property as any).is_service_apartment)) return "per day";
  return "per year";
}

function statusLabel(status: unknown) {
  const statusStr = String(status ?? "published").toLowerCase();
  const statusMap: Record<string, string> = {
    published: "Published",
    hidden: "Hidden",
    pending: "Pending",
    rejected: "Rejected",
    archived: "Archived",
    suspended: "Suspended",
  };
  return statusMap[statusStr] || "Published";
}

function parseLocationParts(location: string) {
  const parts = location
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    area: parts[0] || "Property Area",
    city: parts[1] || parts[0] || "Property City",
    state: parts[2] || parts[1] || "Property State",
  };
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const session = getStoredSession();
  const [isNeedDialogOpen, setIsNeedDialogOpen] = useState(false);
  const [needTitle, setNeedTitle] = useState("");
  const [needMinBudget, setNeedMinBudget] = useState("");
  const [needMaxBudget, setNeedMaxBudget] = useState("");
  const [needMessage, setNeedMessage] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["/properties", id, "public"],
    queryFn: () => propertiesApi.getById(id!),
    enabled: Boolean(id),
  });
  const { data: savedProperties = [] } = useQuery({
    queryKey: ["/seeker/saved-properties"],
    queryFn: () => seekerApi.listSaved(),
    enabled: Boolean(session?.user.role === "seeker"),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const isSaved = savedProperties.some((p: any) => String(p.id) === id || String(p.property_id) === id);

  const propertyType = useMemo(() => {
    if (!data) return "rent";
    return String(data.listing_type ?? (data.is_service_apartment ? "shortlet" : "rent")).toLowerCase();
  }, [data]);

  const resolvedAgentId = useMemo(() => {
    if (!data) return null;
    return String(data.agent_id ?? data.agentId ?? data.owner_id ?? data.ownerId ?? "");
  }, [data]);

  const propertyImage = useMemo(() => {
    if (!data) return getPropertyImage([], 0);
    return getPropertyImage(Array.isArray(data.images) ? data.images : [], 0);
  }, [data]);

  useEffect(() => {
    if (!data || isNeedDialogOpen) {
      return;
    }

    const basePrice = Number(data.price ?? 0);
    const title = String(data.title ?? "this property");
    setNeedTitle(`Interested in ${title}`);
    setNeedMinBudget(String(Math.max(Math.round(basePrice * 0.9), 0)));
    setNeedMaxBudget(String(Math.max(Math.round(basePrice * 1.1), basePrice)));
    setNeedMessage(
      `I want to rent ${title} at ${String(data.location ?? "this location")}. Please share the next steps and availability for this exact listing.`,
    );
  }, [data, isNeedDialogOpen]);

  const postNeedMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => seekerApi.createNeed(payload),
    onSuccess: () => {
      toast.success("Your need has been sent directly to the listing provider.");
      setIsNeedDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/seeker/needs"] });
      queryClient.invalidateQueries({ queryKey: ["/seeker/dashboard/overview"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to post need";
      toast.error(message);
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (isSaved) {
        return seekerApi.removeSavedProperty(id!);
      } else {
        return seekerApi.saveProperty(id!);
      }
    },
    onSuccess: () => {
      if (isSaved) {
        toast.success("Property removed from saved");
      } else {
        toast.success("Property saved");
      }
      queryClient.invalidateQueries({ queryKey: ["/seeker/saved-properties"] });
      queryClient.refetchQueries({ queryKey: ["/seeker/saved-properties"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to save property";
      toast.error(message);
    },
  });

  const handleCreateTargetedNeed = () => {
    if (!data || !id || !resolvedAgentId) {
      toast.error("This property cannot receive a targeted need right now.");
      return;
    }

    const minBudget = Number(needMinBudget);
    const maxBudget = Number(needMaxBudget);

    if (!Number.isFinite(minBudget) || !Number.isFinite(maxBudget) || minBudget <= 0 || maxBudget <= 0) {
      toast.error("Enter a valid budget range.");
      return;
    }

    if (maxBudget < minBudget) {
      toast.error("Maximum budget must be greater than or equal to minimum budget.");
      return;
    }

    const { area, city, state } = parseLocationParts(String(data.location ?? ""));
    const inferredBedrooms = Math.max(Number(String((data as any).bedrooms ?? 1)) || 1, 1);

    postNeedMutation.mutate({
      request_title: needTitle.trim() || `Interested in ${String(data.title ?? "this property")}`,
      area,
      city,
      state,
      property_type: propertyType,
      bedrooms: inferredBedrooms,
      min_budget: minBudget,
      max_budget: maxBudget,
      pricing_preference: propertyType === "sale" ? "total" : propertyType === "shortlet" ? "per_night" : "per_year",
      desired_features: ["Exact property request"],
      description:
        needMessage.trim() ||
        `I want to rent ${String(data.title ?? "this property")} at ${String(data.location ?? "this location")}.`,
      target_agent_id: resolvedAgentId,
      target_property_id: id,
      target_property_title: String(data.title ?? "Property"),
      target_property_image_url: propertyImage,
      target_property_location: String(data.location ?? ""),
    });
  };

  const media = Array.isArray(data?.images) ? data.images : [getPropertyImage([], 0)];
  const typeLabel = data ? listingTypeLabel(data as Record<string, unknown>) : "Rent";
  const priceLabel = data ? listingPriceLabel(data as Record<string, unknown>) : "per year";

  return (
    <div className="min-h-screen bg-background">
      {data && (
        <PageSeo
          title={`${String(data.title ?? "Property")} in ${String(data.location ?? "Nigeria")}`}
          description={String(data.description ?? `Explore ${String(data.title ?? "this property")} listed on Verinest.`)}
          canonicalPath={`/properties/${id}`}
          image={propertyImage}
        />
      )}
      <Navbar />
      <section className="px-6 pb-16 pt-24 lg:px-16 xl:px-20">
        <MarketingShell>
          {isLoading ? (
            <BackendLoadingIndicator label="Loading property..." className="min-h-[60vh]" />
          ) : !data ? (
            <div className="py-20 text-center text-muted-foreground">Property not found.</div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{typeLabel}</Badge>
                    <Badge variant="outline">{statusLabel(data.status)}</Badge>
                    <Badge variant="outline">{Number(data.viewCount ?? data.view_count ?? 0)} views</Badge>
                    <Badge variant="outline">{Number(data.offerCount ?? data.offer_count ?? 0)} offers</Badge>
                  </div>
                  <h1 className="text-3xl font-semibold text-foreground">{String(data.title ?? "Property")}</h1>
                  <p className="mt-2 flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {String(data.location ?? "Unknown location")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">NGN {Number(data.price ?? 0).toLocaleString("en-NG")}</p>
                    <p className="text-sm text-muted-foreground">{priceLabel}</p>
                  </div>
                  {session?.user.role === "seeker" ? (
                    <div className="flex gap-2">
                      <Button className="gap-2" onClick={() => setIsNeedDialogOpen(true)} disabled={!resolvedAgentId}>
                        <MessageSquare className="h-4 w-4" /> Post a Need
                      </Button>
                      <Button 
                        variant={isSaved ? "default" : "outline"} 
                        className="gap-2" 
                        onClick={() => saveMutation.mutate()} 
                        disabled={saveMutation.isPending}
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} /> 
                        {isSaved ? "Saved" : "Save Property"}
                      </Button>
                    </div>
                  ) : (
                    <Button asChild>
                      <Link to={session ? "/seeker" : "/login"}>{session ? "Go to dashboard" : "Sign in"}</Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {media.map((item, index) =>
                  isVideoUrl(String(item)) ? (
                    <video key={`${item}-${index}`} src={String(item)} controls preload="metadata" className="h-72 w-full rounded-2xl bg-black object-cover" />
                  ) : (
                    <img key={`${item}-${index}`} src={String(item)} alt={String(data.title ?? "Property")} className="h-72 w-full rounded-2xl object-cover" />
                  ),
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_320px]">
                <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-foreground">Description</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{String(data.description ?? "No description provided.")}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-foreground">Listing Details</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Owner</span><span className="font-medium text-foreground">{String(data.owner_name ?? data.ownerName ?? "-")}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Agent</span><span className="font-medium text-foreground">{String(data.company_name ?? data.companyName ?? data.agent_name ?? data.agentName ?? "-")}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium text-foreground">{data.created_at || data.createdAt ? new Date(String(data.created_at ?? data.createdAt)).toLocaleDateString() : "-"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Listing type</span><span className="font-medium text-foreground">{typeLabel}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Verification</span><span className="inline-flex items-center gap-1 font-medium text-foreground"><ShieldCheck className="h-4 w-4 text-emerald-600" /> {statusLabel(data.status)}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Updated</span><span className="inline-flex items-center gap-1 font-medium text-foreground"><CalendarDays className="h-4 w-4" /> {data.updated_at || data.updatedAt ? new Date(String(data.updated_at ?? data.updatedAt)).toLocaleDateString() : "-"}</span></div>
                  </div>
                </div>
              </div>

              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <CommentSection propertyId={id!} />
                </CardContent>
              </Card>
            </div>
          )}
        </MarketingShell>
      </section>
      <Dialog open={isNeedDialogOpen} onOpenChange={setIsNeedDialogOpen}>
        <DialogContent className="max-w-xl overflow-hidden border-0 p-0 sm:rounded-[28px]">
          <div className="bg-[#f6efe6] p-6 sm:p-7">
            <DialogHeader className="text-left">
              <DialogTitle className="font-serif text-3xl text-[#1a1814]">Post a Need for This Property</DialogTitle>
              <DialogDescription className="max-w-lg text-[13px] leading-6 text-[#7d6e60]">
                This request will go only to the provider managing this listing, using the same seeker need flow and offer pipeline.
              </DialogDescription>
            </DialogHeader>

            {data ? (
              <div className="mt-5 rounded-[24px] border border-[#e8dbcc] bg-white/85 p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <img src={propertyImage} alt={String(data.title ?? "Property")} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-base font-semibold text-[#1a1814]">{String(data.title ?? "Property")}</p>
                    <p className="mt-1 text-sm text-[#8b7b6d]">{String(data.location ?? "Unknown location")}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="border-[#ead9c7] bg-[#fcf7f0] text-[#7a5b47]">
                        {typeLabel}
                      </Badge>
                      <Badge variant="outline" className="border-[#ead9c7] bg-[#fcf7f0] text-[#7a5b47]">
                        NGN {Number(data.price ?? 0).toLocaleString("en-NG")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-5 p-6 sm:p-7">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Need title</p>
              <Input value={needTitle} onChange={(event) => setNeedTitle(event.target.value)} placeholder="Interested in this property" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Minimum budget</p>
                <Input value={needMinBudget} onChange={(event) => setNeedMinBudget(event.target.value)} inputMode="numeric" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Maximum budget</p>
                <Input value={needMaxBudget} onChange={(event) => setNeedMaxBudget(event.target.value)} inputMode="numeric" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Message to provider</p>
              <Textarea
                value={needMessage}
                onChange={(event) => setNeedMessage(event.target.value)}
                className="min-h-[140px] resize-none"
                placeholder="Tell the provider what you need for this exact listing."
              />
            </div>

            <DialogFooter className="gap-3 sm:justify-between sm:space-x-0">
              <Button variant="outline" onClick={() => setIsNeedDialogOpen(false)} disabled={postNeedMutation.isPending}>
                Cancel
              </Button>
              <Button className="min-w-[180px]" onClick={handleCreateTargetedNeed} disabled={postNeedMutation.isPending}>
                {postNeedMutation.isPending ? "Sending need..." : "Send Need to Provider"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
