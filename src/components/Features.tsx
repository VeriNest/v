import { BarChart3, Brain, MapPin, Shield, Headphones, Eye } from "lucide-react";

import MarketingShell from "@/components/layout/MarketingShell";

const stats = [
  { value: "12,400+", label: "Verified Listings" },
  { value: "18 min", label: "Avg Response Time" },
  { value: "1,100+", label: "Active Providers" },
  { value: "8,600+", label: "Successful Matches" },
];

const features = [
  {
    icon: BarChart3,
    title: "Post Your Need Once",
    description: "Share your preferred location, budget, and move-in plan once, then let matching providers respond with relevant options.",
  },
  {
    icon: Brain,
    title: "Compare Verified Offers",
    description: "Review verified homes from agents and landlords in one place instead of chasing scattered listings and messages.",
  },
  {
    icon: MapPin,
    title: "Clear Cost Breakdown",
    description: "See rent, deposit, service charges, and key details early so you can filter faster and decide with confidence.",
  },
];

const Features = () => {
  return (
    <>
      <section className="px-6 lg:px-16 xl:px-20 py-16 border-y border-border/50">
        <MarketingShell>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-mono font-medium text-primary mb-1.5 tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <MarketingShell>
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Why Verinest</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
              Rental Matching, Without the Noise
            </h2>
            <p className="text-muted-foreground text-[15px] max-w-lg mx-auto leading-relaxed">
              Verinest helps seekers move faster with verified supply, clearer pricing, and providers who can respond with intent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card rounded-xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <MarketingShell>
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Built for Safer Renting</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="rounded-xl border border-border/50 p-3 bg-card">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=420&fit=crop"
                  alt="Verified modern home interior ready for viewing"
                  className="w-full h-[380px] object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-8">
                {[
                  { icon: Shield, title: "Verified Providers", desc: "Every listing is tied to an agent or landlord profile so seekers know who they are dealing with before they engage." },
                  { icon: Headphones, title: "Viewing and Dispute Support", desc: "Track viewings, offers, and next steps in one workflow instead of depending on scattered calls and chats." },
                  { icon: Eye, title: "Clear Cost Breakdown", desc: "See rent, deposit, service charge, and payment expectations before you commit to a property." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MarketingShell>
      </section>
    </>
  );
};

export default Features;
