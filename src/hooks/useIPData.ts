import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG, apiFetch, RateLimitError } from '@/config/api';
import type { IPResponse, GeoResponse, SecurityResponse } from '@/types/api';

export type IPErrorKind = 'rate-limit' | 'timeout' | 'no-public-ip' | 'network';

export type Privacy =
  | { masked: false }
  | { masked: true; via: 'Tor' | 'VPN' | 'Proxy' | 'Data center' };

type Part<T> = { status: 'loading' } | { status: 'ready'; value: T } | { status: 'error' };

export function classifyError(err: unknown): IPErrorKind {
  if (err instanceof RateLimitError) return 'rate-limit';
  if (err instanceof Error) {
    if (err.name === 'AbortError') return 'timeout';
    if (/\b429\b/.test(err.message)) return 'rate-limit';
    if (err.message === 'no-public-ip') return 'no-public-ip';
  }
  return 'network';
}

/**
 * Detects the visitor's IP, then fills in location and VPN/proxy status.
 *
 * The IP renders as soon as /api/ip answers. Geo and security load in
 * parallel afterwards and fail independently, so one slow or broken
 * endpoint never hides the answer.
 */
export function useIPData() {
  const [ip, setIp] = useState<Part<IPResponse>>({ status: 'loading' });
  const [ipError, setIpError] = useState<IPErrorKind | null>(null);
  const [geo, setGeo] = useState<Part<GeoResponse>>({ status: 'loading' });
  const [security, setSecurity] = useState<Part<SecurityResponse>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIp({ status: 'loading' });
    setIpError(null);
    setGeo({ status: 'loading' });
    setSecurity({ status: 'loading' });

    const run = async () => {
      let ipData: IPResponse;
      try {
        ipData = await apiFetch<IPResponse>(API_CONFIG.endpoints.ip);
        const addr = ipData.ipv4;
        if (!addr || addr === '::1' || addr === '127.0.0.1' || addr === 'Unknown') {
          throw new Error('no-public-ip');
        }
      } catch (err) {
        if (!isMounted) return;
        setIpError(classifyError(err));
        setIp({ status: 'error' });
        console.error('useIPData error:', err);
        return;
      }
      if (!isMounted) return;
      setIp({ status: 'ready', value: ipData });

      const addr = ipData.ipv4;
      apiFetch<GeoResponse>(API_CONFIG.endpoints.geo(addr)).then(
        (value) => isMounted && setGeo({ status: 'ready', value }),
        () => isMounted && setGeo({ status: 'error' }),
      );
      apiFetch<SecurityResponse>(API_CONFIG.endpoints.security(addr)).then(
        (value) => isMounted && setSecurity({ status: 'ready', value }),
        () => isMounted && setSecurity({ status: 'error' }),
      );
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const g = geo.status === 'ready' ? geo.value : null;
  const s = security.status === 'ready' ? security.value : null;

  let privacy: Privacy | null = null;
  if (s) {
    if (s.isTor) privacy = { masked: true, via: 'Tor' };
    else if (s.isVPN) privacy = { masked: true, via: 'VPN' };
    else if (s.isProxy) privacy = { masked: true, via: 'Proxy' };
    else if (s.isHosting) privacy = { masked: true, via: 'Data center' };
    else privacy = { masked: false };
  }

  return {
    ip: ip.status === 'ready' ? ip.value.ipv4 : null,
    ipStatus: ip.status,
    ipError,
    geoStatus: geo.status,
    securityStatus: security.status,
    locationString: g ? [g.city, g.country].filter(Boolean).join(', ') || null : null,
    isp: g?.isp || null,
    privacy,
    retry,
  };
}
