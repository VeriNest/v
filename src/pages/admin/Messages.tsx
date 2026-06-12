import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Clock3, Mail, MailOpen, MessageSquareText, Search, User } from "lucide-react";

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminApi, type ContactMessageItem } from "@/lib/api";
import { toast } from "sonner";

export default function AdminMessages() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["/admin/contact-messages"],
    queryFn: () => adminApi.contactMessages(),
  });

  const messages = data?.messages ?? [];
  const unread = data?.unread ?? 0;

  const filtered = useMemo(
    () =>
      messages.filter((message) =>
        [message.name, message.email, message.subject, message.message].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [messages, search],
  );

  useEffect(() => {
    if (!selectedId && filtered.length > 0) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((message) => message.id === selectedId) ?? filtered[0] ?? null;

  const markReadMutation = useMutation({
    mutationFn: (messageId: string) => adminApi.markContactMessageRead(messageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["/admin/contact-messages"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to mark message as read";
      toast.error(message);
    },
  });

  const handleSelect = async (message: ContactMessageItem) => {
    setSelectedId(message.id);
    if (!message.isRead) {
      await markReadMutation.mutateAsync(message.id);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Contact Messages"
        description="Messages users sent from the public contact form, with sender details and read status."
        badge={<DashboardStatusBadge tone={unread > 0 ? "warning" : "success"}>{unread} unread</DashboardStatusBadge>}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search messages..." />
            </div>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 p-6 text-center">
                  <Mail className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium text-foreground">No messages found</p>
                  <p className="mt-1 text-xs text-muted-foreground">Try a different search term.</p>
                </div>
              ) : (
                filtered.map((message) => {
                  const isSelected = message.id === selected?.id;
                  return (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => void handleSelect(message)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isSelected ? "border-primary/30 bg-primary/5" : "border-border/60 bg-background hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{message.subject}</p>
                          <p className="truncate text-xs text-muted-foreground">{message.name} • {message.email}</p>
                        </div>
                        <DashboardStatusBadge tone={message.isRead ? "success" : "warning"}>
                          {message.isRead ? "Read" : "Unread"}
                        </DashboardStatusBadge>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Clock3 className="h-3 w-3" />
                        <span>{message.createdAt ? new Date(message.createdAt).toLocaleString() : "Recently"}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-5">
            {selected ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <DashboardStatusBadge tone={selected.isRead ? "success" : "warning"}>
                      {selected.isRead ? "Read" : "Unread"}
                    </DashboardStatusBadge>
                    <h2 className="mt-3 text-xl font-semibold text-foreground">{selected.subject}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Received {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "recently"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={selected.isRead || markReadMutation.isPending}
                    onClick={() => void markReadMutation.mutateAsync(selected.id)}
                  >
                    <CheckCheck className="h-4 w-4" /> Mark read
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Sender Name", value: selected.name, icon: User },
                    { label: "Sender Email", value: selected.email, icon: MailOpen },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                      <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                        <item.icon className="h-3.5 w-3.5" /> {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Message</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">{selected.message}</p>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Sender Details</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Every message includes the sender identity from the public contact form so the admin can read, follow up, or escalate support directly.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <MessageSquareText className="h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium text-foreground">Select a message</p>
                <p className="mt-1 text-xs text-muted-foreground">Sender details and the full body appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
