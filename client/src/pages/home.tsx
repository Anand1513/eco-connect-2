import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FeaturesSection from "@/components/features-section";
import ExploreSection from "@/components/ExploreSection";
import DonateSection from "@/components/DonateSection";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import PublicProfiles from "@/pages/public-profiles";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <ExploreSection />
      <PublicProfiles />
      <FeaturesSection />
      <DonateSection />
      <ContactSection />
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-50"
      aria-label="Scroll to top"
      data-testid="scroll-to-top"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}
