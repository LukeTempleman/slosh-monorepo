import React, { useCallback, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Eye, Shield } from "lucide-react";

// Get API key from environment
const getApiKey = (): string => {
  // @ts-ignore - Vite injects import.meta.env at build time
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
};

interface GoogleMapsComponentProps {
  title?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  markers?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    scans?: number;
    successRate?: number;
    growth?: number;
    retailers?: number;
    isTopMarket?: boolean;
  }>;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -29.6100,
  lng: 28.2336,
};

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({
  title = "South Africa Distribution Map",
  defaultCenter: center = defaultCenter,
  defaultZoom = 6,
  markers = [],
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: getApiKey(),
  });

  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const onLoad = useCallback(function callback() {
    // Map instance is handled internally by GoogleMap component
  }, []);

  const onUnmount = useCallback(function callback() {
    // Map instance cleanup handled internally
  }, []);

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-8 h-96 flex items-center justify-center text-muted-foreground">
            Loading Map...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={defaultZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: [
              {
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }],
              },
              {
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }],
              },
              {
                elementType: 'labels.text.fill',
                stylers: [{ color: '#616161' }],
              },
              {
                featureType: 'administrative.country',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#e0e0e0' }],
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#c9c9c9' }],
              },
            ],
          }}
        >
          {markers.map((marker) => (
            <MarkerF
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => setSelectedMarker(marker.id)}
              icon={{
                path: 'M12 0c-4.4 0-8 3.6-8 8 0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8z',
                scale: 1.5,
                fillColor: marker.isTopMarket ? '#0B2A4A' : '#C9A76D',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
              }}
            >
              {selectedMarker === marker.id && (
                <InfoWindowF onCloseClick={() => setSelectedMarker(null)}>
                  <div className="bg-white p-3 rounded-lg shadow-lg" style={{ minWidth: '250px' }}>
                    <h4 className="font-semibold text-sm mb-2">{marker.name}</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Scans:</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-blue-600" />
                          <span className="font-medium">{marker.scans?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-green-600" />
                          <span className="font-medium text-green-600">{marker.successRate}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Growth:</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-purple-600" />
                          <span className="font-medium text-purple-600">+{marker.growth}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Retailers:</span>
                        <span className="font-medium">{marker.retailers}</span>
                      </div>
                    </div>
                    {marker.isTopMarket && (
                      <Badge className="mt-2 w-full justify-center" variant="default">
                        Top Market
                      </Badge>
                    )}
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
        </GoogleMap>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsComponent;
