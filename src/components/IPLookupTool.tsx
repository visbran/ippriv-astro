import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Globe, Shield, Server, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import LocationMap from './LocationMap';
import ExportActions from './ExportActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { API_CONFIG, apiFetch } from '@/config/api';
import type { GeoResponse, DNSResponse, SecurityResponse } from '@/types/api';

interface LookupResult {
  ip: string;
  geo: GeoResponse | null;
  dns: DNSResponse | null;
  security: SecurityResponse | null;
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

const SecurityItem = ({ label, detected }: { label: string; detected: boolean }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
    <span className="text-foreground">{label}</span>
    {detected ? (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Detected
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600/30 bg-green-500/10">
        <CheckCircle className="h-3 w-3" />
        Clear
      </Badge>
    )}
  </div>
);

export default function IPLookupTool() {
  const [ipInput, setIpInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  // Load shared data from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('share');
    
    if (shareData) {
      try {
        const decoded = JSON.parse(atob(shareData));
        setResult({
          ip: decoded.ip,
          geo: decoded.geo,
          dns: null,
          security: decoded.security,
        });
        setIpInput(decoded.ip);
      } catch (err) {
        console.error('Failed to decode shared data:', err);
      }
    }
  }, []);

  const isValidIP = (ip: string) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    
    if (ipv4Regex.test(ip)) {
      const parts = ip.split('.').map(Number);
      return parts.every(part => part >= 0 && part <= 255);
    }
    return ipv6Regex.test(ip);
  };

  const handleLookup = async () => {
    const trimmedIP = ipInput.trim();
    
    if (!trimmedIP) {
      setError('Please enter an IP address');
      return;
    }

    if (!isValidIP(trimmedIP)) {
      setError('Please enter a valid IP address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [geoData, dnsData, securityData] = await Promise.all([
        apiFetch<GeoResponse>(API_CONFIG.endpoints.geo(trimmedIP)).catch(() => null),
        apiFetch<DNSResponse>(API_CONFIG.endpoints.dns(trimmedIP)).catch(() => null),
        apiFetch<SecurityResponse>(API_CONFIG.endpoints.security(trimmedIP)).catch(() => null),
      ]);

      setResult({
        ip: trimmedIP,
        geo: geoData,
        dns: dnsData,
        security: securityData,
      });
    } catch (err) {
      setError('Failed to lookup IP address. Please try again.');
      console.error('IP Lookup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          IP Address Lookup
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get detailed information about any IP address including location, DNS records, and security status.
        </p>
      </motion.div>

      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>
          <Button 
            onClick={handleLookup} 
            disabled={isLoading}
            className="h-14 px-8 text-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Lookup'
            )}
          </Button>
        </div>
        {error && (
          <p className="text-destructive mt-3 text-sm">{error}</p>
        )}
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* IP Badge */}
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-lg px-6 py-2">
              <Globe className="h-5 w-5 mr-2" />
              {result.ip}
            </Badge>
            
            {/* Export Actions */}
            <ExportActions
              ip={result.ip}
              geo={result.geo}
              dns={result.dns}
              security={result.security}
            />
          </div>

          {/* Map and Location Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            {result.geo && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <LocationMap
                      lat={result.geo.lat}
                      lng={result.geo.lon}
                      location={`${result.geo.city}, ${result.geo.country}`}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.geo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Country" value={result.geo.country} />
                    <InfoItem label="Country Code" value={result.geo.countryCode} />
                    <InfoItem label="Region" value={result.geo.region} />
                    <InfoItem label="City" value={result.geo.city} />
                    <InfoItem label="Latitude" value={result.geo.lat.toString()} />
                    <InfoItem label="Longitude" value={result.geo.lon.toString()} />
                    <InfoItem label="Timezone" value={result.geo.timezone} />
                    {result.geo.isp && (
                      <InfoItem label="ISP" value={result.geo.isp} />
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Location data unavailable</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* DNS and Security Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* DNS Info */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Server className="h-5 w-5 text-primary" />
                  DNS Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.dns ? (
                  <div className="space-y-4">
                    <InfoItem label="Hostname" value={result.dns.hostname || 'N/A'} />
                    {result.dns.ptrRecords && result.dns.ptrRecords.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">PTR Records</p>
                        <div className="space-y-1">
                          {result.dns.ptrRecords.map((record, index) => (
                            <Badge key={index} variant="outline" className="mr-2 mb-1">
                              {record}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">DNS data unavailable</p>
                )}
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.security ? (
                  <div className="space-y-3">
                    <SecurityItem label="VPN" detected={result.security.isVPN} />
                    <SecurityItem label="Proxy" detected={result.security.isProxy} />
                    <SecurityItem label="Tor" detected={result.security.isTor} />
                    <SecurityItem label="Hosting/Datacenter" detected={result.security.isHosting} />
                  </div>
                ) : (
                  <p className="text-muted-foreground">Security data unavailable</p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-16"
        >
          <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enter an IP address above to get started
          </p>
        </motion.div>
      )}
    </div>
  );
}
