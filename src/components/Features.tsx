import { BarChart3, Brain, MapPin, Shield, Headphones, Eye } from "lucide-react";

const stats = [
  { value: "2,450+", label: "Properties Sold" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "150+", label: "Cities Covered" },
  { value: "$1.2B", label: "Market Value" },
];

const features = [
  {
    icon: BarChart3,
    title: "Live Market Analysis",
    description: "Real-time data feeds from every major listing source, aggregating hidden gems before they hit the mainstream market.",
  },
  {
    icon: Brain,
    title: "Expert Insights",
    description: "Predictive analytics on value appreciation and investment potential, tailored to your financial goals.",
  },
  {
    icon: MapPin,
    title: "Best Area Suggestions",
    description: "Neighborhood matching based on your lifestyle habits, commute preferences, and local amenities.",
  },
];

const Features = () => {
  return (
    <>
      {/* Stats Bar */}
      <section className="px-6 lg:px-16 xl:px-20 py-14 bg-[hsl(var(--dark-bg))]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-mono font-medium text-primary mb-1.5 tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4">Why Choose Dwello?</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
            Smart Property Intelligence
          </h2>
          <p className="text-muted-foreground text-[15px] max-w-lg mx-auto leading-relaxed">
            We leverage advanced tools to give you a competitive edge in the market, turning data into your dream home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card rounded-xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Redefining Section */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-secondary/40">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=420&fit=crop"
              alt="Modern home interior"
              className="w-full h-[380px] object-cover rounded-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-3xl lg:text-[2.5rem] text-foreground leading-tight mb-8">
              Redefining Real Estate
            </h2>
            <div className="space-y-6">
              {[
                { icon: Shield, title: "Verified Listings Only", desc: "Every property on our platform is verified by our team to ensure what you see is what you get." },
                { icon: Headphones, title: "24/7 Concierge Support", desc: "Our dedicated team is always available to answer questions, schedule viewings, and provide expert advice." },
                { icon: Eye, title: "Transparent Pricing", desc: "No hidden fees. We provide clear, upfront cost breakdowns so you can budget with confidence." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-[15px]">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
