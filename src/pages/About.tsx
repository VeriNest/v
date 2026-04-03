import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Target, Heart, Award, Eye, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const values = [
  { icon: Shield, title: "Trust & Transparency", description: "Every listing is verified, every transaction is secure. We build trust through radical transparency." },
  { icon: Users, title: "Community First", description: "We're more than a platform — we're a community connecting seekers with the perfect homes." },
  { icon: Target, title: "Smart Matching", description: "Our intelligent algorithms match you with properties that fit your lifestyle, budget, and preferences." },
  { icon: Heart, title: "Human Touch", description: "Technology powers us, but people drive us. Real support from real humans, always." },
];

const stats = [
  { value: "10K+", label: "Properties Listed" },
  { value: "25K+", label: "Happy Tenants" },
  { value: "5K+", label: "Verified Agents" },
  { value: "98%", label: "Satisfaction Rate" },
];

const team = [
  { name: "Sarah Johnson", role: "CEO & Co-Founder", initials: "SJ", avatar: 15 },
  { name: "Michael Chen", role: "CTO & Co-Founder", initials: "MC", avatar: 32 },
  { name: "Amara Obi", role: "Head of Operations", initials: "AO", avatar: 44 },
  { name: "David Park", role: "Head of Design", initials: "DP", avatar: 56 },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="px-6 lg:px-16 xl:px-20 pt-28 pb-20 bg-secondary/30">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-xl">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">About Dwello</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground leading-[1.15] mb-5">
              Making Renting{" "}
              <span className="italic text-primary">Simple, Safe & Smart</span>
            </h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8 max-w-md">
              Dwello was founded with a simple mission: to transform the rental experience for everyone.
              We connect property seekers with verified providers through intelligent matching and seamless technology.
            </p>
            <Button className="rounded-lg px-7 py-6 text-sm font-medium gap-2" asChild>
              <Link to="/properties">Explore Properties <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="flex-1 relative max-w-xl w-full">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border/30">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&h=480&fit=crop"
                alt="Modern home interior"
                className="w-full h-[400px] lg:h-[460px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 lg:px-16 xl:px-20 py-16 border-y border-border/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-mono font-medium text-primary mb-1.5 tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Our Foundation</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">Core Values</h2>
          <p className="text-muted-foreground text-[15px] max-w-lg mx-auto leading-relaxed">
            The principles that guide everything we do at Dwello.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="group bg-card rounded-xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-secondary/60">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Our People</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">Meet the Team</h2>
          <p className="text-muted-foreground text-[15px] max-w-lg mx-auto leading-relaxed">
            The passionate people building the future of renting.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-card rounded-xl p-7 border border-border/50 text-center hover:shadow-lg transition-all duration-300">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-5 border-[3px] border-background shadow-md">
                <img src={`https://i.pravatar.cc/80?img=${member.avatar}`} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif text-base text-foreground">{member.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <div className="rounded-xl border border-border/50 p-3 bg-card">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=420&fit=crop"
                alt="Beautiful property"
                className="w-full h-[380px] object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Our Mission</p>
            <h2 className="font-serif text-3xl lg:text-[2.5rem] text-foreground leading-tight mb-6">
              A Home for{" "}
              <span className="italic text-primary">Everyone</span>
            </h2>
            <div className="space-y-8">
              {[
                { icon: Award, title: "Quality Guaranteed", desc: "Every property on our platform is physically verified by our team to ensure what you see is what you get." },
                { icon: Headphones, title: "24/7 Concierge Support", desc: "Our dedicated team is always available to answer questions, schedule viewings, and provide expert advice." },
                { icon: Eye, title: "Transparent Pricing", desc: "No hidden fees. We provide clear, upfront cost breakdowns so you can budget with confidence." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-[hsl(var(--dark-bg))]">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl text-primary-foreground mb-4">
            Ready to Join the Dwello Family?
          </h2>
          <p className="text-primary-foreground/40 mb-10 text-[15px] leading-relaxed">
            Whether you're a seeker or a provider, there's a place for you on Dwello.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" className="rounded-lg px-8 py-6 text-sm font-medium border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/5 gap-2" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button className="rounded-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium gap-2" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
