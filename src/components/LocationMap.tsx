import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LocationMapProps {
  lat?: number;
  lng?: number;
  location?: string;
}

const LocationMap = ({ lat = 44.8378, lng = -0.5792, location = "Bordeaux, France" }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      // Dynamic imports
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current) return;

      // Initialize map
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
      });

      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom marker
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
            <div class="absolute w-4 h-4 bg-primary/50 rounded-full animate-ping"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(map);

      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    initMap().catch(console.error);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full max-w-md mx-auto mt-6 mb-10"
    >
      <div className="glass-card rounded-2xl overflow-hidden p-1">
        <div className="relative rounded-xl overflow-hidden h-48 sm:h-56">
          <div ref={mapRef} className="h-full w-full z-0" />
          
          {/* Loading state */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="text-muted-foreground text-sm">Loading map...</div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
          
          {/* Location label */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
              📍 {location}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMap;
