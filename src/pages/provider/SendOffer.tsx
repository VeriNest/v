import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2, ChevronLeft, ArrowRight, Send, ShieldCheck,
  Building2, MapPin, Calendar, MessageSquare, ImagePlus, Sparkles,
  Eye, Rocket, Tag, AlertCircle, DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const mockListings = [
  { id: "l1", title: "3 Bed Flat, Lekki Phase 1", price: "₦2,500,000/yr", location: "Lekki, Lagos", bedrooms: "3" },
  { id: "l2", title: "2 Bed Apartment, Ikeja GRA", price: "₦1,800,000/yr", location: "Ikeja, Lagos", bedrooms: "2" },
  { id: "l3", title: "Studio, Wuse 2", price: "₦1,200,000/yr", location: "Wuse 2, Abuja", bedrooms: "Studio" },
  { id: "l4", title: "4 Bed Duplex, Maitama", price: "₦5,000,000/yr", location: "Maitama, Abuja", bedrooms: "4" },
];

const steps = [
  { id: 1, label: "Select Listing", icon: Building2 },
  { id: 2, label: "Pricing & Availability", icon: DollarSign },
  { id: 3, label: "Message & Photos", icon: MessageSquare },
  { id: 4, label: "Review & Send", icon: CheckCircle2 },
];

export default function SendOffer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadNeed = searchParams.get("need") || "Tenant Request";
  const leadId = searchParams.get("leadId") || "";

  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [prioritySend, setPrioritySend] = useState(false);

  // Step 1
  const [selectedListing, setSelectedListing] = useState("");

  // Step 2
  const [offerPrice, setOfferPrice] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [customTerms, setCustomTerms] = useState("");

  // Step 3
  const [message, setMessage] = useState("");

  const selectedListingData = mockListings.find(l => l.id === selectedListing);
  const progress = (currentStep / steps.length) * 100;

  const canAdvance = () => {
    if (currentStep === 1) return selectedListing.length > 0;
    return true;
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Offer Sent Successfully!</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
            {prioritySend ? "Your offer has been prioritized! " : ""}The tenant will be notified and can review your offer immediately.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/provider/inbox")} variant="outline" size="sm">Back to Inbox</Button>
          <Button size="sm" onClick={() => { setSubmitted(false); setCurrentStep(1); setSelectedListing(""); setOfferPrice(""); setMoveInDate(""); setMessage(""); setPrioritySend(false); setCustomTerms(""); }}>Send Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Send Offer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Responding to: <span className="font-medium text-foreground">{leadNeed}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/provider/inbox")} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" /> Back to Inbox
        </Button>
      </div>

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

          {/* Step 1: Select Listing */}
          {currentStep === 1 && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Select a Listing</CardTitle>
                <CardDescription>Choose which property to offer for this tenant's need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockListings.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => setSelectedListing(listing.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedListing === listing.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedListing === listing.id ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Building2 className={`h-5 w-5 ${selectedListing === listing.id ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${selectedListing === listing.id ? "text-primary" : "text-foreground"}`}>{listing.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5"><MapPin className="h-3 w-3" />{listing.location}</span>
                          <span className="text-xs font-semibold text-foreground">{listing.price}</span>
                        </div>
                      </div>
                      {selectedListing === listing.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/40 mt-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground">Don't see a match? <button className="text-primary font-medium hover:underline" onClick={() => navigate("/provider/listings/new")}>Add a new listing</button> first.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Pricing & Availability */}
          {currentStep === 2 && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Pricing & Availability</CardTitle>
                <CardDescription>Set your offer price and move-in date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {selectedListingData && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/40 flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedListingData.title}</p>
                      <p className="text-xs text-muted-foreground">Listed at {selectedListingData.price}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Offer Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">₦</span>
                    <Input
                      placeholder="e.g. 2,300,000"
                      className="pl-8"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Leave blank to use the listing price</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Available Move-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Custom Terms (optional)</label>
                  <Textarea
                    placeholder="e.g. 6-month minimum lease, caution deposit required, pets allowed..."
                    rows={3}
                    value={customTerms}
                    onChange={(e) => setCustomTerms(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Message & Photos */}
          {currentStep === 3 && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Message & Photos</CardTitle>
                <CardDescription>Write a personalized pitch and attach property photos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Cover Message</label>
                  <Textarea
                    placeholder="Write a personalized pitch to the tenant — highlight what makes your property a great fit for their need..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">Personalized messages get 2x more responses</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Property Photos</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer">
                    <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground mt-2">Drag & drop or click to upload</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Available after backend is connected</p>
                  </div>
                </div>

                {/* Priority send card */}
                <Card className={`border transition-all ${prioritySend ? "border-primary bg-primary/5" : "border-border/60"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${prioritySend ? "bg-primary/20" : "bg-muted"}`}>
                          <Rocket className={`h-5 w-5 ${prioritySend ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Priority Send</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Your offer appears at the top of the tenant's inbox with a featured badge.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                              <Eye className="h-2.5 w-2.5 mr-0.5" /> Top placement
                            </Badge>
                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">
                              <Tag className="h-2.5 w-2.5 mr-0.5" /> Featured badge
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Switch checked={prioritySend} onCheckedChange={setPrioritySend} />
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
                <CardTitle className="text-base">Review Your Offer</CardTitle>
                <CardDescription>Make sure everything looks good before sending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Tenant Need", value: leadNeed },
                    { label: "Your Listing", value: selectedListingData?.title || "Not selected" },
                    { label: "Offer Price", value: offerPrice ? `₦${offerPrice}` : selectedListingData?.price || "Listing price" },
                    { label: "Move-in Date", value: moveInDate || "Flexible" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-lg bg-muted/30 border border-border/40">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {customTerms && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Custom Terms</p>
                    <p className="text-sm text-foreground mt-0.5">{customTerms}</p>
                  </div>
                )}

                {message && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Cover Message</p>
                    <p className="text-sm text-foreground mt-0.5">{message}</p>
                  </div>
                )}

                {prioritySend && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-primary">Priority Send enabled — your offer appears first</p>
                  </div>
                )}

                <Button onClick={() => setSubmitted(true)} className="w-full h-11 text-sm font-medium gap-2">
                  <Send className="h-4 w-4" /> Send Offer
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
                <h3 className="text-sm font-semibold text-foreground">Offer Protection</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">All offers are verified and tracked. Tenants see your verification badge and response history to build trust.</p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Tips for winning offers</h3>
              <ul className="space-y-2">
                {["Respond within the SLA window", "Personalize your cover message", "Offer competitive pricing", "Attach clear property photos"].map((tip, i) => (
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
              <h3 className="text-sm font-semibold text-foreground">What happens next</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Tenant receives your offer" },
                  { step: "2", text: "They compare with other offers" },
                  { step: "3", text: "Accept, negotiate, or decline" },
                  { step: "4", text: "Booking confirmed & payout starts" },
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
    </div>
  );
}
