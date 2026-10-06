import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Copy, Check, ShieldCheck, ShieldAlert, Server, RotateCw } from 'lucide-react';
import LocationMap from './LocationMap';
import ExportActions from './ExportActions';
import { API_CONFIG, apiFetch } from '@/config/api';
import type { IPResponse, GeoResponse, DNSResponse, SecurityResponse } from '@/types/api';

interface LookupResult {
  ip: string;
  isOwnIP: boolean;
  geo: GeoResponse | null;
  dns: DNSResponse | null;
  security: (SecurityResponse & { asn?: string; org?: string }) | null;
}

function isValidIP(value: string): boolean {
  const ip = value.trim();
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    return ip.split('.').every((part) => Number(part) <= 255 && String(Number(part)) === part);
  }
  if (!ip.includes(':')) return false;
  // Let the URL parser validate IPv6 syntax (handles :: compression and embedded IPv4)
  try {
    new URL(`http://[${ip}]/`);
    return true;
  } catch {
    return false;
  }
}

function setIpParam(ip: string | null) {
  const url = new URL(window.location.href);
  url.searchParams.delete('share');
  if (ip) url.searchParams.set('ip', ip);
  else url.searchParams.delete('ip');
  window.history.replaceState(window.history.state, '', url);
}

const Row = ({ label, children, mono = false }: { label: string; children: React.ReactNode; mono?: boolean }) => (
  <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-2.5 border-b border-border last:border-b-0">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className={`text-sm text-foreground break-words ${mono ? 'font-mono text-[13px]' : ''}`}>{children}</dd>
  </div>
);

const Signal = ({ label, detected }: { label: string; detected: boolean }) => (
  <li className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
    <span className="text-sm text-foreground">{label}</span>
    <span className={`text-xs font-medium ${detected ? 'text-destructive' : 'text-muted-foreground'}`}>
      {detected ? 'Detected' : 'Not detected'}
    </span>
  </li>
);

function Verdict({ security }: { security: NonNullable<LookupResult['security']> }) {
  // Datacenter ranges are often also tagged as proxies (public resolvers, cloud hosts): treat
  // proxy + hosting as a hosting verdict unless VPN or Tor is also detected.
  const proxyIsHosting = security.isProxy && security.isHosting;
  const masked = [
    security.isVPN && 'VPN',
    security.isProxy && !proxyIsHosting && 'proxy',
    security.isTor && 'Tor exit node',
  ].filter(Boolean) as string[];

  if (masked.length) {
    return (
      <div className="flex items-start gap-2.5 rounded-md bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          Flagged as {masked.join(', ')}. The real user behind this IP is likely somewhere else.
          {security.isHosting && ' It also belongs to a hosting or datacenter network.'}
        </span>
      </div>
    );
  }
  if (security.isHosting) {
    return (
      <div className="flex items-start gap-2.5 rounded-md bg-secondary px-3.5 py-3 text-sm text-foreground">
        <Server className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span>
          Hosting or datacenter network. Typical for servers, cloud services and public resolvers, and for many VPNs.
          {proxyIsHosting && ' Also flagged as a proxy, which is common for datacenter addresses.'}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2.5 rounded-md bg-accent px-3.5 py-3 text-sm text-accent-foreground">
      <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
      <span>No VPN, proxy, Tor or hosting signal detected.</span>
    </div>
  );
}

const ResultSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-6 sm:p-8 animate-pulse" aria-hidden="true">
    <div className="h-3 w-24 rounded bg-muted" />
    <div className="mt-3 h-9 w-56 rounded-md bg-muted" />
    <div className="mt-6 h-11 rounded-md bg-muted" />
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-muted" />
        ))}
      </div>
      <div className="h-64 rounded-md bg-muted" />
    </div>
  </div>
);

