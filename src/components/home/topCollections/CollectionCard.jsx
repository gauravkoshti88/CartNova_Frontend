import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CollectionCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="
        group
        relative
        w-full
        cursor-pointer
        overflow-hidden
        rounded-xl
        aspect-[4/3]

        sm:rounded-2xl
        sm:aspect-[16/11]

        lg:rounded-3xl
        lg:aspect-[4/3]
      "
    >
      {/* =========================
          IMAGE
      ========================= */}

      <img
        src={item.image?.url || item.image}
        alt={item.title || "Collection"}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-transform
          duration-500
          ease-out
          group-hover:scale-105
        "
      />

      {/* =========================
          OVERLAY
      ========================= */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/40
          to-transparent
        "
      />

      {/* =========================
          CONTENT
      ========================= */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          p-3.5

          sm:p-4
          md:p-5
          lg:p-6
        "
      >
        {/* Title */}

        <h3
          className="
            line-clamp-1
            text-base
            font-bold
            leading-tight
            text-white

            sm:text-lg
            md:text-xl
            lg:text-2xl
            xl:text-3xl
          "
        >
          {item.title}
        </h3>

        {/* Products */}

        <p
          className="
            mt-1
            text-[11px]
            leading-4
            text-gray-200

            sm:text-xs
            md:text-sm
            lg:text-base
          "
        >
          {item.products} products
        </p>

        {/* Button */}

        <button
          type="button"
          className="
            mt-2
            flex
            items-center
            gap-1
            text-xs
            font-semibold
            text-emerald-400
            transition-all
            duration-300

            sm:mt-2.5
            sm:gap-1.5
            sm:text-sm

            md:text-base
            md:group-hover:gap-2.5

            lg:mt-3
            lg:text-lg
            lg:group-hover:gap-3
          "
        >
          <span>Shop Collection</span>

          <ArrowRight
            className="
              h-3.5
              w-3.5
              transition-transform
              duration-300

              sm:h-4
              sm:w-4

              md:h-5
              md:w-5
              md:group-hover:translate-x-1
            "
          />
        </button>
      </div>
    </motion.div>
  );
}
