import { Facebook, Instagram, Twitter, Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import MarketingShell from "@/components/layout/MarketingShell";
import MarketingLogo from "@/components/MarketingLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const socialLinks = [
  { label: "Facebook", href: "/contact", icon: Facebook },
  { label: "Instagram", href: "/contact", icon: Instagram },
  { label: "Twitter", href: "/contact", icon: Twitter },
  { label: "LinkedIn", href: "/contact", icon: Linkedin },
  { label: "YouTube", href: "/contact", icon: Youtube },
];

const quickLinks = [
  { label: "Browse Homes", to: "/properties" },
  { label: "Post a Need", to: "/signup" },
  { label: "For Agents", to: "/signup?role=agent" },
  { label: "For Landlords", to: "/signup?role=landlord" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/about" },
  { label: "Terms of Service", to: "/about" },
  { label: "Cookie Policy", to: "/about" },
  { label: "Sitemap", to: "/" },
];

const Footer = () => {
  return (
    <footer className="px-6 lg:px-16 xl:px-20 pt-16 pb-8 bg-[hsl(var(--dark-bg))]">
      <MarketingShell>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <MarketingLogo
              className="mb-4"
              textTone="light"
              textClassName="text-lg"
            />
            <p className="text-sm text-white/35 leading-relaxed mb-5">
              Verinest helps seekers, agents, and landlords connect through verified listings, clearer pricing, and faster rental matching.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  to={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:text-white/70 hover:border-white/25 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-serif text-base text-white mb-5">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-white/35 hover:text-white/70 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-serif text-base text-white mb-5">Contact Info</p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-white/35 leading-relaxed">502, Devpath Building,<br />Near Torrent Lab,<br />Ashram Road, Lagos</p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+2349876543210" className="text-sm text-white/35 hover:text-white/70 transition-colors">
                  +234 98765 43210
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:hello@verinest.com" className="text-sm text-white/35 hover:text-white/70 transition-colors">
                  hello@verinest.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="font-serif text-base text-white mb-5">Stay Updated</p>
            <p className="text-sm text-white/35 leading-relaxed mb-4">Get product updates, market signals, and new verified listing alerts.</p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-lg bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary h-11"
              />
              <Button className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-medium">
                Subscribe
              </Button>
            </div>
            <p className="text-[11px] text-white/25 mt-3">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-white/25">&copy; 2026 Verinest. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            {legalLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-xs text-white/25 hover:text-white/50 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </MarketingShell>
    </footer>
  );
};

export default Footer;
