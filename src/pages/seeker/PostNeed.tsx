import { useState } from "react";
import { MapPin, Calendar, DollarSign, Home, Bed, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function PostNeed() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Need Posted Successfully!</h2>
        <p className="text-muted-foreground max-w-md">Your property need has been published. Verified agents and landlords will start sending you matching offers shortly.</p>
        <div className="flex gap-3">
          <Button onClick={() => setSubmitted(false)} variant="outline">Post Another</Button>
          <Button className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">View My Posts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Post Your Need</h2>
            <p className="text-white/70 text-sm">Tell providers exactly what you're looking for. They'll send you tailored offers.</p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Property Requirements</CardTitle>
          <CardDescription>Be specific to get better matches</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Type</label>
                <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-[hsl(263,70%,58%)]/20 focus:border-[hsl(263,70%,58%)] outline-none transition-all">
                  <option>Rent (Long-term)</option>
                  <option>Short-let</option>
                  <option>Shared Apartment</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bedrooms</label>
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select className="w-full h-10 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:ring-2 focus:ring-[hsl(263,70%,58%)]/20 focus:border-[hsl(263,70%,58%)] outline-none transition-all">
                    <option>1 Bedroom</option>
                    <option>2 Bedrooms</option>
                    <option>3 Bedrooms</option>
                    <option>4+ Bedrooms</option>
                    <option>Self-contain</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Preferred Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="e.g. Lekki, Lagos or Wuse, Abuja" className="pl-9" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Budget (Annual / Nightly)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="e.g. 2,000,000" className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Move-in Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" className="pl-9" required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Must-haves</label>
              <div className="flex flex-wrap gap-2">
                {["24hr Power", "Security", "Water Supply", "Parking", "Gated Estate", "Pet Friendly", "Furnished"].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    onClick={() => toggleTag(tag)}
                    className={`cursor-pointer px-3 py-1.5 transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-[hsl(263,70%,58%)] text-white border-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]"
                        : "hover:bg-[hsl(263,70%,58%)]/10 hover:border-[hsl(263,70%,58%)]/30"
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Additional Notes</label>
              <textarea className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-[hsl(263,70%,58%)]/20 focus:border-[hsl(263,70%,58%)] outline-none transition-all" placeholder="Any other requirements or preferences..." />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-medium mb-1 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Lagos Tenancy Law</p>
              <p className="text-xs">Landlords cannot demand more than 1 year advance rent for yearly tenants. All rent payments must come with a receipt.</p>
            </div>

            <Button type="submit" className="w-full rounded-full bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)] h-11 text-sm font-medium">
              Publish Need
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
