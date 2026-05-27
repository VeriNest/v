import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { InlineSpinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MarketingLogo from "@/components/MarketingLogo";
import { PageSeo } from "@/components/seo/PageSeo";
import { authApi, setStoredSession } from "@/lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: policyMetadata, isLoading: isLoadingPolicyMetadata } = useQuery({
    queryKey: ["/legal/policies/meta"],
    queryFn: () => authApi.getPolicyMetadata(),
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedLegal) {
      toast.error("You must accept the Terms and Privacy Policy to continue.");
      return;
    }
    if (!policyMetadata) {
      toast.error("Unable to load the current legal policy versions. Try again.");
      return;
    }
    try {
      setSubmitting(true);
      const auth = await authApi.register({
        full_name: fullName,
        email,
        password,
        accepted_terms_version: policyMetadata.termsVersion,
        accepted_privacy_version: policyMetadata.privacyVersion,
      });
      setStoredSession(auth);
      await authApi.sendEmailCode({ email, purpose: "signup" });
      navigate(`/confirm-email?email=${encodeURIComponent(email)}`, { state: { email } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <PageSeo
        title="Create an Account"
        description="Create a Verinest account to browse verified homes, post your housing need, or manage property listings."
        canonicalPath="/signup"
        noIndex
      />
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <MarketingLogo to="/" textClassName="text-2xl" iconBoxClassName="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Find your perfect home,<br />
            <span className="text-primary">hassle-free.</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Join thousands of tenants, agents, and landlords on Nigeria's most trusted property platform.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <MarketingLogo textClassName="text-2xl" iconBoxClassName="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Get started in under a minute</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="John Doe" className="pl-9 h-11 rounded-lg" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9 h-11 rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
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

              <Button type="submit" className="w-full h-11 rounded-lg font-medium gap-2" disabled={submitting}>
                {submitting ? <><InlineSpinner variant="solid" /> Creating account...</> : <>Continue <ArrowRight className="h-4 w-4" /></>}
              </Button>

              <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3">
                <Checkbox id="accept-legal" checked={acceptedLegal} onCheckedChange={(checked) => setAcceptedLegal(checked === true)} />
                <label htmlFor="accept-legal" className="text-[11px] leading-5 text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-primary hover:underline">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>.
                  {policyMetadata ? ` Current versions: Terms ${policyMetadata.termsVersion}, Privacy ${policyMetadata.privacyVersion}.` : ""}
                  {isLoadingPolicyMetadata ? " Loading policy versions..." : ""}
                </label>
              </div>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
