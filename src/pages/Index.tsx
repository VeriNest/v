import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PropertyListings from "@/components/PropertyListings";
import ValueProposition from "@/components/ValueProposition";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