export default function IPLookupTool() {
  const [ipInput, setIpInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [copied, setCopied] = useState(false);

  const lookup = useCallback(async (ip: string, isOwnIP = false) => {
    setIsLoading(true);
    setError(null);

    const [geo, dns, security] = await Promise.all([
      apiFetch<GeoResponse>(API_CONFIG.endpoints.geo(ip)).catch(() => null),
      apiFetch<DNSResponse>(API_CONFIG.endpoints.dns(ip)).catch(() => null),
      apiFetch<SecurityResponse>(API_CONFIG.endpoints.security(ip)).catch(() => null),
    ]);

    if (!geo && !dns && !security) {
      setResult(null);
      setError(
        'The lookup failed. The API may be rate limited (100 requests per hour) or unreachable. Try again in a moment.'
      );
    } else {
      setResult({ ip, isOwnIP, geo, dns, security });
      if (!isOwnIP) setIpParam(ip);
    }
    setIsLoading(false);
  }, []);

  const detectOwnIP = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { ipv4 } = await apiFetch<IPResponse>(API_CONFIG.endpoints.ip);
      if (!ipv4 || !isValidIP(ipv4)) throw new Error('No public IP');
      await lookup(ipv4, true);
    } catch {
      setIsLoading(false);
      setError('We could not detect your IP address. Enter any IP address above to look it up.');
    }
  }, [lookup]);

  // On load: ?ip= deep link, legacy ?share= link (re-run live, never trust the payload), or the visitor's own IP
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let target = params.get('ip');
    const share = params.get('share');
    if (!target && share) {
      try {
        target = JSON.parse(atob(share)).ip ?? null;
      } catch {
        target = null;
      }
    }

    if (target && isValidIP(target)) {
      setIpInput(target.trim());
      lookup(target.trim());
    } else {
      detectOwnIP();
    }
  }, [lookup, detectOwnIP]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ip = ipInput.trim();
    if (!ip) {
      setError('Enter an IPv4 address (like 8.8.8.8) or an IPv6 address.');
      return;
    }
    if (!isValidIP(ip)) {
      setError(`"${ip}" is not a valid IPv4 or IPv6 address.`);
      return;
    }
    lookup(ip);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const geo = result?.geo;
  const location = geo ? [geo.city, geo.region, geo.country].filter(Boolean).join(', ') : null;

  return (
    <div className="section-container">
      <header className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">IP Address Lookup</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Geolocation, ISP, reverse DNS and VPN or proxy status for any IPv4 or IPv6 address.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl" noValidate>
        <label htmlFor="ip-input" className="text-sm font-medium text-foreground">
          IP address
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="ip-input"
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="8.8.8.8 or 2001:4860:4860::8888"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              aria-invalid={Boolean(error && !result)}
              aria-describedby={error ? 'ip-error' : undefined}
              className="h-12 w-full rounded-md border border-input bg-card pl-10 pr-3 font-mono text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-[15px] font-medium text-primary-foreground hover:bg-primary/90 active:translate-y-px disabled:opacity-60 transition-colors"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Look up
          </button>
        </div>
        {error && (
          <p id="ip-error" role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      <div className="mt-10" aria-live="polite" aria-busy={isLoading}>
        {isLoading && <ResultSkeleton />}

        {!isLoading && !result && error && (
          <button
            type="button"
            onClick={() => (ipInput.trim() && isValidIP(ipInput) ? lookup(ipInput.trim()) : detectOwnIP())}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
            Try again
          </button>
        )}

        {!isLoading && result && (
          <section className="rounded-lg border border-border bg-card overflow-hidden" aria-label="Lookup result">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-sm text-muted-foreground">
                    {result.isOwnIP ? 'Your IP address' : 'Lookup result'}
                  </h2>
                  <p
                    className={`mt-1 font-mono font-medium tracking-tight text-foreground break-all ${
                      result.ip.includes(':') ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'
                    }`}
                  >
                    {result.ip}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy IP'}
                  </button>
                  <ExportActions ip={result.ip} geo={result.geo} dns={result.dns} security={result.security} />
                </div>
              </div>

              {result.security && (
                <div className="mt-6">
                  <Verdict security={result.security} />
                </div>
              )}
            </div>

            <div className="grid border-t border-border lg:grid-cols-2">
              <div className="p-6 sm:p-8 lg:border-r lg:border-border">
                <h3 className="text-sm font-medium text-foreground mb-2">Location and network</h3>
                <dl>
                  {geo ? (
                    <>
                      <Row label="Location">
                        {location}
                        {geo.countryCode && <span className="text-muted-foreground"> ({geo.countryCode})</span>}
                      </Row>
                      <Row label="Coordinates" mono>
                        {geo.lat.toFixed(4)}, {geo.lon.toFixed(4)}
                      </Row>
                      <Row label="Timezone" mono>{geo.timezone}</Row>
                      <Row label="ISP">{geo.isp || 'Unknown'}</Row>
                    </>
                  ) : (
                    <Row label="Location">Geolocation unavailable for this IP</Row>
                  )}
                  {result.security?.asn && <Row label="ASN" mono>{result.security.asn}</Row>}
                  {result.security?.org && <Row label="Organization">{result.security.org}</Row>}
                  <Row label="Hostname" mono>{result.dns?.hostname || 'No PTR record'}</Row>
                  {result.dns?.ptrRecords && result.dns.ptrRecords.length > 1 && (
                    <Row label="PTR records" mono>{result.dns.ptrRecords.join(', ')}</Row>
                  )}
                </dl>

                {result.security && (
                  <>
                    <h3 className="mt-8 text-sm font-medium text-foreground mb-3">Privacy signals</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      <Signal label="VPN" detected={result.security.isVPN} />
                      <Signal label="Proxy" detected={result.security.isProxy} />
                      <Signal label="Tor" detected={result.security.isTor} />
                      <Signal label="Hosting" detected={result.security.isHosting} />
                    </ul>
                  </>
                )}
              </div>

              <div className="relative min-h-[280px] border-t border-border bg-muted lg:border-t-0">
                {geo ? (
                  <div className="absolute inset-0">
                    <LocationMap key={result.ip} lat={geo.lat} lng={geo.lon} location={location || undefined} embedded />
                  </div>
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-muted-foreground">
                    No location to map
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
