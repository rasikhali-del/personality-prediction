import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import TestInterface from '@/components/TestInterface';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';

const Test = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // If not loading and not authenticated, show auth modal
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <Navigation />
      {isAuthenticated ? (
        <TestInterface />
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Login Required
            </h2>
            <p className="text-gray-300 mb-8">
              Please login or create an account to take the personality test.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-accent text-[#1B1F3B] rounded-lg font-semibold hover:bg-accent/90 transition"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
      )}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
      />
      <Footer />
    </div>
  );
};

export default Test;