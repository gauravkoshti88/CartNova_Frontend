import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function OfferSlide({ banner }) {
  const navigate = useNavigate();

  if (!banner) return null;

  return (
    <div
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-xl
        sm:rounded-2xl
        cursor-pointer

        h-[220px]
        xs:h-[240px]
        sm:h-[280px]
        md:h-[340px]
        lg:h-[400px]
        xl:h-[450px]
      "
    >
      {/* Image */}

      <img
        src={banner?.image?.url}
        alt={banner?.image?.alt || banner?.title || "Offer"}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-transform
          duration-700
          ease-out
          group-hover:scale-105
        "
      />

      {/* Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/75
          via-black/40
          to-transparent
        "
      />

      {/* Content */}

      <div className="absolute inset-0 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="
            max-w-[75%]
            px-5

            sm:max-w-lg
            sm:px-7

            md:px-10

            lg:max-w-xl
            lg:px-12
          "
        >
          {/* Title */}

          <h2
            className="
              font-bold
              leading-tight
              text-white

              text-xl
              sm:text-2xl
              md:text-3xl
              lg:text-4xl
              xl:text-5xl
            "
          >
            {banner?.title}
          </h2>

          {/* Button */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              if (banner?.link) {
                navigate(banner.link);
              }
            }}
            className="
              mt-4
              rounded-full
              bg-white
              px-4
              py-2
              text-xs
              font-semibold
              text-black
              transition-all
              duration-300

              hover:bg-orange-500
              hover:text-white

              sm:mt-5
              sm:px-5
              sm:py-2.5
              sm:text-sm

              md:mt-6
              md:px-6
              md:py-3
              md:text-base
            "
          >
            Shop Offers
          </button>
        </motion.div>
      </div>
    </div>
  );
}
