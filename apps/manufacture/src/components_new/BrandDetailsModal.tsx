import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Calendar, MapPin, Package } from "lucide-react";

interface BrandDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: {
    id: string;
    name: string;
    logoUrl: string;
    logo: string;
    category: string;
    region: string;
    totalScans: number;
    monthlyGrowth: number;
    authenticScans: number;
    failedScans: number;
    unknownScans: number;
    successRate: number;
    topMarkets: string[];
    recentActivity: number;
    trend: string;
    status: string;
    verificationLevel: string;
    riskLevel: string;
  };
}

// Generate fake scan data for the selected brand
const generateScanData = (brandName: string) => {
  const locations = [
    "Cape Town Central", "Johannesburg CBD", "Durban North", "Pretoria East",
    "Port Elizabeth Marina", "Bloemfontein Centre", "East London Waterfront",
    "George Garden Route", "Stellenbosch Winelands", "Sandton City"
  ];
  
  const retailers = [
    "Liquor City", "Norman Goodfellows", "Tops at SPAR", "Pick n Pay Liquor",
    "Ultra Liquors", "Wine Cellar", "Makro Liquor", "Game Liquor", 
    "Checkers Liquor Shop", "OK Liquor"
  ];

  const statuses = ['Authentic', 'Authentic', 'Authentic', 'Authentic', 'Suspicious', 'Failed'];
  
  const scanData = [];
  
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const retailer = retailers[Math.floor(Math.random() * retailers.length)];
    
    scanData.push({
      id: `${brandName.toLowerCase().replace(' ', '-')}-${1000 + i}`,
      timestamp: date.toISOString(),
      location,
      retailer,
      status,
      batchNumber: `BN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      scannerDevice: `Device-${Math.floor(Math.random() * 999) + 100}`,
      confidence: status === 'Authentic' ? Math.floor(Math.random() * 5) + 95 : 
                 status === 'Suspicious' ? Math.floor(Math.random() * 20) + 60 : 
                 Math.floor(Math.random() * 40) + 20
    });
  }
  
  return scanData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const BrandDetailsModal: React.FC<BrandDetailsModalProps> = ({ isOpen, onClose, brand }) => {
  const scanData = generateScanData(brand.name);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Authentic':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Suspicious':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    const variant = status === 'Authentic' ? 'default' : 
                   status === 'Suspicious' ? 'secondary' : 'destructive';
    return <Badge variant={variant} className="text-xs">{status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-100 flex items-center justify-center border border-gray-200 dark:border-gray-300 p-3">
              <img 
                src={`https://pernod-ricard.com${brand.logoUrl}`}
                alt={`${brand.name} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/64x64/1f2937/ffffff?text=${encodeURIComponent(brand.name.charAt(0))}`;
                }}
              />
            </div>
            <div>
              <DialogTitle className="text-2xl">{brand.name} - Scan Details</DialogTitle>
              <DialogDescription className="text-base">
                Detailed verification scan history and analytics for {brand.category} products
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                  <div className="text-2xl font-bold text-primary">{brand.totalScans.toLocaleString()}</div>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <div className="text-2xl font-bold text-green-600">{brand.successRate}%</div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed Scans</p>
                  <div className="text-2xl font-bold text-red-600">{brand.failedScans}</div>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                  <div className="text-2xl font-bold text-blue-600">+{brand.monthlyGrowth}%</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Recent Scan History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Retailer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Batch #</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scanData.slice(0, 25).map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(scan.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{scan.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{scan.retailer}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(scan.status)}
                          {getStatusBadge(scan.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{scan.batchNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            scan.confidence >= 90 ? 'bg-green-500' : 
                            scan.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm">{scan.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {scan.scannerDevice}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BrandDetailsModal;
