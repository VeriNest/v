import { ArrowRight, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="px-6 lg:px-16 xl:px-20 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-12 bg-secondary/30">
      {/* Left */}
      <div className="flex-1 max-w-xl">
        <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-widest">AI-Powered Real Estate</span>
        </div>

        <h1 className="font-serif text-4xl lg:text-[3.5rem] leading-[1.15] text-foreground mb-6">
          Discover Your{" "}
          <span className="italic text-primary">Dream Home</span> with AI Intelligence
        </h1>

        <p className="text-muted-foreground text-[15px] leading-relaxed mb-10 max-w-md">
          Experience the future of real estate. Our proprietary AI curates the market's finest listings tailored specifically to your lifestyle, removing the noise from your property search.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Button className="rounded-lg px-7 py-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            Explore Properties <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="rounded-lg px-7 py-6 text-sm font-medium border-border text-foreground hover:bg-accent gap-2">
            AI Property Hub
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {[11, 12, 13].map((i) => (
              <div key={i} className="w-9 h-9 rounded-full border-[2.5px] border-background overflow-hidden">
                <img src={`https://i.pravatar.cc/36?img=${i}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-9 h-9 rounded-full border-[2.5px] border-background bg-primary flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
              +2k
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Join <span className="font-semibold text-foreground">2,000+</span> happy homeowners
          </p>
        </div>
      </div>

      {/* Right - Hero image with property card */}
      <div className="flex-1 relative max-w-xl w-full">
        <div className="rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=480&fit=crop"
            alt="Luxury villa with pool"
            className="w-full h-[440px] lg:h-[500px] object-cover"
          />
        </div>

        {/* Property overlay card */}
        <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-foreground text-sm">Villa Serenity</h3>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                  AI Match: 98%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Beverly Hills, CA</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-foreground font-mono">$4,250,000</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> 4</span>
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> 3.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
