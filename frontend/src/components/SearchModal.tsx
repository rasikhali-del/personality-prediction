import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, Users, Settings, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
}

const SearchModal = ({ isOpen, onClose, initialSearch = '' }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [results, setResults] = useState<any[]>([]);

  const mockSearchResults = [
    {
      id: 1,
      title: "Personality Test",
      description: "Take our comprehensive AI-powered personality assessment",
      type: "feature",
      icon: FileText,
      link: "/test"
    },
    {
      id: 2,
      title: "View Results",
      description: "Check your personality analysis results",
      type: "feature", 
      icon: Zap,
      link: "/results"
    },
    {
      id: 3,
      title: "About AI Personality",
      description: "Learn more about our personality assessment technology",
      type: "page",
      icon: Users,
      link: "/about"
    },
    {
      id: 4,
      title: "Contact Support",
      description: "Get help with your personality assessment",
      type: "page",
      icon: Settings,
      link: "/contact"
    },
    {
      id: 5,
      title: "Facial Expression Analysis",
      description: "How our AI analyzes facial expressions for personality insights",
      type: "feature",
      icon: FileText,
      link: "/test"
    },
    {
      id: 6,
      title: "Voice Pattern Recognition",
      description: "Understanding personality through voice analysis",
      type: "feature",
      icon: FileText,
      link: "/test"
    }
  ];

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockSearchResults);
    }
  }, [searchTerm]);

  const handleResultClick = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border border-border max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for features, pages, or help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary/20 border-border text-foreground"
              autoFocus
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.length > 0 ? (
              results.map((result) => {
                const IconComponent = result.icon;
                return (
                  <Link
                    key={result.id}
                    to={result.link}
                    onClick={handleResultClick}
                    className="block p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-border hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.description}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs bg-accent/20 text-accent rounded mt-2">
                          {result.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{searchTerm}"</p>
                <p className="text-sm mt-2">Try searching for "personality", "test", or "analysis"</p>
              </div>
            )}
          </div>
          
          {searchTerm.trim() && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;