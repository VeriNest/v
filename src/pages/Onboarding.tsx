import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, User, Building2, ArrowRight, CheckCircle2,
  MapPin, Phone, Briefcase, Shield, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Role = "tenant" | "agent" | "landlord";

const roleCards: { value: Role; icon: typeof Search; label: string; desc: string; features: string[] }[] = [
  {
    value: "tenant",
    icon: Search,
    label: "I'm looking for a home",
    desc: "Find apartments, short-lets, or shared spaces",
    features: ["Post what you need", "Get matched with agents", "Secure escrow payments"],
  },
  {
    value: "agent",
    icon: Briefcase,
    label: "I'm a property agent",
    desc: "List and manage properties for your clients",
    features: ["Manage multiple listings", "Respond to tenant needs", "Track payouts & leads"],
  },
  {
    value: "landlord",
    icon: Building2,
    label: "I own properties",
    desc: "List and rent out your own properties",
    features: ["Direct tenant matching", "Manage your portfolio", "Secure rental income"],
  },
];

const steps = [
  { id: 1, label: "Your role" },
  { id: 2, label: "Profile" },
  { id: 3, label: "Ready" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const progress = (step / steps.length) * 100;

  const handleComplete = () => {
    if (role) {
      localStorage.setItem("dwello_role", role);
      navigate(role === "tenant" ? "/seeker" : "/provider");
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-border/60 bg-background">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Dwello</span>
        </div>
        <div className="flex items-center gap-3">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                s.id < step ? "bg-emerald-500 text-white" :
                s.id === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {s.id < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.id}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${s.id === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {s.id < steps.length && <div className="w-8 h-px bg-border hidden sm:block" />}
            </div>
          ))}
        </div>
      </header>

      {/* Progress */}
      <Progress value={progress} className="h-1 rounded-none" />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">How will you use Dwello?</h1>
                <p className="text-sm text-muted-foreground mt-1.5">Choose your role to personalize your experience. You can change this later.</p>
              </div>

              <div className="space-y-3">
                {roleCards.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.value;
                  return (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border/60 bg-background hover:border-primary/30 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>{r.label}</p>
                            {isSelected && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {r.features.map((f) => (
                              <Badge key={f} variant="outline" className="text-[10px] px-2 py-0.5 font-normal text-muted-foreground">{f}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!role}
                className="w-full h-11 rounded-lg font-medium gap-2"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Profile Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">
                  {role === "tenant" ? "A few details to find your ideal home" :
                   role === "agent" ? "Set up your agent profile" :
                   "Tell us about your properties"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">This helps us match you with the right {role === "tenant" ? "agents and listings" : "tenants and opportunities"}</p>
              </div>

              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="+234 801 234 5678"
                        className="pl-9 h-11 rounded-lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      {role === "tenant" ? "Where are you looking?" : "Primary City"}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Lagos, Abuja, Port Harcourt"
                        className="pl-9 h-11 rounded-lg"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  {role === "agent" && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Company / Agency Name</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. Prime Realtors Ltd" className="pl-9 h-11 rounded-lg" />
                      </div>
                    </div>
                  )}

                  {role === "landlord" && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Number of Properties</label>
                      <div className="flex flex-wrap gap-2">
                        {["1", "2-5", "6-10", "10+"].map((opt) => (
                          <button
                            key={opt}
                            className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {role === "tenant" && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">What are you looking for?</label>
                      <div className="flex flex-wrap gap-2">
                        {["Rent (long-term)", "Short-let", "Shared space", "Not sure yet"].map((opt) => (
                          <button
                            key={opt}
                            className="px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 rounded-lg">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 h-11 rounded-lg font-medium gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <button onClick={() => setStep(3)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                Skip for now
              </button>
            </div>
          )}

          {/* Step 3: Welcome / Ready */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">You're all set!</h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
                  {role === "tenant"
                    ? "Your personalized dashboard is ready. Start posting what you need and let verified agents come to you."
                    : "Your provider dashboard is ready. Start listing properties and connecting with tenants looking for homes."}
                </p>
              </div>

              <Card className="border border-border/60 shadow-sm max-w-sm mx-auto">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Secure by default</p>
                      <p className="text-xs text-muted-foreground mt-0.5">All payments are protected by escrow. Your data is encrypted and never shared.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleComplete} className="h-11 px-8 rounded-lg font-medium gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
