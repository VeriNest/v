import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const testimonials = [
  {
    text: "Dwello matched us with our dream home in just 2 weeks. The process was seamless and personalized.",
    name: "Sarah Johnson",
    location: "Los Angeles, CA",
    avatar: 15,
  },
  {
    text: "The neighborhood insights were invaluable. We knew exactly what we were getting before even visiting.",
    name: "Michael Chen",
    location: "San Francisco, CA",
    avatar: 32,
  },
  {
    text: "Best real estate experience ever. The recommendations were spot-on and saved us months of searching.",
    name: "Emily Rodriguez",
    location: "Austin, TX",
    avatar: 44,
  },
];

const Newsletter = () => {
  return (
    <>
      {/* Testimonials */}
      <section className="px-8 lg:px-20 py-20 bg-secondary/50">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Testimonials</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">What Our Clients Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl p-7 border border-border/50 shadow-sm">
              <div className="flex gap-1 mb-5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/40?img=${t.avatar}`} alt={t.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 lg:px-20 py-20">
        <div className="bg-[hsl(var(--dark-bg))] rounded-3xl p-12 lg:p-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Join thousands of satisfied homeowners who found their perfect property with Dwello's platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="rounded-full px-5 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-primary"
            />
            <Button className="rounded-full px-8 h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 whitespace-nowrap gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;
