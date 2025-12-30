import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, Terminal, Globe, Shield, Zap } from 'lucide-react';

const endpoints = [
  {
    method: 'GET',
    path: '/api/ip',
    description: 'Detect client IP address',
    response: { ipv4: '5.50.177.22', timestamp: '2025-12-29T13:27:40.560Z' }
  },
  {
    method: 'GET',
    path: '/api/geo/:ip',
    description: 'Get geolocation information for an IP address',
    response: {
      ip: '8.8.8.8',
      country: 'United States',
      countryCode: 'US',
      region: 'Virginia',
      city: 'Ashburn',
      lat: 39.03,
      lon: -77.5,
      timezone: 'America/New_York',
      isp: 'Google LLC'
    }
  },
  {
    method: 'GET',
    path: '/api/dns/:ip',
    description: 'Get DNS information (hostname, PTR records)',
    response: { ip: '1.1.1.1', hostname: 'one.one.one.one', ptrRecords: ['one.one.one.one'] }
  },
  {
    method: 'GET',
    path: '/api/security/:ip',
    description: 'Check security status (VPN, Proxy, Tor, Hosting detection)',
    response: {
      ip: '5.50.177.22',
      isVPN: false,
      isProxy: false,
      isTor: false,
      isHosting: false,
      asn: 'AS5410 Bouygues Telecom SA',
      org: 'Bouygues Telecom SA'
    }
  },
  {
    method: 'GET',
    path: '/api/headers',
    description: 'Get HTTP headers of the request',
    response: {
      'user-agent': 'Mozilla/5.0...',
      'accept-language': 'en-US,en;q=0.9',
      'cf-connecting-ip': '5.50.177.22'
    }
  }
];

const codeExamples = {
  curl: `# Get your IP
curl https://api.ippriv.com/api/ip

# Get geolocation
curl https://api.ippriv.com/api/geo/8.8.8.8

# Get DNS info
curl https://api.ippriv.com/api/dns/1.1.1.1

# Security check
curl https://api.ippriv.com/api/security/5.50.177.22`,
  
  javascript: `// Using fetch
const getIPInfo = async () => {
  const ipRes = await fetch('https://api.ippriv.com/api/ip');
  const { ipv4 } = await ipRes.json();
  
  const geoRes = await fetch(\`https://api.ippriv.com/api/geo/\${ipv4}\`);
  const geo = await geoRes.json();
  
  const secRes = await fetch(\`https://api.ippriv.com/api/security/\${ipv4}\`);
  const security = await secRes.json();
  
  return { ipv4, geo, security };
};

getIPInfo().then(data => console.log(data));`,
  
  python: `import requests

response = requests.get('https://api.ippriv.com/api/ip')
ip_data = response.json()
ipv4 = ip_data['ipv4']

geo_response = requests.get(f'https://api.ippriv.com/api/geo/{ipv4}')
geo = geo_response.json()

sec_response = requests.get(f'https://api.ippriv.com/api/security/{ipv4}')
security = sec_response.json()

print(f"IP: {ipv4}")
print(f"Location: {geo['city']}, {geo['country']}")
print(f"ISP: {geo['isp']}")
print(f"VPN: {security['isVPN']}")`
};

export default function APIDocsContent() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/30">
      <section className="relative pt-32 pb-20 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">API Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              IPPriv API
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Free, fast, and privacy-focused IP geolocation API. No authentication required.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">~50ms</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-xl bg-card border border-border">
              <div className="p-3 rounded-lg bg-primary/10">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">Free</div>
                <div className="text-sm text-muted-foreground">No API Key Required</div>
              </div>
            </div>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-xl font-semibold mb-4">Base URL</h3>
              <code className="block px-4 py-3 rounded-lg bg-muted text-foreground font-mono text-sm">
                https://api.ippriv.com
              </code>
              
              <h3 className="text-xl font-semibold mb-4 mt-8">Authentication</h3>
              <p className="text-muted-foreground">
                No authentication required. All endpoints are publicly accessible.
              </p>
              
              <h3 className="text-xl font-semibold mb-4 mt-8">Rate Limiting</h3>
              <p className="text-muted-foreground">
                <strong>100 requests per hour</strong> per IP address.
              </p>
              
              <h3 className="text-xl font-semibold mb-4 mt-8">CORS</h3>
              <p className="text-muted-foreground">
                CORS enabled for all origins. Call the API directly from frontend.
              </p>
            </div>
          </motion.div>

          {/* Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-6">Endpoints</h2>
            <div className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold">
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono">{endpoint.path}</code>
                  </div>
                  <p className="text-muted-foreground mb-4">{endpoint.description}</p>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Response Example</span>
                      <button
                        onClick={() => copyCode(JSON.stringify(endpoint.response, null, 2), `endpoint-${index}`)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        {copiedCode === `endpoint-${index}` ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <pre className="p-4 rounded-lg bg-muted text-foreground font-mono text-sm overflow-x-auto">
{JSON.stringify(endpoint.response, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Code Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-6">Code Examples</h2>
            
            {/* cURL */}
            <div className="mb-6 p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">cURL</h3>
              </div>
              <div className="relative">
                <button
                  onClick={() => copyCode(codeExamples.curl, 'curl')}
                  className="absolute top-2 right-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {copiedCode === 'curl' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <pre className="p-4 rounded-lg bg-muted text-foreground font-mono text-sm overflow-x-auto">
{codeExamples.curl}
                </pre>
              </div>
            </div>

            {/* JavaScript */}
            <div className="mb-6 p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">JavaScript</h3>
              </div>
              <div className="relative">
                <button
                  onClick={() => copyCode(codeExamples.javascript, 'javascript')}
                  className="absolute top-2 right-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {copiedCode === 'javascript' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <pre className="p-4 rounded-lg bg-muted text-foreground font-mono text-sm overflow-x-auto">
{codeExamples.javascript}
                </pre>
              </div>
            </div>

            {/* Python */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Python</h3>
              </div>
              <div className="relative">
                <button
                  onClick={() => copyCode(codeExamples.python, 'python')}
                  className="absolute top-2 right-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {copiedCode === 'python' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <pre className="p-4 rounded-lg bg-muted text-foreground font-mono text-sm overflow-x-auto">
{codeExamples.python}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Error Handling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Error Handling</h2>
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-muted-foreground mb-4">
                The API uses standard HTTP status codes. Errors return JSON:
              </p>
              <pre className="p-4 rounded-lg bg-muted text-foreground font-mono text-sm overflow-x-auto mb-6">
{`{
  "error": "Invalid IP address format"
}`}
              </pre>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <code className="px-2 py-1 rounded bg-green-500/10 text-green-500 font-mono text-sm">200</code>
                  <span className="text-sm text-muted-foreground">Success</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 font-mono text-sm">400</code>
                  <span className="text-sm text-muted-foreground">Bad Request (invalid IP format)</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="px-2 py-1 rounded bg-orange-500/10 text-orange-500 font-mono text-sm">429</code>
                  <span className="text-sm text-muted-foreground">Rate Limit Exceeded</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="px-2 py-1 rounded bg-red-500/10 text-red-500 font-mono text-sm">500</code>
                  <span className="text-sm text-muted-foreground">Internal Server Error</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
