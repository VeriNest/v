import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketingShell from "@/components/layout/MarketingShell";
import {
  Shield,
  Users,
  Target,
  Heart,
  Award,
  Eye,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Shield,
    title: "Trust by Design",
    description:
      "We focus on clearer verification, more visible provider identity, and cleaner rental workflows so users can make better decisions.",
  },
  {
    icon: Users,
    title: "Role-Aware Workflows",
    description:
      "Seekers, agents, landlords, and admins should not all see the same product surface. Each role needs tools that fit how they actually operate.",
  },
  {
    icon: Target,
    title: "Useful Matching",
    description:
      "The goal is not noise. It is better-fit homes, fewer wasted chats, and faster movement from intent to real options.",
  },
  {
    icon: Heart,
    title: "Human Support",
    description:
      "Technology helps structure the journey, but support matters when pricing is unclear, listings are disputed, or users need help moving forward.",
  },
];

const stats = [
  { value: "12K+", label: "Verified Listings" },
  { value: "8.6K+", label: "Successful Matches" },
  { value: "1.1K+", label: "Active Providers" },
  { value: "18 min", label: "Avg Response Time" },
];

const team = [
  { name: "Tosin Adeyemi", role: "Operations & Trust", avatar: 15 },
  { name: "Chinonso Okeke", role: "Product & Platform", avatar: 32 },
  { name: "Amina Bello", role: "Provider Success", avatar: 44 },
  { name: "David Nwosu", role: "Design & Experience", avatar: 56 },
];

const missionPoints = [
  {
    icon: Award,
    title: "Verified Supply",
    desc: "We want seekers to browse and compare homes tied to real providers, not anonymous listings with weak context.",
  },
  {
    icon: Headphones,
    title: "Operational Support",
    desc: "Verinest is built to support viewings, responses, disputes, and day-to-day rental coordination, not just passive listing discovery.",
  },
  {
    icon: Eye,
    title: "Visible Pricing",
    desc: "Rent, deposits, service charges, and other expectations should be easier to understand before a user wastes time on the wrong option.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-secondary/30 px-6 pb-20 pt-28 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="max-w-xl flex-1">
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                About Verinest
              </p>
              <h1 className="mb-5 font-serif text-4xl leading-[1.15] text-foreground lg:text-5xl">
                Building a{" "}
                <span className="italic text-primary">clearer rental marketplace</span>
              </h1>
              <p className="mb-8 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                Verinest is designed to reduce friction between seekers, agents,
                and landlords by making supply more visible, responses more
                structured, and decisions easier to trust.
              </p>
              <Button className="gap-2 rounded-lg px-7 py-6 text-sm font-medium" asChild>
                <Link to="/properties">
                  Browse Homes <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative w-full max-w-xl flex-1">
              <div className="overflow-hidden rounded-2xl border border-border/30 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&h=480&fit=crop"
                  alt="Modern residential interior representing verified rental supply"
                  className="h-[400px] w-full object-cover lg:h-[460px]"
                />
              </div>
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="border-y border-border/50 px-6 py-16 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="mb-1.5 font-mono text-3xl font-medium tracking-tight text-primary lg:text-4xl">
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mb-14 text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Our Foundation
            </p>
            <h2 className="mb-4 font-serif text-3xl text-foreground lg:text-4xl">
              What the platform is built around
            </h2>
            <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              These are the principles shaping the product and the experience
              across marketing, search, and each dashboard role.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-lg text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="bg-secondary/60 px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mb-14 text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Our People
            </p>
            <h2 className="mb-4 font-serif text-3xl text-foreground lg:text-4xl">
              The team behind the workflow
            </h2>
            <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              A cross-functional team shaping product, operations, provider
              trust, and the everyday renter experience.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-border/50 bg-card p-7 text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="mx-auto mb-5 h-20 w-20 overflow-hidden rounded-full border-[3px] border-background shadow-md">
                  <img
                    src={`https://i.pravatar.cc/80?img=${member.avatar}`}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-serif text-base text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="flex-1">
              <div className="rounded-xl border border-border/50 bg-card p-3">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=420&fit=crop"
                  alt="Modern residential building exterior"
                  className="h-[380px] w-full rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Our Mission
              </p>
              <h2 className="mb-6 font-serif text-3xl leading-tight text-foreground lg:text-[2.5rem]">
                Renting should feel{" "}
                <span className="italic text-primary">less chaotic</span>
              </h2>
              <div className="space-y-8">
                {missionPoints.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-serif text-base text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="bg-[hsl(var(--dark-bg))] px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-3xl text-primary-foreground lg:text-4xl">
              Ready to use a better rental workflow?
            </h2>
            <p className="mb-10 text-[15px] leading-relaxed text-primary-foreground/40">
              Whether you are searching, listing, or managing supply, the
              platform is built to make the process more visible and easier to
              trust.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="outline"
                className="rounded-lg border-primary-foreground/20 px-8 py-6 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/5"
                asChild
              >
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button
                className="rounded-lg bg-primary px-8 py-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link to="/properties">Browse Homes</Link>
              </Button>
            </div>
          </div>
        </MarketingShell>
      </section>

      <Footer />
    </div>
  );
};

export default About;
