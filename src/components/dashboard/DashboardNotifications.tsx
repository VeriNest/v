import { TouchEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

type DashboardRole = "admin" | "provider" | "seeker" | "landlord";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  path: string;
  tone?: "default" | "warning" | "success";
};

const notificationData: Record<DashboardRole, NotificationItem[]> = {
  admin: [
    { id: "admin-verification-chioma", title: "Verification queue updated", message: "Chioma Okafor submitted a new KYC document for review.", time: "10m ago", path: "/admin/verifications", tone: "warning" },
    { id: "admin-dispute-vi", title: "Dispute needs escalation", message: "A Victoria Island tenancy dispute has been reopened by both parties.", time: "42m ago", path: "/admin/disputes", tone: "warning" },
    { id: "admin-report-growth", title: "Weekly report ready", message: "The latest platform health and transaction report is now available.", time: "Today", path: "/admin/reports", tone: "success" },
  ],
  provider: [
    { id: "provider-lead-lekki", title: "New lead matched", message: "A seeker is requesting a 3 bed in Lekki Phase 1.", time: "8m ago", path: "/provider/inbox", tone: "default" },
    { id: "provider-payout-release", title: "Payout released", message: "Your latest escrow release is ready for settlement.", time: "1h ago", path: "/provider/payouts", tone: "success" },
    { id: "provider-calendar-viewing", title: "Viewing scheduled", message: "Corporate Client confirmed a Thursday inspection slot.", time: "Today", path: "/provider/calendar", tone: "default" },
  ],
  seeker: [
    { id: "seeker-offer-ikoyi", title: "New offer received", message: "A landlord sent you an updated offer for Modern 2 Bed, Ikoyi.", time: "12m ago", path: "/seeker/offers", tone: "default" },
    { id: "seeker-viewing-palm", title: "Viewing confirmed", message: "Palm Residence inspection is confirmed for Friday at 11:00 AM.", time: "1h ago", path: "/seeker/viewings", tone: "success" },
    { id: "seeker-booking-docs", title: "Booking awaiting action", message: "Upload the remaining documents to complete your booking review.", time: "Today", path: "/seeker/bookings", tone: "warning" },
  ],
  landlord: [
    { id: "landlord-collection-overdue", title: "Collection alert", message: "Amber Foods is due tomorrow for Admiralty Suites 5B.", time: "9m ago", path: "/landlord/collections", tone: "warning" },
    { id: "landlord-maintenance-urgent", title: "Urgent maintenance issue", message: "Lekki Court A2 was flagged for water heater replacement.", time: "50m ago", path: "/landlord/maintenance", tone: "warning" },
    { id: "landlord-document-expiry", title: "Compliance file expiring", message: "One property document is due for review this week.", time: "Today", path: "/landlord/settings", tone: "default" },
  ],
};

const toneStyles: Record<NonNullable<NotificationItem["tone"]>, string> = {
  default: "border border-primary/15 bg-primary/8 text-primary",
  warning: "border border-amber-500/15 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  success: "border border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
};

const roleLabels: Record<DashboardRole, string> = {
  admin: "Admin workspace",
  provider: "Provider workspace",
  seeker: "Seeker workspace",
  landlord: "Landlord workspace",
};

const roleSettingsPath: Record<DashboardRole, string> = {
  admin: "/admin/settings",
  provider: "/provider/settings",
  seeker: "/seeker/settings",
  landlord: "/landlord/settings",
};

