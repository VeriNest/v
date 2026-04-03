import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

const bookings = [
  { day: 0, startHour: 2, duration: 2, guest: "Emeka N.", property: "2 Bed Serviced, VI", status: "Confirmed" },
  { day: 2, startHour: 0, duration: 3, guest: "Corporate Client", property: "2 Bed Serviced, VI", status: "Pending" },
  { day: 4, startHour: 4, duration: 1, guest: "Fatima A.", property: "2 Bed Serviced, VI", status: "Confirmed" },
  { day: 5, startHour: 1, duration: 4, guest: "Guest User", property: "2 Bed Serviced, VI", status: "Confirmed" },
];

const upcomingBookings = [
  { id: 1, guest: "Emeka Nwankwo", property: "2 Bed Serviced, VI", checkIn: "Mar 22", checkOut: "Mar 24", amount: "₦90,000", status: "Confirmed", initials: "EN" },
  { id: 2, guest: "Corporate Client", property: "2 Bed Serviced, VI", checkIn: "Mar 25", checkOut: "Mar 28", amount: "₦135,000", status: "Pending", initials: "CC" },
  { id: 3, guest: "Fatima Abdullahi", property: "2 Bed Serviced, VI", checkIn: "Mar 30", checkOut: "Mar 31", amount: "₦45,000", status: "Confirmed", initials: "FA" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Confirmed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
};

export default function ProviderCalendar() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Short-let Calendar</h2>
            <p className="text-white/70 text-sm">Manage your short-let availability and bookings.</p>
          </div>
        </div>
      </div>

      {/* Simple week grid */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">This Week — March 18-24, 2024</CardTitle>
          <CardDescription>Click on a slot to block availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-px bg-border rounded-xl overflow-hidden">
            <div className="bg-muted/50 p-2.5 text-xs font-medium text-muted-foreground">Time</div>
            {days.map((d) => (
              <div key={d} className="bg-muted/50 p-2.5 text-xs font-medium text-center text-muted-foreground">{d}</div>
            ))}
            {hours.map((hour, hi) => (
              <div key={`row-${hi}`} className="contents">
                <div className="bg-background p-2.5 text-xs text-muted-foreground border-t">{hour}</div>
                {days.map((_, di) => {
                  const booking = bookings.find(b => b.day === di && b.startHour === hi);
                  return (
                    <div key={`${di}-${hi}`} className="bg-background border-t min-h-[44px] relative hover:bg-muted/30 transition-colors cursor-pointer">
                      {booking && (
                        <div
                          className={`absolute inset-x-1 top-1 rounded-lg p-1.5 text-xs ${
                            booking.status === "Confirmed"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                          style={{ height: `${booking.duration * 44 - 4}px`, zIndex: 1 }}
                        >
                          <p className="font-medium truncate">{booking.guest}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming list */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
          <CardDescription>Your next scheduled short-let guests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingBookings.map((b) => {
            const s = statusStyles[b.status];
            return (
              <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border bg-background hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                      {b.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{b.guest}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {b.checkIn} <ArrowRight className="h-3 w-3" /> {b.checkOut}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    {b.status}
                  </span>
                  <p className="font-bold text-sm">{b.amount}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
