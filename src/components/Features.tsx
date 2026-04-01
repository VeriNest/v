import { Shield, DollarSign, Percent, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Property Insurance",
    description: "We offer our customer property protection of liability coverage and insurance for a better life.",
  },
  {
    icon: DollarSign,
    title: "Best Price",
    description: "Not sure what you should be charging for your property? No need to worry, let us do the numbers for you.",
  },
  {
    icon: Percent,
    title: "Lowest Commission",
    description: "You no longer have to negotiate commissions and haggle with other agents it only cost 2%!",
  },
  {
    icon: SlidersHorizontal,
    title: "Overall Control",
    description: "Get a virtual tour, and be accurate details before you rent a any properties. You get overall control.",
  },
];

const Features = () => {
  return (
    <section className="px-20 py-20">
      <div className="flex gap-10 items-start">
        {/* Left */}
        <div className="w-[280px] shrink-0">
          <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
            The new way to find<br />your new home
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Find your dream place to live in with more than 10k+ properties listed.
          </p>
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=260&fit=crop"
              alt="Modern house"
              className="w-full h-[220px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Button className="absolute bottom-5 left-5 rounded-lg px-5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
              Browse Properties
            </Button>
          </div>
        </div>

        {/* Right 2x2 Grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-10">
          {features.map((feature) => (
            <div key={feature.title}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