export function DashboardNotifications({ role }: { role: DashboardRole }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const storageKey = `dwello_notifications_read_${role}`;
  const dismissedStorageKey = `dwello_notifications_dismissed_${role}`;
  const items = notificationData[role];
  const [readIds, setReadIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [dragX, setDragX] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const storedRead = localStorage.getItem(storageKey);
    if (storedRead) {
      try {
        setReadIds(JSON.parse(storedRead));
      } catch {
        setReadIds([]);
      }
    }

    const storedDismissed = localStorage.getItem(dismissedStorageKey);
    if (storedDismissed) {
      try {
        setDismissedIds(JSON.parse(storedDismissed));
      } catch {
        setDismissedIds([]);
      }
    }
  }, [dismissedStorageKey, storageKey]);

  const persistReadIds = (next: string[]) => {
    setReadIds(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const persistDismissedIds = (next: string[]) => {
    setDismissedIds(next);
    localStorage.setItem(dismissedStorageKey, JSON.stringify(next));
  };

  const visibleItems = useMemo(
    () => items.filter((item) => !dismissedIds.includes(item.id)),
    [dismissedIds, items],
  );

  const unreadCount = useMemo(
    () => visibleItems.filter((item) => !readIds.includes(item.id)).length,
    [readIds, visibleItems],
  );

  const markAllAsRead = () => {
    persistReadIds([...new Set([...readIds, ...visibleItems.map((item) => item.id)])]);
  };

  const dismissNotification = (id: string) => {
    if (!dismissedIds.includes(id)) {
      persistDismissedIds([...dismissedIds, id]);
    }
    if (swipedId === id) {
      setSwipedId(null);
      setDragX(0);
      setTouchStartX(null);
    }
  };

  const clearAllNotifications = () => {
    const nextDismissed = [...new Set([...dismissedIds, ...visibleItems.map((item) => item.id)])];
    const nextRead = [...new Set([...readIds, ...visibleItems.map((item) => item.id)])];
    persistDismissedIds(nextDismissed);
    persistReadIds(nextRead);
  };

  const openSettings = () => {
    setOpen(false);
    navigate(roleSettingsPath[role]);
  };

  const openNotification = (item: NotificationItem) => {
    if (!readIds.includes(item.id)) {
      persistReadIds([...readIds, item.id]);
    }
    setOpen(false);
    navigate(item.path);
  };

  const handleTouchStart = (id: string) => (event: TouchEvent<HTMLButtonElement>) => {
    setTouchStartX(event.touches[0].clientX);
    if (swipedId !== id) {
      setSwipedId(id);
      setDragX(0);
    }
  };

  const handleTouchMove = (id: string) => (event: TouchEvent<HTMLButtonElement>) => {
    if (touchStartX === null) return;
    const delta = event.touches[0].clientX - touchStartX;
    const next = Math.max(-80, Math.min(0, delta));
    setSwipedId(id);
    setDragX(next);
  };

  const handleTouchEnd = (id: string) => () => {
    if (dragX <= -56) {
      setSwipedId(id);
      setDragX(-80);
    } else {
      setSwipedId(null);
      setDragX(0);
    }
    setTouchStartX(null);
  };

  const trigger = (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-lg border border-transparent bg-background/70 shadow-none"
      aria-label="Open notifications"
    >
      <Bell className="h-4 w-4 text-muted-foreground" />
      {unreadCount > 0 && (
        <>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">{unreadCount} unread notifications</span>
        </>
      )}
    </Button>
  );

  const desktopList = (
    <div className="space-y-2">
      {visibleItems.map((item) => {
        const unread = !readIds.includes(item.id);

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => openNotification(item)}
            className="flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-card px-3.5 py-3.5 text-left transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneStyles[item.tone ?? "default"]}`}>
              <Bell className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {unread ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">{item.title}</p>
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.message}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Open</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85dvh] rounded-t-[28px] border-border/60 px-0 pb-0">
          <DrawerHeader className="px-4 pb-3 pt-2 text-left">
            <div className="relative flex items-center justify-between gap-3">
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </DrawerClose>
              <div className="absolute left-1/2 top-1/2 min-w-0 -translate-x-1/2 -translate-y-1/2 text-center">
                <DrawerTitle className="text-lg font-semibold">Notification</DrawerTitle>
                <DrawerDescription className="mt-1 text-xs">{roleLabels[role]}</DrawerDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground" onClick={openSettings}>
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground" onClick={clearAllNotifications}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-3">
            <div className="mx-auto inline-flex rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
              Today
            </div>
          </div>

          <div className="border-y border-border/60 px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Recent activity across your workspace</p>
              </div>
              <Badge variant="outline" className="shrink-0 border-border/60 bg-muted/30 text-[10px] font-medium">
                {visibleItems.length}
              </Badge>
            </div>
          </div>

          <div className="overflow-y-auto px-4 pb-5 pt-3">
            <div className="space-y-3">
              {visibleItems.map((item) => {
                const unread = !readIds.includes(item.id);
                const offset = swipedId === item.id ? dragX : 0;

                return (
                  <div key={item.id} className="relative overflow-hidden rounded-2xl">
                    <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-2xl bg-destructive">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-full w-full rounded-2xl text-white hover:bg-destructive/90 hover:text-white"
                        onClick={() => dismissNotification(item.id)}
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={() => openNotification(item)}
                      onTouchStart={handleTouchStart(item.id)}
                      onTouchMove={handleTouchMove(item.id)}
                      onTouchEnd={handleTouchEnd(item.id)}
                      className="relative z-10 flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-card px-3.5 py-3.5 text-left transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneStyles[item.tone ?? "default"]}`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {unread ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
                              <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">{item.title}</p>
                            </div>
                            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.message}</p>
                          </div>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">Swipe to delete</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-center">
              {unreadCount > 0 ? (
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-full px-3 text-xs text-muted-foreground" onClick={markAllAsRead}>
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </Button>
              ) : (
                <Badge variant="outline" className="rounded-full border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-600 dark:text-emerald-300">
                  Up to date
                </Badge>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        collisionPadding={12}
        className="w-[min(26rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-border/60 bg-background/98 p-0 shadow-lg backdrop-blur"
      >
        <div className="px-4 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
              <DropdownMenuLabel className="p-0 text-base font-semibold">Notifications</DropdownMenuLabel>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground" onClick={openSettings}>
                <Settings2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground" onClick={clearAllNotifications}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{roleLabels[role]}</p>
        </div>
        <div className="px-4 pb-3">
          <div className="inline-flex rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
            Today
          </div>
        </div>
        <div className="border-y border-border/60 px-4 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Recent activity across your workspace</p>
            </div>
            <Badge variant="outline" className="shrink-0 border-border/60 bg-muted/30 text-[10px] font-medium">
              {visibleItems.length}
            </Badge>
          </div>
        </div>
        <div className="max-h-[min(28rem,calc(100dvh-8rem))] overflow-y-auto px-4 pb-4 pt-3">{desktopList}</div>
        <div className="border-t border-border/60 px-4 py-3">
          <div className="flex justify-center">
            {unreadCount > 0 ? (
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 rounded-full px-3 text-xs text-muted-foreground" onClick={markAllAsRead}>
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </Button>
            ) : (
              <Badge variant="outline" className="rounded-full border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-600 dark:text-emerald-300">
                Up to date
              </Badge>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
