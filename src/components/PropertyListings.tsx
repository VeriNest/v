import { ArrowRight, BedDouble, MoveRight, Square } from "lucide-react";
import { Link } from "react-router-dom";

import MarketingShell from "@/components/layout/MarketingShell";
import { cn } from "@/lib/utils";
import palmResidenceImage from "../../images/wmremove-transformed (3).jpeg";
import admiraltySuitesImage from "../../images/wmremove-transformed (4).jpeg";

type ListingTile = {
  title: string;
  location: string;
  price: string;
  image: string;
  alt: string;
  beds?: string;
  area?: string;
  featured?: boolean;
  accentArrow?: boolean;
  heightClass: string;
  variant: "hero" | "portrait" | "small" | "wide";
};

const topListings: ListingTile[] = [
  {
    title: "Palm Residence",
    location: "Lekki Phase 1, Lagos",
    price: "NGN 12.5M / year",
    image: palmResidenceImage,
    alt: "Modern multi-storey residence with black and white facade",
    beds: "6 Beds",
    area: "8,200 sqft",
    featured: true,
    heightClass: "h-[320px] md:h-[360px] lg:h-[385px]",
    variant: "hero",
  },
  {
    title: "Skyline Penthouse",
    location: "Victoria Island, Lagos",
    price: "NGN 8.9M / year",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    alt: "Penthouse interior with panoramic dusk skyline view",
    heightClass: "h-[320px] md:h-[360px] lg:h-[385px]",
    variant: "portrait",
  },
];

const bottomListings: ListingTile[] = [
  {
    title: "Admiralty Suites",
    location: "Ikoyi, Lagos",
    price: "NGN 3.2M / year",
    image: admiraltySuitesImage,
    alt: "Contemporary white residence with palm tree in the courtyard",
    heightClass: "h-[260px] md:h-[280px] lg:h-[230px]",
    variant: "small",
  },
  {
    title: "Coastal Retreat",
    location: "Oniru, Lagos",
    price: "NGN 15.8M / year",
    image:
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1400&q=80",
    alt: "Luxury clifftop property at sunset overlooking the ocean",
    accentArrow: true,
    heightClass: "h-[320px] md:h-[380px] lg:h-[430px]",
    variant: "wide",
  },
];

const tileBase =
  "group relative overflow-hidden rounded-[1.35rem] bg-slate-950 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.55)]";

function ListingCard({
  title,
  location,
  price,
  image,
  alt,
  beds,
  area,
  featured,
  accentArrow,
  heightClass,
  variant,
}: ListingTile) {
  const isHero = variant === "hero";
  const isPortrait = variant === "portrait";
  const isSmall = variant === "small";
  const isWide = variant === "wide";

  return (
    <article className={`${tileBase} ${heightClass}`}>
      <img
        src={image}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div
        className={cn(
          "absolute inset-0",
          isPortrait
            ? "bg-gradient-to-b from-slate-950/28 via-slate-950/16 to-slate-950/88"
            : "bg-gradient-to-b from-slate-950/26 via-slate-950/12 to-slate-950/88",
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/88 via-black/42 to-transparent" />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0",
          isWide ? "p-5 sm:p-6" : "p-4 sm:p-5",
        )}
      >
        {featured ? (
          <span className="mb-3 inline-flex rounded-md bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
            Featured
          </span>
        ) : null}

        <div className="space-y-1">
          <h3
            className={cn(
              "font-serif leading-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]",
              isHero ? "text-[1.9rem] sm:text-[2.15rem]" : "",
              isWide ? "text-[1.85rem] sm:text-[2.05rem]" : "",
              isPortrait ? "text-[1.4rem] sm:text-[1.55rem]" : "",
              isSmall ? "text-[1.35rem] sm:text-[1.45rem]" : "",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]",
              isHero || isWide ? "text-xs sm:text-[13px]" : "text-[11px] sm:text-xs",
            )}
          >
            {location}
          </p>
        </div>

        <div
          className={cn(
            "flex items-end justify-between gap-3",
            isHero ? "mt-4 border-t border-white/10 pt-3" : "",
            isWide ? "mt-5 border-t border-white/10 pt-3.5" : "",
            isPortrait ? "mt-4" : "",
            isSmall ? "mt-4" : "",
          )}
        >
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
              {price}
            </p>
            {isHero && (beds || area) ? (
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/88 [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">
                {beds ? (
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="h-3.5 w-3.5" />
                    {beds}
                  </span>
                ) : null}
                {area ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Square className="h-3.5 w-3.5" />
                    {area}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {accentArrow ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/6 text-white transition-colors group-hover:bg-white group-hover:text-slate-950">
              <MoveRight className="h-4 w-4" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function PropertyListings() {
  return (
    <section className="bg-background px-6 py-20 lg:px-16 lg:py-24 xl:px-20">
      <MarketingShell className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">
              Exclusive Selection
            </p>
            <h2 className="font-serif text-3xl leading-none text-foreground sm:text-4xl lg:text-[3rem]">
              Curated Listings
            </h2>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 self-start text-xs font-medium uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-75 sm:self-auto"
          >
            Browse All Homes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.98fr)_minmax(250px,0.96fr)]">
            {topListings.map((listing) => (
              <ListingCard key={listing.title} {...listing} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(195px,0.68fr)_minmax(0,1.56fr)] lg:items-start">
            {bottomListings.map((listing) => (
              <ListingCard key={listing.title} {...listing} />
            ))}
          </div>
        </div>
      </MarketingShell>
    </section>
  );
}
