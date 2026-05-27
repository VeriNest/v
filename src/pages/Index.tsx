import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PropertyListings from "@/components/PropertyListings";
import ValueProposition from "@/components/ValueProposition";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { PageSeo } from "@/components/seo/PageSeo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Verified Real Estate & Property Listings in Nigeria"
        description="Browse verified homes, connect with trusted agents and landlords, and post your housing need on Verinest."
        canonicalPath="/"
      />
      <Navbar />
      <Hero />
      <Features />
      <PropertyListings />
      <ValueProposition />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
