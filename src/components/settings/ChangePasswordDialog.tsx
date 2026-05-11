import { useState } from "react";
import { toast } from "sonner";

import { InlineSpinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api";

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [sendingCode, setSendingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const reset = () => {
    setCodeSent(false);
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setSendingCode(false);
    setSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  const handleSendCode = async () => {
    try {
      setSendingCode(true);
      await authApi.sendPasswordOtp();
      setCodeSent(true);
      toast.success("A verification code has been sent to your email");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send verification code";
      toast.error(message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await authApi.changePasswordWithOtp({
        code,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });
      toast.success("Password updated successfully");
      handleOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update password";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            We will send a one-time verification code to your email before changing your password.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Email verification</p>
              <p className="text-xs text-muted-foreground">
                Send a code, then enter it below with your new password.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={sendingCode} onClick={() => void handleSendCode()}>
              {sendingCode ? <><InlineSpinner variant="ghost" /> Sending...</> : codeSent ? "Resend code" : "Send code"}
            </Button>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Verification code</label>
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="Enter 5-digit code"
              inputMode="numeric"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Confirm new password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!codeSent || code.length !== 5 || newPassword.length < 8 || confirmPassword.length < 8 || submitting}
          >
            {submitting ? <><InlineSpinner variant="solid" /> Updating...</> : "Update password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
