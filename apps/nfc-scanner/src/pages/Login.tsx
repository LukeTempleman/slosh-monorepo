import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FuturisticBackground from "../components/FuturisticBackground";
import { LoginCredentials } from "@/services/authService";

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginForm, setLoginForm] = useState<LoginFormData>({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.username || !loginForm.password) {
      setLoginError("Please enter username and password");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      console.log("📝 Attempting NFC Scanner login with:", loginForm.username);
      
      await login(loginForm.username, loginForm.password);
      console.log("✅ NFC Scanner login successful, tokens stored");
      setLoading(false);
      
      // Success - navigate after a tiny delay to ensure state is updated
      setTimeout(() => navigate("/"), 50);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      console.error("❌ NFC Scanner login error:", errorMessage, err);
      setLoginError(errorMessage);
      setLoading(false);
      // NO NAVIGATION - error stays on login page
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-accent/30 z-0" />
      <FuturisticBackground intensity="medium" />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card/85 backdrop-blur-xl border border-primary/20 rounded-lg shadow-elevated p-8">
          <div className="flex justify-center mb-6">
            <div className="gradient-primary p-3 rounded-xl shadow-primary">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold text-card-foreground mb-2">NFC Scanner Access</h2>
          <p className="text-center text-muted-foreground mb-6">Pernod Ricard Secure Portal</p>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-background/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/40 transition-smooth text-card-foreground"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-background/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/40 transition-smooth text-card-foreground"
                placeholder="Enter password"
              />
            </div>
          </div>

          {loginError && <p className="text-sm text-destructive mb-4">{loginError}</p>}

          <Button onClick={handleLogin} disabled={loading} className="w-full gradient-primary mb-3">
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
            {["📱 NFC Tags", "✓ Verification", "🛡️ Security", "⚡ Fast"].map((feature) => (
              <div key={feature} className="p-3 bg-card/70 backdrop-blur-xl rounded-lg border border-primary/20 hover:border-primary/30 transition-smooth text-center text-xs text-muted-foreground">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
