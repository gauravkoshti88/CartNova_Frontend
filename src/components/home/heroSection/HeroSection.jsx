import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import HeroSlide from "./HeroSlide";

export default function HeroSection({ website }) {
  const banners = website?.heroBanners || [];
  const total = banners.length;

  // ==========================================
  // CLONES
  // ==========================================
  const loopedBanners = useMemo(() => {
    if (total <= 1) return banners;

    return [banners[total - 1], ...banners, banners[0]];
  }, [banners, total]);

  // ==========================================
  // CURRENT SLIDE
  // ==========================================
  const [current, setCurrent] = useState(total > 1 ? 1 : 0);

  // Used only for instant clone reset
  const [jumping, setJumping] = useState(false);

  // ==========================================
  // RESET WHEN BANNERS CHANGE
  // ==========================================
  useEffect(() => {
    setCurrent(total > 1 ? 1 : 0);
    setJumping(false);
  }, [total]);

  // ==========================================
  // AUTO SLIDE
  // ==========================================
  useEffect(() => {
    if (total <= 1) return;

    const timer = setTimeout(() => {
      setCurrent((prev) => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [current, total]);

  // ==========================================
  // HANDLE LOOP
  // ==========================================
  const handleAnimationComplete = () => {
    if (total <= 1) return;

    // ========================================
    // LAST CLONE
    //
    // Example:
    // A → B → C → A(clone)
    //
    // Current = total + 1
    // ========================================
    if (current === total + 1) {
      setJumping(true);

      // First render clone -> then immediately
      // switch to real first slide
      requestAnimationFrame(() => {
        setCurrent(1);

        requestAnimationFrame(() => {
          setJumping(false);
        });
      });

      return;
    }

    // ========================================
    // FIRST CLONE
    //
    // C(clone) → A → B → C
    // ========================================
    if (current === 0) {
      setJumping(true);

      requestAnimationFrame(() => {
        setCurrent(total);

        requestAnimationFrame(() => {
          setJumping(false);
        });
      });
    }
  };

  // ==========================================
  // EMPTY
  // ==========================================
  if (!total) return null;

  // ==========================================
  // ACTIVE DOT
  // ==========================================
  const activeDot = total > 1 ? (current - 1 + total) % total : 0;

  // ==========================================
  // DOT CLICK
  // ==========================================
  const handleDotClick = (index) => {
    if (jumping) return;

    setCurrent(index + 1);
  };

  return (
    <section className="w-full bg-white dark:bg-slate-950 py-3 sm:py-4 md:py-5">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* =====================================
            HERO
        ====================================== */}
        <div
          className="
            relative
            h-[180px]
            overflow-hidden
            sm:h-[260px]
            md:h-[320px]
            lg:h-[360px]
          "
        >
          <div
            className="
              absolute
              inset-0

              [--slide-width:82vw]
              [--slide-gap:12px]

              sm:[--slide-width:72vw]
              sm:[--slide-gap:16px]

              md:[--slide-width:58vw]
              md:[--slide-gap:20px]

              lg:[--slide-width:42vw]
              lg:[--slide-gap:24px]

              xl:[--slide-width:38vw]
              xl:[--slide-gap:28px]
            "
          >
            {loopedBanners.map((banner, index) => {
              const difference = index - current;

              const isActive = index === current;

              return (
                <motion.div
                  key={`${banner._id || "banner"}-${index}`}
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-full
                    w-[82vw]
                    max-w-[580px]
                    -translate-y-1/2

                    sm:w-[72vw]
                    md:w-[58vw]
                    lg:w-[42vw]
                    xl:w-[38vw]
                  "
                  initial={false}
                  animate={{
                    x: `calc(
                      -50% +
                      ${difference} *
                      (var(--slide-width) + var(--slide-gap))
                    )`,
                    scale: isActive ? 1 : 0.98,

                    // IMPORTANT:
                    // Never hide the immediate clone.
                    opacity: Math.abs(difference) <= 1 ? 1 : 0,
                  }}
                  transition={
                    jumping
                      ? {
                          duration: 0,
                        }
                      : {
                          duration: 0.55,
                          ease: [0.25, 0.1, 0.25, 1],
                        }
                  }
                  onAnimationComplete={
                    isActive ? handleAnimationComplete : undefined
                  }
                  style={{
                    zIndex: isActive ? 10 : 5,
                  }}
                >
                  <HeroSlide slide={banner} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* =====================================
            DOTS
        ====================================== */}
        {total > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {banners.map((banner, index) => (
              <button
                key={banner._id || index}
                type="button"
                onClick={() => handleDotClick(index)}
                aria-label={`Go to banner ${index + 1}`}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    activeDot === index
                      ? "w-5 bg-gray-500"
                      : "w-1.5 bg-gray-300"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
