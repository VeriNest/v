import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MarketingLogo from "@/components/MarketingLogo";
import { authApi, mapVerificationStatusToBanner, resolveAuthenticatedPath, setStoredKycStatus, setStoredSession } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const auth = await authApi.login({ email, password });
      setStoredSession(auth);
      const me = await authApi.me();
      setStoredKycStatus(
        me.user.role === "seeker"
          ? me.livenessCompleted ? "submitted" : "skipped"
          : mapVerificationStatusToBanner(me.verification?.status ?? auth.user.verification_status),
      );
      navigate(resolveAuthenticatedPath(me));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
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
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <MarketingLogo textClassName="text-2xl" iconBoxClassName="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
          </Link>
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Welcome back to<br />
            <span className="text-primary">Verinest.</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Sign in to access your dashboard, manage listings, and track your property journey.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <MarketingLogo textClassName="text-2xl" iconBoxClassName="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" className="pl-9 h-11 rounded-lg" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-9 pr-10 h-11 rounded-lg"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-input h-4 w-4" />
                <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</label>
              </div>

              <Button type="submit" className="w-full h-11 rounded-lg font-medium gap-2" disabled={submitting}>
                {submitting ? "Signing in..." : <>Sign in <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
