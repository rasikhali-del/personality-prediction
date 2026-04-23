import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Mic, Camera, Zap, Loader2, LogOut, History, User } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    loadResults();
  }, [isAuthenticated]);

  const loadResults = () => {
    try {
      // ✅ User ke apne results lo localStorage se
      const userKey = user?.email || user?.username || 'guest';
      const userResultsRaw = localStorage.getItem(`results_${userKey}`);
      const userResults = userResultsRaw ? JSON.parse(userResultsRaw) : [];
      setResults([...userResults].reverse());
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getTraitColor = (value: number) => {
    if (value >= 0.7) return "text-green-400";
    if (value >= 0.4) return "text-yellow-400";
    return "text-red-400";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const TraitBar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className={getTraitColor(value)}>{(value * 100).toFixed(1)}%</span>
      </div>
      <Progress value={value * 100} className="h-2" />
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-main">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
            <p className="text-gray-300 mt-1">Welcome back, {user?.username}!</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/test")}
              className="bg-accent text-[#1B1F3B] hover:bg-accent/90"
            >
              <Zap className="w-4 h-4 mr-2" />
              New Test
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-[#1B1F3B]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Test History
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your previous personality test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No test results yet.</p>
                    <Button
                      onClick={() => navigate("/test")}
                      className="mt-4 bg-accent text-[#1B1F3B] hover:bg-accent/90"
                    >
                      Take Your First Test
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            {result.text_result && (
                              <Badge className="bg-blue-500/20 text-blue-400">
                                <FileText className="w-3 h-3 mr-1" />Text
                              </Badge>
                            )}
                            {result.voice_result && (
                              <Badge className="bg-purple-500/20 text-purple-400">
                                <Mic className="w-3 h-3 mr-1" />Voice
                              </Badge>
                            )}
                            {result.face_result && (
                              <Badge className="bg-green-500/20 text-green-400">
                                <Camera className="w-3 h-3 mr-1" />Face
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDate(result.created_at)}
                          </div>
                        </div>
                        {result.fusion_result && (
                          <Badge className="bg-accent/20 text-accent">
                            {result.fusion_result.mbti_type || "Complete"}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedResult && (
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-white">Test Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    {formatDate(selectedResult.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedResult.text_result && (
                      <div className="bg-secondary/30 border border-border rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />Text Analysis
                        </h4>
                        <div className="space-y-2">
                          <TraitBar label="Openness" value={selectedResult.text_result.openness} />
                          <TraitBar label="Conscientiousness" value={selectedResult.text_result.conscientiousness} />
                          <TraitBar label="Extraversion" value={selectedResult.text_result.extraversion} />
                          <TraitBar label="Agreeableness" value={selectedResult.text_result.agreeableness} />
                          <TraitBar label="Neuroticism" value={selectedResult.text_result.neuroticism} />
                        </div>
                      </div>
                    )}
                    {selectedResult.voice_result && (
                      <div className="bg-secondary/30 border border-border rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Mic className="w-4 h-4" />Voice Analysis
                        </h4>
                        <div className="space-y-2">
                          <TraitBar label="Openness" value={selectedResult.voice_result.openness} />
                          <TraitBar label="Conscientiousness" value={selectedResult.voice_result.conscientiousness} />
                          <TraitBar label="Extraversion" value={selectedResult.voice_result.extraversion} />
                          <TraitBar label="Agreeableness" value={selectedResult.voice_result.agreeableness} />
                          <TraitBar label="Neuroticism" value={selectedResult.voice_result.neuroticism} />
                        </div>
                      </div>
                    )}
                    {selectedResult.face_result && (
                      <div className="bg-secondary/30 border border-border rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Camera className="w-4 h-4" />Face Analysis
                        </h4>
                        <div className="space-y-2">
                          <TraitBar label="Openness" value={selectedResult.face_result.openness} />
                          <TraitBar label="Conscientiousness" value={selectedResult.face_result.conscientiousness} />
                          <TraitBar label="Extraversion" value={selectedResult.face_result.extraversion} />
                          <TraitBar label="Agreeableness" value={selectedResult.face_result.agreeableness} />
                          <TraitBar label="Neuroticism" value={selectedResult.face_result.neuroticism} />
                        </div>
                      </div>
                    )}
                    {selectedResult.fusion_result && (
                      <div className="bg-accent/10 border border-accent/50 rounded-lg p-4">
                        <h4 className="text-accent font-semibold mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" />Final Result
                        </h4>
                        <div className="space-y-2">
                          <TraitBar label="Openness" value={selectedResult.fusion_result.openness} />
                          <TraitBar label="Conscientiousness" value={selectedResult.fusion_result.conscientiousness} />
                          <TraitBar label="Extraversion" value={selectedResult.fusion_result.extraversion} />
                          <TraitBar label="Agreeableness" value={selectedResult.fusion_result.agreeableness} />
                          <TraitBar label="Neuroticism" value={selectedResult.fusion_result.neuroticism} />
                          {selectedResult.fusion_result.mbti_type && (
                            <div className="mt-4 pt-3 border-t border-accent/30 text-center">
                              <div className="text-2xl font-bold text-accent">
                                {selectedResult.fusion_result.mbti_type}
                              </div>
                              <div className="text-gray-400">
                                {selectedResult.fusion_result.personality_name}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Username</div>
                    <div className="text-white font-medium">{user?.username}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white font-medium">{user?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Tests</div>
                    <div className="text-white font-medium">{results.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;