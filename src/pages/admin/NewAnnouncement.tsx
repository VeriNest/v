import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Info,
  Megaphone,
  Plus,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { announcements } from "./Announcements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { id: 1, label: "Audience & type" },
  { id: 2, label: "Content & delivery" },
  { id: 3, label: "Review & publish" },
];

const audienceOptions = [
  { value: "all", label: "All Users", desc: "Broadcast platform-wide", icon: Users, color: "text-primary", bg: "bg-primary/5 border-primary/20" },
  { value: "seekers", label: "Seekers Only", desc: "Tenant-facing update", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { value: "providers", label: "Providers Only", desc: "Agents and landlords", icon: Megaphone, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { value: "agents", label: "Agents Only", desc: "Provider subset", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
];

const typeOptions = [
  { value: "info", label: "Info", desc: "General notice", icon: Info, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { value: "warning", label: "Warning", desc: "Operational alert", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { value: "critical", label: "Critical", desc: "Immediate attention", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
];

export default function NewAnnouncement() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("info");
  const [message, setMessage] = useState("");
  const [delivery, setDelivery] = useState("in-app");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [schedule, setSchedule] = useState("");

  const progress = (currentStep / steps.length) * 100;
  const selectedAudience = audienceOptions.find((item) => item.value === audience) ?? audienceOptions[0];
  const selectedType = typeOptions.find((item) => item.value === type) ?? typeOptions[0];
  const SelectedTypeIcon = selectedType.icon;

  const canAdvance = useMemo(() => {
    if (currentStep === 1) return title.trim().length > 0 && audience.length > 0 && type.length > 0;
    if (currentStep === 2) return message.trim().length > 20 && delivery.length > 0;
    return true;
  }, [audience, currentStep, delivery, message, title, type]);

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Announcement ready</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Your announcement has been saved and published to the selected audience.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/announcements/new")}>
            Create Another
          </Button>
          <Button size="sm" onClick={() => navigate("/admin/announcements")}>
            Back to Announcements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9" asChild>
          <Link to="/admin/announcements">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">New Announcement</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compose a platform update with the same staged workflow used across dashboard create flows.
          </p>
        </div>
      </div>

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="h-auto bg-muted/50 p-1">
          <TabsTrigger value="new" className="gap-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Plus className="h-3.5 w-3.5" /> New Announcement
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="h-3.5 w-3.5" /> Recent Posts
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">
              {announcements.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Step {currentStep} of {steps.length}
                    </p>
                    <p className="text-xs text-muted-foreground">{steps[currentStep - 1].label}</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="mt-3 flex justify-between">
                    {steps.map((step) => {
                      const isActive = step.id === currentStep;
                      const isDone = step.id < currentStep;

                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                          className={`flex items-center gap-1.5 text-xs font-medium ${
                            isActive ? "text-primary" : isDone ? "cursor-pointer text-emerald-600" : "text-muted-foreground/50"
                          }`}
                        >
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : isDone
                                  ? "bg-emerald-500 text-white"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.id}
                          </div>
                          <span className="hidden sm:inline">{step.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {currentStep === 1 ? (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Audience & type</CardTitle>
                    <CardDescription>
                      Define who should receive this announcement and how strong the message should feel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Announcement title</label>
                      <Input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="e.g. Platform Maintenance Notice"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Use a concise operational title that reads well in notifications and history views.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Audience</label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {audienceOptions.map((option) => {
                          const Icon = option.icon;
                          const active = audience === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setAudience(option.value)}
                              className={`rounded-xl border p-4 text-left ${active ? `${option.bg} shadow-sm` : "border-border/60"}`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${active ? option.color : "text-muted-foreground"}`} />
                                <p className={`text-sm font-semibold ${active ? option.color : "text-foreground"}`}>{option.label}</p>
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Announcement type</label>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {typeOptions.map((option) => {
                          const Icon = option.icon;
                          const active = type === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setType(option.value)}
                              className={`rounded-xl border p-4 text-left ${active ? `${option.bg} shadow-sm` : "border-border/60"}`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${active ? option.color : "text-muted-foreground"}`} />
                                <p className={`text-sm font-semibold ${active ? option.color : "text-foreground"}`}>{option.label}</p>
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground">{option.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {currentStep === 2 ? (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Content & delivery</CardTitle>
                    <CardDescription>Write the message and decide how it should be delivered.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Message</label>
                      <Textarea
                        rows={6}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Write the announcement body here..."
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Delivery channel</label>
                        <Select value={delivery} onValueChange={setDelivery}>
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-app">In-app only</SelectItem>
                            <SelectItem value="in-app-push">In-app + Push</SelectItem>
                            <SelectItem value="banner">Banner + In-app</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Schedule</label>
                        <Input
                          value={schedule}
                          onChange={(event) => setSchedule(event.target.value)}
                          placeholder="Send now or set a later time"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Push notification</p>
                        <p className="text-xs text-muted-foreground">
                          Also notify users outside the dashboard when this goes live.
                        </p>
                      </div>
                      <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {currentStep === 3 ? (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">Review & publish</CardTitle>
                    <CardDescription>
                      Confirm the final audience, tone, and delivery setup before sending.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-background p-4">
                      <div className="flex items-center gap-2">
                        <SelectedTypeIcon className={`h-4 w-4 ${selectedType.color}`} />
                        <p className="text-sm font-semibold text-foreground">{title || "Untitled announcement"}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{message || "No message body yet."}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Audience</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{selectedAudience.label}</p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Delivery</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{delivery}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/[0.03] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-foreground">Ready to publish</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Push: {pushEnabled ? "Enabled" : "Disabled"}
                        {schedule ? ` - Schedule: ${schedule}` : " - Send immediately"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Back
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Save Draft
                  </Button>
                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setCurrentStep((step) => Math.min(steps.length, step + 1))}
                      disabled={!canAdvance}
                    >
                      Continue <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button type="button" size="sm" className="gap-1.5" onClick={() => setSubmitted(true)}>
                      <Send className="h-3.5 w-3.5" /> Publish
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Dispatch summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Audience</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{selectedAudience.label}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Type</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{selectedType.label}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Channel</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{delivery}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Publishing guidance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
                  <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3">
                    Keep titles operational and short. Users should understand the notice before opening it.
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3">
                    Use `Warning` or `Critical` only when a user action, outage, or risk is truly involved.
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-3">
                    When push is enabled, the first sentence should stand on its own as the message preview.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {announcements.map((item) => (
              <Card key={item.id} className="border border-border/60 shadow-sm">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  <p className="line-clamp-3 text-xs text-muted-foreground">{item.message}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.audience}</span>
                    <span>{item.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
