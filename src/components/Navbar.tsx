import { Home, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-4 bg-[hsl(240,60%,97%)]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Dwello</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-foreground font-medium hover:text-primary transition-colors">Rent</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Buy</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sell</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Manage Property <ChevronDown className="w-3 h-3" />
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Resources <ChevronDown className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a href="#" className="text-sm text-foreground font-medium hover:text-primary transition-colors">Login</a>
        <Button className="rounded-lg px-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm">Sign up</Button>
      </div>
    </nav>
  );
};

export default Navbar;
