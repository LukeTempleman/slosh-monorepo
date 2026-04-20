import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, Eye, Shield } from "lucide-react";

interface MapModalProps {
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

// South African locations with scan data
const generateLocationData = (brandName: string, topMarkets: string[]) => {
  const saLocations = [
    { name: "Cape Town", province: "Western Cape", coords: [-33.9249, 18.4241], population: "4.6M" },
    { name: "Johannesburg", province: "Gauteng", coords: [-26.2041, 28.0473], population: "5.6M" },
    { name: "Durban", province: "KwaZulu-Natal", coords: [-29.8587, 31.0218], population: "3.9M" },
    { name: "Pretoria", province: "Gauteng", coords: [-25.7479, 28.2293], population: "2.9M" },
    { name: "Port Elizabeth", province: "Eastern Cape", coords: [-33.9608, 25.6022], population: "1.3M" },
    { name: "Bloemfontein", province: "Free State", coords: [-29.0852, 26.1596], population: "750K" },
    { name: "East London", province: "Eastern Cape", coords: [-33.0153, 27.9116], population: "755K" },
    { name: "George", province: "Western Cape", coords: [-33.9628, 22.4619], population: "204K" },
    { name: "Polokwane", province: "Limpopo", coords: [-23.9045, 29.4689], population: "754K" },
  ];

  return saLocations.map((location, index) => {
    const isTopMarket = topMarkets.includes(location.name);
    const baseScans = isTopMarket ? Math.floor(Math.random() * 5000) + 3000 : Math.floor(Math.random() * 2000) + 500;
    
    return {
      ...location,
      scans: baseScans,
      successRate: Math.floor(Math.random() * 3) + 97, // 97-99%
      growth: Math.floor(Math.random() * 20) + 5, // 5-25%
      isTopMarket,
      retailers: Math.floor(Math.random() * 15) + 8, // 8-23 retailers
      lastScan: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString() // Last 7 days
    };
  }).sort((a, b) => b.scans - a.scans);
};

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, brand }) => {
  const locationData = generateLocationData(brand.name, brand.topMarkets);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-100 flex items-center justify-center border border-gray-200 dark:border-gray-300 p-2">
              <img 
                src={`https://pernod-ricard.com${brand.logoUrl}`}
                alt={`${brand.name} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/48x48/1f2937/ffffff?text=${encodeURIComponent(brand.name.charAt(0))}`;
                }}
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{brand.name} - South Africa Distribution</DialogTitle>
              <DialogDescription>
                Verification scanning activity across South African provinces and cities
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>South Africa Geographic Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg p-8 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="text-lg font-semibold text-muted-foreground">Interactive Map</h3>
                    <p className="text-sm text-muted-foreground">South African scanning locations for {brand.name}</p>
                  </div>
                </div>
                {/* Mock location pins */}
                <div className="absolute top-16 left-20">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs ml-1">Cape Town</span>
                </div>
                <div className="absolute top-12 right-24">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs ml-1">Johannesburg</span>
                </div>
                <div className="absolute bottom-16 right-16">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs ml-1">Durban</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>City-by-City Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationData.map((location, index) => (
                  <div 
                    key={location.name} 
                    className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{location.name}</h4>
                          {location.isTopMarket && (
                            <Badge variant="default" className="text-xs">Top Market</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {location.province} • Population: {location.population}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-600">{location.scans.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Total Scans</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">{location.successRate}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-600">+{location.growth}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Monthly Growth</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">{location.retailers}</div>
                        <p className="text-xs text-muted-foreground">Retailers</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;