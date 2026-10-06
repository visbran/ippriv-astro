import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const BASE_URL = 'https://api.ippriv.com';

const endpoints = [
  {
    id: 'ip',
    path: '/api/ip',
    description: "Returns the caller's public IP address.",
    response: { ipv4: '5.50.177.22', timestamp: '2026-10-06T13:27:40.560Z' },
  },
  {
    id: 'geo',
    path: '/api/geo/:ip',
    description: 'Geolocation and ISP for an IPv4 or IPv6 address.',
    tryIp: '8.8.8.8',
    response: {
      ip: '8.8.8.8',
      country: 'United States',
      countryCode: 'US',
      region: 'Virginia',
      city: 'Ashburn',
      lat: 39.03,
      lon: -77.5,
      timezone: 'America/New_York',
      isp: 'Google LLC',
    },
  },
  {
    id: 'dns',
    path: '/api/dns/:ip',
    description: 'Reverse DNS: hostname and PTR records.',
    tryIp: '1.1.1.1',
    response: { ip: '1.1.1.1', hostname: 'one.one.one.one', ptrRecords: ['one.one.one.one'] },
  },
  {
    id: 'security',
    path: '/api/security/:ip',
    description: 'VPN, proxy, Tor and hosting detection, with ASN and organization.',
    tryIp: '8.8.8.8',
    response: {
      ip: '8.8.8.8',
      isVPN: false,
      isProxy: true,
      isTor: false,
      isHosting: true,
      asn: 'AS15169 Google LLC',
      org: 'Google Public DNS',
    },
  },
  {
    id: 'headers',
    path: '/api/headers',
    description: 'HTTP headers of your request, as the API received them.',
    response: {
      'user-agent': 'Mozilla/5.0...',
      'accept-language': 'en-US,en;q=0.9',
      'cf-connecting-ip': '5.50.177.22',
    },
  },
];

const examples = [
  {
    id: 'curl',
    label: 'cURL',
    code: `# Your IP
curl ${BASE_URL}/api/ip

# Geolocation
curl ${BASE_URL}/api/geo/8.8.8.8

# Reverse DNS
curl ${BASE_URL}/api/dns/1.1.1.1

# VPN, proxy and Tor detection
curl ${BASE_URL}/api/security/8.8.8.8`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    code: `const BASE = '${BASE_URL}';

async function getIPInfo() {
  const { ipv4 } = await fetch(\`\${BASE}/api/ip\`).then((r) => r.json());

  const [geo, security] = await Promise.all([
    fetch(\`\${BASE}/api/geo/\${ipv4}\`).then((r) => r.json()),
    fetch(\`\${BASE}/api/security/\${ipv4}\`).then((r) => r.json()),
  ]);

  return { ipv4, geo, security };
}

getIPInfo().then(console.log);`,
  },
  {
    id: 'python',
    label: 'Python',
    code: `import requests

BASE = "${BASE_URL}"

ipv4 = requests.get(f"{BASE}/api/ip").json()["ipv4"]
geo = requests.get(f"{BASE}/api/geo/{ipv4}").json()
security = requests.get(f"{BASE}/api/security/{ipv4}").json()

print(f"IP: {ipv4}")
print(f"Location: {geo['city']}, {geo['country']}")
print(f"ISP: {geo['isp']}")
print(f"VPN: {security['isVPN']}")`,
  },
];

const statuses = [
  { code: '200', text: 'Success' },
  { code: '400', text: 'Missing or invalid IP address' },
  { code: '429', text: 'Rate limit exceeded (see Retry-After)' },
  { code: '500', text: 'Upstream or server error' },
];

const nav = [
  { href: '#getting-started', label: 'Getting started' },
  { href: '#rate-limits', label: 'Rate limits' },
  ...endpoints.map((e) => ({ href: `#endpoint-${e.id}`, label: e.path })),
  { href: '#examples', label: 'Code examples' },
  { href: '#errors', label: 'Errors' },
];

