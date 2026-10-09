import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroSlide({ slide }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (slide?.buttonLink) {
      navigate(slide.buttonLink);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl">
      {/* Image */}
      <img
        src={slide?.image?.url}
        alt={slide?.title || "Hero banner"}
        className="h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            {/* Title */}
            <h1
              className="
                max-w-[75%]
                text-lg
                font-bold
                leading-tight
                text-white
                sm:max-w-[80%]
                sm:text-xl
                md:text-2xl
                lg:text-3xl
                xl:text-4xl
              "
            >
              {slide?.title}
            </h1>

            {/* Subtitle */}
            {slide?.subtitle && (
              <p
                className="
                  mt-2
                  max-w-[75%]
                  text-xs
                  leading-relaxed
                  text-gray-200
                  sm:mt-3
                  sm:max-w-[80%]
                  sm:text-sm
                  md:mt-4
                  md:text-base
                "
              >
                {slide.subtitle}
              </p>
            )}

            {/* Button */}
            {slide?.buttonText && (
              <div className="mt-3 sm:mt-5 md:mt-6">
                <button
                  type="button"
                  onClick={handleClick}
                  className="
                    rounded-full
                    bg-orange-500
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    transition
                    hover:bg-orange-600
                    active:scale-95
                    sm:px-5
                    sm:py-2.5
                    sm:text-sm
                    md:px-5
                    md:py-2
                    md:text-base
                  "
                >
                  {slide.buttonText}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
