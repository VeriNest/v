import { TrendingUp, Users, MapPin, DollarSign, BarChart3, Brain, Map, Shield, Headphones, Eye } from "lucide-react";

const stats = [
  { value: "2,450+", label: "Properties Sold", icon: TrendingUp },
  { value: "98%", label: "Client Satisfaction", icon: Users },
  { value: "150+", label: "Cities Covered", icon: MapPin },
  { value: "$1.2B", label: "Market Value", icon: DollarSign },
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
    icon: Map,
    title: "Best Area Suggestions",
    description: "Neighborhood matching based on your lifestyle habits, commute preferences, and local amenities.",
  },
];

const Features = () => {
  return (
    <>
      {/* Stats Bar */}
      <section className="px-8 lg:px-20 py-14 bg-[hsl(var(--dark-bg))] mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-bold text-primary mb-1 tracking-tight font-mono">{stat.value}</p>
              <p className="text-xs text-white/50 uppercase tracking-widest font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 lg:px-20 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Why Choose Dwello?</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Smart Property Intelligence
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We leverage advanced tools to give you a competitive edge in the market, turning data into your dream home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-8 lg:px-20 py-20 bg-secondary/50">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop"
              alt="Modern home interior"
              className="w-full h-[380px] object-cover rounded-3xl shadow-lg"
            />
          </div>
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl font-bold text-foreground leading-tight">Redefining Real Estate</h2>
            <div className="space-y-6">
              {[
                { icon: Shield, title: "Verified Listings Only", desc: "Every property on our platform is verified by our team to ensure what you see is what you get." },
                { icon: Headphones, title: "24/7 Concierge Support", desc: "Our dedicated team is always available to answer questions, schedule viewings, and provide expert advice." },
                { icon: Eye, title: "Transparent Pricing", desc: "No hidden fees. We provide clear, upfront cost breakdowns so you can budget with confidence." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
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
