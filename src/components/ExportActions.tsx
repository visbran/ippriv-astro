import { useState } from 'react';
import { Download, Link2, Check } from 'lucide-react';
import type { GeoResponse, DNSResponse, SecurityResponse } from '@/types/api';

interface ExportActionsProps {
  ip: string;
  geo: GeoResponse | null;
  dns: DNSResponse | null;
  security: SecurityResponse | null;
}

export default function ExportActions({ ip, geo, dns, security }: ExportActionsProps) {
  const [copied, setCopied] = useState(false);

  // Export JSON
  const exportJSON = () => {
    const data = {
      ip,
      geolocation: geo,
      dns,
      security,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ippriv-${ip}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const exportCSV = () => {
    let csv = '';

    // Header
    csv += `IPPriv Lookup Results\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Geolocation Section
    csv += `GEOLOCATION\n`;
    if (geo) {
      csv += `IP,Country,Country Code,Region,City,Latitude,Longitude,Timezone,ISP\n`;
      csv += `${ip},${geo.country},${geo.countryCode},${geo.region},${geo.city},${geo.lat},${geo.lon},${geo.timezone},${geo.isp || 'N/A'}\n`;
    } else {
      csv += `No geolocation data available\n`;
    }
    csv += `\n`;

    // DNS Section
    csv += `DNS INFORMATION\n`;
    if (dns) {
      csv += `Hostname,PTR Records\n`;
      csv += `${dns.hostname || 'N/A'},${dns.ptrRecords?.join('; ') || 'N/A'}\n`;
    } else {
      csv += `No DNS data available\n`;
    }
    csv += `\n`;

    // Security Section
    csv += `SECURITY STATUS\n`;
    if (security) {
      csv += `VPN,Proxy,Tor,Hosting/Datacenter,ASN,Organization\n`;
      csv += `${security.isVPN},${security.isProxy},${security.isTor},${security.isHosting},${security.asn || 'N/A'},${security.org || 'N/A'}\n`;
    } else {
      csv += `No security data available\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ippriv-${ip}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate shareable link
  const shareLink = () => {
    const data = {
      ip,
      geo: geo ? {
        country: geo.country,
        city: geo.city,
        lat: geo.lat,
        lon: geo.lon,
        isp: geo.isp
      } : null,
      security: security ? {
        isVPN: security.isVPN,
        isProxy: security.isProxy,
        isTor: security.isTor,
        isHosting: security.isHosting
      } : null
    };

    // Encode data to base64
    const encoded = btoa(JSON.stringify(data));
    const shareUrl = `${window.location.origin}/ip-lookup?share=${encoded}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* Export JSON Button */}
      <button
        onClick={exportJSON}
        className="group relative px-6 py-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 
                   hover:border-primary/50 hover:bg-card hover:shadow-lg transition-all duration-300
                   flex items-center gap-2.5 text-sm font-medium text-foreground"
      >
        <Download className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        <span>Export JSON</span>
      </button>

      {/* Export CSV Button */}
      <button
        onClick={exportCSV}
        className="group relative px-6 py-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 
                   hover:border-primary/50 hover:bg-card hover:shadow-lg transition-all duration-300
                   flex items-center gap-2.5 text-sm font-medium text-foreground"
      >
        <Download className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        <span>Export CSV</span>
      </button>

      {/* Share Link Button */}
      <button
        onClick={shareLink}
        className="group relative px-6 py-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 
                   hover:border-primary/50 hover:bg-card hover:shadow-lg transition-all duration-300
                   flex items-center gap-2.5 text-sm font-medium text-foreground"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-500 animate-scale-in" />
            <span className="text-green-600 dark:text-green-400">Link Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span>Share Link</span>
          </>
        )}
      </button>
    </div>
  );
}
