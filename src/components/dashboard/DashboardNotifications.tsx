import { TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Trash2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { notificationsApi, type NotificationItem } from "@/lib/api";

type DashboardRole = "admin" | "provider" | "seeker" | "landlord";

const toneStyles: Record<string, string> = {
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

function timeAgo(value: string) {
  const date = new Date(value);
  const diffMinutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function toneFromKind(kind: string) {
  if (kind.includes("report") || kind.includes("verification") || kind.includes("maintenance")) return "warning";
  if (kind.includes("paid") || kind.includes("released") || kind.includes("booking")) return "success";
  return "default";
}

export function DashboardNotifications({ role }: { role: DashboardRole }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [dragX, setDragX] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const seenNotificationIds = useRef<Set<string>>(new Set());
  const hydratedNotifications = useRef(false);

  const { data = [] } = useQuery({
    queryKey: ["/notifications"],
    queryFn: () => notificationsApi.list(),
    refetchInterval: 60_000,
  });

  const visibleItems = useMemo(
    () => data.map((item) => ({ ...item, time: timeAgo(item.createdAt), tone: toneFromKind(item.kind) })),
    [data],
  );

  const unreadCount = useMemo(
    () => visibleItems.filter((item) => !item.readAt).length,
    [visibleItems],
  );

  useEffect(() => {
    visibleItems.forEach((item) => {
      if (seenNotificationIds.current.has(item.id)) return;
      seenNotificationIds.current.add(item.id);
      if (hydratedNotifications.current && !item.readAt) {
        toast.info(item.title, { description: item.body });
      }
    });
    hydratedNotifications.current = true;
  }, [visibleItems]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/notifications"] });
  };

  const markAllAsRead = async () => {
    await notificationsApi.readAll();
    await refresh();
  };

  const dismissNotification = async (id: string) => {
    await notificationsApi.deleteOne(id);
    if (swipedId === id) {
      setSwipedId(null);
      setDragX(0);
      setTouchStartX(null);
    }
    await refresh();
  };

  const clearAllNotifications = async () => {
    await Promise.all(visibleItems.map((item) => notificationsApi.deleteOne(item.id)));
    await refresh();
  };

  const openSettings = () => {
    setOpen(false);
    navigate(roleSettingsPath[role]);
  };

  const openNotification = async (item: NotificationItem & { time: string; tone: string }) => {
    if (!item.readAt) {
      await notificationsApi.readOne(item.id);
      await refresh();
    }
    setOpen(false);
    navigate(item.actionUrl || roleSettingsPath[role]);
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
        const unread = !item.readAt;

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => void openNotification(item)}
            className="flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-card px-3.5 py-3.5 text-left transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneStyles[item.tone]}`}>
              <Bell className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {unread ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">{item.title}</p>
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
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
      {!visibleItems.length ? <p className="px-2 py-8 text-center text-sm text-muted-foreground">No notifications yet.</p> : null}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85dvh] rounded-t-[28px] border-border/60 px-0 pb-0">
          <DrawerHeader className="px-4 pb-3 pt-2 text-left">
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/60 bg-background/70">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </DrawerClose>
                <div>
                  <DrawerTitle className="text-base font-semibold">Notifications</DrawerTitle>
                  <DrawerDescription className="text-xs text-muted-foreground">{roleLabels[role]}</DrawerDescription>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px] font-medium">{unreadCount} unread</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-full px-3 text-xs" onClick={() => void markAllAsRead()} disabled={!visibleItems.length}>
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/60 bg-background/70" onClick={openSettings}>
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/60 bg-background/70" onClick={() => void clearAllNotifications()} disabled={!visibleItems.length}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-6">
            {visibleItems.length ? (
              <div className="space-y-3">
                {visibleItems.map((item) => {
                  const unread = !item.readAt;
                  const translate = swipedId === item.id ? dragX : 0;

                  return (
                    <div key={item.id} className="relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <button type="button" aria-label={`Dismiss ${item.title}`} className="flex h-full w-full items-center justify-center" onClick={() => void dismissNotification(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => void openNotification(item)}
                        onTouchStart={handleTouchStart(item.id)}
                        onTouchMove={handleTouchMove(item.id)}
                        onTouchEnd={handleTouchEnd(item.id)}
                        className="relative z-10 flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-card px-3.5 py-3.5 text-left shadow-sm transition-transform duration-200"
                        style={{ transform: `translateX(${translate}px)` }}
                      >
                        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneStyles[item.tone]}`}>
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {unread ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
                                <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">{item.title}</p>
                              </div>
                              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                            </div>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{item.time}</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-4 py-10 text-center">
                <Bell className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <p className="mt-4 text-sm font-medium text-foreground">No notifications yet</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Once backend alerts start flowing, they will appear here.</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-[380px] rounded-3xl border border-border/60 bg-background/95 p-0 shadow-[0_18px_80px_-42px_rgba(15,23,42,0.55)] backdrop-blur-xl">
        <div className="border-b border-border/60 px-5 pb-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">Notifications</DropdownMenuLabel>
              <p className="mt-1 text-xs text-muted-foreground">{roleLabels[role]}</p>
            </div>
            <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px] font-medium">{unreadCount} unread</Badge>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-full px-3 text-xs" onClick={() => void markAllAsRead()} disabled={!visibleItems.length}>
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/60 bg-background/70" onClick={openSettings}>
                <Settings2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/60 bg-background/70" onClick={() => void clearAllNotifications()} disabled={!visibleItems.length}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="max-h-[420px] overflow-y-auto px-4 py-4">{desktopList}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
