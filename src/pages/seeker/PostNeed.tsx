import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Bed, CheckCircle2, ShieldCheck, FileText, Plus, ChevronRight,
  ChevronLeft, Zap, Clock, Eye, Rocket, ArrowRight, Home, Sparkles, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { DashboardHistoryRow } from "@/components/dashboard/DashboardHistoryRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { seekerApi } from "@/lib/api";

const amenities = ["24hr Power", "Security", "Water Supply", "Parking", "Gated Estate", "Pet Friendly", "Furnished", "Swimming Pool", "Gym", "Serviced", "Elevator", "Balcony"];

const steps = [
  { id: 1, label: "Basics", icon: Home },
  { id: 2, label: "Location & Budget", icon: MapPin },
  { id: 3, label: "Amenities & Preferences", icon: Sparkles },
  { id: 4, label: "Review & Publish", icon: CheckCircle2 },
];

const urgencyLevels = [
  { value: "flexible", label: "Flexible", desc: "No rush, exploring options", icon: Clock, color: "text-blue-600 dark:text-blue-300", bg: "bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/15 dark:border-blue-500/30", dot: "bg-blue-500" },
  { value: "soon", label: "Soon", desc: "Within 2-4 weeks", icon: Calendar, color: "text-amber-600 dark:text-amber-300", bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30", dot: "bg-amber-500" },
  { value: "urgent", label: "Urgent", desc: "Need ASAP", icon: Zap, color: "text-red-600 dark:text-red-300", bg: "bg-red-500/10 border-red-500/20 dark:bg-red-500/15 dark:border-red-500/30", dot: "bg-red-500" },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT",
].sort();

const formatBudget = (val: number) => {
  if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
  return `₦${val}`;
};

const formatNeedDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

type NeedRow = {
  id: string;
  request_title: string;
  min_budget: number;
  max_budget: number;
  status: string;
  response_count: number;
  created_at: string;
};

export default function PostNeed() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [urgency, setUrgency] = useState("flexible");
  const [boost, setBoost] = useState(false);
  const [budgetRange, setBudgetRange] = useState([500000, 3000000]);
  const [propertyType, setPropertyType] = useState("rent");
  const [bedrooms, setBedrooms] = useState("2");
  const [location, setLocation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data: needs = [] } = useQuery<NeedRow[]>({
    queryKey: ["/seeker/needs"],
    queryFn: () => seekerApi.listNeeds() as Promise<NeedRow[]>,
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const progress = (currentStep / steps.length) * 100;

  const parseLocation = () => {
    const parts = location
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const area = parts[0] ?? location.trim();
    const city = parts[1] ?? area;
    const state = selectedState || "Unspecified";

    return {
      area,
      city,
      state,
    };
  };

  const bedroomCount = () => {
    if (bedrooms === "self") return 1;
    if (bedrooms === "4+") return 4;
    return Number.parseInt(bedrooms, 10) || 1;
  };

  const requestTitle = () => {
    const bedroomLabel = bedrooms === "self" ? "Self-con" : `${bedrooms} Bed`;
    const propertyLabel =
      propertyType === "shortlet" ? "Short-let" : propertyType === "shared" ? "Shared Apartment" : "Rent";
    const locationLabel = [location.trim(), selectedState].filter(Boolean).join(", ");
    return `${bedroomLabel} ${propertyLabel} in ${locationLabel || "Preferred Area"}`;
  };

  const handlePublishNeed = async () => {
    const trimmedLocation = location.trim();
    if (!trimmedLocation || !selectedState) {
      toast.error("Preferred area and state are required");
      setCurrentStep(2);
      return;
    }

    const { area, city, state } = parseLocation();

    try {
      setSubmitting(true);
      await seekerApi.createNeed({
        request_title: requestTitle(),
        area,
        city,
        state,
        property_type: propertyType,
        bedrooms: bedroomCount(),
        min_budget: budgetRange[0],
        max_budget: budgetRange[1],
        pricing_preference: propertyType === "shortlet" ? "per_night" : "per_year",
        desired_features: selectedTags,
        description:
          notes.trim() ||
          `Urgency: ${urgency}. Move-in date: ${moveInDate || "Flexible"}. Boost requested: ${boost ? "Yes" : "No"}.`,
      });
      setSubmitted(true);
      toast.success("Need published successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to publish need";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const canAdvance = () => {
    if (currentStep === 1) return propertyType && bedrooms;
    if (currentStep === 2) return location.length > 0 && selectedState.length > 0;
    return true;
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Need Published Successfully!</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
            {boost ? "Your need has been boosted! " : ""}Verified agents and landlords will start sending you matching offers shortly.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => { setSubmitted(false); setCurrentStep(1); }} variant="outline" size="sm">Post Another</Button>
          <Button size="sm">View My Posts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 min-w-0">
      <DashboardPageHeader
        title="Post a Need"
        description="Describe what you're looking for — providers will send you tailored offers."
      />

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="new" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Need
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <FileText className="h-3.5 w-3.5" /> My Posts
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">{needs.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Progress bar */}
              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">Step {currentStep} of {steps.length}</p>
                    <p className="text-xs text-muted-foreground">{steps[currentStep - 1].label}</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between mt-3">
                    {steps.map((step) => {
                      const StepIcon = step.icon;
                      const isActive = step.id === currentStep;
                      const isDone = step.id < currentStep;
                      return (
                        <button
                          key={step.id}
                          onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                            isActive ? "text-primary" : isDone ? "text-emerald-600 cursor-pointer" : "text-muted-foreground/50"
                          }`}
                        >
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isActive ? "bg-primary text-primary-foreground" :
                            isDone ? "bg-emerald-500 text-white" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.id}
                          </div>
                          <span className="hidden sm:inline">{step.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Step 1: Basics */}
              {currentStep === 1 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Property Basics</CardTitle>
                    <CardDescription>What type of property are you looking for?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Property Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "rent", label: "Rent", desc: "Long-term lease" },
                          { value: "shortlet", label: "Short-let", desc: "Days to weeks" },
                          { value: "shared", label: "Shared", desc: "Shared apartment" },
                        ].map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setPropertyType(type.value)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              propertyType === type.value
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border/60"
                            }`}
                          >
                            <p className={`text-sm font-semibold ${propertyType === type.value ? "text-primary" : "text-foreground"}`}>{type.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{type.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Number of Bedrooms</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "self", label: "Self-con" },
                          { value: "1", label: "1 Bed" },
                          { value: "2", label: "2 Bed" },
                          { value: "3", label: "3 Bed" },
                          { value: "4+", label: "4+ Bed" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setBedrooms(opt.value)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              bedrooms === opt.value
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border/60 text-muted-foreground"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Urgency */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">How urgently do you need this?</label>
                      <div className="grid grid-cols-3 gap-3">
                        {urgencyLevels.map((level) => {
                          const Icon = level.icon;
                          return (
                            <button
                              key={level.value}
                              onClick={() => setUrgency(level.value)}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                urgency === level.value
                                  ? `${level.bg} shadow-sm`
                                  : "border-border/60"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${urgency === level.value ? level.color : "text-muted-foreground"}`} />
                                <p className={`text-sm font-semibold ${urgency === level.value ? level.color : "text-foreground"}`}>{level.label}</p>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{level.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Location & Budget */}
              {currentStep === 2 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Location & Budget</CardTitle>
                    <CardDescription>Where do you want to live and what's your budget?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Preferred State</label>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Preferred Area / City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. Lekki Phase 1, Ikeja, Wuse 2"
                          className="pl-9"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">Enter your preferred area first, then optionally add a city after a comma</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">
                          Budget Range {propertyType === "shortlet" ? "(per night)" : "(per year)"}
                        </label>
                        <span className="text-sm font-bold text-primary">
                          {formatBudget(budgetRange[0])} — {formatBudget(budgetRange[1])}
                        </span>
                      </div>
                      <Slider
                        value={budgetRange}
                        onValueChange={setBudgetRange}
                        min={propertyType === "shortlet" ? 10000 : 200000}
                        max={propertyType === "shortlet" ? 500000 : 10000000}
                        step={propertyType === "shortlet" ? 5000 : 100000}
                        className="py-2"
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>{formatBudget(propertyType === "shortlet" ? 10000 : 200000)}</span>
                        <span>{formatBudget(propertyType === "shortlet" ? 500000 : 10000000)}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
                        <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground">Setting a wider range increases your chances of getting matched with more providers</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        {propertyType === "shortlet" ? "Check-in Date" : "Preferred Move-in Date"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="date" className="pl-9" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Amenities */}
              {currentStep === 3 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Amenities & Preferences</CardTitle>
                    <CardDescription>Select must-haves and add any extra notes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Must-have Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            onClick={() => toggleTag(tag)}
                            className={`cursor-pointer px-3 py-1.5 text-xs ${
                              selectedTags.includes(tag)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {selectedTags.length > 0 && (
                        <p className="text-[11px] text-muted-foreground">{selectedTags.length} selected</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Additional Notes</label>
                      <Textarea
                        placeholder="Any other requirements? e.g. ground floor preferred, near a bus stop, need a study room..."
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    {/* Boost card */}
                    <Card className={`border transition-all ${boost ? "border-primary bg-primary/5" : "border-border/60"}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${boost ? "bg-primary/20" : "bg-muted"}`}>
                              <Rocket className={`h-5 w-5 ${boost ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">Boost Visibility</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Get 3x more agent responses. Your need will be featured at the top and sent to premium agents.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                                  <Eye className="h-2.5 w-2.5 mr-0.5" /> 3x visibility
                                </Badge>
                                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300">
                                  <Zap className="h-2.5 w-2.5 mr-0.5" /> Priority matching
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Switch checked={boost} onCheckedChange={setBoost} />
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Review Your Need</CardTitle>
                    <CardDescription>Make sure everything looks good before publishing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Type", value: propertyType === "rent" ? "Rent (Long-term)" : propertyType === "shortlet" ? "Short-let" : "Shared Apartment" },
                        { label: "Bedrooms", value: bedrooms === "self" ? "Self-contain" : `${bedrooms} Bedroom${bedrooms !== "1" ? "s" : ""}` },
                        { label: "Location", value: [location, selectedState].filter(Boolean).join(", ") || "Not specified" },
                        { label: "Budget", value: `${formatBudget(budgetRange[0])} — ${formatBudget(budgetRange[1])}` },
                        { label: "Move-in", value: moveInDate || "Flexible" },
                        { label: "Urgency", value: urgencyLevels.find(l => l.value === urgency)?.label || "" },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-lg bg-muted/30 border border-border/40">
                          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {selectedTags.length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Must-haves</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {notes && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Notes</p>
                        <p className="text-sm text-foreground mt-0.5">{notes}</p>
                      </div>
                    )}

                    {boost && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-primary">Visibility Boost enabled — 3x more agent responses</p>
                      </div>
                    )}

                    <Button onClick={() => void handlePublishNeed()} disabled={submitting} className="w-full h-11 text-sm font-medium gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Publish Need
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(s => s - 1)}
                  disabled={currentStep === 1}
                  className="gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                {currentStep < 4 && (
                  <Button
                    onClick={() => setCurrentStep(s => s + 1)}
                    disabled={!canAdvance()}
                    className="gap-1.5"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                    <h3 className="text-sm font-semibold text-foreground">Lagos Tenancy Law</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Landlords cannot demand more than 1 year advance rent for yearly tenants. All rent payments must come with a receipt.</p>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Tips for better matches</h3>
                  <ul className="space-y-2">
                    {["Be specific about your preferred area", "Set a realistic budget range", "List amenities that matter most", "Add urgency for faster responses"].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-0.5 h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold shrink-0">{i + 1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm bg-muted/20">
                <CardContent className="p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">How it works</h3>
                  <div className="space-y-3">
                    {[
                      { step: "1", text: "Describe your ideal property" },
                      { step: "2", text: "Verified agents see your need" },
                      { step: "3", text: "Receive tailored property offers" },
                      { step: "4", text: "Compare, shortlist & book securely" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{item.step}</div>
                        <p className="text-xs text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* History tab */}
        <TabsContent value="history">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Posted Needs</CardTitle>
                  <CardDescription>Track your published property needs and incoming offers</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {needs.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No posted needs yet.
                </div>
              ) : (
                needs.map((need) => (
                  <button
                    key={need.id}
                    type="button"
                    className="block w-full py-4 text-left first:pt-0 last:pb-0"
                    onClick={() => navigate("/seeker/offers")}
                  >
                    <DashboardHistoryRow
                      icon={FileText}
                      title={need.request_title}
                      subtitle={
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatBudget(need.min_budget)} — {formatBudget(need.max_budget)}</span>
                          <span>·</span>
                          <span>{formatNeedDate(need.created_at)}</span>
                          <span>·</span>
                          <span>{need.response_count} offers</span>
                        </div>
                      }
                      badges={
                        <div className="flex flex-wrap items-center gap-2">
                          <DashboardStatusBadge tone={need.status === "active" ? "success" : "neutral"}>
                            {need.status.charAt(0).toUpperCase() + need.status.slice(1)}
                          </DashboardStatusBadge>
                        </div>
                      }
                    />
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
