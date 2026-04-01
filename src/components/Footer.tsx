import { Home, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const footerLinks = [
  {
    title: "SELL A HOME",
    links: ["Request an offer", "Pricing", "Reviews", "Stories"],
  },
  {
    title: "BUY A HOME",
    links: ["Buy", "Finance", "Inspections", "Appraisal"],
  },
  {
    title: "BUY, RENT AND SELL",
    links: ["Buy and sell properties", "Rent home", "Builder trade-up"],
  },
  {
    title: "TERMS & PRIVACY",
    links: ["Trust & Safety", "Terms of Service", "Privacy Policy"],
  },
  {
    title: "ABOUT",
    links: ["Company", "How it works", "Contact", "Investors"],
  },
  {
    title: "RESOURCES",
    links: ["Blog", "Guides", "FAQ", "Help Center"],
  },
];

const Footer = () => {
  return (
    <footer className="px-20 pt-16 pb-8 bg-secondary/50">
      <div className="grid grid-cols-7 gap-6 mb-12">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Dwello</span>
          </div>
        </div>

        {/* Link Columns */}
        {footerLinks.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">©2024 Dwello. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
