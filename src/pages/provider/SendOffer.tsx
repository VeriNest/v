import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  DollarSign,
  Eye,
  ImagePlus,
  MapPin,
  MessageSquare,
  Rocket,
  Send,
  ShieldCheck,
  Tag,
} from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const mockListings = [
  { id: "l1", title: "3 Bed Flat, Lekki Phase 1", price: "N2,500,000/yr", location: "Lekki, Lagos", bedrooms: "3" },
  { id: "l2", title: "2 Bed Apartment, Ikeja GRA", price: "N1,800,000/yr", location: "Ikeja, Lagos", bedrooms: "2" },
  { id: "l3", title: "Studio, Wuse 2", price: "N1,200,000/yr", location: "Wuse 2, Abuja", bedrooms: "Studio" },
  { id: "l4", title: "4 Bed Duplex, Maitama", price: "N5,000,000/yr", location: "Maitama, Abuja", bedrooms: "4" },
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

  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [prioritySend, setPrioritySend] = useState(false);
  const [selectedListing, setSelectedListing] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [customTerms, setCustomTerms] = useState("");
  const [message, setMessage] = useState("");

  const selectedListingData = mockListings.find((listing) => listing.id === selectedListing);
  const progress = (currentStep / steps.length) * 100;

  const canAdvance = () => {
    if (currentStep === 1) return selectedListing.length > 0;
    return true;
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Offer Sent Successfully!</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            {prioritySend ? "Your offer has been prioritized! " : ""}The tenant will be notified and can review your offer immediately.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/provider/inbox")} variant="outline" size="sm">Back to Inbox</Button>
          <Button
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
              setSelectedListing("");
              setOfferPrice("");
              setMoveInDate("");
              setMessage("");
              setPrioritySend(false);
              setCustomTerms("");
            }}
          >
            Send Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageHeader
        title="Send Offer"
        description={`Responding to ${leadNeed} with the same staged workflow used across provider actions.`}
        badge={<DashboardStatusBadge tone="info">Provider workflow</DashboardStatusBadge>}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/provider/inbox")} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" /> Back to Inbox
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Step {currentStep} of {steps.length}</p>
                <p className="text-xs text-muted-foreground">{steps[currentStep - 1].label}</p>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="mt-3 flex justify-between">
                {steps.map((step) => {
                  const isActive = step.id === currentStep;
                  const isDone = step.id < currentStep;
                  return (
                    <button
                      key={step.id}
                      onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        isActive ? "text-primary" : isDone ? "cursor-pointer text-emerald-600" : "text-muted-foreground/50"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                          isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.id}
                      </div>
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

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
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      selectedListing === listing.id ? "border-primary bg-primary/5 shadow-sm" : "border-border/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          selectedListing === listing.id ? "bg-primary/20" : "bg-muted"
                        }`}
                      >
                        <Building2 className={`h-5 w-5 ${selectedListing === listing.id ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${selectedListing === listing.id ? "text-primary" : "text-foreground"}`}>{listing.title}</p>
                        <div className="mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{listing.location}</span>
                          <span className="text-xs font-semibold text-foreground">{listing.price}</span>
                        </div>
                      </div>
                      {selectedListing === listing.id ? <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> : null}
                    </div>
                  </button>
                ))}
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-border/40 bg-muted/40 p-3">
                  <AlertCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Don't see a match?{" "}
                    <button className="font-medium text-primary hover:underline" onClick={() => navigate("/provider/listings/new")}>
                      Add a new listing
                    </button>{" "}
                    first.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Pricing & Availability</CardTitle>
                <CardDescription>Set your offer price and move-in date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {selectedListingData ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-3">
                    <Building2 className="h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedListingData.title}</p>
                      <p className="text-xs text-muted-foreground">Listed at {selectedListingData.price}</p>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Offer Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">N</span>
                    <Input placeholder="e.g. 2,300,000" className="pl-8" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Leave blank to use the listing price</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Available Move-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    placeholder="Write a personalized pitch to the tenant and highlight what makes your property a strong fit."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-[11px] text-muted-foreground">Personalized messages get stronger response rates.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Property Photos</label>
                  <div className="cursor-pointer rounded-xl border-2 border-dashed border-border p-8 text-center">
                    <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-2 text-sm text-muted-foreground">Drag and drop or click to upload</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">Available after backend is connected</p>
                  </div>
                </div>

                <Card className={`border transition-all ${prioritySend ? "border-primary bg-primary/5" : "border-border/60"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${prioritySend ? "bg-primary/20" : "bg-muted"}`}>
                          <Rocket className={`h-5 w-5 ${prioritySend ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Priority Send</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Your offer appears at the top of the tenant's inbox with a featured badge.
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="outline" className="border-primary/20 bg-primary/10 text-[10px] text-primary">
                              <Eye className="mr-0.5 h-2.5 w-2.5" /> Top placement
                            </Badge>
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-600">
                              <Tag className="mr-0.5 h-2.5 w-2.5" /> Featured badge
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

          {currentStep === 4 && (
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Review Your Offer</CardTitle>
                <CardDescription>Make sure everything looks good before sending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: "Tenant Need", value: leadNeed },
                    { label: "Your Listing", value: selectedListingData?.title || "Not selected" },
                    { label: "Offer Price", value: offerPrice ? `N${offerPrice}` : selectedListingData?.price || "Listing price" },
                    { label: "Move-in Date", value: moveInDate || "Flexible" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border/40 bg-muted/30 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                {customTerms ? (
                  <div className="rounded-lg border border-border/40 bg-muted/30 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Custom Terms</p>
                    <p className="mt-0.5 text-sm text-foreground">{customTerms}</p>
                  </div>
                ) : null}

                {message ? (
                  <div className="rounded-lg border border-border/40 bg-muted/30 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Cover Message</p>
                    <p className="mt-0.5 text-sm text-foreground">{message}</p>
                  </div>
                ) : null}

                {prioritySend ? (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <Rocket className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-primary">Priority Send enabled and your offer appears first.</p>
                  </div>
                ) : null}

                <Button onClick={() => setSubmitted(true)} className="h-11 w-full gap-2 text-sm font-medium">
                  <Send className="h-4 w-4" /> Send Offer
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} disabled={currentStep === 1} className="gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canAdvance()} className="gap-1.5">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                <h3 className="text-sm font-semibold text-foreground">Offer Protection</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                All offers are verified and tracked. Tenants see your verification badge and response history to build trust.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-sm">
            <CardContent className="space-y-3 p-5">
              <h3 className="text-sm font-semibold text-foreground">Tips for winning offers</h3>
              <ul className="space-y-2">
                {["Respond within the SLA window", "Personalize your cover message", "Offer competitive pricing", "Attach clear property photos"].map((tip, i) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-muted/20 shadow-sm">
            <CardContent className="space-y-2 p-5">
              <h3 className="text-sm font-semibold text-foreground">What happens next</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Tenant receives your offer" },
                  { step: "2", text: "They compare with other offers" },
                  { step: "3", text: "Accept, negotiate, or decline" },
                  { step: "4", text: "Booking confirmed and payout starts" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{item.step}</div>
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
