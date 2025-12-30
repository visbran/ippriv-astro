import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section id="cta" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Content */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Start Using IPPriv Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Free to use, no account required. Start looking up IP addresses in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/ip-lookup"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/api-docs"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View API Docs
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
