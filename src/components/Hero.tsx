import { Search, CalendarDays, Users, Building2, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("Rent");

  return (
    <section className="px-20 pt-8 pb-16 flex items-start gap-8">
      {/* Left */}
      <div className="flex-1 max-w-lg pt-8">
        <h1 className="text-[42px] font-bold leading-[1.15] text-foreground mb-4">
          Buy, rent, or sell<br />your property<br />easily
        </h1>
        <p className="text-muted-foreground text-sm mb-8 max-w-sm leading-relaxed">
          A great platform to buy, sell, or even rent your properties without any commissions.
        </p>

        {/* Tabs */}
        <div className="flex gap-6 mb-5">
          {["Rent", "Buy", "Sell"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-sm font-medium transition-colors relative border-b-2 ${
                activeTab === tab
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-background rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex-1 px-4 py-3">
            <p className="text-[10px] text-muted-foreground mb-0.5">Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">Barcelona, Spain</span>
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 px-4 py-3">
            <p className="text-[10px] text-muted-foreground mb-0.5">When</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Select Move-in Date</span>
              <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
          <Button className="rounded-lg px-5 py-6 mx-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            Browse Properties
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10 mt-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">50k+ renters</p>
              <p className="text-xs text-muted-foreground">believe in our service</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">10k+ properties</p>
              <p className="text-xs text-muted-foreground">and 10+ amenity/finance privacy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Property Image with overlays */}
      <div className="flex-1 relative mt-4">
        <img
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=450&fit=crop"
          alt="Property"
          className="w-full h-[420px] object-cover rounded-2xl"
        />

        {/* Minal Villa info card - top left */}
        <div className="absolute -top-2 left-[15%] bg-background rounded-xl p-3 shadow-xl min-w-[240px] z-10">
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Agent"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Minal Villa</p>
              <p className="text-[11px] text-muted-foreground">Seller</p>
              <p className="text-[11px] text-muted-foreground">Property Villa × 2Beds</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">H</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight flex-1">
              I would want to inspect the house. Are there available time/day to come and check it out?
            </p>
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute left-[5%] top-[45%] bg-background rounded-xl px-5 py-3 shadow-lg flex items-center gap-5 z-10">
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
        <div className="absolute left-[10%] top-[60%] z-10">
          <Button className="rounded-lg px-5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm shadow-lg">
            Browse Properties
          </Button>
        </div>

        {/* Excellent badge - bottom right */}
        <div className="absolute bottom-6 right-6 bg-primary rounded-xl px-4 py-3 shadow-lg z-10">
          <p className="text-xs font-semibold text-primary-foreground mb-1">Excellent</p>
          <div className="flex gap-0.5 mb-1">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-[9px] text-primary-foreground/70">from 3,264 reviews</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
