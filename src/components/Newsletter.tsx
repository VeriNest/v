import { Star } from "lucide-react";

import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    text: "I posted my budget and preferred area once, and serious options started coming in the same day.",
    name: "Tolu A.",
    location: "Lekki renter",
    avatar: 15,
  },
  {
    text: "The pricing breakdown helped me filter out listings that were not actually within my range.",
    name: "Adaeze N.",
    location: "Abuja seeker",
    avatar: 32,
  },
  {
    text: "As a provider, I get clearer requests and spend less time filtering casual inquiries before sending offers.",
    name: "Ibrahim S.",
    location: "Lagos agent",
    avatar: 44,
  },
];

const Newsletter = () => {
  return (
    <>
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <MarketingShell>
          <div className="mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Testimonials</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Trusted by Renters and Providers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-xl p-7 border border-border/50">
                <div className="flex gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-[hsl(var(--dark-bg))]">
        <MarketingShell>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
              Ready to Start Your Search the Smarter Way?
            </h2>
            <p className="text-white/40 mb-10 text-[15px] leading-relaxed">
              Post your need, browse verified homes, or join Verinest as an agent or landlord.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="outline" className="rounded-lg px-8 py-6 text-sm font-medium border-white/20 text-white hover:bg-white/5 gap-2">
                Browse Homes
              </Button>
              <Button className="rounded-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium gap-2">
                Post a Need
              </Button>
            </div>
          </div>
        </MarketingShell>
      </section>
    </>
  );
};

export default Newsletter;
