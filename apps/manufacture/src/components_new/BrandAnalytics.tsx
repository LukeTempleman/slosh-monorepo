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
  Package
} from "lucide-react";
import MapModal from "@/components/MapModal";
import BrandDetailsModal from "@/components/BrandDetailsModal";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";

// Complete Pernod Ricard brand portfolio based on official website data
const brandData = [
  // Premium Global Brands - Tier 1
  {
    id: "absolut",
    name: "Absolut",
    logoUrl: "/sites/default/files/2021-04/brand-absolut-logo-240px_1.png",
    logo: "🍸",
    category: "Vodka",
    region: "Sweden",
    totalScans: 45621,
    monthlyGrowth: 12.3,
    authenticScans: 44892,
    failedScans: 524,
    unknownScans: 205,
    successRate: 98.4,
    topMarkets: ["Cape Town", "Johannesburg", "Durban", "Port Elizabeth"],
    recentActivity: 4205,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "ballantines",
    name: "Ballantine's",
    logoUrl: "/sites/default/files/2021-07/ballantines_logo_240.png",
    logo: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    category: "Scotch Whisky",
    region: "Scotland",
    totalScans: 42185,
    monthlyGrowth: 9.1,
    authenticScans: 41456,
    failedScans: 498,
    unknownScans: 231,
    successRate: 98.3,
    topMarkets: ["Europe", "Asia", "Latin America", "Africa"],
    recentActivity: 3876,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "beefeater",
    name: "Beefeater",
    logoUrl: "/sites/default/files/2021-07/beefeater-logo_240.png",
    logo: "💂‍♂️",
    category: "Gin",
    region: "England",
    totalScans: 28903,
    monthlyGrowth: 6.8,
    authenticScans: 28456,
    failedScans: 298,
    unknownScans: 149,
    successRate: 98.5,
    topMarkets: ["Cape Town", "Durban", "Johannesburg", "Port Elizabeth"],
    recentActivity: 2634,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "chivas-regal",
    name: "Chivas Regal",
    logoUrl: "/sites/default/files/2021-06/chivas_logo_blue_240.png",
    logo: "👑",
    category: "Scotch Whisky",
    region: "Scotland",
    totalScans: 32156,
    monthlyGrowth: 15.2,
    authenticScans: 31498,
    failedScans: 445,
    unknownScans: 213,
    successRate: 98.0,
    topMarkets: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
    recentActivity: 2847,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "havana-club",
    name: "Havana Club",
    logoUrl: "/sites/default/files/2021-05/havana_club_logo-resize_blue.png",
    logo: "🇨🇺",
    category: "Rum",
    region: "Cuba",
    totalScans: 34567,
    monthlyGrowth: 10.2,
    authenticScans: 33987,
    failedScans: 398,
    unknownScans: 182,
    successRate: 98.3,
    topMarkets: ["Durban", "Cape Town", "Johannesburg", "Bloemfontein"],
    recentActivity: 3123,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "jameson",
    name: "Jameson",
    logoUrl: "/sites/default/files/2021-06/brand-jameson-logo-240px.png",
    logo: "🥃",
    category: "Irish Whiskey",
    region: "Ireland",
    totalScans: 38492,
    monthlyGrowth: 8.7,
    authenticScans: 37891,
    failedScans: 387,
    unknownScans: 214,
    successRate: 98.4,
    topMarkets: ["Cape Town", "Johannesburg", "Durban", "Port Elizabeth"],
    recentActivity: 3245,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "malibu",
    name: "Malibu",
    logoUrl: "/sites/default/files/2021-06/Malibu_logo_240.png",
    logo: "🥥",
    category: "Rum",
    region: "Caribbean",
    totalScans: 36742,
    monthlyGrowth: 11.5,
    authenticScans: 36098,
    failedScans: 412,
    unknownScans: 232,
    successRate: 98.2,
    topMarkets: ["USA", "UK", "Australia", "Germany"],
    recentActivity: 3421,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "ojo-de-tigre",
    name: "Ojo de Tigre",
    logoUrl: "/sites/default/files/2024-02/ojo-de-tigre-logo_bleu.png",
    logo: "🐅",
    category: "Tequila & Mezcal",
    region: "Mexico",
    totalScans: 15234,
    monthlyGrowth: 18.7,
    authenticScans: 14987,
    failedScans: 167,
    unknownScans: 80,
    successRate: 98.4,
    topMarkets: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
    recentActivity: 1456,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "martell",
    name: "Martell",
    logoUrl: "/sites/default/files/2021-06/martell_logo_240.png",
    logo: "🍇",
    category: "Cognac & Brandy",
    region: "France",
    totalScans: 28934,
    monthlyGrowth: 10.1,
    authenticScans: 28456,
    failedScans: 312,
    unknownScans: 166,
    successRate: 98.3,
    topMarkets: ["Cape Town", "Johannesburg", "Durban", "Bloemfontein"],
    recentActivity: 2341,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "mumm",
    name: "G.H.Mumm",
    logoUrl: "/sites/default/files/2021-06/brand-mumm-logo-240px.png",
    logo: "🍾",
    category: "Champagne",
    region: "France",
    totalScans: 23456,
    monthlyGrowth: 6.1,
    authenticScans: 23089,
    failedScans: 245,
    unknownScans: 122,
    successRate: 98.4,
    topMarkets: ["Cape Town", "Johannesburg", "Port Elizabeth", "East London"],
    recentActivity: 2112,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "perrier-jouet",
    name: "Perrier-Jouët",
    logoUrl: "/sites/default/files/2021-06/brand-perrier-jouet-logo-240px.png",
    logo: "🥂",
    category: "Champagne",
    region: "France",
    totalScans: 19876,
    monthlyGrowth: 7.2,
    authenticScans: 19543,
    failedScans: 223,
    unknownScans: 110,
    successRate: 98.3,
    topMarkets: ["Durban", "Cape Town", "Johannesburg", "Pretoria"],
    recentActivity: 1789,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Ultra Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "ricard",
    name: "Ricard",
    logoUrl: "/sites/default/files/2021-06/brand-ricard-logo-240px.png",
    logo: "⭐",
    category: "Aperitif",
    region: "France",
    totalScans: 25734,
    monthlyGrowth: 5.8,
    authenticScans: 25234,
    failedScans: 334,
    unknownScans: 166,
    successRate: 98.1,
    topMarkets: ["France", "Spain", "Belgium", "Switzerland"],
    recentActivity: 2145,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "royal-salute",
    name: "Royal Salute",
    logoUrl: "/sites/default/files/2021-06/brand-royal-salute-logo-240px.png",
    logo: "🏆",
    category: "Scotch Whisky",
    region: "Scotland",
    totalScans: 15672,
    monthlyGrowth: 18.5,
    authenticScans: 15398,
    failedScans: 189,
    unknownScans: 85,
    successRate: 98.2,
    topMarkets: ["Johannesburg", "Cape Town", "Durban", "Port Elizabeth"],
    recentActivity: 1834,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Ultra Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "the-glenlivet",
    name: "The Glenlivet",
    logoUrl: "/sites/default/files/2021-07/the-glenlivet_logo_240.png",
    logo: "🏔️",
    category: "Scotch Whisky",
    region: "Scotland",
    totalScans: 41234,
    monthlyGrowth: 9.7,
    authenticScans: 40567,
    failedScans: 445,
    unknownScans: 222,
    successRate: 98.4,
    topMarkets: ["Cape Town", "Johannesburg", "Durban", "Bloemfontein"],
    recentActivity: 3754,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "aberlour",
    name: "Aberlour",
    logoUrl: "/sites/default/files/2021-07/aberlour_logo_240.png",
    logo: "🌊",
    category: "Scotch Whisky",
    region: "Scotland",
    totalScans: 22145,
    monthlyGrowth: 13.8,
    authenticScans: 21789,
    failedScans: 245,
    unknownScans: 111,
    successRate: 98.4,
    topMarkets: ["Cape Town", "Durban", "Johannesburg", "Port Elizabeth"],
    recentActivity: 1987,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "altos",
    name: "Altos",
    logoUrl: "/sites/default/files/2021-04/brand-altos-logo-240px_0.png",
    logo: "🌵",
    category: "Tequila & Mezcal",
    region: "Mexico",
    totalScans: 18234,
    monthlyGrowth: 14.7,
    authenticScans: 17923,
    failedScans: 201,
    unknownScans: 110,
    successRate: 98.3,
    topMarkets: ["Mexico", "USA", "UK", "Netherlands"],
    recentActivity: 1623,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "augier",
    name: "Augier",
    logoUrl: "/sites/default/files/2021-05/brand-augier-logo-blue-240px.png",
    logo: "🦅",
    category: "Cognac & Brandy",
    region: "France",
    totalScans: 8734,
    monthlyGrowth: 22.1,
    authenticScans: 8567,
    failedScans: 98,
    unknownScans: 69,
    successRate: 98.1,
    topMarkets: ["France", "USA", "UK", "Singapore"],
    recentActivity: 845,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Ultra Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "avion",
    name: "Avión",
    logoUrl: "/sites/default/files/2021-04/brand-avion-logo-240px.png",
    logo: "✈️",
    category: "Tequila & Mezcal",
    region: "Mexico",
    totalScans: 12456,
    monthlyGrowth: 16.3,
    authenticScans: 12234,
    failedScans: 145,
    unknownScans: 77,
    successRate: 98.2,
    topMarkets: ["USA", "Mexico", "Canada", "UK"],
    recentActivity: 1134,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "ballantines",
    name: "Ballantine's",
    logoUrl: "/sites/default/files/2021-07/ballantines_logo_240.png",
    logo: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    category: "Scotch Whisky",
    region: "Scotland",
    totalScans: 42185,
    monthlyGrowth: 9.1,
    authenticScans: 41456,
    failedScans: 498,
    unknownScans: 231,
    successRate: 98.3,
    topMarkets: ["Europe", "Asia", "Latin America", "Africa"],
    recentActivity: 3876,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "ceders",
    name: "Ceder's",
    logoUrl: "/sites/default/files/2022-01/ceders_logo_list-updated.png",
    logo: "🌿",
    category: "No Alcohol",
    region: "South Africa",
    totalScans: 9234,
    monthlyGrowth: 25.4,
    authenticScans: 9087,
    failedScans: 89,
    unknownScans: 58,
    successRate: 98.4,
    topMarkets: ["Cape Town", "Johannesburg", "Durban", "George"],
    recentActivity: 1023,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "del-maguey",
    name: "Del Maguey",
    logoUrl: "/sites/default/files/2021-04/brand-delmaguey-logo-240px.png",
    logo: "🌮",
    category: "Tequila & Mezcal",
    region: "Mexico",
    totalScans: 5674,
    monthlyGrowth: 31.2,
    authenticScans: 5567,
    failedScans: 67,
    unknownScans: 40,
    successRate: 98.1,
    topMarkets: ["USA", "Mexico", "UK", "France"],
    recentActivity: 634,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Ultra Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "green-spot",
    name: "Green Spot",
    logoUrl: "/sites/default/files/2022-12/spot_whiskeys.png",
    logo: "🍀",
    category: "Irish Whiskey",
    region: "Ireland",
    totalScans: 14567,
    monthlyGrowth: 19.3,
    authenticScans: 14298,
    failedScans: 178,
    unknownScans: 91,
    successRate: 98.2,
    topMarkets: ["Ireland", "USA", "UK", "Australia"],
    recentActivity: 1334,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "malibu",
    name: "Malibu",
    logoUrl: "/sites/default/files/2021-06/Malibu_logo_240.png",
    logo: "🥥",
    category: "Rum",
    region: "Caribbean",
    totalScans: 36742,
    monthlyGrowth: 11.5,
    authenticScans: 36098,
    failedScans: 412,
    unknownScans: 232,
    successRate: 98.2,
    topMarkets: ["USA", "UK", "Australia", "Germany"],
    recentActivity: 3421,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "italicus",
    name: "Italicus",
    logoUrl: "/sites/default/files/2021-04/brand-italicus-logo-240px_0.png",
    logo: "🇮🇹",
    category: "Liqueur & Bitters",
    region: "Italy",
    totalScans: 7234,
    monthlyGrowth: 28.4,
    authenticScans: 7098,
    failedScans: 89,
    unknownScans: 47,
    successRate: 98.1,
    topMarkets: ["Italy", "UK", "USA", "Germany"],
    recentActivity: 723,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "jeffersons",
    name: "Jefferson's",
    logoUrl: "/sites/default/files/2024-04/jeffersons-bourbon-blue.png",
    logo: "🇺🇸",
    category: "World Whiskies",
    region: "USA",
    totalScans: 11234,
    monthlyGrowth: 21.7,
    authenticScans: 11012,
    failedScans: 134,
    unknownScans: 88,
    successRate: 98.0,
    topMarkets: ["USA", "Canada", "UK", "Japan"],
    recentActivity: 1034,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "kahlua",
    name: "Kahlúa",
    logoUrl: "/sites/default/files/2021-06/Kahlua-logo_240.png",
    logo: "☕",
    category: "Liqueur & Bitters",
    region: "Mexico",
    totalScans: 31245,
    monthlyGrowth: 8.9,
    authenticScans: 30734,
    failedScans: 356,
    unknownScans: 155,
    successRate: 98.4,
    topMarkets: ["USA", "Mexico", "Canada", "Australia"],
    recentActivity: 2892,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "lillet",
    name: "Lillet",
    logoUrl: "/sites/default/files/2021-06/LOGO_LILLET_blue_240.png",
    logo: "�",
    category: "Aperitif",
    region: "France",
    totalScans: 13567,
    monthlyGrowth: 15.3,
    authenticScans: 13345,
    failedScans: 145,
    unknownScans: 77,
    successRate: 98.4,
    topMarkets: ["France", "USA", "UK", "Germany"],
    recentActivity: 1234,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "lot-no-40",
    name: "Lot No. 40",
    logoUrl: "/sites/default/files/2021-04/brand-lotno.40-logo-240px.png",
    logo: "🍁",
    category: "World Whiskies",
    region: "Canada",
    totalScans: 9876,
    monthlyGrowth: 18.2,
    authenticScans: 9723,
    failedScans: 98,
    unknownScans: 55,
    successRate: 98.5,
    topMarkets: ["Canada", "USA", "UK", "Australia"],
    recentActivity: 834,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "malfy",
    name: "Malfy",
    logoUrl: "/sites/default/files/2021-06/malfy_blue_240.png",
    logo: "�",
    category: "Gin",
    region: "Italy",
    totalScans: 16789,
    monthlyGrowth: 26.1,
    authenticScans: 16456,
    failedScans: 223,
    unknownScans: 110,
    successRate: 98.0,
    topMarkets: ["Italy", "UK", "Germany", "USA"],
    recentActivity: 1567,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "method-and-madness",
    name: "Method and Madness",
    logoUrl: "/sites/default/files/2021-04/brand-method-and-madness-logo-240px.png",
    logo: "⚗️",
    category: "Irish Whiskey",
    region: "Ireland",
    totalScans: 6234,
    monthlyGrowth: 35.7,
    authenticScans: 6123,
    failedScans: 67,
    unknownScans: 44,
    successRate: 98.2,
    topMarkets: ["Ireland", "USA", "UK", "Netherlands"],
    recentActivity: 567,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Ultra Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "midleton-very-rare",
    name: "Midleton Very Rare",
    logoUrl: "/sites/default/files/2021-04/brand-midleton-very-rare-logo-240px.png",
    logo: "💎",
    category: "Irish Whiskey",
    region: "Ireland",
    totalScans: 3456,
    monthlyGrowth: 42.3,
    authenticScans: 3398,
    failedScans: 34,
    unknownScans: 24,
    successRate: 98.3,
    topMarkets: ["Ireland", "USA", "UK", "Japan"],
    recentActivity: 345,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Ultra Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "codigo-1530",
    name: "Código 1530",
    logoUrl: "/sites/default/files/2023-09/codigo_logo_blue.png",
    logo: "⚡",
    category: "Tequila & Mezcal",
    region: "Mexico",
    totalScans: 8934,
    monthlyGrowth: 29.5,
    authenticScans: 8767,
    failedScans: 112,
    unknownScans: 55,
    successRate: 98.1,
    topMarkets: ["USA", "Mexico", "Canada", "UK"],
    recentActivity: 867,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  },
  {
    id: "monkey-47",
    name: "Monkey 47",
    logoUrl: "/sites/default/files/2021-04/brand-monkey-47-logo-240px.png",
    logo: "🐒",
    category: "Gin",
    region: "Germany",
    totalScans: 12345,
    monthlyGrowth: 17.8,
    authenticScans: 12123,
    failedScans: 145,
    unknownScans: 77,
    successRate: 98.2,
    topMarkets: ["Germany", "USA", "UK", "Netherlands"],
    recentActivity: 1123,
    trend: "up" as const,
    status: "Active" as const,
    verificationLevel: "Premium" as const,
    riskLevel: "Low" as const
  }
];

