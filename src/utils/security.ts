// API Response Validation Utilities
// Validates API responses to prevent insecure deserialization

export interface IPResponse {
  ipv4: string;
  timestamp: string;
}

export interface GeoResponse {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
}

export interface DNSResponse {
  ip: string;
  hostname: string;
  ptrRecords: string[];
}

export interface SecurityResponse {
  ip: string;
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
  isHosting: boolean;
  asn?: string;
  org?: string;
}

// IP Address Validation (IPv4 and IPv6)
export const isValidIP = (ip: string): boolean => {
  // IPv4 regex
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;

  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  return isValidIPv6(ip);
};

// IPv6, full or compressed ("2001:4860::8888", "::1"); "::" may appear once
const isValidIPv6 = (ip: string): boolean => {
  if (!/^[0-9a-fA-F:]+$/.test(ip)) return false;
  const halves = ip.split('::');
  if (halves.length > 2) return false;
  const groupsOf = (s: string) => (s === '' ? [] : s.split(':'));
  const groups = [...groupsOf(halves[0]), ...(halves.length === 2 ? groupsOf(halves[1]) : [])];
  if (!groups.every((g) => /^[0-9a-fA-F]{1,4}$/.test(g))) return false;
  return halves.length === 2 ? groups.length < 8 : groups.length === 8;
};

// Validate IP Response
export const validateIPResponse = (data: unknown): data is IPResponse => {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Record<string, unknown>;
  
  return (
    typeof response.ipv4 === 'string' &&
    isValidIP(response.ipv4) &&
    typeof response.timestamp === 'string' &&
    !isNaN(Date.parse(response.timestamp))
  );
};

// Validate Geo Response
export const validateGeoResponse = (data: unknown): data is GeoResponse => {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Record<string, unknown>;
  
  return (
    typeof response.ip === 'string' &&
    isValidIP(response.ip) &&
    typeof response.country === 'string' &&
    typeof response.countryCode === 'string' &&
    typeof response.region === 'string' &&
    typeof response.city === 'string' &&
    typeof response.lat === 'number' &&
    typeof response.lon === 'number' &&
    typeof response.timezone === 'string' &&
    typeof response.isp === 'string'
  );
};

// Validate DNS Response
export const validateDNSResponse = (data: unknown): data is DNSResponse => {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Record<string, unknown>;
  
  return (
    typeof response.ip === 'string' &&
    isValidIP(response.ip) &&
    typeof response.hostname === 'string' &&
    Array.isArray(response.ptrRecords) &&
    response.ptrRecords.every(record => typeof record === 'string')
  );
};

// Validate Security Response
export const validateSecurityResponse = (data: unknown): data is SecurityResponse => {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Record<string, unknown>;
  
  return (
    typeof response.ip === 'string' &&
    isValidIP(response.ip) &&
    typeof response.isVPN === 'boolean' &&
    typeof response.isProxy === 'boolean' &&
    typeof response.isTor === 'boolean' &&
    typeof response.isHosting === 'boolean' &&
    (response.asn === undefined || typeof response.asn === 'string') &&
    (response.org === undefined || typeof response.org === 'string')
  );
};

// Sanitize user input (for IP lookup)
export const sanitizeIPInput = (input: string): string => {
  // Remove any non-IP characters
  return input.trim().replace(/[^0-9a-fA-F:.]/g, '');
};

// Rate limit tracker (client-side)
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 100;

export const checkRateLimit = (): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Remove old timestamps
  while (requestTimestamps.length > 0 && requestTimestamps[0] < windowStart) {
    requestTimestamps.shift();
  }
  
  const remaining = RATE_LIMIT_MAX - requestTimestamps.length;
  const allowed = remaining > 0;
  
  if (allowed) {
    requestTimestamps.push(now);
  }
  
  return { allowed, remaining };
};
