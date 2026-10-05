import { motion } from 'framer-motion';
import { Copy, Check, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';
import { useIPData, type IPErrorKind, type Privacy } from '@/hooks/useIPData';
import { Skeleton } from '@/components/ui/skeleton';

const ERROR_MESSAGES: Record<IPErrorKind, string> = {
  'rate-limit': 'Too many lookups from your network in the last hour. Wait a few minutes, then try again.',
  timeout: 'The lookup service took too long to respond. Your connection may be slow or the service busy.',
  'no-public-ip': 'Your connection did not report a public IP address.',
  network: 'The lookup service could not be reached. Check your connection, or a content blocker may be stopping the request.',
};

function Row({ label, status, children }: { label: string; status: 'loading' | 'ready' | 'error'; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-3 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-foreground">
        {status === 'loading' && <Skeleton className="ml-auto h-4 w-32" aria-label="Loading" />}
        {status === 'error' && <span className="font-normal text-muted-foreground">Unavailable</span>}
        {status === 'ready' && children}
      </dd>
    </div>
  );
}

function privacyLabel(p: Privacy) {
  if (!p.masked) return 'None detected';
  if (p.via === 'Data center') return 'Data center IP';
  return `${p.via} detected`;
}

const HeroSection = () => {
  const [copied, setCopied] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { ip, ipStatus, ipError, geoStatus, securityStatus, locationString, isp, privacy, retry } = useIPData();

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY < 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCopy = () => {
    if (!ip || !navigator.clipboard) return;
    navigator.clipboard.writeText(ip).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => console.error('Copy failed:', err),
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 geometric-pattern" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[1.75rem] sm:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight text-balance"
          >
            What Is My IP Address?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto text-balance"
          >
            Every website you visit sees this address. Here is what it reveals about you.
          </motion.p>

          {/* IP readout */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card rounded-2xl p-5 sm:p-8 max-w-md mx-auto mb-8 text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Your IP address</span>
              <button
                onClick={handleCopy}
                disabled={!ip}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Copy IP address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                )}
              </button>
            </div>

            <span className="sr-only" aria-live="polite">
              {copied ? 'IP address copied to clipboard' : ''}
            </span>

            {ipStatus === 'loading' && (
              <div className="flex items-center gap-3 py-5" role="status">
                <Loader2 className="w-5 h-5 text-primary animate-spin" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Detecting your IP address...</p>
              </div>
            )}

            {ipStatus === 'error' && ipError && (
              <div className="py-4" role="alert">
                <p className="font-medium text-foreground">We couldn't detect your IP address.</p>
                <p className="mt-1 text-sm text-muted-foreground">{ERROR_MESSAGES[ipError]}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 text-sm font-medium">
                  <button onClick={retry} className="inline-flex min-h-11 items-center text-primary hover:underline underline-offset-4">
                    Try again
                  </button>
                  <a href="/ip-lookup" className="inline-flex min-h-11 items-center text-primary hover:underline underline-offset-4">
                    Look up an IP by hand
                  </a>
                </div>
              </div>
            )}

            {ipStatus === 'ready' && ip && (
              <>
                <div
                  className={`mt-2 mb-5 font-mono font-semibold text-foreground break-words ${ip.includes(':') ? 'text-base sm:text-lg' : 'text-3xl sm:text-4xl'}`}
                >
                  {/* IPv6: only allow line breaks after a colon, never inside a group */}
                  {ip.split(':').map((group, i, all) => (
                    <span key={i}>
                      {group}
                      {i < all.length - 1 && <>:<wbr /></>}
                    </span>
                  ))}
                </div>

                <dl className="divide-y divide-border/60 rounded-lg bg-secondary/50">
                  <Row label="Location" status={geoStatus === 'ready' && !locationString ? 'error' : geoStatus}>
                    {locationString}
                  </Row>
                  <Row label="Provider" status={geoStatus === 'ready' && !isp ? 'error' : geoStatus}>
                    <span className="break-words">{isp}</span>
                  </Row>
                  <Row label="VPN / proxy" status={securityStatus}>
                    {privacy && privacyLabel(privacy)}
                  </Row>
                </dl>

                {privacy && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {privacy.masked
                      ? 'Sites see this connection, not your real provider or location.'
                      : 'Sites can see your real provider and approximate location.'}{' '}
                    {!privacy.masked && (
                      <a href="/blog/hide-your-ip-address" className="font-medium text-primary hover:underline underline-offset-4">
                        How to hide it
                      </a>
                    )}
                  </p>
                )}
              </>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3"
          >
            <a
              href="/ip-lookup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity duration-200"
            >
              Look up an IP
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="/api-docs"
              className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              API Docs
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isAtTop ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
