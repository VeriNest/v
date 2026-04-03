import { Home, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/rent", label: "Rent" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border/60">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-16 xl:px-20 py-3 sm:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Dwello</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm transition-colors",
                location.pathname === link.to
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
          <Button asChild className="rounded-lg px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-accent transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 bg-background/95 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-6 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-base py-3 px-4 rounded-lg transition-colors",
                  location.pathname === link.to
                    ? "font-medium text-primary bg-primary/10"
                    : "text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border/60 my-3" />
            <Link
              to="/login"
              className="text-base py-3 px-4 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
            <Button asChild className="mt-1 rounded-lg py-3 h-auto bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
