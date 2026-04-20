import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, MapPin, User, Clock } from "lucide-react";

interface ScanEvent {
  id: string;
  timestamp: Date;
  user: string;
  location: string;
  brand: string;
  status: 'authentic' | 'suspicious' | 'failed';
  confidence: number;
  device: string;
  isNew?: boolean;
}

const LiveFeed: React.FC = () => {
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>([]);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  // Add new scan event every 2-5 seconds
  useEffect(() => {
    // South African locations
    const locations = [
      "Cape Town, WC", "Johannesburg, GP", "Durban, KZN", "Pretoria, GP",
      "Port Elizabeth, EC", "Bloemfontein, FS", "East London, EC", 
      "George, WC", "Polokwane, LP", "Nelspruit, MP", "Kimberley, NC",
      "Rustenburg, NW", "Pietermaritzburg, KZN", "Stellenbosch, WC"
    ];

    // Pernod Ricard brands
    const brands = [
      "Absolut", "Jameson", "Chivas Regal", "Ballantine's", "Martell",
      "Havana Club", "Malibu", "Beefeater", "The Glenlivet", "Royal Salute",
      "Perrier-Jouët", "Mumm", "Kahlúa", "Olmeca"
    ];

    // South African first names
    const firstNames = [
      "Thabo", "Sarah", "Mandla", "Nomsa", "Johan", "Priya", "Ahmed", "Zanele",
      "Michael", "Fatima", "Sipho", "Catherine", "Arjun", "Nosipho", "David",
      "Aisha", "Pieter", "Thandiwe", "Ryan", "Lerato", "Kevin", "Nalini",
      "Bongani", "Michelle", "Trevor", "Zinhle"
    ];

    // Generate random user
    const generateRandomUser = () => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      return `${firstName} ${lastInitial}.`;
    };
    // Generate random scan event
    const generateScanEvent = (): ScanEvent => {
      const statuses: Array<'authentic' | 'suspicious' | 'failed'> = ['authentic', 'authentic', 'authentic', 'authentic', 'authentic', 'suspicious', 'failed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      let confidence: number;
      switch (status) {
        case 'authentic':
          confidence = Math.floor(Math.random() * 8) + 92; // 92-99%
          break;
        case 'suspicious':
          confidence = Math.floor(Math.random() * 20) + 60; // 60-79%
          break;
        case 'failed':
          confidence = Math.floor(Math.random() * 40) + 10; // 10-49%
          break;
      }

      return {
        id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        user: generateRandomUser(),
        location: locations[Math.floor(Math.random() * locations.length)],
        brand: brands[Math.floor(Math.random() * brands.length)],
        status,
        confidence,
        device: `Device-${Math.floor(Math.random() * 999) + 100}`,
        isNew: true
      };
    };

    // Add initial events
    const initialEvents = Array.from({ length: 5 }, () => ({
      ...generateScanEvent(),
      isNew: false
    }));
    setScanEvents(initialEvents);

    const interval = setInterval(() => {
      const newEvent = generateScanEvent();
      
      // Add to animating items
      setAnimatingItems(prev => new Set([...prev, newEvent.id]));
      
      setScanEvents(prev => {
        const updatedEvents = [newEvent, ...prev.slice(0, 19).map(event => ({ ...event, isNew: false }))];
        return updatedEvents;
      });

      // Remove from animating items after animation completes
      setTimeout(() => {
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(newEvent.id);
          return newSet;
        });
      }, 800); // Animation duration

    }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'suspicious':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'authentic' ? 'default' : 
                   status === 'suspicious' ? 'secondary' : 'destructive';
    return (
      <Badge variant={variant} className="text-xs capitalize">
        {status}
      </Badge>
    );
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-background to-background/95">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              Live Scan Feed
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
              {scanEvents.length} Recent
            </Badge>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground animate-in fade-in-0 duration-700">
          Real-time verification scans across South Africa
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto scroll-smooth">
          <div className="space-y-1">
            {scanEvents.map((event, index) => {
              const isAnimating = animatingItems.has(event.id);
              const isNewest = index === 0 && event.isNew;
              
              return (
                <div 
                  key={event.id}
                  className={`
                    p-4 border-b border-gray-100 dark:border-gray-800 
                    transition-all duration-500 ease-out transform-gpu
                    ${isAnimating 
                      ? 'animate-in slide-in-from-top-2 fade-in-0 duration-500' 
                      : 'opacity-100 translate-y-0'
                    }
                    ${isNewest 
                      ? 'bg-gradient-to-r from-blue-50 via-blue-25 to-transparent dark:from-blue-950/30 dark:via-blue-950/15 dark:to-transparent border-l-4 border-l-blue-500 shadow-sm' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }
                    ${index === 0 && !event.isNew 
                      ? 'bg-blue-50/50 dark:bg-blue-950/10' 
                      : ''
                    }
                    will-change-transform will-change-opacity
                  `}
                  style={{
                    animationDelay: isAnimating ? `${index * 50}ms` : '0ms',
                    transitionDelay: isAnimating ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`transition-all duration-300 ${isNewest ? 'scale-110' : 'scale-100'}`}>
                        {getStatusIcon(event.status)}
                      </div>
                      <span className={`font-medium text-sm transition-all duration-300 ${
                        isNewest ? 'text-blue-700 dark:text-blue-300 font-semibold' : ''
                      }`}>
                        {event.brand}
                      </span>
                      {isNewest && (
                        <div className="flex items-center gap-1 animate-in fade-in-0 slide-in-from-left-2 duration-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Live
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`transition-all duration-300 ${isNewest ? 'scale-105' : 'scale-100'}`}>
                        {getStatusBadge(event.status)}
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 transition-all duration-300">
                        <Clock className={`w-3 h-3 ${isNewest ? 'text-blue-500' : ''}`} />
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs text-muted-foreground transition-all duration-300 ${
                      isNewest ? 'animate-in slide-in-from-left-1 duration-500' : ''
                    }`}>
                      <User className="w-3 h-3" />
                      <span>{event.user}</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-xs text-muted-foreground transition-all duration-300 ${
                      isNewest ? 'animate-in slide-in-from-left-1 duration-600' : ''
                    }`}>
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between mt-2 transition-all duration-300 ${
                    isNewest ? 'animate-in slide-in-from-bottom-1 duration-700' : ''
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        event.confidence >= 90 ? 'bg-green-500' : 
                        event.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      } ${isNewest ? 'animate-pulse scale-125' : ''}`} />
                      <span className={`text-xs font-medium transition-all duration-300 ${
                        isNewest ? 'text-blue-700 dark:text-blue-300 font-semibold' : ''
                      }`}>
                        {event.confidence}% confidence
                      </span>
                    </div>
                    <span className={`text-xs text-muted-foreground font-mono transition-all duration-300 ${
                      isNewest ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}>
                      {event.device}
                    </span>
                  </div>
                  
                  {isNewest && (
                    <div className="mt-3 pt-2 border-t border-blue-200 dark:border-blue-800/50 animate-in fade-in-0 slide-in-from-bottom-2 duration-800">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span>Just scanned</span>
                          </div>
                          <div className="h-4 w-px bg-blue-300 dark:bg-blue-600"></div>
                          <span className="text-blue-500">#{event.id.slice(-8)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveFeed;
