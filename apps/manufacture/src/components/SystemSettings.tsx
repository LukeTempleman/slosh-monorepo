import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Bell, 
  Globe, 
  Database,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const { toast } = useToast();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer",
    department: "",
    phone: "",
    location: ""
  });

  // Mock user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Mitchell",
      email: "john.mitchell@pernodricard.com",
      role: "administrator",
      department: "IT Security",
      phone: "+1 555 0123",
      location: "New York, USA",
      status: "active",
      lastLogin: "2024-01-15 09:30",
      avatar: null,
      permissions: ["full_access", "user_management", "system_config"]
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah.chen@pernodricard.com",
      role: "manager",
      department: "Supply Chain",
      phone: "+1 555 0124",
      location: "San Francisco, USA",
      status: "active",
      lastLogin: "2024-01-15 14:15",
      avatar: null,
      permissions: ["batch_management", "analytics_view", "reports_export"]
    },
    {
      id: 3,
      name: "Pierre Dubois",
      email: "pierre.dubois@pernodricard.com",
      role: "analyst",
      department: "Quality Assurance",
      phone: "+33 1 40 00 00 00",
      location: "Paris, France",
      status: "active",
      lastLogin: "2024-01-14 16:45",
      avatar: null,
      permissions: ["analytics_view", "reports_view"]
    },
    {
      id: 4,
      name: "Maria Rodriguez",
      email: "maria.rodriguez@pernodricard.com",
      role: "viewer",
      department: "Marketing",
      phone: "+34 91 000 0000",
      location: "Madrid, Spain",
      status: "inactive",
      lastLogin: "2024-01-10 11:20",
      avatar: null,
      permissions: ["dashboard_view"]
    }
  ]);

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    twoFactorRequired: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    apiRateLimit: 1000,
    encryptionEnabled: true,
    auditLogging: true,
    emailNotifications: true,
    slackIntegration: false,
    maintenanceMode: false,
    autoBackup: true,
    dataRetention: 365
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields",
        variant: "destructive"
      });
      return;
    }

    const userId = users.length + 1;
    const user = {
      ...newUser,
      id: userId,
      status: "active",
      lastLogin: "Never",
      avatar: null,
      permissions: getDefaultPermissions(newUser.role)
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "viewer", department: "", phone: "", location: "" });
    setUserDialogOpen(false);
    
    toast({
      title: "User Created",
      description: `${user.name} has been added to the system successfully`
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system"
    });
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
  };

  const getDefaultPermissions = (role: string) => {
    switch (role) {
      case "administrator":
        return ["full_access", "user_management", "system_config", "batch_management", "analytics_view", "reports_export"];
      case "manager":
        return ["batch_management", "analytics_view", "reports_export", "user_view"];
      case "analyst":
        return ["analytics_view", "reports_view", "dashboard_view"];
      case "viewer":
      default:
        return ["dashboard_view"];
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
      administrator: "destructive",
      manager: "default", 
      analyst: "secondary",
      viewer: "outline"
    };
    return <Badge variant={variants[role] || "outline"}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-heading">System Settings</h2>
          <p className="text-muted-foreground">Manage users, security, and system configuration</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Settings
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with appropriate permissions and access levels.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-name">Full Name *</Label>
                        <Input
                          id="user-name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email Address *</Label>
                        <Input
                          id="user-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="user@pernodricard.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-role">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrator">Administrator</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-department">Department</Label>
                        <Input
                          id="user-department"
                          value={newUser.department}
                          onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                          placeholder="e.g., Supply Chain"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-phone">Phone Number</Label>
                        <Input
                          id="user-phone"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                          placeholder="e.g., +1 555 0123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-location">Location</Label>
                        <Input
                          id="user-location"
                          value={newUser.location}
                          onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                          placeholder="e.g., New York, USA"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser} className="gradient-primary">
                        <Save className="h-4 w-4 mr-2" />
                        Create User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.department}</div>
                            <div className="text-sm text-muted-foreground">{user.location}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              {user.status === "active" ? (
                                <>
                                  <Lock className="h-3 w-3 mr-1" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-3 w-3 mr-1" />
                                  Enable
                                </>
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Force 2FA for all user accounts</p>
                  </div>
                  <Switch
                    checked={systemSettings.twoFactorRequired}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, twoFactorRequired: checked})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Input
                    type="number"
                    value={systemSettings.passwordExpiry}
                    onChange={(e) => 
                      setSystemSettings({...systemSettings, passwordExpiry: parseInt(e.target.value)})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => 
                      setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Encryption & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">Encrypt all stored data</p>
                  </div>
                  <Switch
                    checked={systemSettings.encryptionEnabled}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, encryptionEnabled: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all system activities</p>
                  </div>
                  <Switch
                    checked={systemSettings.auditLogging}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, auditLogging: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Rate Limit (requests/hour)</Label>
                  <Input
                    type="number"
                    value={systemSettings.apiRateLimit}
                    onChange={(e) => 
                      setSystemSettings({...systemSettings, apiRateLimit: parseInt(e.target.value)})
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Daily system backups</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, autoBackup: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Retention Period (days)</Label>
                  <Input
                    type="number"
                    value={systemSettings.dataRetention}
                    onChange={(e) => 
                      setSystemSettings({...systemSettings, dataRetention: parseInt(e.target.value)})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable system access</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, maintenanceMode: checked})
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download System Logs
                </Button>
                <Button className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Configuration
                </Button>
                <Button className="w-full" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button className="w-full gradient-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save All Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <Switch
                  checked={systemSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSystemSettings({...systemSettings, emailNotifications: checked})
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Security Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Failed login attempts</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Suspicious activity</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">System breaches</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">System Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">System downtime</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">High counterfeit activity</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Batch processing errors</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Slack Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                  </div>
                  <Switch
                    checked={systemSettings.slackIntegration}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, slackIntegration: checked})
                    }
                  />
                </div>
                {systemSettings.slackIntegration && (
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input placeholder="https://hooks.slack.com/..." />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Base URL</Label>
                  <Input value="https://api.veritas-scan.com/v1" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input value="vst_***************************" readOnly />
                    <Button variant="outline" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Regenerate API Key
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
