import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { agentApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface PropertyStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  currentStatus: string;
  onStatusUpdated?: () => void;
}

const STATUS_OPTIONS = [
  { value: "published", label: "Published (Active)" },
  { value: "hidden", label: "Hidden (Unlisted)" },
  { value: "rented_out", label: "Rented Out" },
  { value: "sold_out", label: "Sold" },
  { value: "draft", label: "Draft" },
];

export function PropertyStatusModal({
  open,
  onOpenChange,
  propertyId,
  currentStatus,
  onStatusUpdated,
}: PropertyStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [availableDate, setAvailableDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    // Reset availability date if not selecting rented_out
    if (value !== "rented_out") {
      setAvailableDate("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    // If rented_out, require a date
    if (selectedStatus === "rented_out" && !availableDate) {
      toast.error("Please set when the property will be available");
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, any> = {
        status: selectedStatus,
      };

      // Include available_at as ISO string if provided
      if (availableDate) {
        const date = new Date(availableDate);
        payload.available_at = date.toISOString();
      }

      await agentApi.updateProperty(propertyId, payload);
      toast.success("Property status updated successfully");
      onOpenChange(false);
      setSelectedStatus("");
      setAvailableDate("");
      onStatusUpdated?.();
    } catch (error) {
      toast.error("Failed to update property status");
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Property Status</DialogTitle>
          <DialogDescription>
            Update your property status to reflect its current availability
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status Display */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground font-medium">Current Status</p>
            <p className="text-sm font-semibold capitalize mt-1">{currentStatus.replace("_", " ")}</p>
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select new status..." />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability Date - only show for rented_out */}
          {selectedStatus === "rented_out" && (
            <div className="space-y-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3">
              <Label htmlFor="available-date">Available Again On</Label>
              <input
                id="available-date"
                type="date"
                value={availableDate}
                onChange={(e) => setAvailableDate(e.target.value)}
                min={today}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The property will automatically become available on this date
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !selectedStatus}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
