import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"agent" | "landlord">("agent");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Dwello</span>
          </Link>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join as an agent or landlord</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("agent")}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-lg border-2 transition-colors ${
                    role === "agent"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Agent</span>
                  <span className="text-xs text-center">List & manage properties for clients</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("landlord")}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-lg border-2 transition-colors ${
                    role === "landlord"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-sm font-medium">Landlord</span>
                  <span className="text-xs text-center">List your own properties directly</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="John Doe" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  required
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

            <Button type="submit" className="w-full rounded-full">Create Account</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
