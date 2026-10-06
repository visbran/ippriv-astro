import { motion, useReducedMotion } from 'framer-motion';
import { Code, Lock, MapPin } from 'lucide-react';

// Same request and response as the /api/geo example on /api-docs.
const sampleRequest = 'curl https://api.ippriv.com/api/geo/8.8.8.8';
const sampleResponse = `{
  "ip": "8.8.8.8",
  "country": "United States",
  "countryCode": "US",
  "region": "Virginia",
  "city": "Ashburn",
  "lat": 39.03,
  "lon": -77.5,
  "timezone": "America/New_York",
  "isp": "Google LLC"
}`;

const lookupFields = [
  'Country',
  'Region',
  'City',
  'Coordinates',
  'Timezone',
  'ISP',
  'Hostname',
  'VPN',
  'Proxy',
  'Tor',
  'Hosting',
];

const FeaturesSection = () => {
  const reduce = useReducedMotion();

  // Always reveal to the visible state; reduced motion only drops the movement.
  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: reduce ? { duration: 0 } : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="features" className="py-20 md:py-28 scroll-mt-16">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Everything You Need for IP Lookup
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            One lookup returns location, network and privacy signals. The same data is open through a free API.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2">
          {/* Developer friendly: real request + response */}
          <motion.article
            {...reveal(0)}
            className="md:col-span-4 md:row-span-2 rounded-lg border border-border bg-card overflow-hidden flex flex-col"
          >
            <div className="p-6 sm:p-8">
              <Code className="w-5 h-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Developer Friendly</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed max-w-[52ch]">
                A plain JSON API with no key and no signup. One GET request per lookup.
              </p>
            </div>
            <div className="flex-1 flex flex-col justify-center border-t border-border bg-[hsl(222_18%_7%)] text-[13px] leading-relaxed font-mono overflow-x-auto">
              <p className="px-6 sm:px-8 pt-5 text-[hsl(168_72%_55%)] whitespace-nowrap">
                <span className="text-[hsl(218_11%_55%)] select-none">$ </span>
                {sampleRequest}
              </p>
              <pre className="px-6 sm:px-8 pt-3 pb-6 text-[hsl(214_20%_82%)]">{sampleResponse}</pre>
            </div>
          </motion.article>

          {/* Privacy first */}
          <motion.article
            {...reveal(0.08)}
            className="md:col-span-2 rounded-lg bg-accent text-accent-foreground p-6 sm:p-8"
          >
            <Lock className="w-5 h-5" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-semibold tracking-tight">Privacy First</h3>
            <p className="mt-2 leading-relaxed opacity-90">
              No account, no ads, no tracking cookies. API request logs are deleted after 30 days.
            </p>
            <a href="/privacy" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
              Read the privacy policy
            </a>
          </motion.article>

          {/* Instant lookup: fields returned */}
          <motion.article
            {...reveal(0.16)}
            className="md:col-span-2 rounded-lg border border-border bg-card p-6 sm:p-8"
          >
            <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Instant IP Lookup</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">IPv4 and IPv6. Every lookup returns:</p>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Fields returned by a lookup">
              {lookupFields.map((field) => (
                <li
                  key={field}
                  className="px-2 py-1 rounded-md border border-border font-mono text-xs text-muted-foreground"
                >
                  {field}
                </li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
