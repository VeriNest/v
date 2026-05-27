import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MarketingShell from "@/components/layout/MarketingShell";
import { PageSeo } from "@/components/seo/PageSeo";
import { authApi } from "@/lib/api";

const sections = [
  {
    title: "Who We Are",
    body: "Verinest is a property marketplace and rental coordination platform connecting seekers, agents, landlords, and administrators through listings, verification, bookings, communication, and trust workflows.",
  },
  {
    title: "Information We Collect",
    body: "We collect account details, onboarding and profile data, verification documents, listing content, booking activity, reports, disputes, notifications, device and request data, and other information required to operate the platform safely.",
  },
  {
    title: "How We Use Information",
    body: "We use personal data to create accounts, verify identity, publish listings, facilitate matching, operate bookings and notifications, investigate disputes, improve platform trust and performance, and comply with legal obligations.",
  },
  {
    title: "Verification and Sensitive Data",
    body: "Where applicable, we process identity documents, property documents, and liveness/selfie data for fraud prevention, trust, safety, and compliance purposes.",
  },
  {
    title: "Sharing of Information",
    body: "We may share relevant information with other users, infrastructure vendors, email and storage providers, professional advisers, regulators, or law enforcement where required. We do not operate as a commercial personal-data broker.",
  },
  {
    title: "Retention and Security",
    body: "We retain data for as long as reasonably necessary for account administration, verification, fraud prevention, dispute handling, audit, and compliance. We use reasonable safeguards, but no system can guarantee absolute security.",
  },
  {
    title: "Your Rights",
    body: "Subject to applicable law, users may request access, correction, deletion, restriction, or further information about their personal data by contacting support.",
  },
  {
    title: "Policy Updates",
    body: "We may update this Privacy Policy from time to time. Where changes are material, users will be notified through in-app alerts, dashboard notices, or email, and the latest version will be reflected on this page.",
  },
];

export default function PrivacyPage() {
  const { data } = useQuery({
    queryKey: ["/legal/policies/meta"],
    queryFn: () => authApi.getPolicyMetadata(),
  });

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Privacy Policy"
        description="Read how Verinest collects, uses, stores, and protects personal data across listings, verification, and bookings."
        canonicalPath="/privacy"
      />
      <Navbar />
      <section className="px-6 pb-16 pt-24 lg:px-16 xl:px-20">
        <MarketingShell className="max-w-4xl space-y-8">
          <div className="rounded-[32px] border border-border/60 bg-card p-6 shadow-sm sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Privacy Policy</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              How Verinest handles personal data.
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>Effective: {data?.effectiveAt ? new Date(data.effectiveAt).toLocaleDateString() : "May 24, 2026"}</span>
              <span>Privacy Version: {data?.privacyVersion ?? "2026.05"}</span>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
              This page explains what Verinest collects, how we use it, how long we retain it, and how users are notified when material changes are made.
            </p>
          </div>

          {sections.map((section) => (
            <section key={section.title} className="rounded-[28px] border border-border/60 bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </MarketingShell>
      </section>
      <Footer />
    </div>
  );
}
