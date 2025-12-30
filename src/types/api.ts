/**
 * TypeScript Types for IP Privacy API
 * 
 * Matching the ippriv backend API responses
 */

/**
 * IP Detection Response
 * GET /api/ip
 */
export interface IPResponse {
  ipv4: string;
  ipv6?: string;
  timestamp: string;
}

/**
 * Geolocation Response
 * GET /api/geo/:ip
 */
export interface GeoResponse {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  isp?: string;
}

/**
 * DNS Information Response
 * GET /api/dns/:ip
 */
export interface DNSResponse {
  ip: string;
  hostname: string;
  ptrRecords?: string[];
}

/**
 * Security Check Response
 * GET /api/security/:ip
 */
export interface SecurityResponse {
  ip: string;
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
  isHosting: boolean;
}

/**
 * Combined IP Data
 * Used in the UI
 */
export interface IPData {
  // IP Info
  ipv4: string;
  ipv6?: string;
  timestamp: string;
  
  // Geolocation
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  isp?: string;
  
  // DNS
  hostname: string;
  ptrRecords?: string[];
  
  // Security
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
  isHosting: boolean;
}

/**
 * Loading states for each data type
 */
export interface IPDataLoadingState {
  ip: boolean;
  geo: boolean;
  dns: boolean;
  security: boolean;
}

/**
 * Error states for each data type
 */
export interface IPDataErrorState {
  ip: Error | null;
  geo: Error | null;
  dns: Error | null;
  security: Error | null;
}
