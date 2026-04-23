import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MarketingLogo from "@/components/MarketingLogo";
import { authApi, getStoredSession, resolveAuthenticatedPath, setStoredSession } from "@/lib/api";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [resent, setResent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const email = useMemo(() => {
    const stateEmail = (location.state as { email?: string } | null)?.email;
    return stateEmail ?? searchParams.get("email") ?? getStoredSession()?.user.email ?? "your email";
  }, [location.state, searchParams]);

  const otpValue = otp.join("");

  const handleDigitChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "");
    const next = [...otp];
    next[index] = value ? value[0] : "";
    setOtp(next);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!pasted) return;

    event.preventDefault();
    const next = ["", "", "", "", ""];
    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });
    setOtp(next);

    const focusIndex = Math.min(pasted.length, 4);
    inputRefs.current[focusIndex]?.focus();
    inputRefs.current[focusIndex]?.select();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setSubmitting(true);
      const user = await authApi.verifyEmailCode({ email, code: otpValue });
      const session = getStoredSession();
      if (session) {
        setStoredSession({ ...session, user: { ...session.user, email_verified: true, role: user.role } });
      }
      const me = await authApi.me();
      navigate(resolveAuthenticatedPath(me));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to verify code";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await authApi.sendEmailCode({ email, purpose: "signup" });
      setResent(true);
      toast.success("A fresh code has been sent.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to resend code";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-primary/5 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative z-10 max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <MarketingLogo textClassName="text-2xl" iconBoxClassName="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
          </Link>
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Confirm your email<br />
            <span className="text-primary">before setup.</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            We use email verification to protect seekers, providers, and landlords before they enter the platform.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <MarketingLogo textClassName="text-2xl" iconBoxClassName="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
            </div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Confirm your email</CardTitle>
            <CardDescription>
              Enter the OTP sent to <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5 text-center">
              <label className="text-sm font-medium text-foreground">One-time password</label>
              <div className="flex items-center justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(node) => {
                      inputRefs.current[index] = node;
                    }}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    className="h-12 w-12 rounded-xl text-center text-lg font-semibold"
                    value={digit}
                    onChange={(event) => handleDigitChange(index, event.target.value)}
                    onPaste={handlePaste}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Paste the 5-digit code and it will fill automatically.</p>
            </div>

            <div className="space-y-2">
              <Button type="button" className="w-full h-11 rounded-lg font-medium gap-2" onClick={handleVerify} disabled={otpValue.length !== 5 || submitting}>
                {submitting ? "Verifying..." : <>Verify email <ArrowRight className="h-4 w-4" /></>}
              </Button>

              <Button type="button" variant="outline" className="w-full h-11 rounded-lg font-medium gap-2" onClick={handleResend}>
                <RefreshCw className="h-4 w-4" /> Resend verification email
              </Button>
            </div>

            {resent ? (
              <p className="text-center text-xs text-emerald-600">
                A fresh OTP has been sent to {email}.
              </p>
            ) : null}

            <div className="text-center text-sm text-muted-foreground">
              Used the wrong email?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Go back
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
