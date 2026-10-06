import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="cta" className="pb-20 md:pb-28">
      <div className="section-container">
        <div className="rounded-lg border border-border bg-card px-6 py-12 sm:px-12 sm:py-16 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              Start Your Free IP Lookup Today
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Free to use, no account required. Start looking up IP addresses in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/ip-lookup"
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-px transition-colors whitespace-nowrap"
            >
              Try IP Lookup
              <ArrowRight className="w-4 h-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
            </a>
            <a
              href="/api-docs"
              className="inline-flex items-center justify-center px-5 py-3 text-[15px] font-medium rounded-md border border-border text-foreground hover:bg-secondary active:translate-y-px transition-colors whitespace-nowrap"
            >
              View API Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
