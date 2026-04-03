import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your short-let availability and bookings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm font-medium text-foreground px-2">Mar 18 – 24, 2024</span>
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "This Week", value: "4", sub: "bookings", accent: "text-primary" },
          { label: "Confirmed", value: "3", sub: "guests", accent: "text-emerald-600" },
          { label: "Pending", value: "1", sub: "awaiting", accent: "text-amber-600" },
          { label: "Revenue", value: "₦270K", sub: "this week", accent: "text-foreground" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.accent}`}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="week" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="week" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> Week View
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Upcoming ({upcomingBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-8 gap-px bg-border rounded-xl overflow-hidden">
                <div className="bg-muted/50 p-2.5 text-xs font-medium text-muted-foreground">Time</div>
                {days.map((d) => (
                  <div key={d} className="bg-muted/50 p-2.5 text-xs font-medium text-center text-muted-foreground">{d}</div>
                ))}
                {hours.map((hour, hi) => (
                  <div key={`row-${hi}`} className="contents">
                    <div className="bg-background p-2.5 text-xs text-muted-foreground border-t border-border/60">{hour}</div>
                    {days.map((_, di) => {
                      const booking = bookings.find(b => b.day === di && b.startHour === hi);
                      return (
                        <div key={`${di}-${hi}`} className="bg-background border-t border-border/60 min-h-[40px] relative hover:bg-accent/30 transition-colors cursor-pointer">
                          {booking && (
                            <div
                              className={`absolute inset-x-0.5 top-0.5 rounded-lg p-1.5 text-xs ${
                                booking.status === "Confirmed"
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                              style={{ height: `${booking.duration * 40 - 2}px`, zIndex: 1 }}
                            >
                              <p className="font-medium truncate text-[11px]">{booking.guest}</p>
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
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
          {upcomingBookings.map((b) => {
            const s = statusStyles[b.status];
            return (
              <Card key={b.id} className="border border-border/60 shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border/60">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">{b.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-foreground">{b.guest}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          {b.checkIn} <ArrowRight className="h-3 w-3" /> {b.checkOut} · {b.property}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{b.status}
                      </span>
                      <p className="font-bold text-sm text-foreground">{b.amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
