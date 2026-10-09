import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { features } from "./featureData";

export default function FeatureSection() {
  return (
    <section className="py-2">
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Why Shop With Us?
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          Everything you need for a smooth and secure shopping experience.
        </p>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
            }}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
