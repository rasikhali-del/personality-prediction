import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@personality-prediction.com");
  const [password, setPassword] = useState("admin@123");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use backend authentication
      await login(email, password);
      
      // Note: isAdmin state updates after component re-render
      // For immediate check, we verify in the response
      toast({ 
        title: "Login successful",
        description: "Welcome to Admin Dashboard"
      });
      
      // Navigate to admin dashboard (route will verify admin status)
      setTimeout(() => navigate("/admin/dashboard"), 100);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-main px-4">
      <form
        onSubmit={handleLogin}
        className="bg-card border border-border p-8 rounded-lg w-full max-w-md shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">
          Admin Login
        </h2>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/30 border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-secondary/30 border-border"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-accent text-[#1B1F3B] hover:bg-accent/90"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <p className="text-gray-400 text-sm text-center">
          Demo credentials are pre-filled. Click Login to continue.
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;