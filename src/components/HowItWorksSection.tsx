import { motion, useReducedMotion } from 'framer-motion';
import { Search, Zap, Download } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Enter any IP address',
    description: 'Type or paste any IPv4 or IPv6 address into our lookup tool.',
  },
  {
    icon: Zap,
    title: 'Get instant IP information',
    description: 'Receive detailed geolocation and network information on any IP address in milliseconds.',
  },
  {
    icon: Download,
    title: 'Export or share data',
    description: 'Download results as JSON, CSV, or share directly with your team.',
  },
];

const HowItWorksSection = () => {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="py-20 md:py-28 border-t border-border scroll-mt-16">
      <div className="section-container">
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <div className="md:sticky md:top-28 md:self-start">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              How Our IP Lookup Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Get started in seconds. No account required.
            </p>
          </div>

          <ol className="relative">
            {/* Rail */}
            <span className="absolute left-[19px] top-3 bottom-3 w-px bg-border" aria-hidden="true" />
            {steps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
                  <step.icon className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
                <div className="pt-1.5">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-1.5 text-muted-foreground leading-relaxed max-w-[48ch]">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
