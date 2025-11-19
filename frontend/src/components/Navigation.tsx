import { useState } from "react";
import { Brain, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import SearchModal from "@/components/SearchModal";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const handleLogin = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchModalOpen(true);
  };

  const handleSearchIconClick = () => {
    setIsSearchModalOpen(true);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#1B1F3B]/95 to-[#2C2F4A]/95 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-white">AI Personality</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`hover:text-accent transition-colors ${
                isActive("/") ? "text-accent" : "text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/test"
              className={`hover:text-accent transition-colors ${
                isActive("/test") ? "text-accent" : "text-white"
              }`}
            >
              Take Test
            </Link>
            <Link
              to="/results"
              className={`hover:text-accent transition-colors ${
                isActive("/results") ? "text-accent" : "text-white"
              }`}
            >
              Results
            </Link>
            <Link
              to="/about"
              className={`hover:text-accent transition-colors ${
                isActive("/about") ? "text-accent" : "text-white"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`hover:text-accent transition-colors ${
                isActive("/contact") ? "text-accent" : "text-white"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={handleSearchIconClick}
              variant="ghost"
              size="icon"
              className="text-white hover:text-accent"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              onClick={handleLogin}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-[#1B1F3B]"
            >
              Login
            </Button>
            <Button
              onClick={handleSignUp}
              className="bg-accent text-[#1B1F3B] hover:bg-accent/90"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`hover:text-accent transition-colors text-left ${
                  isActive("/") ? "text-accent" : "text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/test"
                onClick={() => setIsMenuOpen(false)}
                className={`hover:text-accent transition-colors text-left ${
                  isActive("/test") ? "text-accent" : "text-white"
                }`}
              >
                Take Test
              </Link>
              <Link
                to="/results"
                onClick={() => setIsMenuOpen(false)}
                className={`hover:text-accent transition-colors text-left ${
                  isActive("/results") ? "text-accent" : "text-white"
                }`}
              >
                Results
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`hover:text-accent transition-colors text-left ${
                  isActive("/about") ? "text-accent" : "text-white"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`hover:text-accent transition-colors text-left ${
                  isActive("/contact") ? "text-accent" : "text-white"
                }`}
              >
                Contact
              </Link>
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-[#1B1F3B]"
                >
                  Login
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-accent text-[#1B1F3B] hover:bg-accent/90"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        initialSearch={searchTerm}
      />
    </nav>
  );
};

export default Navigation;
