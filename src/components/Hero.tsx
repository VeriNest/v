import { ArrowRight, Bed, ShowerHead, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="px-8 lg:px-20 pt-16 pb-8 flex flex-col lg:flex-row items-center gap-16">
      {/* Left */}
      <div className="flex-1 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Smart Real Estate</span>
        </div>

        <h1 className="text-4xl lg:text-[3.4rem] font-bold leading-[1.15] text-foreground mb-6">
          Discover Your{" "}
          <span className="italic text-primary font-semibold">Dream Home</span> with Dwello
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-md">
          Experience the future of real estate. Find the market's finest listings tailored specifically to your lifestyle, removing the noise from your property search.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Button className="rounded-full px-8 py-6 text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2">
            Explore Properties <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="rounded-full px-8 py-6 text-sm border-border hover:bg-accent gap-2">
            Browse Rentals
          </Button>
        </div>

        {/* Avatars + social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[11, 12, 13].map((i) => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-background overflow-hidden">
                <img src={`https://i.pravatar.cc/36?img=${i}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-9 h-9 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
              +2k
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Join <span className="font-semibold text-foreground">2,000+</span> happy homeowners</p>
        </div>
      </div>

      {/* Right - Hero image with property card */}
      <div className="flex-1 relative max-w-xl w-full">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-foreground/10">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=500&fit=crop"
            alt="Luxury villa with pool"
            className="w-full h-[420px] object-cover"
          />
        </div>

        {/* Property overlay card */}
        <div className="absolute -bottom-6 left-4 right-4 bg-card rounded-2xl p-5 shadow-xl border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Villa Serenity</h3>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Featured</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Beverly Hills, CA</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">$4,250,000</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> 4</span>
                <span className="flex items-center gap-1"><ShowerHead className="w-3.5 h-3.5" /> 3.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
