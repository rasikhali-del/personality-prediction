import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Mic, Smile, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartTest = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center neural-bg px-4 pt-20"
    >
      <div className="container mx-auto text-center">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-accent mr-2 animate-pulse" />
            <span className="text-accent font-medium text-lg">
              AI-Powered Insights
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Yourself
            <span className="block text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              with AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-lora">
            Uncover your unique traits with insights from text, voice, and
            facial analysis
          </p>

          {isAuthenticated ? (
            <Link to="/test">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform animate-pulse-glow mb-16"
              >
                Start Test
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleStartTest}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-white text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform animate-pulse-glow mb-16"
            >
              Start Test
            </Button>
          )}
        </div>

        {/* Analysis Cards - Static Design */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="bg-card border border-border p-8 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-primary to-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 font-poppins">
              Text Analysis
            </h3>
            <p className="text-gray-300 font-lora">
              Express your thoughts through writing and let AI analyze your
              personality patterns
            </p>
          </Card>

          <Card className="bg-card border border-border p-8 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-primary to-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 font-poppins">
              Voice Analysis
            </h3>
            <p className="text-gray-300 font-lora">
              Speak naturally and discover personality traits hidden in your
              vocal patterns
            </p>
          </Card>

          <Card className="bg-card border border-border p-8 shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-primary to-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Smile className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4 font-poppins">
              Facial Analysis
            </h3>
            <p className="text-gray-300 font-lora">
              Advanced AI reads micro-expressions to reveal your authentic
              personality
            </p>
          </Card>
        </div>        {/* Stats */}
        <div className="mt-16 text-center">
          <p className="text-accent text-lg font-medium">
            <span className="text-2xl font-bold">10,000+</span> users have
            discovered themselves
          </p>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </section>
  );
};

export default HeroSection;
