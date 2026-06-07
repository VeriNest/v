import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Bed,
  Bath,
  Star,
  Eye,
  Home,
  Grid3X3,
  List,
  ArrowRight,
  Maximize,
  Heart,
} from "lucide-react";
import { getPendingPropertyRating, getPropertyImage, propertiesApi, seekerApi, getStoredSession } from "@/lib/api";
import { PageSeo } from "@/components/seo/PageSeo";

type UiProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  rawPrice: number;
  period: string;
  beds: number;
  baths: number;
  sqft: string;
  rating: number;
  views: number;
  match: number;
  type: string;
  propertyType: string;
  image: string;
};

const BUDGET_RANGES: Record<string, { min?: number; max?: number }> = {
  "under-1m": { max: 1_000_000 },
  "1m-3m": { min: 1_000_000, max: 3_000_000 },
  "3m-7m": { min: 3_000_000, max: 7_000_000 },
  "7m-plus": { min: 7_000_000 },
};

function propertyListingType(property: Record<string, unknown>) {
  const listingType = String((property as any).listingType ?? (property as any).listing_type ?? "").toLowerCase();
  if (listingType === "sale") return "Sale";
  if (listingType === "shortlet" || Boolean((property as any).is_service_apartment)) return "Short-let";
  return "Rent";
}

function propertyPricePeriod(property: Record<string, unknown>) {
  const listingType = String((property as any).listingType ?? (property as any).listing_type ?? "").toLowerCase();
  if (listingType === "sale") return "";
  if (listingType === "shortlet" || Boolean((property as any).is_service_apartment)) return "/day";
  return "/year";
}

function normalizeTypeFilter(value: string) {
  return value.toLowerCase().replace(/[\s_-]+/g, "");
}

