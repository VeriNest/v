import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { getPendingPropertyRating, getPropertyImage, propertiesApi } from "@/lib/api";

type UiProperty = {
  id: string;
  title: string;
  location: string;
  price: string;
  period: string;
  beds: number;
  baths: number;
  sqft: string;
  rating: number;
  views: number;
  match: number;
  type: string;
  image: string;
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

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const { data = [], isLoading } = useQuery({
    queryKey: ["public-properties", search],
    queryFn: () => propertiesApi.listPublic({ location: search || undefined }),
  });

  const allProperties = useMemo<UiProperty[]>(
    () => data.map((property, index) => ({
      id: String(property.id),
      title: String(property.title ?? "Property"),
      location: String(property.location ?? "Unknown location"),
      price: `NGN ${Number(property.price ?? 0).toLocaleString("en-NG")}`,
      period: propertyPricePeriod(property),
      beds: Number((property.title as string | undefined)?.match(/(\d+)/)?.[1] ?? 2),
      baths: Number((property.title as string | undefined)?.match(/(\d+)/)?.[1] ?? 2),
      sqft: "--",
      rating: getPendingPropertyRating(property),
      views: Number((property as any).viewCount ?? (property as any).view_count ?? 0),
      match: 80 + (index % 20),
      type: propertyListingType(property),
      image: getPropertyImage(property.images, index),
    })),
    [data],
  );

  const filtered = allProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(search.toLowerCase()) ||
      property.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeOptions = Array.from(new Set(allProperties.map((property) => property.type)));

  return (
    <div className="min-h-screen bg-background">
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
                      {typeOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
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
              <p className="text-sm text-muted-foreground">{filtered.length} properties found</p>
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
                      <Button size="sm" className="gap-1.5 rounded-full px-4" onClick={(event) => { event.stopPropagation(); navigate(`/properties/${property.id}`); }}>View <ArrowRight className="h-4 w-4" /></Button>
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
                        <Button className="gap-2 rounded-full px-5" onClick={() => navigate(`/properties/${property.id}`)}>View Details <ArrowRight className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MarketingShell>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
