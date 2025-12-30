import { useState, useEffect } from 'react';
import { API_CONFIG, apiFetch } from '@/config/api';
import type {
  IPResponse,
  GeoResponse,
  DNSResponse,
  SecurityResponse,
  IPData,
} from '@/types/api';

/**
 * Custom hook to fetch IP data from ippriv backend
 * 
 * Fetches IP, geolocation, DNS, and security data in sequence
 * Returns combined data with loading and error states
 */
export function useIPData() {
  const [data, setData] = useState<IPData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchIPData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Step 1: Get IP address
        const ipData = await apiFetch<IPResponse>(API_CONFIG.endpoints.ip);
        
        if (!isMounted) return;
        
        // Handle localhost fallback (for development)
        let displayIP = ipData.ipv4;
        if (displayIP === '::1' || displayIP === '127.0.0.1' || displayIP === 'Unknown') {
          displayIP = '5.50.177.22'; // Brandon's IP for demo
        }

        // Step 2: Fetch all data in parallel
        const [geoData, dnsData, securityData] = await Promise.all([
          apiFetch<GeoResponse>(API_CONFIG.endpoints.geo(displayIP)),
          apiFetch<DNSResponse>(API_CONFIG.endpoints.dns(displayIP)),
          apiFetch<SecurityResponse>(API_CONFIG.endpoints.security(displayIP)),
        ]);

        if (!isMounted) return;

        // Combine all data
        const combinedData: IPData = {
          // IP
          ipv4: displayIP,
          ipv6: ipData.ipv6,
          timestamp: ipData.timestamp,
          
          // Geo
          country: geoData.country,
          countryCode: geoData.countryCode,
          region: geoData.region,
          city: geoData.city,
          lat: geoData.lat,
          lon: geoData.lon,
          timezone: geoData.timezone,
          isp: geoData.isp,
          
          // DNS
          hostname: dnsData.hostname,
          ptrRecords: dnsData.ptrRecords,
          
          // Security
          isVPN: securityData.isVPN,
          isProxy: securityData.isProxy,
          isTor: securityData.isTor,
          isHosting: securityData.isHosting,
        };

        setData(combinedData);
      } catch (err) {
        if (!isMounted) return;
        
        const error = err instanceof Error ? err : new Error('Failed to fetch IP data');
        setError(error);
        console.error('useIPData error:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchIPData();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []); // Run once on mount

  return {
    data,
    isLoading,
    error,
    // Helper computed values
    locationString: data ? `${data.city}, ${data.country}` : null,
    hasSecurityConcerns: data 
      ? data.isVPN || data.isProxy || data.isTor || data.isHosting
      : false,
  };
}
