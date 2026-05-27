import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { agentApi } from "@/lib/api";
import { Loader2, Lock } from "lucide-react";

interface PropertyStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  currentStatus: string;
  currentLockedUntil?: string | null;
  onStatusUpdated?: () => void;
}

const STATUS_OPTIONS = [
  { value: "published", label: "Published (Active)" },
  { value: "hidden", label: "Hidden (Unlisted)" },
  { value: "rented_out", label: "Rented Out" },
  { value: "in_use", label: "In Use" },
  { value: "sold_out", label: "Sold" },
  { value: "draft", label: "Draft" },
];

const TIMED_STATUSES = new Set(["hidden", "rented_out", "in_use"]);

export function PropertyStatusModal({
  open,
  onOpenChange,
  propertyId,
  currentStatus,
  currentLockedUntil,
  onStatusUpdated,
}: PropertyStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [availableDate, setAvailableDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const lockDate = currentLockedUntil ? new Date(currentLockedUntil) : null;
  const isLocked = Boolean(lockDate && !Number.isNaN(lockDate.getTime()) && lockDate.getTime() > Date.now());

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    if (!TIMED_STATUSES.has(value)) {
      setAvailableDate("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    if (isLocked) {
      toast.error("This status is locked until the current duration ends.");
      return;
    }

    if (TIMED_STATUSES.has(selectedStatus) && !availableDate) {
      toast.error("Please set when the property will be available again.");
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
        payload.availableAt = date.toISOString();
      }

      const response = await agentApi.updateProperty(propertyId, payload);
      toast.success(String((response as any)?.message ?? "Property status updated successfully"));
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
            {isLocked && lockDate ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <Lock className="h-3.5 w-3.5" />
                Locked until {lockDate.toLocaleDateString()} {lockDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            ) : null}
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={isLocked}>
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

          {TIMED_STATUSES.has(selectedStatus) && (
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
                This status cannot be changed again until this date passes.
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
              disabled={isLoading || !selectedStatus || isLocked}
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
