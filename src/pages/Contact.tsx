import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@dwello.com", href: "mailto:hello@dwello.com" },
  { icon: Phone, label: "Phone", value: "+234 98765 43210", href: "tel:+2349876543210" },
  { icon: MapPin, label: "Address", value: "502, Devpath Building, Ashram Road, Lagos" },
  { icon: Clock, label: "Working Hours", value: "Mon – Fri: 9AM – 6PM WAT" },
];

const faqs = [
  { q: "How do I list my property?", a: "Sign up as a provider, complete verification, and use the 'Add Listing' feature from your dashboard." },
  { q: "Is Dwello free for seekers?", a: "Yes! Browsing, saving, and posting needs is completely free for property seekers." },
  { q: "How does the matching work?", a: "Our algorithm considers your budget, location preferences, amenities, and lifestyle to suggest the best matches." },
  { q: "How long does verification take?", a: "Provider verification typically takes 24-48 hours after submitting all required documents." },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="px-6 lg:px-16 xl:px-20 pt-28 pb-20 bg-secondary/30">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Contact Us</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground leading-[1.15] mb-5">
            We'd Love to{" "}
            <span className="italic text-primary">Hear From You</span>
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-md">
            Have questions, feedback, or need support? Our team is here to help you with anything related to your rental journey.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="px-6 lg:px-16 xl:px-20 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Form */}
          <div className="flex-1 lg:flex-[1.6]">
            <div className="bg-card rounded-xl p-8 border border-border/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-foreground">Send a Message</h2>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">We'll respond within 24 hours</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-12 border-border/50 bg-secondary/30 focus-visible:ring-1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="h-12 border-border/50 bg-secondary/30 focus-visible:ring-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required className="h-12 border-border/50 bg-secondary/30 focus-visible:ring-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</Label>
                  <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="border-border/50 bg-secondary/30 focus-visible:ring-1" />
                </div>
                <Button type="submit" className="rounded-lg px-7 py-6 text-sm font-medium gap-2 w-full sm:w-auto">
                  Send Message <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-1">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-6">Get in Touch</p>
            <div className="space-y-0">
              {contactInfo.map((item, i) => (
                <div key={item.label} className={`flex gap-5 py-7 ${i < contactInfo.length - 1 ? "border-b border-border/60" : ""}`}>
                  <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base text-foreground mb-1">{item.label}</h4>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors leading-relaxed">{item.value}</a>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-secondary/60">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Support</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Frequently Asked Questions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-card rounded-xl p-7 border border-border/50">
              <h3 className="font-serif text-base text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-[hsl(var(--dark-bg))]">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl text-primary-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-primary-foreground/40 mb-10 text-[15px] leading-relaxed">
            Our support team is available around the clock to assist you.
          </p>
          <Button className="rounded-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium gap-2">
            Schedule a Call <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
