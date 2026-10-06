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

  // Quote every field so values with commas (ISP names, PTR lists) stay in one column
  const cell = (value: unknown) => `"${String(value ?? 'N/A').replace(/"/g, '""')}"`;
  const row = (...values: unknown[]) => values.map(cell).join(',') + '\n';

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
      csv += row(ip, geo.country, geo.countryCode, geo.region, geo.city, geo.lat, geo.lon, geo.timezone, geo.isp);
    } else {
      csv += `No geolocation data available\n`;
    }
    csv += `\n`;

    // DNS Section
    csv += `DNS INFORMATION\n`;
    if (dns) {
      csv += `Hostname,PTR Records\n`;
      csv += row(dns.hostname || 'N/A', dns.ptrRecords?.join('; ') || 'N/A');
    } else {
      csv += `No DNS data available\n`;
    }
    csv += `\n`;

    // Security Section
    csv += `SECURITY STATUS\n`;
    if (security) {
      csv += `VPN,Proxy,Tor,Hosting/Datacenter,ASN,Organization\n`;
      csv += row(security.isVPN, security.isProxy, security.isTor, security.isHosting, security.asn, security.org);
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

  // Share a plain ?ip= link: the result is looked up live, nothing is embedded in the URL
  const shareLink = () => {
    const shareUrl = `${window.location.origin}/ip-lookup?ip=${encodeURIComponent(ip)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const button =
    'inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors';

  return (
    <>
      <button type="button" onClick={shareLink} className={button}>
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Link copied' : 'Share link'}
      </button>
      <button type="button" onClick={exportJSON} className={button}>
        <Download className="h-3.5 w-3.5" />
        JSON
      </button>
      <button type="button" onClick={exportCSV} className={button}>
        <Download className="h-3.5 w-3.5" />
        CSV
      </button>
    </>
  );
}
