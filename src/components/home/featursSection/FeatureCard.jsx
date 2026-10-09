import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, subtitle }) => {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.03,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
            bg-white
            dark:bg-slate-900
            rounded-2xl
            shadow-md
            hover:shadow-xl
            transition-all
            p-6
            flex
            items-center
            gap-5
            border
            border-gray-100
            dark:border-slate-700
        "
    >
      <div
        className="
                h-14
                w-14
                rounded-full
                bg-orange-100
                text-orange-600
                flex
                items-center
                justify-center
            "
      >
        <Icon size={28} />
      </div>

      <div>
        <h3 className="font-semibold text-lg dark:text-gray-300">{title}</h3>

        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
