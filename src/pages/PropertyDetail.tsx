import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getPropertyImage, getStoredSession, propertiesApi, reviewsApi, seekerApi } from "@/lib/api";
import { CalendarDays, Heart, MapPin, ShieldCheck, Star } from "lucide-react";

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

export default function PropertyDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const session = getStoredSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["/properties", id, "public"],
    queryFn: () => propertiesApi.getById(id!),
    enabled: Boolean(id),
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["/properties", id, "reviews"],
    queryFn: () => propertiesApi.reviews(id!),
    enabled: Boolean(id),
  });

  const saveMutation = useMutation({
    mutationFn: () => seekerApi.saveProperty(id!),
    onSuccess: () => {
      toast.success("Property saved");
      queryClient.invalidateQueries({ queryKey: ["/seeker/saved-properties"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to save property";
      toast.error(message);
    },
  });
  const reviewMutation = useMutation({
    mutationFn: () =>
      reviewsApi.create({
        revieweeId: String(data?.agent_id ?? data?.agentId ?? data?.owner_id ?? data?.ownerId ?? ""),
        propertyId: id!,
        rating,
        comment,
      }),
    onSuccess: () => {
      toast.success("Property review submitted");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["/properties", id, "reviews"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to submit review";
      toast.error(message);
    },
  });

  const media = Array.isArray(data?.images) ? data.images : [getPropertyImage([], 0)];
  const reviewTargetId = String(data?.agent_id ?? data?.agentId ?? data?.owner_id ?? data?.ownerId ?? "");
  const typeLabel = data ? listingTypeLabel(data as Record<string, unknown>) : "Rent";
  const priceLabel = data ? listingPriceLabel(data as Record<string, unknown>) : "per year";

  return (
    <div className="min-h-screen bg-background">
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
                    <Badge variant="outline">{String(data.status ?? "published")}</Badge>
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
                    <Button className="gap-2" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                      <Heart className="h-4 w-4" /> Save Property
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link to={session ? "/seeker" : "/login"}>{session ? "Go to dashboard" : "Sign in to save"}</Link>
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
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Agent</span><span className="font-medium text-foreground">{String(data.agent_name ?? data.agentName ?? "-")}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium text-foreground">{data.created_at || data.createdAt ? new Date(String(data.created_at ?? data.createdAt)).toLocaleDateString() : "-"}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Listing type</span><span className="font-medium text-foreground">{typeLabel}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Verification</span><span className="inline-flex items-center gap-1 font-medium text-foreground"><ShieldCheck className="h-4 w-4 text-emerald-600" /> {String(data.status ?? "published")}</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Updated</span><span className="inline-flex items-center gap-1 font-medium text-foreground"><CalendarDays className="h-4 w-4" /> {data.updated_at || data.updatedAt ? new Date(String(data.updated_at ?? data.updatedAt)).toLocaleDateString() : "-"}</span></div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Property Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reviews.length ? (
                      reviews.map((review: any) => (
                        <div key={review.id} className="rounded-2xl border border-border/60 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">{review.reviewerName ?? review.reviewer_name ?? "Verified user"}</p>
                              <p className="text-xs text-muted-foreground">{review.createdAt ?? review.created_at ? new Date(String(review.createdAt ?? review.created_at)).toLocaleDateString() : ""}</p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              {Array.from({ length: Number(review.rating ?? 0) }).map((_, index) => (
                                <Star key={index} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground">{String(review.comment ?? "")}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No property reviews yet.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle>Leave a Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session?.user.role === "seeker" && reviewTargetId ? (
                      <>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button key={value} type="button" onClick={() => setRating(value)} className={value <= rating ? "text-amber-500" : "text-muted-foreground/40"}>
                              <Star className={`h-5 w-5 ${value <= rating ? "fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          rows={5}
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          placeholder="Share your experience with this property."
                        />
                        <Button
                          onClick={() => reviewMutation.mutate()}
                          disabled={reviewMutation.isPending || comment.trim().length < 6}
                        >
                          Submit property review
                        </Button>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Sign in as a seeker and interact with the property before leaving a review.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </MarketingShell>
      </section>
      <Footer />
    </div>
  );
}
