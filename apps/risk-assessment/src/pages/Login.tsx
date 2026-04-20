import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { riskAssessmentApi } from "@/services/apiClient";
import FuturisticBackground from "../components/FuturisticBackground";

interface LoginFormData {
  username: string;
  password: string;
}

interface TwoFAForm {
  code: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginFormData>({ username: "", password: "" });
  const [twoFAForm, setTwoFAForm] = useState<TwoFAForm>({ code: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loginForm.username === "risk_admin" && loginForm.password === "password123") {
      setShowTwoFA(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try: risk_admin / password123");
    }
  };

  const handleTwoFA = async () => {
    if (twoFAForm.code === "123456") {
      // Attempt real backend login
      setLoading(true);
      try {
        const response = await riskAssessmentApi.login({
          username: loginForm.username,
          password: loginForm.password,
        });

        if (response.success && response.data.access_token) {
          riskAssessmentApi.setAuthToken(response.data.access_token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsLoggedIn(true);
          setTimeout(() => navigate("/"), 500);
        } else {
          setLoginError("Backend authentication failed. Using demo mode.");
          setIsLoggedIn(true);
          setTimeout(() => navigate("/"), 500);
        }
      } catch (err) {
        setLoginError("Backend unavailable. Using demo mode.");
        setIsLoggedIn(true);
        setTimeout(() => navigate("/"), 500);
      } finally {
        setLoading(false);
      }
    } else {
      setLoginError("Invalid 2FA code. Use: 123456");
    }
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-accent/30 z-0" />
      <FuturisticBackground intensity="medium" />
      <div className="relative z-10 w-full max-w-md">
        {!showTwoFA ? (
          <div className="bg-card/85 backdrop-blur-xl border border-primary/20 rounded-lg shadow-elevated p-8">
            <div className="flex justify-center mb-6">
              <div className="gradient-alert p-3 rounded-xl shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-center text-2xl font-bold text-card-foreground mb-2">Risk Assessment Access</h2>
            <p className="text-center text-muted-foreground mb-6">Threat Intelligence Dashboard Login</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-card-foreground block mb-2">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-background/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/40 transition-smooth text-card-foreground"
                  placeholder="Enter username (demo: risk_admin)"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground block mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-background/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/40 transition-smooth text-card-foreground"
                  placeholder="Enter password (demo: password123)"
                />
              </div>
            </div>

            {loginError && <p className="text-sm text-destructive mb-4">{loginError}</p>}

            <Button onClick={handleLogin} className="w-full gradient-alert mb-3">
              Sign In
            </Button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
              {["⚠️ Risk Analysis", "📊 Alerts", "🔍 Investigation", "📈 Intelligence"].map((feature) => (
                <div key={feature} className="p-3 bg-card/70 backdrop-blur-xl rounded-lg border border-primary/20 hover:border-primary/30 transition-smooth text-center text-xs text-muted-foreground">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card/85 backdrop-blur-xl border border-success/20 rounded-lg shadow-elevated p-8">
            <h2 className="text-center text-2xl font-bold text-card-foreground mb-2">Two-Factor Authentication</h2>
            <p className="text-center text-muted-foreground mb-6">Enter the 6-digit code from your authenticator</p>

            <div className="mb-6">
              <input
                type="text"
                value={twoFAForm.code}
                onChange={(e) => setTwoFAForm({ code: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                maxLength={6}
                disabled={loading}
                className="w-full px-3 py-3 border border-success/30 rounded-lg bg-background/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-success focus:border-success/50 transition-smooth text-center text-lg tracking-widest font-mono text-card-foreground disabled:opacity-50"
                placeholder="000000"
              />
            </div>

            {loginError && <p className="text-sm text-destructive mb-4">{loginError}</p>}

            <Button onClick={handleTwoFA} disabled={loading} className="w-full gradient-success mb-3">
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
            <Button
              onClick={() => {
                setShowTwoFA(false);
                setTwoFAForm({ code: "" });
                setLoginError("");
              }}
              variant="ghost"
              disabled={loading}
              className="w-full gap-2 bg-background/40 backdrop-blur-sm border border-primary/20 hover:bg-background/60 hover:border-primary/30 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
