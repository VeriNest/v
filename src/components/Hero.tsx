import { Search, CalendarDays, Users, Building2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("Rent");

  return (
    <section className="px-20 pt-10 pb-20 flex items-center gap-12">
      {/* Left */}
      <div className="flex-1 max-w-xl">
        <h1 className="text-5xl font-bold leading-tight text-foreground mb-4">
          Buy, rent, or sell<br />your property<br />easily
        </h1>
        <p className="text-muted-foreground text-base mb-8 max-w-md">
          A great platform to buy, sell, or even rent your properties without any commissions.
        </p>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-border">
          {["Rent", "Buy", "Sell"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-background border border-border rounded-lg p-1.5 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 flex-1 border-r border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Barcelona, Spain</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 flex-1">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Select Move-in Date</span>
          </div>
          <Button className="rounded-lg px-6 bg-primary text-primary-foreground hover:bg-primary/90">
            Browse Properties
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">50k+</p>
              <p className="text-xs text-muted-foreground">renters</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">10k+</p>
              <p className="text-xs text-muted-foreground">properties</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Property Card */}
      <div className="flex-1 relative">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"
            alt="Property"
            className="w-full h-[400px] object-cover rounded-2xl"
          />
          {/* Overlay Card */}
          <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg min-w-[220px]">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=60&h=60&fit=crop"
                alt="Villa"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">Minal Villa</p>
                <p className="text-xs text-muted-foreground">$1,500<span className="text-xs">/month</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted -ml-1 first:ml-0 overflow-hidden">
                    <img src={`https://i.pravatar.cc/24?img=${i+10}`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">+20 people interested</span>
            </div>
          </div>
          {/* Trust Badge */}
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <p className="text-xs font-semibold text-foreground mb-1">Excellent</p>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
