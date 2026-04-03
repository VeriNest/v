import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Send, ImagePlus, CalendarDays } from "lucide-react";
import { toast } from "sonner";

const mockListings = [
  { id: "l1", title: "3 Bed Flat, Lekki Phase 1", price: "₦2,500,000/yr" },
  { id: "l2", title: "2 Bed Apartment, Ikeja GRA", price: "₦1,800,000/yr" },
  { id: "l3", title: "Studio, Wuse 2", price: "₦1,200,000/yr" },
  { id: "l4", title: "4 Bed Duplex, Maitama", price: "₦5,000,000/yr" },
];

interface SendOfferSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadNeed: string;
  onOfferSent: () => void;
}

export function SendOfferSheet({ open, onOpenChange, leadNeed, onOfferSent }: SendOfferSheetProps) {
  const [selectedListing, setSelectedListing] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    if (!selectedListing) {
      toast.error("Please select a listing");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Offer sent successfully!", {
        description: "The tenant will be notified of your offer.",
      });
      onOfferSent();
      onOpenChange(false);
      setSelectedListing("");
      setOfferPrice("");
      setMoveInDate("");
      setMessage("");
    }, 1200);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg">Send Offer</SheetTitle>
          <SheetDescription className="text-xs">
            Responding to: <span className="font-medium text-foreground">{leadNeed}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select a Listing</Label>
            <Select value={selectedListing} onValueChange={setSelectedListing}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a listing to offer" />
              </SelectTrigger>
              <SelectContent>
                {mockListings.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    <span className="flex items-center justify-between gap-2">
                      {l.title} <span className="text-muted-foreground text-xs">{l.price}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Offer Price</Label>
            <Input
              placeholder="e.g. ₦2,300,000/yr"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">Leave blank to use the listing price</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Available Move-in Date
            </Label>
            <Input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Cover Message</Label>
            <Textarea
              placeholder="Write a personalized pitch to the tenant..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Attach Photos</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
              <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground mt-2">Drag & drop or click to upload</p>
              <p className="text-[10px] text-muted-foreground">Available after backend is connected</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} disabled={sending} className="flex-1 gap-1.5">
              <Send className="h-3.5 w-3.5" />
              {sending ? "Sending..." : "Send Offer"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