function CodeBlock({ code, id, copied, onCopy }: { code: string; id: string; copied: boolean; onCopy: (code: string, id: string) => void }) {
  return (
    <div className="relative rounded-lg border border-border bg-[hsl(222_18%_7%)]">
      <button
        type="button"
        onClick={() => onCopy(code, id)}
        aria-label="Copy code"
        className="absolute right-2 top-2 rounded-md p-2 text-[hsl(218_11%_60%)] hover:bg-white/10 hover:text-white transition-colors"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed text-[hsl(214_20%_85%)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function APIDocsContent() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [tab, setTab] = useState(examples[0].id);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const active = examples.find((e) => e.id === tab) ?? examples[0];

  return (
    <div className="section-container pb-20">
      <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {[
          ['Auth', 'No API key'],
          ['Limit', '100 req / hour / IP'],
          ['Format', 'JSON over HTTPS'],
          ['CORS', 'All origins'],
        ].map(([k, v]) => (
          <div key={k} className="bg-card px-4 py-3">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label="API documentation" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-border">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`-ml-px block border-l border-transparent py-1 pl-3 text-sm text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors ${
                    item.label.startsWith('/') ? 'font-mono text-[13px]' : ''
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 max-w-3xl space-y-16">
          <section id="getting-started" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Getting started</h2>
            <p className="mt-3 text-foreground/85 leading-relaxed">
              Send a GET request. No key, no signup. CORS is open, so you can call the API straight from the browser.
            </p>
            <div className="mt-5">
              <CodeBlock code={`curl ${BASE_URL}/api/geo/8.8.8.8`} id="quick" copied={copiedCode === 'quick'} onCopy={copyCode} />
            </div>
          </section>

          <section id="rate-limits" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Rate limits</h2>
            <p className="mt-3 text-foreground/85 leading-relaxed">
              100 requests per hour per IP address, over a sliding window. Every response carries the current state:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><code className="font-mono text-[13px] text-foreground">X-RateLimit-Limit</code> <span className="text-muted-foreground">requests allowed per window</span></li>
              <li><code className="font-mono text-[13px] text-foreground">X-RateLimit-Remaining</code> <span className="text-muted-foreground">requests left</span></li>
              <li><code className="font-mono text-[13px] text-foreground">X-RateLimit-Reset</code> <span className="text-muted-foreground">Unix time when the window frees up</span></li>
            </ul>
            <p className="mt-4 text-foreground/85 leading-relaxed">
              Above the limit, the API answers <code className="font-mono text-[13px]">429</code> with a{' '}
              <code className="font-mono text-[13px]">Retry-After</code> header in seconds.
            </p>
          </section>

          <section aria-labelledby="endpoints-heading">
            <h2 id="endpoints-heading" className="text-2xl font-semibold tracking-tight text-foreground">Endpoints</h2>
            <div className="mt-6 space-y-10">
              {endpoints.map((endpoint) => (
                <article key={endpoint.id} id={`endpoint-${endpoint.id}`} className="scroll-mt-24">
                  <h3 className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-xs font-semibold text-accent-foreground">GET</span>
                    <code className="font-mono text-base text-foreground">{endpoint.path}</code>
                  </h3>
                  <p className="mt-2 text-foreground/85">
                    {endpoint.description}
                    {endpoint.tryIp && (
                      <>
                        {' '}
                        <a href={`/ip-lookup?ip=${endpoint.tryIp}`} className="text-primary underline underline-offset-4">
                          Try {endpoint.tryIp} in the lookup tool
                        </a>
                      </>
                    )}
                  </p>
                  <div className="mt-3">
                    <CodeBlock
                      code={JSON.stringify(endpoint.response, null, 2)}
                      id={endpoint.id}
                      copied={copiedCode === endpoint.id}
                      onCopy={copyCode}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="examples" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Code examples</h2>
            <div role="tablist" aria-label="Language" className="mt-5 flex gap-1 border-b border-border">
              {examples.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  role="tab"
                  id={`tab-${e.id}`}
                  aria-selected={tab === e.id}
                  aria-controls="example-panel"
                  onClick={() => setTab(e.id)}
                  className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                    tab === e.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
            <div id="example-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="mt-4">
              <CodeBlock code={active.code} id={`ex-${active.id}`} copied={copiedCode === `ex-${active.id}`} onCopy={copyCode} />
            </div>
          </section>

          <section id="errors" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Errors</h2>
            <p className="mt-3 text-foreground/85 leading-relaxed">Errors use standard HTTP status codes and a JSON body:</p>
            <div className="mt-4">
              <CodeBlock code={`{\n  "error": "IP address is required"\n}`} id="err" copied={copiedCode === 'err'} onCopy={copyCode} />
            </div>
            <dl className="mt-5 divide-y divide-border rounded-lg border border-border">
              {statuses.map((s) => (
                <div key={s.code} className="flex gap-4 px-4 py-2.5 text-sm">
                  <dt className="w-10 font-mono text-foreground">{s.code}</dt>
                  <dd className="text-muted-foreground">{s.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
