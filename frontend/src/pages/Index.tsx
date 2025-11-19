
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProcessFlow from '@/components/ProcessFlow';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-main">
      <Navigation />
      <HeroSection />
      <ProcessFlow />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
