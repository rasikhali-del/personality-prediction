import { Brain, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-[#1B1F3B]/95 border-t border-white/10 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-white">
                AI Personality
              </span>
            </div>
            <p className="text-gray-300 font-lora mb-6 max-w-md">
              Discover your authentic self through advanced AI analysis. Join
              thousands who have unlocked deeper self-understanding.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-accent"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-accent"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-accent"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a
                href="#home"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                Home
              </a>
              <a
                href="#test"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                Take Test
              </a>
              <a
                href="#results"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                Results
              </a>
              <a
                href="#about"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                About
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <a
                href="#faq"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                Contact
              </a>
              <a
                href="#privacy"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="block text-gray-300 hover:text-accent transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
        

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
  <p className="text-gray-400 text-sm">
    © 2024 AI Personality Predictor. All rights reserved.
  </p>
  <div className="flex items-center space-x-4 mt-4 md:mt-0">
    <span className="text-gray-400 text-sm">
      AI-Powered Personality Analysis
    </span>
    {/* ADMIN LINK */}
    <a
      href="/admin/login"
      className="text-accent underline hover:text-white text-sm"
    >
      Admin Panel
    </a>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;
