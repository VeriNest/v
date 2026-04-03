import { Home, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 lg:px-16 xl:px-20 py-4 border-b border-border/60 bg-background sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">Dwello</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-primary transition-colors">Home</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Properties</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rent</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          About <ChevronDown className="w-3 h-3" />
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-5">
        <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
          Sign In
        </Link>
        <Button asChild className="rounded-lg px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
