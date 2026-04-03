import { Bed, Bath, Search, MapPin, Home, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    console.log("Search:", { searchQuery, propertyType, budget });
  };

  return (
    <section className="px-6 lg:px-16 xl:px-20 pt-28 pb-16 bg-secondary/30 min-h-[calc(100vh-64px)] flex flex-col justify-center">
      {/* Top row: text + image */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 mb-12">
        {/* Left */}
        <div className="flex-1 max-w-xl lg:py-4">
          <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-widest">AI-Powered Real Estate</span>
          </div>

          <h1 className="font-serif text-4xl lg:text-5xl xl:text-[3.5rem] leading-[1.15] text-foreground mb-5">
            Discover Your{" "}
            <span className="italic text-primary">Dream Home</span> with AI Intelligence
          </h1>

          <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-md">
            Experience the future of real estate. Our proprietary AI curates the market's finest listings tailored specifically to your lifestyle, removing the noise from your property search.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button className="rounded-lg px-7 py-6 text-sm font-medium gap-2">
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

        {/* Right - Hero image */}
        <div className="flex-1 relative max-w-xl w-full">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=480&fit=crop"
              alt="Luxury villa with pool"
              className="w-full h-[400px] lg:h-[460px] object-cover"
            />
          </div>
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
      </div>

      {/* Search bar — full width */}
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-card border border-border rounded-2xl p-3 shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by city, neighborhood, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-0 bg-secondary/50 focus-visible:ring-1 h-12 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-full sm:w-[140px] border-0 bg-secondary/50 h-12">
                  <Home className="w-4 h-4 mr-1.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="w-full sm:w-[160px] border-0 bg-secondary/50 h-12">
                  <DollarSign className="w-4 h-4 mr-1.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500">$0 – $500/mo</SelectItem>
                  <SelectItem value="500-1000">$500 – $1k/mo</SelectItem>
                  <SelectItem value="1000-2000">$1k – $2k/mo</SelectItem>
                  <SelectItem value="2000-5000">$2k – $5k/mo</SelectItem>
                  <SelectItem value="5000+">$5,000+/mo</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="h-12 px-6 rounded-xl gap-2 shrink-0">
                <Search className="w-4 h-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
