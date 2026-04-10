import { useNavigate, useParams } from "react-router-dom";
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
import { initialLeads } from "./Inbox";

const getUrgencyTone = (urgency: string) => {
  if (urgency === "High") return "danger";
  if (urgency === "Medium") return "warning";
  return "success";
};

const getTypeTone = (type: string) => (type === "Short-let" ? "warning" : "info");

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const lead = initialLeads.find((item) => item.id === Number(id));

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20">
        <Home className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">Lead not found</p>
        <Button variant="outline" onClick={() => navigate("/provider/inbox")}>Back to Inbox</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageHeader
        title={lead.need}
        description={`Review ${lead.tenant}'s requirement and respond with the best matching listing.`}
        badge={<DashboardStatusBadge tone={lead.status === "Responded" ? "success" : "info"}>{lead.status}</DashboardStatusBadge>}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {lead.status === "New" ? (
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => navigate(`/provider/inbox/${lead.id}/offer?need=${encodeURIComponent(lead.need)}&leadId=${lead.id}`)}
              >
                <Send className="h-3.5 w-3.5" /> Send Offer
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="gap-1.5 border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Offer Sent
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/provider/inbox")}>
              <ArrowLeft className="h-4 w-4" /> Back to Inbox
            </Button>
          </div>
        }
      />

      {lead.status === "New" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          {lead.sla} minutes left to respond for priority boost.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.8fr)]">
        <DashboardSectionCard
          title="Need Summary"
          description="The full requirement shared by the tenant."
          contentClassName="space-y-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <DashboardStatusBadge tone={getTypeTone(lead.type)}>{lead.type}</DashboardStatusBadge>
            <DashboardStatusBadge tone={getUrgencyTone(lead.urgency)}>{lead.urgency}</DashboardStatusBadge>
            <span className="text-xs text-muted-foreground">Posted {lead.posted}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Budget", value: lead.budget, icon: DollarSign },
              { label: "Move-in", value: lead.moveIn, icon: CalendarDays },
              { label: "Location", value: lead.location, icon: MapPin },
              { label: "SLA", value: lead.sla > 0 ? `${lead.sla} min left` : "Handled", icon: Clock },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5" /> {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-sm leading-6 text-muted-foreground">{lead.description}</p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Required Features</p>
            <div className="flex flex-wrap gap-2">
              {lead.features.map((feature) => (
                <span key={feature} className="rounded-full border border-border/60 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </DashboardSectionCard>

        <div className="space-y-6">
          <DashboardSectionCard
            title="Tenant Profile"
            description="Trust and urgency context for this request."
            contentClassName="space-y-4"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border/60">
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">{lead.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{lead.tenant}</p>
                <p className="text-xs text-muted-foreground">Need urgency: {lead.urgency}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                {lead.verified ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}
                <p className="text-sm font-medium text-foreground">{lead.verified ? "Verified renter profile" : "Unverified renter profile"}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {lead.verified
                  ? "This lead has completed identity checks and can be prioritized with more confidence."
                  : "Profile verification is incomplete. Review carefully before committing inventory."}
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
              "Respond before the SLA expires to retain queue priority.",
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
            {lead.status === "New" ? (
              <Button
                className="mt-2 w-full gap-1.5"
                onClick={() => navigate(`/provider/inbox/${lead.id}/offer?need=${encodeURIComponent(lead.need)}&leadId=${lead.id}`)}
              >
                <Zap className="h-3.5 w-3.5" /> Respond to Lead
              </Button>
            ) : null}
          </DashboardSectionCard>
        </div>
      </div>
    </div>
  );
}
