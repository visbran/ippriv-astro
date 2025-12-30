import { motion } from 'framer-motion';
import { MapPin, Shield, Code } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Instant IP Lookup',
    description: 'Get detailed information about any IP address in milliseconds. Location, ISP, timezone, and more.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'No logging, no tracking, no data collection. Your privacy is guaranteed with every request.',
  },
  {
    icon: Code,
    title: 'Developer Friendly',
    description: 'Clean API for developers. Simple integration, powerful results. Built for scale.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and privacy-respecting tools for all your IP lookup needs.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 hover:-translate-y-1">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
