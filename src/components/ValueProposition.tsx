import { UserCheck, Search, Eye, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: "01",
    icon: UserCheck,
    title: "Profile Analysis",
    description: "Our AI deep-dives into your preferences, lifestyle needs, and financial goals to build a comprehensive buyer profile.",
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
    description: "From offer to keys, our digital platform handles paperwork, negotiations, and closing logistics effortlessly.",
  },
];

const ValueProposition = () => {
  return (
    <section className="px-6 lg:px-16 xl:px-20 py-20 bg-secondary/60">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left side - heading */}
        <div className="lg:w-[340px] shrink-0">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Process</p>
          <h2 className="font-serif text-3xl lg:text-[2.5rem] text-foreground leading-tight mb-6">
            The Path to Your{" "}
            <span className="italic text-primary">New Beginning</span>
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
            We've simplified the complex journey of buying a home into four seamless, AI-assisted steps.
          </p>
          <Button className="rounded-lg px-7 py-6 bg-foreground text-background hover:bg-foreground/90 text-sm font-medium">
            Start Your Journey
          </Button>
        </div>

        {/* Right side - vertical steps */}
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
  );
};

export default ValueProposition;
