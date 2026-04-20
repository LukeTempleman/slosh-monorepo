import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FuturisticBackground from "../../components/FuturisticBackground";
import { LoginCredentials } from "@/services/authService";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!username || !password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      console.log("📝 Attempting login with:", username);
      
      await login(username, password);
      console.log("✅ Login successful, tokens stored");
      setLoading(false);
      
      // Success - navigate after a tiny delay to ensure state is updated
      setTimeout(() => navigate("/"), 50);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      console.error("❌ Login error:", errorMessage, err);
      setError(errorMessage);
      setLoading(false);
      // NO NAVIGATION - error stays on login page
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6">
      <FuturisticBackground intensity="medium" />
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-card/85 backdrop-blur-xl border-primary/20 shadow-lg hover:border-primary/30 transition-colors">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-primary to-primary/70 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Manufacturing Login</CardTitle>
            <CardDescription>
              Access the Production Dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/60 backdrop-blur-sm border-primary/20 focus:border-primary/40"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/60 backdrop-blur-sm border-primary/20 focus:border-primary/40 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Button variant="link" className="px-0 text-primary" type="button" disabled={loading}>
                  Forgot password?
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button type="submit" className="w-full" variant="gradient-primary" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-card/70 backdrop-blur-xl rounded-lg border border-primary/20 hover:border-primary/30 transition-colors">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-xs text-muted-foreground">Encrypted</div>
          </div>
          <div className="p-3 bg-card/70 backdrop-blur-xl rounded-lg border border-primary/20 hover:border-primary/30 transition-colors">
            <div className="text-lg mb-1">⚡</div>
            <div className="text-xs text-muted-foreground">Fast Login</div>
          </div>
          <div className="p-3 bg-card/70 backdrop-blur-xl rounded-lg border border-primary/20 hover:border-primary/30 transition-colors">
            <div className="text-lg mb-1">🛡️</div>
            <div className="text-xs text-muted-foreground">Secure</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by <strong className="text-primary">Slosh</strong> Security Solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
