import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Shield, FileText, Key, ArrowRight, Users, Clock, Sparkles, Bed, Bath, MapPin, Star, Maximize } from "lucide-react";

const steps = [
  { num: "01", icon: Search, title: "Search & Discover", description: "Browse thousands of verified properties or post your specific housing need and let agents come to you." },
  { num: "02", icon: Shield, title: "Verified Listings", description: "Every property is verified by our team. No scams, no fake listings — just genuine homes ready for you." },
  { num: "03", icon: FileText, title: "Smart Offers", description: "Receive personalized offers from verified agents that match your preferences, budget, and timeline." },
  { num: "04", icon: Key, title: "Move In", description: "Complete your booking securely through Dwello, sign your lease digitally, and get your keys." },
];

const benefits = [
  { icon: Shield, title: "Verified Properties", desc: "100% of listings go through our verification process before going live." },
  { icon: Sparkles, title: "Smart Matching", desc: "AI-powered suggestions based on your lifestyle and preferences." },
  { icon: Clock, title: "Fast Process", desc: "From search to move-in in as little as 48 hours." },
  { icon: Users, title: "Direct Communication", desc: "Chat directly with verified agents and landlords." },
];

const categories = [
  { title: "Apartments", count: "3,200+", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=400&fit=crop" },
  { title: "Duplexes", count: "1,800+", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=400&fit=crop" },
  { title: "Studios", count: "2,100+", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop" },
  { title: "Penthouses", count: "450+", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=400&fit=crop" },
];

const featured = [
  { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=500&fit=crop", price: "₦1,200,000", name: "Spacious 3BR Duplex", location: "Ikeja GRA, Lagos", beds: 3, baths: 3, sqft: "2,800", rating: 4.9, match: 92 },
  { image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=500&fit=crop", price: "₦850,000", name: "Modern 2BR Apartment", location: "Victoria Island, Lagos", beds: 2, baths: 2, sqft: "1,200", rating: 4.8, match: 95 },
  { image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&h=500&fit=crop", price: "₦3,500,000", name: "Luxury Penthouse", location: "Banana Island, Lagos", beds: 4, baths: 4, sqft: "4,500", rating: 5.0, match: 98 },
];

const Rent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="px-6 lg:px-16 xl:px-20 pt-28 pb-20 bg-secondary/30">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Rent with Confidence</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-[3.5rem] leading-[1.15] text-foreground mb-5">
              Find Your Next Home,{" "}
              <span className="italic text-primary">The Smart Way</span>
            </h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-md">
              Whether you're looking for a cozy studio or a spacious family home, Dwello makes renting simple,
              secure, and stress-free.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button className="rounded-lg px-7 py-6 text-sm font-medium gap-2" asChild>
                <Link to="/properties">Browse Properties <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button variant="outline" className="rounded-lg px-7 py-6 text-sm font-medium border-border text-foreground hover:bg-accent gap-2" asChild>
                <Link to="/signup">Post Your Need</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative max-w-xl w-full">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&h=480&fit=crop"
                alt="Beautiful apartment interior"
                className="w-full h-[400px] lg:h-[460px] object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-foreground text-sm">Spacious 3BR Duplex</h3>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">92% match</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">Ikeja GRA, Lagos</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-foreground font-mono">₦1,200,000</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> 3</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - matching ValueProposition layout */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-secondary/60">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[340px] shrink-0">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Process</p>
            <h2 className="font-serif text-3xl lg:text-[2.5rem] text-foreground leading-tight mb-6">
              How Renting{" "}
              <span className="italic text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
              We've simplified the journey of finding a home into four seamless, AI-assisted steps.
            </p>
            <Button className="rounded-lg px-7 py-6 bg-foreground text-background hover:bg-foreground/90 text-sm font-medium" asChild>
              <Link to="/signup">Start Your Journey</Link>
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
      </section>

      {/* Categories - bento grid style */}
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Categories</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Browse by Type</h2>
          </div>
          <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 hover:bg-transparent text-sm font-medium px-0" asChild>
            <Link to="/properties">View All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link to="/properties" key={cat.title}>
              <div className="relative group rounded-2xl overflow-hidden cursor-pointer h-[260px]">
                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-serif text-lg text-primary-foreground">{cat.title}</h3>
                  <p className="text-[11px] text-primary-foreground/70 font-mono uppercase tracking-wider">{cat.count} listings</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Top Picks</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Featured Rentals</h2>
          </div>
          <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 hover:bg-transparent text-sm font-medium px-0" asChild>
            <Link to="/properties">View All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featured.map((property, i) => (
            <div key={property.name} className={`relative group rounded-2xl overflow-hidden cursor-pointer ${i === 0 ? "lg:col-span-2 h-[380px]" : "h-[380px]"}`}>
              <img src={property.image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3">
                <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded font-mono uppercase tracking-wider">
                  {property.match}% match
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">{property.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono uppercase tracking-wider">
                      <MapPin className="h-3 w-3 shrink-0" /> {property.location}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-foreground font-mono text-sm">{property.price}</p>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.baths}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> <span className="font-medium text-foreground">{property.rating}</span></span>
                    <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {property.sqft} sqft</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary hover:text-primary/80 px-2">
                    View Details <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Why Dwello</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
            Smart Rental Intelligence
          </h2>
          <p className="text-muted-foreground text-[15px] max-w-lg mx-auto leading-relaxed">
            We leverage advanced tools to give you a seamless renting experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="group bg-card rounded-xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-[hsl(var(--dark-bg))]">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl text-primary-foreground mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-primary-foreground/40 mb-10 text-[15px] leading-relaxed">
            Join thousands of happy renters who found their perfect home through Dwello.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" className="rounded-lg px-8 py-6 text-sm font-medium border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/5 gap-2" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button className="rounded-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium gap-2" asChild>
              <Link to="/properties">Browse Properties <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rent;
