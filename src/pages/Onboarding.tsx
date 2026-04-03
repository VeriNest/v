import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Building2, ArrowRight, CheckCircle2,
  MapPin, Phone, Briefcase, Shield, Sparkles, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "tenant" | "agent" | "landlord";

const roleCards: { value: Role; icon: React.ElementType; label: string; desc: string }[] = [
  { value: "tenant", icon: Search, label: "Find a home", desc: "Browse listings, post needs, and get matched with verified agents." },
  { value: "agent", icon: Briefcase, label: "I'm an agent", desc: "List properties, manage leads, and grow your rental business." },
  { value: "landlord", icon: Building2, label: "I own property", desc: "List your properties directly and connect with quality tenants." },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleComplete = () => {
    if (role) {
      localStorage.setItem("dwello_role", role);
      navigate(role === "tenant" ? "/seeker" : "/provider");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground">Dwello</span>
        </div>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
        )}
      </div>

      {/* Step indicator - minimal dots */}
      <div className="flex justify-center gap-1.5 pb-2">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1 rounded-full transition-all duration-500 ${
            s === step ? "w-8 bg-primary" : s < step ? "w-4 bg-primary/40" : "w-4 bg-border"
          }`} />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        {/* Step 1: Role */}
        {step === 1 && (
          <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <p className="text-xs font-medium text-primary tracking-widest uppercase">Step 1 of 3</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">What brings you here?</h1>
              <p className="text-muted-foreground text-sm">Pick the one that best describes you.</p>
            </div>

            <div className="space-y-3">
              {roleCards.map((r) => {
                const selected = role === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`w-full group flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selected
                        ? "border-primary bg-primary/[0.04] shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]"
                        : "border-transparent bg-muted/40 hover:bg-muted/70"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-primary/10" : "bg-muted"}`}>
                      <r.icon className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-[15px] font-semibold ${selected ? "text-foreground" : "text-foreground/80"}`}>{r.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.desc}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      selected ? "border-primary bg-primary" : "border-border"
                    }`}>
                      {selected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!role}
              className="w-full h-12 rounded-xl text-sm font-semibold gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <p className="text-xs font-medium text-primary tracking-widest uppercase">Step 2 of 3</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {role === "tenant" ? "Where are you looking?" : "Tell us a bit more"}
              </h1>
              <p className="text-muted-foreground text-sm">We'll use this to personalize your experience.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+234 801 234 5678"
                    className="pl-11 h-12 rounded-xl bg-muted/40 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {role === "tenant" ? "Preferred city" : "Where you operate"}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. Lagos, Abuja"
                    className="pl-11 h-12 rounded-xl bg-muted/40 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              {role === "agent" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Agency name <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Prime Realtors Ltd"
                      className="pl-11 h-12 rounded-xl bg-muted/40 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                    />
                  </div>
                </div>
              )}

              {role === "landlord" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">How many properties do you have?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1", "2–5", "6–10", "10+"].map((opt) => (
                      <button
                        key={opt}
                        className="h-11 rounded-xl bg-muted/40 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary border-2 border-transparent focus:border-primary transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {role === "tenant" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">What type?</label>
                  <div className="flex flex-wrap gap-2">
                    {["Rent", "Short-let", "Shared", "Not sure"].map((opt) => (
                      <button
                        key={opt}
                        className="px-4 h-9 rounded-full bg-muted/40 text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary border-2 border-transparent focus:border-primary transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button onClick={() => setStep(3)} className="w-full h-12 rounded-xl text-sm font-semibold gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
              <button onClick={() => setStep(3)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="w-full max-w-md text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3" />
              <div className="relative h-full w-full bg-background rounded-3xl border border-border/60 flex items-center justify-center shadow-sm">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">You're in!</h1>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                {role === "tenant"
                  ? "Start exploring properties or post what you need — verified agents will come to you."
                  : "Your dashboard is ready. List your first property and start connecting with tenants."}
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 text-left max-w-sm mx-auto">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Protected by escrow</p>
                <p className="text-[11px] text-muted-foreground">Every transaction is secured. Your money is safe.</p>
              </div>
            </div>

            <Button onClick={handleComplete} className="h-12 px-10 rounded-xl text-sm font-semibold gap-2">
              Go to dashboard <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
