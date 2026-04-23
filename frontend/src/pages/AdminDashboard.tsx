import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { adminService, AdminUser, TestResult } from "../services/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FileText,
  Mic,
  Camera,
  Zap,
  Search,
  User,
  Users,
  History,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  X,
} from "lucide-react";

interface UserDetails {
  id: number;
  username: string;
  email: string;
  date_joined: string;
  is_staff: boolean;
  is_superuser: boolean;
  profile: {
    age: number | null;
    gender: string | null;
    total_tests: number;
    last_test_date: string | null;
  };
  results: TestResult[];
  total_tests: number;
}

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  useEffect(() => {
  const isLoggedIn = localStorage.getItem("admin_logged_in");
  if (!isLoggedIn) {
    navigate("/admin-login");
  } else {
    fetchUsers();
  }
}, [page]);


  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setPage(1);
      fetchUsers(1, search);
    }, 500);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [search]);

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
  navigate("/admin-login");
};

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  if (!localStorage.getItem("admin_logged_in")) {
  return null;
}

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="container mx-auto px-4 pt-6 pb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300">Manage users and view test results</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      placeholder="Search by username or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-secondary/30 border-border"
                    />
                  </div>
                  <div className="text-gray-400 text-sm">
                    {totalUsers} users total
                  </div>
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
                          {users.map((user) => (
                            <TableRow key={user.id} className="border-border">
                              <TableCell className="text-white">{user.id}</TableCell>
                              <TableCell className="text-white font-medium">
                                {user.username}
                                {user.is_staff && (
                                  <Badge className="ml-2 bg-purple-500/20 text-purple-400">
                                    Admin
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-gray-300">{user.email}</TableCell>
                              <TableCell className="text-gray-300">{user.total_tests}</TableCell>
                              <TableCell className="text-gray-400 text-sm">
                                {formatDate(user.date_joined)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  onClick={() => fetchUserDetails(user.id)}
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
                      <div className="text-center py-8 text-gray-400">
                        No users found.
                      </div>
                    )}

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className="border-border"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-gray-400 text-sm px-4">
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                          className="border-border"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedUser && (
            <div className="space-y-4">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white">User Profile</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(null);
                        setSelectedResult(null);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400">Username</div>
                      <div className="text-white font-medium">{selectedUser.username}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="text-white font-medium">{selectedUser.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Joined</div>
                      <div className="text-white">{formatDate(selectedUser.date_joined)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Total Tests</div>
                      <div className="text-white">{selectedUser.total_tests}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Test Results ({selectedUser.results.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedUser.results.map((result) => (
                      <div
                        key={result.test_id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedResult?.test_id === result.test_id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:bg-secondary/30"
                        }`}
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {result.text_result && (
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                <FileText className="w-2 h-2 mr-1" />
                                T
                              </Badge>
                            )}
                            {result.voice_result && (
                              <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                                <Mic className="w-2 h-2 mr-1" />
                                V
                              </Badge>
                            )}
                            {result.face_result && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">
                                <Camera className="w-2 h-2 mr-1" />
                                F
                              </Badge>
                            )}
                          </div>
                          <span className="text-gray-400 text-xs">
                            {formatDate(result.created_at)}
                          </span>
                        </div>
                        {result.fusion_result && (
                          <div className="text-accent font-medium">
                            {result.fusion_result.mbti_type || "Test Complete"}
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedUser.results.length === 0 && (
                      <div className="text-gray-400 text-center py-4">
                        No tests yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {selectedResult && (
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-white">Result Details</CardTitle>
                    <CardDescription className="text-gray-400">
                      {formatDate(selectedResult.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedResult.text_result && (
                        <div className="bg-secondary/30 border border-border rounded-lg p-3">
                          <h5 className="text-blue-400 font-medium mb-2 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Text
                          </h5>
                          <TraitBar label="O" value={selectedResult.text_result.openness} />
                          <TraitBar label="C" value={selectedResult.text_result.conscientiousness} />
                          <TraitBar label="E" value={selectedResult.text_result.extraversion} />
                          <TraitBar label="A" value={selectedResult.text_result.agreeableness} />
                          <TraitBar label="N" value={selectedResult.text_result.neuroticism} />
                        </div>
                      )}

                      {selectedResult.voice_result && (
                        <div className="bg-secondary/30 border border-border rounded-lg p-3">
                          <h5 className="text-purple-400 font-medium mb-2 flex items-center gap-1">
                            <Mic className="w-3 h-3" />
                            Voice
                          </h5>
                          <TraitBar label="O" value={selectedResult.voice_result.openness} />
                          <TraitBar label="C" value={selectedResult.voice_result.conscientiousness} />
                          <TraitBar label="E" value={selectedResult.voice_result.extraversion} />
                          <TraitBar label="A" value={selectedResult.voice_result.agreeableness} />
                          <TraitBar label="N" value={selectedResult.voice_result.neuroticism} />
                        </div>
                      )}

                      {selectedResult.face_result && (
                        <div className="bg-secondary/30 border border-border rounded-lg p-3">
                          <h5 className="text-green-400 font-medium mb-2 flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            Face
                          </h5>
                          <TraitBar label="O" value={selectedResult.face_result.openness} />
                          <TraitBar label="C" value={selectedResult.face_result.conscientiousness} />
                          <TraitBar label="E" value={selectedResult.face_result.extraversion} />
                          <TraitBar label="A" value={selectedResult.face_result.agreeableness} />
                          <TraitBar label="N" value={selectedResult.face_result.neuroticism} />
                        </div>
                      )}

                      {selectedResult.fusion_result && (
                        <div className="bg-accent/10 border border-accent/50 rounded-lg p-3">
                          <h5 className="text-accent font-medium mb-2 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Final
                          </h5>
                          <TraitBar label="O" value={selectedResult.fusion_result.openness} />
                          <TraitBar label="C" value={selectedResult.fusion_result.conscientiousness} />
                          <TraitBar label="E" value={selectedResult.fusion_result.extraversion} />
                          <TraitBar label="A" value={selectedResult.fusion_result.agreeableness} />
                          <TraitBar label="N" value={selectedResult.fusion_result.neuroticism} />
                          {selectedResult.fusion_result.mbti_type && (
                            <div className="text-center mt-3 pt-2 border-t border-accent/30">
                              <div className="text-xl font-bold text-accent">
                                {selectedResult.fusion_result.mbti_type}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {selectedResult.fusion_result.personality_name}
                              </div>
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
      </div>
    </div>
  );
};

export default AdminDashboard;