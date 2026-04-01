import { Home, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">Dwello</span>
      </div>

      <div className="flex items-center gap-8">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rent</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Buy</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sell</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          Manage Property <ChevronDown className="w-3 h-3" />
        </a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          Resources <ChevronDown className="w-3 h-3" />
        </a>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm text-foreground hover:text-primary transition-colors">Login</Link>
        <Button asChild className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
