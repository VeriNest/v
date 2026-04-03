import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Building2, ArrowRight, CheckCircle2,
  MapPin, Phone, Briefcase, Shield, Sparkles, ChevronRight,
  User, Mail, Wallet, Clock, Star, HomeIcon, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const [selectedType, setSelectedType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedPropertyCount, setSelectedPropertyCount] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [selectedAgentStatus, setSelectedAgentStatus] = useState("");

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
          <div className="w-full max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <p className="text-xs font-medium text-primary tracking-widest uppercase">Step 2 of 3</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {role === "tenant" ? "Let's find your match" : "A few quick details"}
              </h1>
              <p className="text-muted-foreground text-sm">This helps us tailor your experience — takes 30 seconds.</p>
            </div>

            {/* ── Contact & Location ── */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Contact & Location</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Phone number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="+234 801 234 5678"
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {role === "tenant" ? "Preferred city" : "Primary location"}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="e.g. Lagos, Abuja"
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Tenant: Preferences ── */}
            {role === "tenant" && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5">
                <div className="flex items-center gap-2 pb-1">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Search className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Search Preferences</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Type of accommodation</label>
                  <div className="flex flex-wrap gap-2">
                    {["Rent", "Short-let", "Shared", "Serviced", "Not sure"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedType(opt)}
                        className={`px-4 h-9 rounded-full text-xs font-medium border transition-all ${
                          selectedType === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Monthly budget range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Under ₦200k", "₦200k–₦500k", "₦500k–₦1M", "₦1M+"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedBudget(opt)}
                        className={`h-11 rounded-xl text-xs font-medium border transition-all ${
                          selectedBudget === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Move-in timeline</label>
                  <div className="flex flex-wrap gap-2">
                    {["Immediately", "Within 1 month", "1–3 months", "Just browsing"].map((opt) => (
                      <button
                        key={opt}
                        className={`px-4 h-9 rounded-full text-xs font-medium border transition-all border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Agent: Professional Info ── */}
            {role === "agent" && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5">
                <div className="flex items-center gap-2 pb-1">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Professional Details</h2>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Agency / Company name <span className="text-muted-foreground/60">(optional)</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="e.g. Prime Realtors Ltd"
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Years of experience</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["< 1 year", "1–3 years", "3–5 years", "5+ years"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setExperience(opt)}
                        className={`h-11 rounded-xl text-xs font-medium border transition-all ${
                          experience === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Specialization <span className="text-muted-foreground/60">(select multiple)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {["Residential", "Commercial", "Short-let", "Land", "Luxury"].map((opt) => {
                      const isSelected = selectedPropertyTypes.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedPropertyTypes(prev =>
                            isSelected ? prev.filter(p => p !== opt) : [...prev, opt]
                          )}
                          className={`px-4 h-9 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Short bio <span className="text-muted-foreground/60">(optional)</span></label>
                  <Textarea
                    placeholder="Tell potential clients about yourself and your services..."
                    className="min-h-[80px] rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Landlord: Property Info ── */}
            {role === "landlord" && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5">
                <div className="flex items-center gap-2 pb-1">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Property Details</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">How many properties do you have?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1", "2–5", "6–10", "10+"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedPropertyCount(opt)}
                        className={`h-11 rounded-xl text-sm font-medium border transition-all ${
                          selectedPropertyCount === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Property types <span className="text-muted-foreground/60">(select multiple)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {["Flat / Apartment", "Detached House", "Semi-detached", "Duplex", "Mini-flat", "Self-contain", "Commercial"].map((opt) => {
                      const isSelected = selectedPropertyTypes.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedPropertyTypes(prev =>
                            isSelected ? prev.filter(p => p !== opt) : [...prev, opt]
                          )}
                          className={`px-4 h-9 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Do you currently have an agent?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes", "No", "Looking for one"].map((opt) => (
                      <button
                        key={opt}
                        className={`h-11 rounded-xl text-xs font-medium border transition-all border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 pb-4">
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
