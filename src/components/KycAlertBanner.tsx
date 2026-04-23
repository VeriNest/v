import { useState } from "react";
import { ShieldAlert, ShieldCheck, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface KycAlertBannerProps {
  variant: "provider" | "landlord" | "seeker";
}

export function KycAlertBanner({ variant }: KycAlertBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (variant === "seeker") {
      return localStorage.getItem("verinest_kyc_banner_dismissed") === "true";
    }
    return false;
  });

  const kycStatus = localStorage.getItem("verinest_kyc_status");

  if (kycStatus === "submitted" || dismissed) return null;

  const themeTone =
    variant === "seeker"
      ? {
          shell: "border-primary/15 bg-card/90",
          iconWrap: "bg-primary/8",
          icon: "text-primary",
          progressTrack: "bg-primary/10",
          progressFill: "bg-primary",
          action: "border-primary/20 text-primary hover:bg-primary/5",
        }
      : {
          shell: "border-border/70 bg-card/95",
          iconWrap: "bg-primary/8",
          icon: "text-primary",
          progressTrack: "bg-secondary",
          progressFill: "bg-primary",
          action: "bg-primary text-primary-foreground hover:bg-primary/90",
        };

  const handleDismiss = () => {
    if (variant === "seeker") {
      localStorage.setItem("verinest_kyc_banner_dismissed", "true");
    }
    setDismissed(true);
  };

  if (variant === "provider" || variant === "landlord") {
    const isLandlord = variant === "landlord";

    return (
      <div className={`flex items-start gap-4 rounded-2xl border p-5 shadow-sm ${themeTone.shell}`}>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${themeTone.iconWrap}`}>
          <ShieldAlert className={`h-5 w-5 ${themeTone.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Complete your verification</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {isLandlord
                  ? "Verified landlords unlock ownership trust badges, faster portfolio approvals, and stronger tenant confidence."
                  : "Verified agents get 3x more leads and appear higher in search results. Upload your documents to build trust with tenants."}
              </p>
            </div>
            <button onClick={handleDismiss} className="shrink-0 text-muted-foreground transition-colors hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className={`h-1.5 flex-1 rounded-full ${themeTone.progressTrack}`}>
              <div className={`h-full w-0 rounded-full transition-all ${themeTone.progressFill}`} />
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">0 of 2 documents</span>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button size="sm" className={`h-8 gap-1.5 text-xs ${themeTone.action}`} asChild>
              <Link to={isLandlord ? "/landlord/settings" : "/provider/settings"}>
                Complete Verification <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span>{isLandlord ? "Ownership trust badge unlocked after verification" : "Trusted badge unlocked after verification"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm ${themeTone.shell}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${themeTone.iconWrap}`}>
        <ShieldCheck className={`h-4 w-4 ${themeTone.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">Verify your identity for faster approvals</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Verified tenants get priority responses from agents.</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" variant="outline" className={`h-8 gap-1 text-xs ${themeTone.action}`} asChild>
          <Link to="/seeker/settings">Verify Now</Link>
        </Button>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
