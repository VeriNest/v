import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Home,
  MapPin,
  Send,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { agentApi, formatCompactCurrency, titleCase } from "@/lib/api";

const getUrgencyTone = (urgency: string) => {
  if (urgency === "High") return "danger";
  if (urgency === "Medium") return "warning";
  return "success";
};

const getTypeTone = (type: string) => (type === "Short Let" ? "warning" : "info");

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["/agent/leads", id],
    queryFn: () => agentApi.getLead(id!),
    enabled: Boolean(id),
  });

  const lead = (data as any)?.lead;
  const seekerNeed = (data as any)?.seekerNeed;
  const existingOffer = (data as any)?.existingOffer;

  if (!lead || !seekerNeed) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20">
        <Home className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">Lead not found</p>
        <Button variant="outline" onClick={() => navigate("/provider/inbox")}>Back to Inbox</Button>
      </div>
    );
  }

  const needTitle = String(lead.requestTitle ?? seekerNeed.request_title ?? "Lead");
  const urgency = titleCase(String(lead.urgency ?? seekerNeed.urgency ?? "standard"));
  const type = titleCase(String(lead.propertyType ?? seekerNeed.property_type ?? "rent"));
  const status = String(lead.status ?? "new").toLowerCase() === "responded" ? "Responded" : "New";
  const location = String(lead.location ?? seekerNeed.location ?? "Unknown location");
  const budget = `${formatCompactCurrency(Number(seekerNeed.min_budget ?? 0))} - ${formatCompactCurrency(Number(seekerNeed.max_budget ?? 0))}`;
  const features = Array.isArray(seekerNeed.desired_features) ? seekerNeed.desired_features : [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageHeader
        title={needTitle}
        description="Review the full seeker requirement and respond with the best matching listing."
        badge={<DashboardStatusBadge tone={status === "Responded" ? "success" : "info"}>{status}</DashboardStatusBadge>}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {existingOffer && existingOffer !== null ? (
              <Button size="sm" variant="outline" className="gap-1.5 border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Offer Sent
              </Button>
            ) : (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(`/provider/inbox/${id}/offer?need=${encodeURIComponent(needTitle)}&id=${lead.needPostId}`)}
              >
                <Send className="h-3.5 w-3.5" /> Send Offer
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/provider/inbox")}>
              <ArrowLeft className="h-4 w-4" /> Back to Inbox
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.8fr)]">
        <DashboardSectionCard
          title="Need Summary"
          description="The full requirement shared by the seeker."
          contentClassName="space-y-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <DashboardStatusBadge tone={getTypeTone(type)}>{type}</DashboardStatusBadge>
            <DashboardStatusBadge tone={getUrgencyTone(urgency)}>{urgency}</DashboardStatusBadge>
            <span className="text-xs text-muted-foreground">Posted {lead.createdAt ? new Date(String(lead.createdAt)).toLocaleDateString() : "recently"}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Budget", value: budget, icon: DollarSign },
              { label: "Move-in", value: String(seekerNeed.move_in_timeline ?? "Flexible"), icon: CalendarDays },
              { label: "Location", value: location, icon: MapPin },
              { label: "Status", value: status, icon: Clock },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5" /> {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-sm leading-6 text-muted-foreground">{String(seekerNeed.description ?? "No description provided.")}</p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Required Features</p>
            <div className="flex flex-wrap gap-2">
              {features.length ? features.map((feature: string) => (
                <span key={feature} className="rounded-full border border-border/60 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {feature}
                </span>
              )) : <span className="text-sm text-muted-foreground">No required features listed.</span>}
            </div>
          </div>
        </DashboardSectionCard>

        <div className="space-y-6">
          <DashboardSectionCard
            title="Seeker Profile"
            description="Trust and urgency context for this request."
            contentClassName="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border/60">
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">SK</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">Seeker</p>
                <p className="text-xs text-muted-foreground">Need urgency: {urgency}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-medium text-foreground">Verified renter profile</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                This lead entered the routed provider queue for your operating location and can be prioritized with more confidence.
              </p>
            </div>
          </DashboardSectionCard>

          <DashboardSectionCard
            title="Response Guidance"
            description="What to do next from this lead."
            contentClassName="space-y-3"
          >
            {[
              "Send your strongest matching listing first.",
              "Keep your price, move-in terms, and special conditions clear.",
              "Use your operating location settings to keep future leads relevant.",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
            {!existingOffer ? (
              <Button
                className="mt-2 w-full gap-1.5"
                onClick={() => navigate(`/provider/inbox/${id}/offer?need=${encodeURIComponent(needTitle)}&id=${lead.needPostId}`)}
              >
                <Zap className="h-3.5 w-3.5" /> Respond to Lead
              </Button>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-700">
                Offer already sent for this lead.
              </div>
            )}
          </DashboardSectionCard>
        </div>
      </div>
    </div>
  );
}
