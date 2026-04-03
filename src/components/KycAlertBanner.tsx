import { useState } from "react";
import { ShieldAlert, ShieldCheck, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface KycAlertBannerProps {
  variant: "provider" | "seeker";
}

export function KycAlertBanner({ variant }: KycAlertBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (variant === "seeker") {
      return localStorage.getItem("dwello_kyc_banner_dismissed") === "true";
    }
    return false;
  });

  const kycStatus = localStorage.getItem("dwello_kyc_status");

  if (kycStatus === "submitted" || dismissed) return null;

  const handleDismiss = () => {
    if (variant === "seeker") {
      localStorage.setItem("dwello_kyc_banner_dismissed", "true");
    }
    setDismissed(true);
  };

  if (variant === "provider") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Complete your verification</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Verified agents get <span className="font-semibold text-amber-700">3× more leads</span> and appear higher in search results. Upload your documents to build trust with tenants.
              </p>
            </div>
            <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-1.5 rounded-full bg-amber-100">
              <div className="h-full w-0 rounded-full bg-amber-500 transition-all" />
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">0 of 2 documents</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white" asChild>
              <Link to="/provider/settings">
                Complete Verification <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Trusted badge unlocked after verification</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Seeker variant — lighter
  return (
    <div className="rounded-2xl border border-blue-200/60 bg-blue-50/40 p-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-blue-100/80 flex items-center justify-center shrink-0">
        <ShieldCheck className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">Verify your identity for faster approvals</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Verified tenants get priority responses from agents.</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
          <Link to="/seeker/settings">Verify Now</Link>
        </Button>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