const Properties = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = getStoredSession();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? searchParams.get("location") ?? "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") ?? "all");
  const [budgetFilter, setBudgetFilter] = useState(searchParams.get("budget") ?? "all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setSearch(searchParams.get("q") ?? searchParams.get("location") ?? "");
    setTypeFilter(searchParams.get("type") ?? "all");
    setBudgetFilter(searchParams.get("budget") ?? "all");
    setPage(1);
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["public-properties", search, page],
    queryFn: () => propertiesApi.listPublic({ 
      location: search || undefined,
      page: page,
      per_page: pageSize
    }),
  });

  const { data: savedProperties = [] } = useQuery({
    queryKey: ["/seeker/saved-properties"],
    queryFn: () => seekerApi.listSaved(),
    enabled: Boolean(session?.user.role === "seeker"),
    staleTime: 0, // Always consider data stale so it refetches
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const savePropertyMutation = useMutation({
    mutationFn: (propertyId: string) => seekerApi.saveProperty(propertyId),
    onSuccess: () => {
      // Use different invalidation strategy for immediate refresh
      queryClient.invalidateQueries({ queryKey: ["/seeker/saved-properties"] });
      queryClient.refetchQueries({ queryKey: ["/seeker/saved-properties"] });
      toast.success("Property saved");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to save property";
      toast.error(message);
    },
  });

  const removePropertyMutation = useMutation({
    mutationFn: (propertyId: string) => seekerApi.removeSavedProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/seeker/saved-properties"] });
      queryClient.refetchQueries({ queryKey: ["/seeker/saved-properties"] });
      toast.success("Property removed from saved");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to remove property";
      toast.error(message);
    },
  });

  const handleSaveProperty = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    const isSaved = savedProperties.some((p: any) => p.id === propertyId || p.property_id === propertyId);
    if (isSaved) {
      removePropertyMutation.mutate(propertyId);
    } else {
      savePropertyMutation.mutate(propertyId);
    }
  };

  // Handle both paginated and non-paginated responses
  const propertiesData = Array.isArray(data) ? data : (data?.items ?? []);
  const total = !Array.isArray(data) && data?.total ? data.total : propertiesData.length;
  const totalPages = Math.ceil(total / pageSize);

  const allProperties = useMemo<UiProperty[]>(
    () => propertiesData.map((property, index) => ({
      id: String(property.id),
      title: String(property.title ?? "Property"),
      location: String(property.location ?? "Unknown location"),
      price: `NGN ${Number(property.price ?? 0).toLocaleString("en-NG")}`,
      rawPrice: Number(property.price ?? 0),
      period: propertyPricePeriod(property),
      beds: Number((property.title as string | undefined)?.match(/(\d+)/)?.[1] ?? 2),
      baths: Number((property.title as string | undefined)?.match(/(\d+)/)?.[1] ?? 2),
      sqft: "--",
      rating: getPendingPropertyRating(property),
      views: Number((property as any).viewCount ?? (property as any).view_count ?? 0),
      match: 80 + (index % 20),
      type: propertyListingType(property),
      propertyType: String((property as any).propertyType ?? (property as any).property_type ?? property.title ?? "")
        .toLowerCase()
        .replace(/\s+/g, "-"),
      image: getPropertyImage(property.images, index),
    })),
    [propertiesData],
  );

  const filtered = allProperties.filter((property) => {
    const normalizedListingType = property.type.toLowerCase().replace(/\s+/g, "-");
    const normalizedFilter = normalizeTypeFilter(typeFilter);
    const matchesType =
      normalizedFilter === "all" ||
      normalizedListingType.replace(/-/g, "") === normalizedFilter ||
      property.propertyType.replace(/-/g, "").includes(normalizedFilter) ||
      property.title.toLowerCase().includes(typeFilter.toLowerCase().replace(/-/g, " "));

    const range = BUDGET_RANGES[budgetFilter];
    const matchesBudget = !range ||
      ((range.min === undefined || property.rawPrice >= range.min) &&
        (range.max === undefined || property.rawPrice < range.max));

    return matchesType && matchesBudget;
  });

  const typeOptions = Array.from(
    new Set([
      ...allProperties.map((property) => property.type.toLowerCase()),
      ...(typeFilter !== "all" ? [typeFilter] : []),
    ]),
  );

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Browse Verified Properties"
        description="Search verified property listings across Nigeria by location, budget, and listing type on Verinest."
        canonicalPath="/properties"
      />
      <Navbar />

      <section className="bg-secondary/30 px-6 pb-16 pt-28 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">Explore</p>
            <h1 className="mb-5 font-serif text-4xl leading-[1.15] text-foreground lg:text-5xl">
              Browse <span className="italic text-primary">Properties</span>
            </h1>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Discover verified rental properties curated to match your lifestyle, budget, and preferences.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-border bg-card p-3 shadow-md">
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <div className="relative w-full flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name or location..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 border-0 bg-secondary/50 pl-9 text-sm focus-visible:ring-1" />
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-12 w-full border-0 bg-secondary/50 sm:w-[160px]">
                      <Home className="mr-1.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {typeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === "short-let" ? "Short-let" : option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                    <SelectTrigger className="h-12 w-full border-0 bg-secondary/50 sm:w-[170px]">
                      <span className="mr-1.5 text-base leading-none text-muted-foreground">₦</span>
                      <SelectValue placeholder="Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Budget</SelectItem>
                      <SelectItem value="under-1m">Under NGN 1M / year</SelectItem>
                      <SelectItem value="1m-3m">NGN 1M - 3M / year</SelectItem>
                      <SelectItem value="3m-7m">NGN 3M - 7M / year</SelectItem>
                      <SelectItem value="7m-plus">NGN 7M+ / year</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1 rounded-xl border border-border bg-secondary/50 p-1">
                    <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-10 w-10 rounded-lg" onClick={() => setViewMode("grid")}>
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-10 w-10 rounded-lg" onClick={() => setViewMode("list")}>
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 py-16 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">Results</p>
              <p className="text-sm text-muted-foreground">{filtered.length} of {total} properties found</p>
            </div>
          </div>

          {isLoading ? (
            <BackendLoadingIndicator label="Loading properties..." className="min-h-[24rem]" />
          ) : viewMode === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property) => (
                <div key={property.id} className="group relative h-[340px] cursor-pointer overflow-hidden rounded-2xl" onClick={() => navigate(`/properties/${property.id}`)}>
                  <img src={property.image} alt={property.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block rounded bg-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      {property.match}% match
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/10 bg-background/90 p-4 backdrop-blur-xl">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{property.type}</p>
                        <h3 className="truncate text-lg font-semibold text-foreground">{property.title}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{property.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{property.price}</p>
                        <p className="text-xs text-muted-foreground">{property.period}</p>
                      </div>
                    </div>
                    <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{property.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="h-4 w-4" />{property.sqft}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" />{property.rating}</span>
                        <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{property.views}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {session?.user.role === "seeker" && (
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => handleSaveProperty(e, property.id)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${savedProperties.some((p: any) => p.id === property.id || p.property_id === property.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                        )}
                        <Button size="sm" className="gap-1.5 rounded-full px-4" onClick={(event) => { event.stopPropagation(); navigate(`/properties/${property.id}`); }}>View <ArrowRight className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((property) => (
                <div key={property.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex flex-col md:flex-row">
                    <img src={property.image} alt={property.title} className="h-60 w-full object-cover md:h-auto md:w-80" />
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div>
                            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{property.type}</p>
                            <h3 className="text-2xl font-semibold text-foreground">{property.title}</h3>
                            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" />{property.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-semibold text-foreground">{property.price}</p>
                            <p className="text-sm text-muted-foreground">{property.period}</p>
                          </div>
                        </div>
                        <div className="mb-4 flex items-center gap-6 text-muted-foreground">
                          <span className="flex items-center gap-2"><Bed className="h-4 w-4" />{property.beds} Beds</span>
                          <span className="flex items-center gap-2"><Bath className="h-4 w-4" />{property.baths} Baths</span>
                          <span className="flex items-center gap-2"><Maximize className="h-4 w-4" />{property.sqft} sqft</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" />{property.rating}</span>
                          <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{property.views} views</span>
                          <span className="rounded bg-primary px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{property.match}% match</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {session?.user.role === "seeker" && (
                            <Button 
                              size="icon" 
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={(e) => handleSaveProperty(e, property.id)}
                            >
                              <Heart 
                                className={`h-4 w-4 ${savedProperties.some((p: any) => p.id === property.id || p.property_id === property.id) ? "fill-red-500 text-red-500" : ""}`}
                              />
                            </Button>
                          )}
                          <Button className="gap-2 rounded-full px-5" onClick={() => navigate(`/properties/${property.id}`)}>View Details <ArrowRight className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = page > 3 ? page - 2 + i : i + 1;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      className="h-10 w-10 rounded-lg p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </MarketingShell>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
