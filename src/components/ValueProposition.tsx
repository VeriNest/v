import { UserCheck, Search, Eye, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: "01",
    icon: UserCheck,
    title: "Post Your Need",
    description: "Share your preferred location, budget, property type, and move-in timeline in one quick request.",
  },
  {
    num: "02",
    icon: Search,
    title: "Receive Matched Offers",
    description: "Verified agents and landlords respond with homes that fit your request instead of making you search listing by listing.",
  },
  {
    num: "03",
    icon: Eye,
    title: "Compare and Schedule",
    description: "Review pricing, provider details, and available options before booking a viewing that actually suits your needs.",
  },
  {
    num: "04",
    icon: FileCheck,
    title: "Proceed with Confidence",
    description: "Move forward with clearer pricing, verified profiles, and support for the next steps after you choose a property.",
  },
];

const ValueProposition = () => {
  return (
    <section className="px-6 lg:px-16 xl:px-20 py-20 bg-secondary/60">
      <MarketingShell>
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[340px] shrink-0">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">How It Works</p>
            <h2 className="font-serif text-3xl lg:text-[2.5rem] text-foreground leading-tight mb-6">
              From Need Post{" "}
              <span className="italic text-primary">to Move-In</span>
            </h2>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
              A simpler rental workflow for seekers, agents, and landlords.
            </p>
            <Button className="rounded-lg px-7 py-6 bg-foreground text-background hover:bg-foreground/90 text-sm font-medium" asChild>
              <Link to="/seeker/post">
                Post a Need
              </Link>
            </Button>
          </div>

          <div className="flex-1 space-y-0">
            {steps.map((step, i) => (
              <div key={step.num} className={`flex gap-5 py-8 ${i < steps.length - 1 ? "border-b border-border/60" : ""}`}>
                <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0 text-sm font-mono text-muted-foreground">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MarketingShell>
    </section>
  );
};

export default ValueProposition;
