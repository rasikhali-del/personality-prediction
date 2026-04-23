import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService, AdminUser, TestResult, AdminStats } from "../services/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FileText, Mic, Camera, Zap, Search, User, Users, History,
  ChevronLeft, ChevronRight, Loader2, LogOut, X, BarChart3,
  TrendingUp, Activity,
} from "lucide-react";

interface UserDetails {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_admin: boolean;
  profile: { total_tests: number; last_test_date: string | null };
  results: TestResult[];
  total_tests: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "results">("users");
  const [allResults, setAllResults] = useState<any[]>([]);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsTotalPages, setResultsTotalPages] = useState(1);
  const [resultsLoading, setResultsLoading] = useState(false);

  // Guard: redirect if not admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      navigate("/admin-login");
      return;
    }
    fetchStats();
    fetchUsers();
  }, [page]);

  useEffect(() => {
    if (activeTab === "results") fetchAllResults(resultsPage);
  }, [activeTab, resultsPage]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setPage(1);
      fetchUsers(1, search);
    }, 500);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const fetchUsers = async (pageNum: number = page, searchTerm: string = search) => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers(searchTerm, pageNum, 10);
      setUsers(data.users);
      setTotalPages(data.pages);
      setTotalUsers(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllResults = async (p: number = 1) => {
    setResultsLoading(true);
    try {
      const data = await adminService.getAllResults(p, 15);
      setAllResults(data.results);
      setResultsTotalPages(data.pages);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setResultsLoading(false);
    }
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      const data = await adminService.getUserDetails(userId);
      setSelectedUser(data);
      setSelectedResult(null);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("access_token");
    navigate("/admin-login");
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const getTraitColor = (value: number) => {
    if (value >= 0.7) return "text-green-400";
    if (value >= 0.4) return "text-yellow-400";
    return "text-red-400";
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

  if (!localStorage.getItem("admin_logged_in")) return null;

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="container mx-auto px-4 pt-6 pb-12">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Personality Prediction — User & Results Management
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-[#1B1F3B]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* ── Stats Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Users",
              value: stats?.total_users ?? "—",
              icon: <Users className="w-5 h-5 text-blue-400" />,
              color: "text-blue-400",
            },
            {
              label: "Total Tests",
              value: stats?.total_tests ?? "—",
              icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
              color: "text-purple-400",
            },
            {
              label: "Tests Today",
              value: stats?.tests_today ?? "—",
              icon: <Activity className="w-5 h-5 text-green-400" />,
              color: "text-green-400",
            },
            {
              label: "New Users Today",
              value: stats?.users_today ?? "—",
              icon: <TrendingUp className="w-5 h-5 text-accent" />,
              color: "text-accent",
            },
          ].map((s) => (
            <Card key={s.label} className="bg-card border border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5">{s.icon}</div>
                <div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-400 text-xs">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <div className="flex gap-2 mb-4">
          {(["users", "results"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-accent text-[#1B1F3B]"
                  : "text-gray-400 hover:text-white border border-border"
              }`}
            >
              {tab === "users" ? <><Users className="inline w-4 h-4 mr-1" />Users</> : <><History className="inline w-4 h-4 mr-1" />All Test Results</>}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ──────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* user list */}
            <div className={selectedUser ? "lg:col-span-2" : "lg:col-span-3"}>
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Registered Users
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search by username or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-secondary/30 border-border"
                      />
                    </div>
                    <div className="text-gray-400 text-sm">{totalUsers} total</div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border">
                              <TableHead className="text-gray-400">ID</TableHead>
                              <TableHead className="text-gray-400">Username</TableHead>
                              <TableHead className="text-gray-400">Email</TableHead>
                              <TableHead className="text-gray-400">Tests</TableHead>
                              <TableHead className="text-gray-400">Joined</TableHead>
                              <TableHead className="text-gray-400">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((u) => (
                              <TableRow key={u.id} className="border-border">
                                <TableCell className="text-white">{u.id}</TableCell>
                                <TableCell className="text-white font-medium">
                                  {u.username}
                                  {u.is_admin && (
                                    <Badge className="ml-2 bg-purple-500/20 text-purple-400">Admin</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-gray-300">{u.email}</TableCell>
                                <TableCell className="text-gray-300">{u.total_tests}</TableCell>
                                <TableCell className="text-gray-400 text-sm">
                                  {formatDate(u.created_at)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    onClick={() => fetchUserDetails(u.id)}
                                    className="bg-accent text-[#1B1F3B] hover:bg-accent/90"
                                  >
                                    <User className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {users.length === 0 && (
                        <div className="text-center py-8 text-gray-400">No users found.</div>
                      )}

                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1} className="border-border">
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-gray-400 text-sm px-4">Page {page} of {totalPages}</span>
                          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages} className="border-border">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* user detail panel */}
            {selectedUser && (
              <div className="space-y-4">
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">User Profile</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(null); setSelectedResult(null); }} className="text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { label: "Username", value: selectedUser.username },
                        { label: "Email", value: selectedUser.email },
                        { label: "Joined", value: formatDate(selectedUser.created_at) },
                        { label: "Total Tests", value: String(selectedUser.total_tests) },
                        { label: "Last Test", value: selectedUser.profile?.last_test_date ? formatDate(selectedUser.profile.last_test_date) : "Never" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="text-xs text-gray-400">{item.label}</div>
                          <div className="text-white font-medium">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* result list */}
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Test History ({selectedUser.results.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {selectedUser.results.map((result) => (
                        <div
                          key={result.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedResult?.id === result.id
                              ? "border-accent bg-accent/10"
                              : "border-border hover:bg-secondary/30"
                          }`}
                          onClick={() => setSelectedResult(result)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex gap-1">
                              {result.text_result && (
                                <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                  <FileText className="w-2 h-2 mr-1" />T
                                </Badge>
                              )}
                              {result.voice_result && (
                                <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                                  <Mic className="w-2 h-2 mr-1" />V
                                </Badge>
                              )}
                              {result.face_result && (
                                <Badge className="bg-green-500/20 text-green-400 text-xs">
                                  <Camera className="w-2 h-2 mr-1" />F
                                </Badge>
                              )}
                            </div>
                            <span className="text-gray-400 text-xs">
                              {result.created_at ? formatDate(result.created_at) : "—"}
                            </span>
                          </div>
                          {result.fusion_result?.mbti_type && (
                            <div className="text-accent font-medium text-sm">
                              {result.fusion_result.mbti_type}
                            </div>
                          )}
                        </div>
                      ))}
                      {selectedUser.results.length === 0 && (
                        <div className="text-gray-400 text-center py-4">No tests yet</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* result detail */}
                {selectedResult && (
                  <Card className="bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">Result Detail</CardTitle>
                      <p className="text-gray-400 text-xs">
                        {selectedResult.created_at ? formatDate(selectedResult.created_at) : ""}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedResult.text_result && (
                          <div className="bg-secondary/30 border border-border rounded-lg p-3">
                            <h5 className="text-blue-400 font-medium mb-2 flex items-center gap-1 text-sm">
                              <FileText className="w-3 h-3" /> Text Analysis
                            </h5>
                            {['openness','conscientiousness','extraversion','agreeableness','neuroticism'].map(t => (
                              <TraitBar key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} value={selectedResult.text_result?.[t] ?? 0} />
                            ))}
                          </div>
                        )}
                        {selectedResult.voice_result && (
                          <div className="bg-secondary/30 border border-border rounded-lg p-3">
                            <h5 className="text-purple-400 font-medium mb-2 flex items-center gap-1 text-sm">
                              <Mic className="w-3 h-3" /> Voice Analysis
                            </h5>
                            {['openness','conscientiousness','extraversion','agreeableness','neuroticism'].map(t => (
                              <TraitBar key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} value={selectedResult.voice_result?.[t] ?? 0} />
                            ))}
                          </div>
                        )}
                        {selectedResult.face_result && (
                          <div className="bg-secondary/30 border border-border rounded-lg p-3">
                            <h5 className="text-green-400 font-medium mb-2 flex items-center gap-1 text-sm">
                              <Camera className="w-3 h-3" /> Face Analysis
                            </h5>
                            {['openness','conscientiousness','extraversion','agreeableness','neuroticism'].map(t => (
                              <TraitBar key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} value={selectedResult.face_result?.[t] ?? 0} />
                            ))}
                          </div>
                        )}
                        {selectedResult.fusion_result && (
                          <div className="bg-accent/10 border border-accent/50 rounded-lg p-3">
                            <h5 className="text-accent font-medium mb-2 flex items-center gap-1 text-sm">
                              <Zap className="w-3 h-3" /> Fusion Result
                            </h5>
                            {['openness','conscientiousness','extraversion','agreeableness','neuroticism'].map(t => (
                              <TraitBar key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} value={selectedResult.fusion_result?.[t] ?? 0} />
                            ))}
                            {selectedResult.fusion_result?.mbti_type && (
                              <div className="text-center mt-3 pt-2 border-t border-accent/30">
                                <div className="text-xl font-bold text-accent">{selectedResult.fusion_result.mbti_type}</div>
                                <div className="text-gray-400 text-sm">{selectedResult.fusion_result.personality_name}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ALL RESULTS TAB ────────────────────────────────── */}
        {activeTab === "results" && (
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                All Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resultsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-gray-400">ID</TableHead>
                          <TableHead className="text-gray-400">User</TableHead>
                          <TableHead className="text-gray-400">Email</TableHead>
                          <TableHead className="text-gray-400">Modalities</TableHead>
                          <TableHead className="text-gray-400">MBTI</TableHead>
                          <TableHead className="text-gray-400">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allResults.map((r) => (
                          <TableRow key={r.id} className="border-border">
                            <TableCell className="text-white">{r.id}</TableCell>
                            <TableCell className="text-white font-medium">{r.username}</TableCell>
                            <TableCell className="text-gray-300 text-sm">{r.email}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {r.text_result && <Badge className="bg-blue-500/20 text-blue-400 text-xs"><FileText className="w-2 h-2 mr-1" />T</Badge>}
                                {r.voice_result && <Badge className="bg-purple-500/20 text-purple-400 text-xs"><Mic className="w-2 h-2 mr-1" />V</Badge>}
                                {r.face_result && <Badge className="bg-green-500/20 text-green-400 text-xs"><Camera className="w-2 h-2 mr-1" />F</Badge>}
                                {r.fusion_result && <Badge className="bg-accent/20 text-accent text-xs"><Zap className="w-2 h-2 mr-1" />F</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-accent font-semibold">
                              {r.fusion_result?.mbti_type || "—"}
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm">
                              {r.created_at ? formatDate(r.created_at) : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {allResults.length === 0 && (
                    <div className="text-center py-8 text-gray-400">No test results yet.</div>
                  )}

                  {resultsTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button variant="outline" size="sm" onClick={() => setResultsPage(p => p - 1)} disabled={resultsPage === 1} className="border-border">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-gray-400 text-sm px-4">Page {resultsPage} of {resultsTotalPages}</span>
                      <Button variant="outline" size="sm" onClick={() => setResultsPage(p => p + 1)} disabled={resultsPage === resultsTotalPages} className="border-border">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;