import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Lock, Mail } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@personality.com");
  const [password, setPassword] = useState("Admin@1234");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);

      // Check admin after a tick (state update is async)
      setTimeout(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast({
            title: "Login failed",
            description: "No token received",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Decode JWT to check is_admin without extra API call
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (!payload.is_admin) {
            toast({
              title: "Access Denied",
              description: "This account does not have admin privileges",
              variant: "destructive",
            });
            localStorage.removeItem("access_token");
            setLoading(false);
            return;
          }
        } catch (_) {}

        localStorage.setItem("admin_logged_in", "true");
        toast({
          title: "✅ Login successful",
          description: "Welcome to the Admin Dashboard",
        });
        navigate("/admin/dashboard");
        setLoading(false);
      }, 200);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-main px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/20 border border-accent/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">Sign in to manage the dashboard</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-card border border-border p-8 rounded-2xl shadow-2xl space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@personality.com"
              className="bg-secondary/30 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              className="bg-secondary/30 border-border"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-[#1B1F3B] hover:bg-accent/90 font-semibold py-3"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-[#1B1F3B] border-t-transparent rounded-full" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-gray-500 text-xs text-center mt-2">
            Default: admin@personality.com / Admin@1234
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;