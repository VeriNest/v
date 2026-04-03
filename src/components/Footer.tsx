import { Home, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const footerLinks = [
  {
    title: "Buy a Home",
    links: ["Buy", "Finance", "Inspections", "Appraisal"],
  },
  {
    title: "Rent a Home",
    links: ["Rent", "Pricing", "Reviews", "Stories"],
  },
  {
    title: "Sell a Home",
    links: ["Request an offer", "Pricing", "Reviews"],
  },
  {
    title: "About",
    links: ["Company", "How it works", "Contact", "Investors"],
  },
  {
    title: "Resources",
    links: ["Blog", "Guides", "FAQ", "Help Center"],
  },
];

const Footer = () => {
  return (
    <footer className="px-6 lg:px-16 xl:px-20 pt-14 pb-8 bg-[hsl(var(--dark-bg))] border-t border-white/[0.06]">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Dwello</span>
          </div>
          <p className="text-xs text-white/30 leading-relaxed">
            Your trusted partner in finding the perfect home.
          </p>
        </div>

        {footerLinks.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/35 hover:text-white/70 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/[0.06]">
        <p className="text-xs text-white/25">©2024 Dwello. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
            <a key={i} href="#" className="text-white/25 hover:text-white/60 transition-colors">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
