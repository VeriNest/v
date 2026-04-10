import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.10),transparent_34%)]" />

      <div className="relative w-full max-w-3xl text-center">
        <div className="space-y-6 rounded-[2rem] border border-border/60 bg-card/80 px-8 py-14 shadow-sm backdrop-blur">
          <p className="font-mono text-7xl leading-none text-primary/85 sm:text-8xl">404</p>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Page not found
            </h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Button asChild size="lg" className="gap-2 rounded-xl px-6">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
