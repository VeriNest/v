import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MarketingShell from "@/components/layout/MarketingShell";
import { PageSeo } from "@/components/seo/PageSeo";
import { authApi } from "@/lib/api";

const sections = [
  {
    title: "Platform Role",
    body: "Verinest is a marketplace and coordination platform. Unless expressly stated otherwise, Verinest is not the owner of listed properties, not the direct contracting party in every listing, and not a guarantor of user conduct or transaction outcome.",
  },
  {
    title: "User Responsibilities",
    body: "Users must provide accurate information, protect account credentials, avoid fraud or impersonation, and use caution when dealing with listings, bookings, visits, and any off-platform arrangements.",
  },
  {
    title: "Verification and Trust",
    body: "Verification and moderation features are designed to reduce risk and improve trust, but they do not amount to an absolute guarantee of property quality, legal title, honesty, or transaction success.",
  },
  {
    title: "Bookings, Visits, and Safety",
    body: "Users remain responsible for their own decisions before, during, and after visits. Safety guidance, due-diligence tips, and platform notices should be followed at all times.",
  },
  {
    title: "Payment and Escrow Status",
    body: "Verinest is preparing an in-app payment and escrow system. Until that system is live and expressly stated to apply, users remain responsible for off-platform transfers and payment decisions. Once escrow is launched, additional payment-specific terms may apply.",
  },
  {
    title: "Limitation of Liability",
    body: "Before in-app payment or escrow is active, Verinest is not liable for user losses arising from off-platform payments, failure to follow platform safety guidance, or direct arrangements outside Verinest-controlled payment systems, to the maximum extent permitted by law.",
  },
  {
    title: "Reports, Disputes, and Moderation",
    body: "Users may raise reports or disputes where supported by the platform. Verinest may investigate, request evidence, moderate content, restrict users, or resolve disputes based on available evidence and platform policy.",
  },
  {
    title: "Changes to These Terms",
    body: "We may update these Terms from time to time. Material changes will be surfaced through in-app notices, dashboard prompts, email, or other reasonable alerts, and continued use after acceptance means the updated terms apply.",
  },
];

export default function TermsPage() {
  const { data } = useQuery({
    queryKey: ["/legal/policies/meta"],
    queryFn: () => authApi.getPolicyMetadata(),
  });

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Terms & Conditions"
        description="Read the Terms and Conditions that govern use of Verinest, including bookings, disputes, verification, and payment status."
        canonicalPath="/terms"
      />
      <Navbar />
      <section className="px-6 pb-16 pt-24 lg:px-16 xl:px-20">
        <MarketingShell className="max-w-4xl space-y-8">
          <div className="rounded-[32px] border border-border/60 bg-card p-6 shadow-sm sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">Terms & Conditions</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              The rules that govern use of Verinest.
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>Effective: {data?.effectiveAt ? new Date(data.effectiveAt).toLocaleDateString() : "May 24, 2026"}</span>
              <span>Terms Version: {data?.termsVersion ?? "2026.05"}</span>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
              These terms explain Verinest’s platform role, user obligations, booking and dispute expectations, and how responsibility is allocated before in-app escrow and payments go live.
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
