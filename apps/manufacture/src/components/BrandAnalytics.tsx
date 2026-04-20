import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Shield, 
  Eye,
  Globe,
  Award,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MapPin,
  Package,
  Loader2
} from "lucide-react";
import MapModal from "@/components/MapModal";
import BrandDetailsModal from "@/components/BrandDetailsModal";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { batchService } from "@/services/batchService";

interface BrandData {
  id: string;
  name: string;
  logoUrl: string;
  category: string;
  region: string;
  totalScans: number;
  monthlyGrowth: number;
  successRate: number;
  topMarkets: string[];
  recentActivity: number;
  status: "Active" | "Limited" | "Inactive";
  verificationLevel: "Premium" | "Ultra Premium";
  riskLevel: "Low" | "Medium" | "High";
}

interface BrandCardProps {
  brand: BrandData;
  index: number;
  onMapClick: (brand: BrandData) => void;
  onDetailsClick: (brand: BrandData) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, index, onMapClick, onDetailsClick }) => {
  const animatedScans = brand.totalScans;
  const animatedSuccessRate = brand.successRate;
  const animatedRecentActivity = brand.recentActivity;

  return (
    <Card className="card-elevated group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-100 flex items-center justify-center border border-gray-200 dark:border-gray-300 p-2">
              <img 
                src={brand.logoUrl}
                alt={`${brand.name} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/48x48/1f2937/ffffff?text=${encodeURIComponent(brand.name.charAt(0))}`;
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{brand.name}</h3>
              <p className="text-sm text-muted-foreground">{brand.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge 
              variant={brand.verificationLevel === "Ultra Premium" ? "default" : "secondary"}
              className="text-xs"
            >
              {brand.verificationLevel}
            </Badge>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                brand.status === "Active" ? "bg-green-500" : 
                brand.status === "Limited" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              <span className="text-xs text-muted-foreground">{brand.status === "Active" ? "Live" : brand.status}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/30">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{animatedScans.toLocaleString()}</div>
            <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">Total Scans</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/50 dark:border-green-800/30">
            <div className="text-lg font-bold text-green-700 dark:text-green-300">{animatedSuccessRate}%</div>
            <div className="text-xs text-green-600/80 dark:text-green-400/80 font-medium">Success Rate</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200/50 dark:border-purple-800/30">
            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{animatedRecentActivity}</div>
            <div className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">7d Activity</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Assessment</span>
            <Badge 
              variant={brand.riskLevel === "Low" ? "secondary" : brand.riskLevel === "Medium" ? "default" : "destructive"}
              className="text-xs"
            >
              {brand.riskLevel}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2 hover:bg-primary/10 hover:border-primary/30 transition-colors group/btn"
              onClick={() => onMapClick(brand)}
            >
              <MapPin className="w-4 h-4 group-hover/btn:text-primary transition-colors" />
              <span>View Map</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors"
              onClick={() => onDetailsClick(brand)}
            >
              Details
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {brand.topMarkets.slice(0, 3).map((market, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {market}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BrandAnalytics = () => {
  const [mounted, setMounted] = useState(false);
  const [brandData, setBrandData] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedBrandDetails, setSelectedBrandDetails] = useState<BrandData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchBrandData();
  }, []);

  const fetchBrandData = async () => {
    try {
      setLoading(true);
      const analytics = await batchService.getAnalytics();
      
      if (analytics && analytics.brands) {
        const transformedBrands: BrandData[] = analytics.brands.map((brand: any) => {
          const totalScans = brand.totalScans || 0;
          const authenticated = brand.authenticatedScans || 0;
          
          return {
            id: brand.id,
            name: brand.name,
            logoUrl: "/sites/default/files/placeholder.png",
            category: "Spirits",
            region: brand.region || "South Africa",
            totalScans: totalScans,
            monthlyGrowth: brand.monthlyGrowth || Math.floor(Math.random() * 20),
            successRate: Math.round(brand.successRate || 98),
            topMarkets: brand.topMarkets || ["Johannesburg", "Cape Town", "Durban"],
            recentActivity: Math.floor(totalScans * 0.1),
            status: "Active" as const,
            verificationLevel: "Premium" as const,
            riskLevel: (brand.riskLevel || "Low") as "Low" | "Medium" | "High"
          };
        });
        
        setBrandData(transformedBrands);
      }
    } catch (error) {
      console.error("Error fetching brand analytics:", error);
      setBrandData([]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Brand Analytics</h2>
        <p className="text-muted-foreground">Real-time performance metrics for Pernod Ricard brands</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-2" />
            <p className="text-muted-foreground">Loading brand data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandData.map((brand, index) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              index={index}
              onMapClick={(b) => setSelectedBrand(b) || setIsMapOpen(true)}
              onDetailsClick={(b) => setSelectedBrandDetails(b) || setIsDetailsOpen(true)}
            />
          ))}
        </div>
      )}

      {!loading && brandData.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No brand data available</p>
        </div>
      )}

      {selectedBrand && (
        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          brand={selectedBrand}
        />
      )}

      {selectedBrandDetails && (
        <BrandDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          brand={selectedBrandDetails}
        />
      )}
    </div>
  );
};

export default BrandAnalytics;
