import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@verinest.com",
    href: "mailto:hello@verinest.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 98765 43210",
    href: "tel:+2349876543210",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "502, Devpath Building, Ashram Road, Lagos",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri: 9AM - 6PM WAT",
  },
];

const faqs = [
  {
    q: "How do I list as an agent or landlord?",
    a: "Create an account, choose the correct provider role during onboarding, complete verification, and then add your property supply from the matching dashboard.",
  },
  {
    q: "Can seekers post what they need instead of browsing only?",
    a: "Yes. Seekers can browse listings, save options, or post a housing need so verified providers respond with matching homes.",
  },
  {
    q: "What makes a listing verified on Verinest?",
    a: "Verification is tied to provider identity, listing review, and the platform's trust workflow so seekers can evaluate options with stronger context.",
  },
  {
    q: "Who should contact support?",
    a: "Seekers, agents, landlords, and admins can all contact support for account questions, verification help, listing issues, disputes, or workflow problems.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Message sent. We'll get back to you within one business day.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-secondary/30 px-6 pb-20 pt-28 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Contact Us
            </p>
            <h1 className="mb-5 font-serif text-4xl leading-[1.15] text-foreground lg:text-5xl">
              Support for{" "}
              <span className="italic text-primary">every role on Verinest</span>
            </h1>
            <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Whether you are a seeker, agent, landlord, or admin, reach out if
              you need help with listings, verification, onboarding, or any
              part of the rental workflow.
            </p>
          </div>
        </MarketingShell>
      </section>

      <section className="px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="flex flex-col gap-16 lg:flex-row">
            <div className="lg:flex-[1.6]">
              <div className="rounded-xl border border-border/50 bg-card p-8">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Send className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg text-foreground">
                      Send a Message
                    </h2>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Usually within one business day
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData({ ...formData, name: event.target.value })
                        }
                        required
                        className="h-12 border-border/50 bg-secondary/30 focus-visible:ring-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(event) =>
                          setFormData({ ...formData, email: event.target.value })
                        }
                        required
                        className="h-12 border-border/50 bg-secondary/30 focus-visible:ring-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Seeker, agent, landlord, or support inquiry"
                      value={formData.subject}
                      onChange={(event) =>
                        setFormData({ ...formData, subject: event.target.value })
                      }
                      required
                      className="h-12 border-border/50 bg-secondary/30 focus-visible:ring-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us what you need help with, what role you are using, and any page or workflow involved."
                      rows={5}
                      value={formData.message}
                      onChange={(event) =>
                        setFormData({ ...formData, message: event.target.value })
                      }
                      required
                      className="border-border/50 bg-secondary/30 focus-visible:ring-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2 rounded-lg px-7 py-6 text-sm font-medium sm:w-auto"
                  >
                    Send Message <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Get in Touch
              </p>
              <div className="space-y-0">
                {contactInfo.map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex gap-5 py-7 ${
                      index < contactInfo.length - 1
                        ? "border-b border-border/60"
                        : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-serif text-base text-foreground">
                        {item.label}
                      </h4>
                      {"href" in item && item.href ? (
                        <a
                          href={item.href}
                          className="text-sm leading-relaxed text-muted-foreground transition-colors hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MarketingShell>
      </section>

      <section className="bg-secondary/60 px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mb-14 text-center">
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Support
            </p>
            <h2 className="font-serif text-3xl text-foreground lg:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border/50 bg-card p-7"
              >
                <h3 className="mb-2 font-serif text-base text-foreground">
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </MarketingShell>
      </section>

      <section className="bg-[hsl(var(--dark-bg))] px-6 py-20 lg:px-16 xl:px-20">
        <MarketingShell>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-3xl text-primary-foreground lg:text-4xl">
              Need a faster answer?
            </h2>
            <p className="mb-10 text-[15px] leading-relaxed text-primary-foreground/40">
              Reach the support team directly if you need help resolving a
              listing, verification, or account issue quickly.
            </p>
            <Button
              className="gap-2 rounded-lg bg-primary px-8 py-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <a href="mailto:hello@verinest.com">
                Email Support <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </MarketingShell>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
