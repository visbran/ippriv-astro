import { motion, useReducedMotion } from 'framer-motion';
import { Copy, Check, ShieldCheck, ShieldAlert, ArrowRight, RotateCw } from 'lucide-react';
import { useState } from 'react';
import LocationMap from './LocationMap';
import { useIPData } from '@/hooks/useIPData';
import type { IPData } from '@/types/api';

const ease = [0.16, 1, 0.3, 1] as const;

function detectedFlags(data: IPData) {
  return [
    data.isVPN && 'VPN',
    data.isProxy && 'Proxy',
    data.isTor && 'Tor',
    data.isHosting && 'Hosting',
  ].filter(Boolean) as string[];
}

const ReadoutSkeleton = () => (
  <div className="animate-pulse" aria-hidden="true">
    <div className="h-9 w-56 rounded-md bg-muted mb-6" />
    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="h-3 w-16 rounded bg-muted mb-2" />
          <div className="h-4 w-28 rounded bg-muted" />
        </div>
      ))}
    </div>
  </div>
);

const HeroSection = () => {
  const [copied, setCopied] = useState(false);
  const { data, isLoading, error, locationString } = useIPData();
  const reduce = useReducedMotion();

  // Always animate to the visible state: SSR renders the initial style,
  // so an empty prop set under reduced motion would leave it hidden.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.6, delay, ease },
  });

  const handleCopy = () => {
    if (!data?.ipv4) return;
    navigator.clipboard.writeText(data.ipv4);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const flags = data ? detectedFlags(data) : [];
  const isLongIP = data?.ipv4.includes(':');

  return (
    <section className="pt-28 pb-12 md:pt-36 md:pb-16">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 items-center">
          {/* Message */}
          <div>
            <h1
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.05] text-foreground text-balance"
            >
              Free IP Lookup Tool.{' '}
              <span className="text-muted-foreground">Know Your IP Address.</span>
            </h1>

            <p
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-[46ch]"
            >
              Your public IP, location, ISP and VPN status, detected the moment this page loads. No account, no ads.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href="/ip-lookup"
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px transition-colors"
              >
                Try IP Lookup
                <ArrowRight className="w-4 h-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
              </a>
              <a
                href="/api-docs"
                className="inline-flex items-center justify-center px-5 py-3 text-[15px] font-medium rounded-md border border-border text-foreground hover:bg-secondary active:translate-y-px transition-colors"
              >
                View API Docs
              </a>
            </div>
          </div>

          {/* Live readout */}
          <motion.div
            {...enter(0.1)}
            className="rounded-lg border border-border bg-card overflow-hidden shadow-[0_24px_48px_-24px_hsl(var(--foreground)/0.18)]"
          >
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm text-muted-foreground">Your IP address</h2>
                <button
                  onClick={handleCopy}
                  disabled={!data}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  aria-label="Copy IP address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div aria-live="polite" aria-busy={isLoading}>
                {isLoading && <ReadoutSkeleton />}

                {error && !isLoading && (
                  <div className="py-2">
                    <p className="text-sm text-destructive">
                      We could not detect your IP address. Your network or an extension may be blocking the request.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Try again
                    </button>
                  </div>
                )}

                {data && !isLoading && !error && (
                  <>
                    <p
                      className={`font-mono font-medium tracking-tight text-foreground break-all ${
                        isLongIP ? 'text-lg sm:text-xl' : 'text-3xl sm:text-4xl'
                      }`}
                    >
                      {data.ipv4}
                    </p>

                    <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Location</dt>
                        <dd className="mt-0.5 text-foreground">{locationString}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">ISP</dt>
                        <dd className="mt-0.5 text-foreground truncate" title={data.isp}>{data.isp || 'Unknown'}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Timezone</dt>
                        <dd className="mt-0.5 font-mono text-[13px] text-foreground">{data.timezone}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Coordinates</dt>
                        <dd className="mt-0.5 font-mono text-[13px] text-foreground">
                          {data.lat.toFixed(2)}, {data.lon.toFixed(2)}
                        </dd>
                      </div>
                    </dl>

                    <div
                      className={`mt-6 flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm ${
                        flags.length ? 'bg-destructive/10 text-destructive' : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      {flags.length ? (
                        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                      )}
                      <span>
                        {flags.length
                          ? `Detected: ${flags.join(', ')}. Sites see this IP as a shared or masked connection.`
                          : 'No VPN, proxy or Tor detected. Sites see this as a direct connection.'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="h-40 sm:h-44 border-t border-border bg-muted">
              {data && !isLoading && (
                <LocationMap lat={data.lat} lng={data.lon} location={locationString || undefined} embedded />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
