import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { InlineSpinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MarketingLogo from "@/components/MarketingLogo";
import { authApi } from "@/lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setSubmitting(true);
      await authApi.sendPasswordReset({ email });
      setSent(true);
      toast.success("Check your email for the password reset link");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <MarketingLogo to="/" textClassName="text-2xl" iconBoxClassName="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Reset your<br />
            <span className="text-primary">password.</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            We'll send you a secure link to reset your password and regain access to your account.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>
              {sent
                ? "Check your email for the reset link"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {sent ? (
              <div className="space-y-6">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email sent successfully</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We've sent a password reset link to <strong>{email}</strong>. Check your inbox or spam folder.
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  The reset link expires in 1 hour.
                </p>

                <Button
                  onClick={() => navigate("/auth/login")}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive the email? <button onClick={() => setSent(false)} className="text-primary hover:underline">Try again</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={submitting}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll send a secure reset link to this email address.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <InlineSpinner />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">or</span>
                  </div>
                </div>

                <Link to="/auth/login">
                  <Button variant="outline" className="w-full" type="button">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
