import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Settings, 
  Upload, 
  FileText, 
  Menu, 
  X,
  ChevronLeft,
  Factory,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidePanelProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SidePanel = ({ activeSection, onSectionChange }: SidePanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "batch-manager", label: "Batch Manager", icon: Upload },
    { id: "analytics", label: "Brand Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className={cn(
      "bg-card border-r border-border/50 shadow-card transition-smooth",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Factory className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-semibold text-sm text-primary">Pernod Ricard</h2>
                <p className="text-xs text-muted-foreground">Manufacturer Portal</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2">
        <nav className="space-y-1">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 text-left transition-smooth",
                isCollapsed ? "px-2" : "px-3"
              )}
              onClick={() => onSectionChange(section.id)}
            >
              <section.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{section.label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      {/* Status Card */}
      {!isCollapsed && (
        <div className="p-4 mt-4">
          <Card className="bg-gradient-to-br from-primary/10 to-gold/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">System Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">NXT System</span>
                  <Badge variant="default" className="text-xs bg-success">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Encryption</span>
                  <Badge variant="default" className="text-xs bg-success">Secure</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Last Sync</span>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SidePanel;