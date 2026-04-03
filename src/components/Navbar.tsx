import { Home, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 lg:px-20 py-5 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/50">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
          <Home className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground tracking-tight">Dwello</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-primary transition-colors">Home</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Properties</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rent</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          Resources <ChevronDown className="w-3 h-3" />
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
          Sign In
        </Link>
        <Button asChild className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
