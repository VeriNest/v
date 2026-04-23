import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { agentApi, seekerApi } from "@/lib/api";

type Role = "provider" | "seeker";

function getReminderKey(role: Role, bookingId: string, scheduledFor: string) {
  return `verinest_booking_reminder_${role}_${bookingId}_${scheduledFor}`;
}

export function useBookingReminders(role: Role) {
  const { data = [] } = useQuery({
    queryKey: [role === "provider" ? "/agent/bookings" : "/seeker/bookings", "reminders"],
    queryFn: () => (role === "provider" ? agentApi.listBookings() : seekerApi.listBookings()),
    refetchInterval: 5 * 60 * 1000,
  });

  const upcoming = useMemo(
    () =>
      data.filter((item: any) => {
        if (!item.scheduledFor) return false;
        const scheduledFor = new Date(item.scheduledFor).getTime();
        const now = Date.now();
        const diff = scheduledFor - now;
        return diff > 0 && diff <= 3 * 60 * 60 * 1000;
      }),
    [data],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    upcoming.forEach((item: any) => {
      const bookingId = String(item.id ?? "");
      const scheduledFor = String(item.scheduledFor ?? "");
      const key = getReminderKey(role, bookingId, scheduledFor);
      if (window.sessionStorage.getItem(key)) return;

      window.sessionStorage.setItem(key, "1");
      toast.info(
        role === "provider"
          ? `Upcoming visit for ${item.propertyTitle ?? "property"} within 3 hours.`
          : `Upcoming booking for ${item.propertyTitle ?? "property"} within 3 hours.`,
        {
          description: item.scheduledFor ? new Date(item.scheduledFor).toLocaleString() : undefined,
        },
      );
    });
  }, [role, upcoming]);
}
