import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: '50,000+',
    label: 'Lookups performed',
  },
  {
    icon: Users,
    value: '2,500+',
    label: 'Happy developers',
  },
  {
    icon: Zap,
    value: '<50ms',
    label: 'Average response time',
  },
];

const SocialProofSection = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-lg text-muted-foreground">
            Trusted by developers and privacy enthusiasts worldwide
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
