import { Link } from "react-router-dom";

export function DashboardLegalFooter() {
  return (
    <footer className="border-t border-border/60 bg-background px-4 py-3 sm:px-6">
      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Use Verinest carefully. Escrow protections apply only where expressly stated once in-app payments go live.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Support</Link>
        </div>
      </div>
    </footer>
  );
}
