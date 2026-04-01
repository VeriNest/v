import { Home, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="px-20 pt-14 pb-8">
      <div className="flex gap-16 mb-10">
        {/* Logo */}
        <div className="min-w-[150px]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Dwello</span>
          </div>
        </div>

        {/* Column 1: SELL A HOME */}
        <div>
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">SELL A HOME</p>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Request an offer</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stories</a></li>
          </ul>

          <p className="text-xs font-bold text-foreground uppercase tracking-wider mt-6 mb-4">BUY A HOME</p>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Buy</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Finance</a></li>
          </ul>
        </div>

        {/* Column 2: BUY, RENT AND SELL */}
        <div>
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">BUY, RENT AND SELL</p>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Buy and sell properties</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rent home</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Builder trade-up</a></li>
          </ul>

          <p className="text-xs font-bold text-foreground uppercase tracking-wider mt-6 mb-4">TERMS & PRIVACY</p>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trust & Safety</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Column 3: ABOUT */}
        <div>
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">ABOUT</p>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Company</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Investors</a></li>
          </ul>

          <p className="text-xs font-bold text-foreground uppercase tracking-wider mt-6 mb-4">RESOURCES</p>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">©2024 Dwello. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Facebook className="w-4 h-4" /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram className="w-4 h-4" /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
