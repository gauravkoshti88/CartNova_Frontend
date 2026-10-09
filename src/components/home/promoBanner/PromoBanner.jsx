import { useEffect, useState } from "react";
import OfferSlide from "./OfferSlide";

export default function PromoBanner({ website }) {
  const banners = website?.offerBanners || [];

  const [current, setCurrent] = useState(0);

  // =========================================================
  // AUTO SLIDE
  // =========================================================

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // =========================================================
  // KEEP INDEX SAFE
  // =========================================================

  useEffect(() => {
    if (current >= banners.length && banners.length > 0) {
      setCurrent(0);
    }
  }, [current, banners.length]);

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!banners.length) {
    return null;
  }

  return (
    <section className="w-full py-3 sm:py-5">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-5">
        <div className="relative w-full">
          <OfferSlide banner={banners[current]} />
        </div>
      </div>
    </section>
  );
}
