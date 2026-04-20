import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import SidePanel from "@/components/SidePanel";
import BatchManager from "@/components/BatchManager";
import ManufacturerAnalytics from "@/components/ManufacturerAnalytics";
import BrandAnalytics from "@/components/BrandAnalytics";
import ReportsAnalytics from "@/components/ReportsAnalytics";
import SystemSettings from "@/components/SystemSettings";
import FuturisticBackground from "@/components/FuturisticBackground";

const Manufacturer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <ManufacturerAnalytics />;
      case "batch-manager":
        return <BatchManager />;
      case "analytics":
        return <BrandAnalytics />;
      case "reports":
        return <ReportsAnalytics />;
      case "settings":
        return <SystemSettings />;
      default:
        return <ManufacturerAnalytics />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Side Panel */}
      <SidePanel 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border/50 shadow-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-heading text-xl">Manufacturer Portal</h1>
                <p className="text-sm text-muted-foreground">Pernod Ricard NXT Management System</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">Administrator</div>
                  <div className="text-xs text-muted-foreground">pernod_admin</div>
                </div>
                <ThemeToggle />
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex gap-6 h-full">
            {/* Main Content */}
            <div className="flex-1">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manufacturer;