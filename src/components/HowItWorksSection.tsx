import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Enter any IP address',
    description: 'Type or paste any IPv4 or IPv6 address into our lookup tool.',
  },
  {
    number: '02',
    title: 'Get instant results',
    description: 'Receive detailed geolocation and network information in milliseconds.',
  },
  {
    number: '03',
    title: 'Export or share data',
    description: 'Download results as JSON, CSV, or share directly with your team.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-secondary/30">
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
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in seconds. No account required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border to-transparent" />
              )}

              {/* Step Number */}
              <div className="text-5xl sm:text-6xl font-bold text-primary/20 mb-4">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
