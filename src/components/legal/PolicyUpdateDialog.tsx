import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InlineSpinner } from "@/components/Loaders";
import { authApi, clearStoredSession, type AuthMeResponse } from "@/lib/api";

export function PolicyUpdateDialog({ me }: { me: AuthMeResponse | null }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requiresReacceptance = Boolean(me?.policyAcceptance?.requiresReacceptance);

  const acceptMutation = useMutation({
    mutationFn: () => authApi.acceptCurrentPolicies(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/auth/me"] });
      await queryClient.invalidateQueries({ queryKey: ["/auth/me", "access"] });
    },
  });

  const handleSignOut = async () => {
    const session = localStorage.getItem("verinest_session");
    const refreshToken = session ? JSON.parse(session)?.refresh_token : null;
    if (refreshToken) {
      await authApi.logout(refreshToken);
    } else {
      clearStoredSession();
    }
    navigate("/login", { replace: true });
  };

  return (
    <Dialog open={requiresReacceptance}>
      <DialogContent className="sm:max-w-lg [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>We updated our Terms and Privacy Policy</DialogTitle>
          <DialogDescription>
            {me?.policyMetadata?.changeSummary ?? "Please review the latest legal policies before continuing to use Verinest."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
          <p>Terms version: <span className="font-medium text-foreground">{me?.policyMetadata?.termsVersion ?? "--"}</span></p>
          <p>Privacy version: <span className="font-medium text-foreground">{me?.policyMetadata?.privacyVersion ?? "--"}</span></p>
          <p>Effective date: <span className="font-medium text-foreground">{me?.policyMetadata?.effectiveAt ? new Date(me.policyMetadata.effectiveAt).toLocaleDateString() : "--"}</span></p>
          <p className="pt-1">
            Read the full documents:
            {" "}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
            {" · "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>

        <DialogFooter className="gap-3 sm:justify-between">
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
          <Button onClick={() => acceptMutation.mutate()} disabled={acceptMutation.isPending}>
            {acceptMutation.isPending ? <><InlineSpinner variant="solid" /> Accepting...</> : "Accept and continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
