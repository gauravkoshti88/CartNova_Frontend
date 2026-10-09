import { motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function FlashSaleCard({ product }) {
  const navigate = useNavigate();

  const sold = useMemo(() => Math.floor(Math.random() * 80) + 20, []);

  // =========================
  // PRODUCT NAVIGATION
  // =========================

  const handleProductClick = () => {
    const categorySlug = product?.basicInfo?.category?.slug;
    const productSlug = product?.slug;

    if (!categorySlug || !productSlug) return;

    navigate(`/product/category/${categorySlug}/${productSlug}`);
  };

  // =========================
  // IMAGE
  // =========================

  const mediaImages = Array.isArray(product?.media)
    ? product.media.filter((image) => image?.url)
    : [];

  const variantImages = Array.isArray(product?.variants)
    ? product.variants
        .map((variant) => variant?.image)
        .filter((image) => image?.url)
    : [];

  const images = mediaImages.length > 0 ? mediaImages : variantImages;

  const primaryImage =
    images.find((image) => image?.isPrimary)?.url || images[0]?.url || "";

  // =========================
  // PRICE
  // =========================

  const variant = product?.variants?.[0];

  const price = variant?.salePrice || 0;
  const oldPrice = variant?.mrp || 0;

  // =========================
  // DISCOUNT
  // =========================

  const minDiscount = Number(product?.minDiscountPercent || 0);
  const maxDiscount = Number(product?.maxDiscountPercent || 0);

  const hasDiscount = minDiscount > 0 || maxDiscount > 0;

  const discountText =
    minDiscount === maxDiscount
      ? `${minDiscount}% OFF`
      : `${minDiscount}% - ${maxDiscount}% OFF`;

  return (
    <motion.div
      onClick={handleProductClick}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="
        cursor-pointer
        rounded-xl
        bg-white
        p-2
        shadow-sm
        transition-shadow
        hover:shadow-lg
        sm:rounded-2xl
        sm:p-2.5
        dark:bg-slate-900
      "
    >
      {/* IMAGE */}

      <div
        className="
          relative
          overflow-hidden
          rounded-lg
          sm:rounded-xl
        "
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product?.basicInfo?.productName || "Product"}
            className="
              h-40
              w-full
              object-cover
              transition-transform
              duration-300
              hover:scale-105
              xs:h-44
              sm:h-52
              md:h-56
              lg:h-60
              xl:h-64
            "
          />
        ) : (
          <div
            className="
              flex
              h-40
              w-full
              items-center
              justify-center
              bg-gray-100
              text-xs
              text-gray-400
              xs:h-44
              sm:h-52
              md:h-56
              lg:h-60
              xl:h-64
              dark:bg-slate-800
            "
          >
            No Image
          </div>
        )}

        {/* DISCOUNT */}

        {hasDiscount && (
          <div className="absolute bottom-2 right-2 z-10">
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-emerald-500
                px-2
                py-1
                text-[9px]
                font-bold
                leading-none
                text-white
                shadow-md
                sm:px-2.5
                sm:py-1.5
                sm:text-[10px]
                md:text-xs
              "
            >
              {discountText}
            </span>
          </div>
        )}
      </div>

      {/* BODY */}

      <div className="mt-2 sm:mt-3">
        <h3
          className="
            line-clamp-2
            text-sm
            font-medium
            leading-5
            text-gray-900
            sm:text-base
            sm:leading-6
            lg:text-lg
            dark:text-gray-100
          "
        >
          {product?.basicInfo?.productName || "Product"}
        </h3>

        {/* PRICE */}

        <div
          className="
            mt-1.5
            flex
            items-center
            gap-2
            sm:mt-2
            sm:gap-3
          "
        >
          <span
            className="
              text-base
              font-bold
              text-emerald-500
              sm:text-lg
              lg:text-xl
            "
          >
            ₹{price}
          </span>

          {oldPrice > price && (
            <span
              className="
                text-xs
                text-gray-400
                line-through
                sm:text-sm
                lg:text-base
              "
            >
              ₹{oldPrice}
            </span>
          )}
        </div>

        {/* PROGRESS */}

        <div
          className="
            mt-2
            h-1
            overflow-hidden
            rounded-full
            bg-gray-200
            sm:mt-3
            sm:h-1.5
            dark:bg-slate-700
          "
        >
          <div
            style={{ width: `${sold}%` }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>

        <p
          className="
            mt-1
            text-[10px]
            text-gray-400
            sm:text-xs
            dark:text-gray-500
          "
        >
          {sold}% sold
        </p>
      </div>
    </motion.div>
  );
}
