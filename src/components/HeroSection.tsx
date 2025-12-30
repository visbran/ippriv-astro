import { motion } from 'framer-motion';
import { Copy, Check, MapPin, Globe, Loader2 } from 'lucide-react';
import { useState } from 'react';
import LocationMap from './LocationMap';
import { useIPData } from '@/hooks/useIPData';

const HeroSection = () => {
  const [copied, setCopied] = useState(false);
  const { data, isLoading, error, locationString } = useIPData();

  const handleCopy = () => {
    if (!data?.ipv4) return;
    navigator.clipboard.writeText(data.ipv4);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 geometric-pattern" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Privacy-First IP Tools
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight text-balance"
          >
            Know Your IP.{' '}
            <span className="gradient-text">Protect Your Privacy.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Fast, private, and accurate IP tools. No tracking, no ads, no BS.
          </motion.p>

          {/* IP Display Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-2xl p-6 sm:p-8 max-w-md mx-auto mb-10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Your IP Address</span>
              <button
                onClick={handleCopy}
                disabled={isLoading || !data}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Copy IP address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                )}
              </button>
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Detecting your IP address...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="py-4">
                <p className="text-sm text-red-500 mb-2">Failed to fetch IP data</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Data Display */}
            {data && !isLoading && !error && (
              <>
                <div className="text-2xl sm:text-3xl font-mono font-semibold text-foreground mb-4">
                  {data.ipv4}
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap">
                  {locationString && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{locationString}</span>
                    </div>
                  )}
                  {data.isp && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-primary" />
                        <span>{data.isp}</span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Location Map */}
          {data && !isLoading && (
            <LocationMap
              lat={data.lat}
              lng={data.lon}
              location={locationString || undefined}
            />
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/ip-lookup"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Try IP Lookup
            </a>
            <a
              href="/api-docs"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
            >
              View API Docs
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2"
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
