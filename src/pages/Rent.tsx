import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  UserCheck,
  Search,
  Eye,
  FileCheck,
  Shield,
  ArrowRight,
  Users,
  Clock,
  Sparkles,
  Bed,
  Bath,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserCheck,
    title: "Post Your Need",
    description:
      "Share your preferred location, budget, property type, and move-in timeline in one quick request.",
  },
  {
    num: "02",
    icon: Search,
    title: "Receive Matched Offers",
    description:
      "Verified agents and landlords respond with homes that fit your request instead of making you search listing by listing.",
  },
  {
    num: "03",
    icon: Eye,
    title: "Compare and Schedule",
    description:
      "Review pricing, provider details, and available options before booking a viewing that actually suits your needs.",
  },
  {
    num: "04",
    icon: FileCheck,
    title: "Proceed with Confidence",
    description:
      "Move forward with clearer pricing, verified profiles, and support for the next steps after you choose a property.",
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Verified Providers",
    desc: "Listings are tied to verified agents and landlords so seekers can assess who they are dealing with before they proceed.",
  },
  {
    icon: Sparkles,
    title: "Intent-Based Matching",
    desc: "The platform works around what the seeker actually wants, not just whichever listing happens to be published first.",
  },
  {
    icon: Clock,
    title: "Faster Response Flow",
    desc: "Qualified requests and clearer pricing reduce wasted chats and help serious matches move faster.",
  },
  {
    icon: Users,
    title: "Role-Based Experience",
    desc: "Seekers, agents, and landlords each get workflows built for how they actually operate in the rental market.",
  },
];

const categories = [
  {
    title: "Apartments",
    count: "3,200+ active homes",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=400&fit=crop",
  },
  {
    title: "Duplexes",
    count: "1,800+ family-ready options",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=400&fit=crop",
  },
  {
    title: "Studios",
    count: "2,100+ compact city choices",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop",
  },
  {
    title: "Penthouses",
    count: "450+ premium listings",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=400&fit=crop",
  },
];

const featured = [
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=500&fit=crop",
    price: "NGN 1,200,000",
    name: "Spacious 3BR Duplex",
    location: "Ikeja GRA, Lagos",
    beds: 3,
    baths: 3,
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=500&fit=crop",
    price: "NGN 850,000",
    name: "Modern 2BR Apartment",
    location: "Victoria Island, Lagos",
    beds: 2,
    baths: 2,
  },
  {
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&h=500&fit=crop",
    price: "NGN 3,500,000",
    name: "Luxury Penthouse",
    location: "Banana Island, Lagos",
    beds: 4,
    baths: 4,
  },
];

const Rent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-secondary/30 px-6 pb-20 pt-28 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="max-w-xl flex-1">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
                  Rental flow, rebuilt
                </span>
              </div>
              <h1 className="mb-5 font-serif text-4xl leading-[1.15] text-foreground lg:text-5xl xl:text-[3.5rem]">
                Rent with more clarity and{" "}
                <span className="italic text-primary">less wasted time</span>
              </h1>
              <p className="mb-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Verinest helps seekers move from search to shortlist faster with
                verified listings, clearer pricing, and responses from the
                right agents and landlords.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button className="gap-2 rounded-lg px-7 py-6 text-sm font-medium" asChild>
                  <Link to="/properties">
                    Browse Homes <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg border-border px-7 py-6 text-sm font-medium text-foreground hover:bg-accent"
                  asChild
                >
                  <Link to="/signup">Post Your Need</Link>
                </Button>
              </div>
            </div>
            <div className="relative w-full max-w-xl flex-1">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&h=480&fit=crop"
                  alt="Modern rental interior prepared for move-in"
                  className="h-[400px] w-full object-cover lg:h-[460px]"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/30 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-0.5 flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        Spacious 3BR Duplex
                      </h3>
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary">
                        Verified match
                      </span>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Ikeja GRA, Lagos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-base font-bold text-foreground">
                      NGN 1,200,000
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" /> 3
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" /> 3
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="bg-secondary/60 px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="flex flex-col gap-16 lg:flex-row">
            <div className="shrink-0 lg:w-[340px]">
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                How It Works
              </p>
              <h2 className="mb-6 font-serif text-3xl leading-tight text-foreground lg:text-[2.5rem]">
                From Need Post{" "}
                <span className="italic text-primary">to Move-In</span>
              </h2>
              <p className="mb-8 text-[15px] leading-relaxed text-muted-foreground">
                A simpler rental workflow for seekers, agents, and landlords.
              </p>
              <Button
                className="rounded-lg bg-foreground px-7 py-6 text-sm font-medium text-background hover:bg-foreground/90"
                asChild
              >
                <Link to="/signup">Post a Need</Link>
              </Button>
            </div>
            <div className="flex-1 space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.num}
                  className={`flex gap-5 py-8 ${
                    index < steps.length - 1 ? "border-b border-border/60" : ""
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border font-mono text-sm text-muted-foreground">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="mb-2 font-serif text-lg text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Categories
              </p>
              <h2 className="font-serif text-3xl text-foreground lg:text-4xl">
                Browse by type
              </h2>
            </div>
            <Button
              variant="ghost"
              className="gap-2 px-0 text-sm font-medium text-primary hover:bg-transparent hover:text-primary/80"
              asChild
            >
              <Link to="/properties">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link to="/properties" key={category.title}>
                <div className="group relative h-[260px] cursor-pointer overflow-hidden rounded-2xl">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-serif text-lg text-primary-foreground">
                      {category.title}
                    </h3>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-primary-foreground/70">
                      {category.count}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Verified supply
              </p>
              <h2 className="font-serif text-3xl text-foreground lg:text-4xl">
                Featured rentals
              </h2>
            </div>
            <Button
              variant="ghost"
              className="gap-2 px-0 text-sm font-medium text-primary hover:bg-transparent hover:text-primary/80"
              asChild
            >
              <Link to="/properties">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {featured.map((property, index) => (
              <div
                key={property.name}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl ${
                  index === 0 ? "h-[380px] lg:col-span-2" : "h-[380px]"
                }`}
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-border/30 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {property.name}
                    </h3>
                    <p className="shrink-0 font-mono text-sm font-bold text-foreground">
                      {property.price}
                    </p>
                  </div>
                  <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" /> {property.beds}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" /> {property.baths}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1 px-2 text-xs text-primary hover:text-primary/80"
                    >
                      View Details <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mb-14 text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Why Verinest
            </p>
            <h2 className="mb-4 font-serif text-3xl text-foreground lg:text-4xl">
              A rental workflow built for the real market
            </h2>
            <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              The platform is designed to reduce fake supply, unclear pricing,
              and wasted back-and-forth between seekers and providers.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="bg-[hsl(var(--dark-bg))] px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-3xl text-primary-foreground lg:text-4xl">
              Ready to rent with more confidence?
            </h2>
            <p className="mb-10 text-[15px] leading-relaxed text-primary-foreground/40">
              Browse verified homes or post your need and let the right
              providers respond with better context.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="outline"
                className="rounded-lg border-primary-foreground/20 px-8 py-6 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/5"
                asChild
              >
                <Link to="/signup">Post a Need</Link>
              </Button>
              <Button
                className="gap-2 rounded-lg bg-primary px-8 py-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/properties">
                  Browse Homes <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </MarketingShell>
      </section>

      <Footer />
    </div>
  );
};

export default Rent;
