import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, CheckCircle2, ShieldCheck, FileText, Plus, ChevronRight,
  ChevronLeft, Eye, Rocket, ArrowRight, Building2, Sparkles, AlertCircle,
  ImagePlus, Home, Bed, DollarSign, Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { DashboardHistoryRow } from "@/components/dashboard/DashboardHistoryRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";

const previousListings = [
  { id: 1, title: "3 Bedroom Flat, Lekki Phase 1", price: "₦2.5M/yr", status: "Active", views: 45, date: "Mar 15, 2024", type: "Rent" },
  { id: 2, title: "Studio Apartment, Wuse 2", price: "₦1.2M/yr", status: "Active", views: 32, date: "Feb 28, 2024", type: "Rent" },
  { id: 3, title: "2 Bed Serviced Apartment, VI", price: "₦45K/night", status: "Draft", views: 0, date: "Mar 18, 2024", type: "Short-let" },
];

const amenities = ["24hr Power", "Security", "Water Supply", "Parking", "Gated Estate", "Pet Friendly", "Furnished", "Swimming Pool", "Gym", "Serviced", "Elevator", "Balcony"];

const steps = [
  { id: 1, label: "Property Details", icon: Building2 },
  { id: 2, label: "Location & Pricing", icon: MapPin },
  { id: 3, label: "Features & Photos", icon: Sparkles },
  { id: 4, label: "Review & Publish", icon: CheckCircle2 },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Active: { color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  Draft: { color: "text-muted-foreground", bg: "bg-muted border-border", dot: "bg-muted-foreground" },
  Pending: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
};

export default function AddListing() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [boost, setBoost] = useState(false);

  // Step 1
  const [listingType, setListingType] = useState("rent");
  const [bedrooms, setBedrooms] = useState("2");
  const [title, setTitle] = useState("");

  // Step 2
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");

  // Step 3
  const [description, setDescription] = useState("");

  const toggleAmenity = (tag: string) => {
    setSelectedAmenities(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const progress = (currentStep / steps.length) * 100;

  const canAdvance = () => {
    if (currentStep === 1) return listingType && bedrooms && title.length > 0;
    if (currentStep === 2) return location.length > 0 && price.length > 0;
    return true;
  };

  const priceLabel = listingType === "shortlet" ? "per night" : listingType === "sale" ? "total" : "per year";

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Listing Published Successfully!</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
            {boost ? "Your listing has been boosted! " : ""}Your property is now visible to verified tenants looking for a match.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => { setSubmitted(false); setCurrentStep(1); setTitle(""); setLocation(""); setPrice(""); setDescription(""); setSelectedAmenities([]); setBoost(false); }} variant="outline" size="sm">Add Another</Button>
          <Button size="sm" onClick={() => navigate("/provider/listings")}>View My Listings</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <DashboardPageHeader
        title="Add a Listing"
        description="List your property — verified tenants will discover and send you offers."
      />

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="new" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Listing
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <FileText className="h-3.5 w-3.5" /> My Listings
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">{previousListings.length}</Badge>
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

              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Property Details</CardTitle>
                    <CardDescription>What type of property are you listing?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Listing Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "rent", label: "Rent", desc: "Long-term lease" },
                          { value: "shortlet", label: "Short-let", desc: "Days to weeks" },
                          { value: "sale", label: "Sale", desc: "Property for sale" },
                        ].map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setListingType(type.value)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              listingType === type.value
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border/60"
                            }`}
                          >
                            <p className={`text-sm font-semibold ${listingType === type.value ? "text-primary" : "text-foreground"}`}>{type.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{type.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Property Title</label>
                      <Input
                        placeholder="e.g. 3 Bedroom Flat, Lekki Phase 1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <p className="text-[11px] text-muted-foreground">A clear title helps tenants find your property faster</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Number of Bedrooms</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "studio", label: "Studio" },
                          { value: "self", label: "Self-con" },
                          { value: "1", label: "1 Bed" },
                          { value: "2", label: "2 Bed" },
                          { value: "3", label: "3 Bed" },
                          { value: "4", label: "4 Bed" },
                          { value: "5+", label: "5+ Bed" },
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
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Location & Pricing */}
              {currentStep === 2 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Location & Pricing</CardTitle>
                    <CardDescription>Where is the property and how much does it cost?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Location</label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Select city" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lagos">Lagos</SelectItem>
                          <SelectItem value="Abuja">Abuja</SelectItem>
                          <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                          <SelectItem value="Ibadan">Ibadan</SelectItem>
                          <SelectItem value="Kano">Kano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Full Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. 12 Admiralty Way, Lekki Phase 1"
                          className="pl-9"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">Exact address helps tenants assess the neighborhood</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        Price ({priceLabel}) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">₦</span>
                        <Input
                          placeholder={listingType === "shortlet" ? "e.g. 50,000" : listingType === "sale" ? "e.g. 25,000,000" : "e.g. 2,500,000"}
                          className="pl-8"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {listingType === "shortlet" ? "Price per night in Naira" : listingType === "sale" ? "Total sale price in Naira" : "Annual rent in Naira"}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">
                        {listingType === "shortlet" ? "Available From" : "Move-in Date"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="date" className="pl-9" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
                      <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                      <p className="text-xs text-muted-foreground">Competitive pricing increases tenant interest. Check similar listings in your area.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Features & Photos */}
              {currentStep === 3 && (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Features & Photos</CardTitle>
                    <CardDescription>Highlight what makes your property special</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Available Amenities</label>
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            onClick={() => toggleAmenity(tag)}
                            className={`cursor-pointer px-3 py-1.5 text-xs ${
                              selectedAmenities.includes(tag)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {selectedAmenities.length > 0 && (
                        <p className="text-[11px] text-muted-foreground">{selectedAmenities.length} selected</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Property Description</label>
                      <Textarea
                        placeholder="Describe the property — features, condition, neighborhood highlights, nearby landmarks..."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Property Photos</label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer">
                        <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground mt-2">Drag & drop or click to upload</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Available after backend is connected</p>
                      </div>
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
                                Get 3x more tenant inquiries. Your listing will be featured at the top and shown to active seekers.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                                  <Eye className="h-2.5 w-2.5 mr-0.5" /> 3x visibility
                                </Badge>
                                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">
                                  <Tag className="h-2.5 w-2.5 mr-0.5" /> Featured badge
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
                    <CardTitle className="text-base">Review Your Listing</CardTitle>
                    <CardDescription>Make sure everything looks good before publishing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Title", value: title || "Not specified" },
                        { label: "Type", value: listingType === "rent" ? "Rent (Long-term)" : listingType === "shortlet" ? "Short-let" : "Sale" },
                        { label: "Bedrooms", value: bedrooms === "studio" ? "Studio" : bedrooms === "self" ? "Self-contain" : `${bedrooms} Bedroom${bedrooms !== "1" ? "s" : ""}` },
                        { label: "Location", value: location || "Not specified" },
                        { label: "Price", value: price ? `₦${price}/${listingType === "shortlet" ? "night" : listingType === "sale" ? "total" : "yr"}` : "Not set" },
                        { label: "Available", value: availableFrom || "Flexible" },
                      ].map((item) => (
                        <div key={item.label} className="p-3 rounded-lg bg-muted/30 border border-border/40">
                          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {address && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Address</p>
                        <p className="text-sm text-foreground mt-0.5">{address}</p>
                      </div>
                    )}

                    {selectedAmenities.length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAmenities.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {description && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Description</p>
                        <p className="text-sm text-foreground mt-0.5">{description}</p>
                      </div>
                    )}

                    {boost && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-primary">Visibility Boost enabled — 3x more tenant inquiries</p>
                      </div>
                    )}

                    <Button onClick={() => setSubmitted(true)} className="w-full h-11 text-sm font-medium gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Publish Listing
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
                    <h3 className="text-sm font-semibold text-foreground">Listing Guidelines</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">All listings are reviewed before going live. Ensure your property details are accurate and photos are clear to avoid delays.</p>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Tips for better engagement</h3>
                  <ul className="space-y-2">
                    {["Add clear, well-lit photos", "Write a detailed description", "Set competitive pricing", "Highlight unique amenities"].map((tip, i) => (
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
                      { step: "1", text: "Describe your property" },
                      { step: "2", text: "Set location & pricing" },
                      { step: "3", text: "Add photos & amenities" },
                      { step: "4", text: "Publish & get matched" },
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
                  <CardTitle className="text-base">My Listings</CardTitle>
                  <CardDescription>Track your published properties and their performance</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {previousListings.map((listing) => {
                const s = statusStyles[listing.status] || statusStyles.Draft;
                return (
                  <div key={listing.id} className="py-4 first:pt-0 last:pb-0">
                    <DashboardHistoryRow
                      icon={Building2}
                      title={listing.title}
                      subtitle={
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{listing.price}</span>
                          <span>·</span>
                          <span>{listing.date}</span>
                          <span>·</span>
                          <span>{listing.views} views</span>
                        </div>
                      }
                      badges={
                        <div className="flex flex-wrap items-center gap-2">
                          <DashboardStatusBadge tone="neutral">{listing.type}</DashboardStatusBadge>
                          <DashboardStatusBadge tone={listing.status === "Active" ? "success" : listing.status === "Pending" ? "warning" : "neutral"}>
                            {listing.status}
                          </DashboardStatusBadge>
                        </div>
                      }
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