// BrandCard Component - Moved outside main component
interface BrandCardProps {
  brand: typeof brandData[0];
  index: number;
  onMapClick: (brand: typeof brandData[0]) => void;
  onDetailsClick: (brand: typeof brandData[0]) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, index, onMapClick, onDetailsClick }) => {
  // Use static values instead of animations to ensure proper display
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
                src={`https://pernod-ricard.com${brand.logoUrl}`}
                alt={`${brand.name} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to placeholder if logo fails to load
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
              variant={brand.verificationLevel === 'Ultra Premium' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {brand.verificationLevel.replace('Premium', '').replace('Ultra ', 'Ultra').trim()}
            </Badge>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                brand.status === 'Active' ? 'bg-green-500' : 
                brand.status === 'Limited' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-muted-foreground">{brand.status.replace('Active', 'Live')}</span>
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
              variant={brand.riskLevel === 'Low' ? 'secondary' : brand.riskLevel === 'Medium' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {brand.riskLevel}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
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
              View Details
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {brand.topMarkets.map((market, idx) => (
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
  const [selectedBrand, setSelectedBrand] = useState<typeof brandData[0] | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedBrandDetails, setSelectedBrandDetails] = useState<typeof brandData[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openBrandMap = (brand: typeof brandData[0]) => {
    setSelectedBrand(brand);
    setIsMapOpen(true);
  };

  const closeBrandMap = () => {
    setIsMapOpen(false);
    setSelectedBrand(null);
  };

  const openBrandDetails = (brand: typeof brandData[0]) => {
    setSelectedBrandDetails(brand);
    setIsDetailsOpen(true);
  };

  const closeBrandDetails = () => {
    setIsDetailsOpen(false);
    setSelectedBrandDetails(null);
  };

  const totalPortfolioScans = brandData.reduce((sum, brand) => sum + brand.totalScans, 0);
  const averageSuccessRate = brandData.reduce((sum, brand) => sum + brand.successRate, 0) / brandData.length;
  
  // Use static values to ensure proper display
  const animatedBrandCount = brandData.length;
  const animatedPortfolioScans = totalPortfolioScans;
  const animatedSuccessRate = Math.round(averageSuccessRate * 10);
  const animatedCountries = 9;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-minimal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Brands</p>
                <div className="text-lg font-semibold text-primary">{animatedBrandCount}</div>
              </div>
              <Award className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-minimal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Portfolio Scans</p>
                <div className="text-lg font-semibold text-success">{animatedPortfolioScans.toLocaleString()}</div>
              </div>
              <Eye className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-minimal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Avg Success Rate</p>
                <div className="text-lg font-semibold text-success">{(animatedSuccessRate / 10).toFixed(1)}%</div>
              </div>
              <Shield className="w-5 h-5 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-minimal">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">SA Provinces</p>
                <div className="text-lg font-semibold text-primary">{animatedCountries}</div>
              </div>
              <Globe className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Brand Portfolio</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor verification performance across all Pernod Ricard brands
            </p>
          </div>
          <Badge variant="outline" className="bg-background">
            {brandData.length} Active Brands
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {brandData.map((brand, index) => (
            <BrandCard 
              key={brand.id} 
              brand={brand} 
              index={index} 
              onMapClick={openBrandMap}
              onDetailsClick={openBrandDetails}
            />
          ))}
        </div>
      </div>

      {/* Map Modal */}
      {selectedBrand && (
        <MapModal 
          isOpen={isMapOpen}
          onClose={closeBrandMap}
          brand={selectedBrand}
        />
      )}

      {/* Brand Details Modal */}
      {selectedBrandDetails && (
        <BrandDetailsModal 
          isOpen={isDetailsOpen}
          onClose={closeBrandDetails}
          brand={selectedBrandDetails}
        />
      )}
    </div>
  );
};

export default BrandAnalytics;
