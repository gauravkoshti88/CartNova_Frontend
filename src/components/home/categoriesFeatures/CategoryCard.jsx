import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="
        group
        relative
        h-[210px]
        cursor-pointer
        overflow-hidden
        rounded-xl
        sm:h-[230px]
        sm:rounded-2xl
        md:h-[250px]
        lg:h-[260px]
      "
    >
      {/* Image */}
      <img
        src={item?.image?.url || ""}
        alt={item?.name || "Category"}
        loading="lazy"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          transition-transform
          duration-500
          group-hover:scale-110
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/85
          via-black/30
          to-transparent
        "
      />

      {/* Content */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          p-3
          sm:p-4
          md:p-5
        "
      >
        {/* Category Name */}
        <h3
          className="
            line-clamp-2
            text-base
            font-bold
            leading-tight
            capitalize
            text-white
            sm:text-lg
            md:text-xl
          "
        >
          {item?.name}
        </h3>

        {/* Shop Now */}
        <div
          className="
            mt-1.5
            flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-green-400
            sm:mt-2
            sm:gap-2
            sm:text-sm
            md:text-base
          "
        >
          <span>Shop now</span>

          <ArrowRight
            className="
              h-4
              w-4
              transition-transform
              duration-300
              group-hover:translate-x-1.5
              sm:h-[17px]
              sm:w-[17px]
              md:h-[18px]
              md:w-[18px]
            "
          />
        </div>
      </div>
    </motion.div>
  );
}
