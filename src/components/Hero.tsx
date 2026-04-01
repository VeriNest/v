import { Search, CalendarDays, Users, Building2, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("Rent");

  return (
    <section className="relative px-16 pt-12 pb-20 overflow-hidden">
      {/* Background image - right side */}
      <div className="absolute right-0 top-0 w-[55%] h-full">
        <img
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=600&fit=crop"
          alt="Property"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay at bottom for badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-[420px]">
        <h1 className="text-[44px] font-bold leading-[1.12] text-foreground mb-5">
          Buy, rent, or sell<br />your property<br />easily
        </h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-[340px] leading-relaxed">
          A great platform to buy, sell, or even rent your properties without any commissions.
        </p>

        {/* Tabs */}
        <div className="flex gap-0 mb-5">
          {["Rent", "Buy", "Sell"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-medium transition-colors border ${
                activeTab === tab
                  ? "text-foreground border-foreground bg-background"
                  : "text-muted-foreground border-border bg-background hover:text-foreground"
              } first:rounded-l-lg last:rounded-r-lg -ml-px first:ml-0`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-background rounded-lg border border-border shadow-sm">
          <div className="flex-1 px-4 py-3">
            <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wide">Location</p>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm text-foreground font-medium">Barcelona, Spain</span>
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 px-4 py-3">
            <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wide">When</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">Select Move-in Date</span>
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
          <Button className="rounded-lg px-5 h-full py-5 mx-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm whitespace-nowrap">
            Browse Properties
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">50k+ renters</p>
              <p className="text-xs text-muted-foreground">believe in our service</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">10k+ properties</p>
              <p className="text-xs text-muted-foreground">and no. seventy finance privacy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards on the image */}
      {/* Minal Villa card */}
      <div className="absolute top-8 right-[22%] bg-background rounded-xl p-3 shadow-xl min-w-[230px] z-20">
        <div className="flex items-start gap-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Agent"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">Minal Villa</p>
            <p className="text-[10px] text-muted-foreground">Seller</p>
            <p className="text-[10px] text-muted-foreground">Property Villa × 2 Beds</p>
          </div>
        </div>
        <div className="mt-2 flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-primary-foreground text-[10px] font-bold">H</span>
          </div>
          <p className="text-[9px] text-muted-foreground leading-tight">
            I would want to inspect the house. Are there available time/day to come and check it out?
          </p>
        </div>
      </div>

      {/* Stats overlay - $1,500 / -24 hrs */}
      <div className="absolute top-[45%] right-[38%] bg-background rounded-xl px-5 py-3 shadow-lg flex items-center gap-6 z-20">
        <div className="text-center">
          <p className="text-base font-bold text-primary">$1,500</p>
          <p className="text-[10px] text-muted-foreground">Savings</p>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-foreground">-24 hrs</p>
          <p className="text-[10px] text-muted-foreground">Processing</p>
        </div>
      </div>

      {/* Browse Properties button on image */}
      <div className="absolute top-[58%] right-[35%] z-20">
        <Button className="rounded-lg px-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm shadow-lg">
          Browse Properties
        </Button>
      </div>

      {/* Excellent badge - bottom right with dark bg */}
      <div className="absolute bottom-8 right-8 bg-[hsl(256,60%,10%)] rounded-xl px-4 py-3 shadow-lg z-20">
        <p className="text-xs font-semibold text-white mb-1">Excellent</p>
        <div className="flex gap-0.5 mb-1">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-[9px] text-white/60">from 3,264 reviews</p>
      </div>
    </section>
  );
};

export default Hero;
