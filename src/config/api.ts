/**
 * API Configuration
 * 
 * Backend: ippriv Hono API
 * Local: http://localhost:8787
 * Production: https://api.ippriv.com
 */

import {
  validateIPResponse,
  validateGeoResponse,
  validateDNSResponse,
  validateSecurityResponse,
  checkRateLimit,
  type IPResponse,
  type GeoResponse,
  type DNSResponse,
  type SecurityResponse,
} from '@/utils/security';

export const API_CONFIG = {
  // Base URL - change in .env for production
  baseURL: import.meta.env.PUBLIC_API_URL || 'https://api.ippriv.com',
  
  // Endpoints
  endpoints: {
    ip: '/api/ip',
    geo: (ip: string) => `/api/geo/${ip}`,
    dns: (ip: string) => `/api/dns/${ip}`,
    security: (ip: string) => `/api/security/${ip}`,
  },
  
  // Timeout
  timeout: 10000,
  
  // Retry config
  retry: {
    attempts: 3,
    delay: 1000,
  },
} as const;

/**
 * Rate Limit Error
 */
export class RateLimitError extends Error {
  constructor(public remaining: number) {
    super(`Rate limit exceeded. Please try again later.`);
    this.name = 'RateLimitError';
  }
}

/**
 * Validation Error
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Fetch wrapper with error handling and validation
 */
export async function apiFetch<T>(
  endpoint: string,
  validator?: (data: unknown) => data is T
): Promise<T> {
  // Check rate limit
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    throw new RateLimitError(rateLimit.remaining);
  }

  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response if validator provided
    if (validator && !validator(data)) {
      throw new ValidationError('Invalid API response format');
    }
    
    return data;
  } catch (error) {
    if (error instanceof RateLimitError || error instanceof ValidationError) {
      throw error;
    }
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}

/**
 * Typed API calls with validation
 */
export const api = {
  getIP: () => apiFetch<IPResponse>(API_CONFIG.endpoints.ip, validateIPResponse),
  
  getGeo: (ip: string) => apiFetch<GeoResponse>(
    API_CONFIG.endpoints.geo(ip),
    validateGeoResponse
  ),
  
  getDNS: (ip: string) => apiFetch<DNSResponse>(
    API_CONFIG.endpoints.dns(ip),
    validateDNSResponse
  ),
  
  getSecurity: (ip: string) => apiFetch<SecurityResponse>(
    API_CONFIG.endpoints.security(ip),
    validateSecurityResponse
  ),
};
