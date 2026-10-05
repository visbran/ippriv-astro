import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  lat?: number;
  lng?: number;
  location?: string;
}

// Tiles fail as a block (blocked provider, offline, CSP): after this many
// errors with no successful tile, show the fallback instead of a grey box.
const TILE_ERROR_THRESHOLD = 3;

const LocationMap = ({ lat, lng, location }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  const hasCoords = typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    if (typeof window === 'undefined' || !hasCoords || !mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: false,
        // The map is illustrative only: keep it out of the tab order
        keyboard: false,
      });
      map.attributionControl.setPrefix(false);

      // OpenStreetMap tiles: no API key, attribution required by the tile usage policy
      let tilesLoaded = 0;
      let tileErrors = 0;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      })
        .on('tileload', () => {
          tilesLoaded += 1;
          if (!cancelled) setStatus('ready');
        })
        .on('tileerror', () => {
          tileErrors += 1;
          if (!cancelled && tilesLoaded === 0 && tileErrors >= TILE_ERROR_THRESHOLD) setStatus('failed');
        })
        .addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
          </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([lat, lng], { icon: customIcon, keyboard: false }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap().catch((err) => {
      console.error('LocationMap error:', err);
      if (!cancelled) setStatus('failed');
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, hasCoords]);

  const showFallback = !hasCoords || status === 'failed';

  return (
    <div className="relative h-full min-h-48 w-full overflow-hidden">
      {!showFallback && <div ref={mapRef} className="h-full w-full z-0" aria-hidden="true" />}

      {status === 'loading' && !showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      )}

      {showFallback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card px-6 text-center">
          <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {hasCoords ? 'The map could not load.' : 'No coordinates for this IP address.'}
          </p>
          {hasCoords && (
            <p className="text-xs text-muted-foreground tabular-nums">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {location && !showFallback && (
        <div className="pointer-events-none absolute top-3 left-3 z-[400] flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
