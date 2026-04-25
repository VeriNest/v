import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { InlineSpinner, MorphLoader } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImagePlus, Plus, MapPin } from "lucide-react";
import { toast } from "sonner";

interface AddListingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onListingAdded: (listing: {
    id: string;
    title: string;
    type: string;
    price: string;
    location: string;
    status: string;
    views: number;
    offers: number;
  }) => void;
}

export function AddListingSheet({ open, onOpenChange, onListingAdded }: AddListingSheetProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!title || !type || !price || !location) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newListing = {
        id: `L-${String(Date.now()).slice(-3)}`,
        title,
        type,
        price: type === "Short-let" ? `₦${price}/night` : `₦${price}/yr`,
        location,
        status: "Draft",
        views: 0,
        offers: 0,
      };
      onListingAdded(newListing);
      toast.success("Listing created!", { description: "Your listing has been saved as a draft." });
      onOpenChange(false);
      setTitle("");
      setType("");
      setPrice("");
      setLocation("");
      setBedrooms("");
      setDescription("");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        {submitting ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/90 backdrop-blur-sm">
            <MorphLoader size="sm" />
            <p className="text-sm text-muted-foreground">Creating listing...</p>
          </div>
        ) : null}
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg">Add New Listing</SheetTitle>
          <SheetDescription className="text-xs">List a property for tenants to discover.</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Property Title *</Label>
            <Input placeholder="e.g. 3 Bedroom Flat, Lekki Phase 1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Listing Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Short-let">Short-let</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bedrooms</Label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger><SelectValue placeholder="Beds" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5+">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Price *</Label>
            <Input placeholder={type === "Short-let" ? "e.g. 50,000" : "e.g. 2,500,000"} value={price} onChange={(e) => setPrice(e.target.value)} />
            <p className="text-[11px] text-muted-foreground">{type === "Short-let" ? "Price per night in Naira" : "Annual rent in Naira"}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Lagos">Lagos</SelectItem>
                <SelectItem value="Abuja">Abuja</SelectItem>
                <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                <SelectItem value="Ibadan">Ibadan</SelectItem>
                <SelectItem value="Kano">Kano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea placeholder="Describe the property — features, amenities, neighborhood..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Property Photos</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer">
              <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground mt-2">Drag & drop or click to upload</p>
              <p className="text-[10px] text-muted-foreground">Available after backend is connected</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1 gap-1.5">
              {submitting ? <InlineSpinner variant="solid" /> : <Plus className="h-3.5 w-3.5" />}
              {submitting ? "Creating..." : "Create Listing"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
