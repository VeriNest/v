import { UserCheck, Search, Eye, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: "01",
    icon: UserCheck,
    title: "Profile Analysis",
    description: "We deep-dive into your preferences, lifestyle needs, and financial goals to build a comprehensive buyer profile.",
  },
  {
    num: "02",
    icon: Search,
    title: "Smart Matching",
    description: "Algorithms scan thousands of listings to find properties that align with your unique criteria, filtering out the noise.",
  },
  {
    num: "03",
    icon: Eye,
    title: "Virtual Tours & Insights",
    description: "Experience homes remotely with immersive 3D tours and receive detailed neighborhood analytics reports.",
  },
  {
    num: "04",
    icon: FileCheck,
    title: "Seamless Closing",
    description: "From offer to keys, our platform handles paperwork, negotiations, and closing logistics effortlessly.",
  },
];

const ValueProposition = () => {
  return (
    <section className="px-6 lg:px-16 xl:px-20 py-20 bg-[hsl(var(--dark-bg))]">
      <div className="text-center mb-14">
        <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4">Process</p>
        <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
          The Path to Your{" "}
          <span className="italic text-primary">New Beginning</span>
        </h2>
        <p className="text-white/40 text-[15px] max-w-lg mx-auto leading-relaxed">
          We've simplified the complex journey of buying a home into four seamless steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {steps.map((step) => (
          <div key={step.num} className="bg-white/[0.04] rounded-xl p-7 border border-white/[0.06] hover:border-primary/20 transition-all duration-300 group">
            <span className="text-3xl font-mono font-medium text-primary/25 block mb-4">{step.num}</span>
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button className="rounded-lg px-7 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium gap-2">
          Start Your Journey <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default ValueProposition;
