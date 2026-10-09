import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProductRating from "./ProductRating";
import ProductPrice from "./ProductPrice";
import useWishlist from "../../hooks/useWishlist";
import { useToast } from "../../hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWishlistError,
  clearWishlistMessage,
} from "../../redux/slices/wishlistSlice";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const { success, message, error } = useSelector(
    (state) => state.wishlist || {},
  );

  const {
    isInWishlist,
    toggleWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productId = product?._id;

  const wishlisted = isInWishlist(productId);

  // Toast listener
  useToast({
    success,
    message,
    error,

    clearMessage: () => {
      dispatch(clearWishlistMessage());
    },

    clearError: () => {
      dispatch(clearWishlistError());
    },
  });

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId || wishlistLoading) {
      return;
    }

    try {
      await toggleWishlist(productId);
    } catch (error) {
      return;
    }
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleProductClick = () => {
    const categorySlug = product?.basicInfo?.category?.slug;
    const productSlug = product?.slug;

    if (!categorySlug || !productSlug) return;

    navigate(`/product/category/${categorySlug}/${productSlug}`);
  };

  // =========================
  // IMAGES
  // =========================

  // Product media images
  const mediaImages = Array.isArray(product?.media)
    ? product.media.filter((item) => item?.url)
    : [];

  // Variant images
  const variantImages = Array.isArray(product?.variants)
    ? product.variants
        .map((variant) => variant?.image)
        .filter((image) => image?.url)
    : [];

  /*
    Image priority:

    1. Product media
    2. Variant images
  */
  const productImages = mediaImages.length > 0 ? mediaImages : variantImages;

  // Remove duplicate images
  const images = productImages.filter(
    (image, index, self) =>
      index === self.findIndex((item) => item?.url === image?.url),
  );

  // Find primary image
  const primaryImageIndex = Math.max(
    images.findIndex((item) => item?.isPrimary === true),
    0,
  );

  const primaryImage = images[primaryImageIndex]?.url || images[0]?.url || "";

  const currentImage = images[currentImageIndex]?.url || primaryImage;

  // =========================
  // ATTRIBUTES
  // =========================

  const attributes = Array.isArray(product?.attributes)
    ? product.attributes
    : [];

  // =========================
  // BADGES
  // =========================

  const badges = [];

  if (product?.publish?.bestSeller) {
    badges.push("Best Seller");
  }

  if (product?.publish?.newArrival) {
    badges.push("New Arrival");
  }

  if (product?.publish?.featured) {
    badges.push("Featured");
  }

  // =========================
  // PRICE
  // =========================

  const variant = product?.variants?.[0];

  const price = variant?.salePrice || 0;
  const oldPrice = variant?.mrp || 0;

  // =========================
  // IMAGE SLIDER
  // =========================

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev + 1 >= images.length ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // =========================
  // HOVER
  // =========================

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCurrentImageIndex(primaryImageIndex);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(primaryImageIndex);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div
      className="group min-w-0 self-start"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        onClick={handleProductClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          dark:bg-slate-800
          shadow-sm
          transition-shadow
          duration-300
          hover:shadow-lg
          sm:rounded-2xl
        "
      >
        <div
          className="
    relative
    aspect-square
    w-full
    overflow-hidden
    bg-gray-100
    dark:bg-slate-600
  "
        >
          {/* IMAGE */}
          {primaryImage ? (
            <img
              src={isHovered ? currentImage : primaryImage}
              alt={product?.basicInfo?.productName || "Product"}
              className="
        h-full
        w-full
        object-cover
        transition-transform
        duration-500
        group-hover:scale-105
      "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}

          {/* BADGES */}
          {badges.length > 0 && (
            <div className="absolute left-1.5 top-1.5 z-10 flex max-w-[90%] flex-col gap-1 sm:left-2 sm:top-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="
            w-fit
            whitespace-nowrap
            rounded-full
            bg-orange-500
            px-1.5
            py-0.5
            text-[7px]
            font-semibold
            leading-3
            text-white
            sm:px-2.5
            sm:py-1
            sm:text-[10px]
          "
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* HEART */}
          <div
            className="absolute right-1.5 top-1.5 z-20 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:right-2.5 sm:top-2.5 hover:scale-105"
            onClick={handleWishlist}
          >
            {wishlisted ? <Heart fill="red" color="red" /> : <Heart />}
          </div>

          {/* DISCOUNT TAG */}
          {(product?.minDiscountPercent > 0 ||
            product?.maxDiscountPercent > 0) && (
            <div className="absolute bottom-2 right-2 z-10 sm:bottom-2.5 sm:right-2.5">
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
                {product?.minDiscountPercent === product?.maxDiscountPercent
                  ? `${product.minDiscountPercent}% OFF`
                  : `${product.minDiscountPercent}% - ${product.maxDiscountPercent}% OFF`}
              </span>
            </div>
          )}

          {/* SLIDER INDICATORS */}
          {isHovered && images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {/* indicators */}
            </div>
          )}
        </div>

        {/* =========================
            DETAILS
        ========================= */}

        <div className="min-w-0 p-2 sm:p-3 md:p-4">
          {/* =========================
              BRAND + PRODUCT NAME
          ========================= */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              sm:gap-2
            "
          >
            {/* Brand */}

            {product?.basicInfo?.brand?.image?.url && (
              <img
                src={product.basicInfo.brand.image.url}
                alt={product?.basicInfo?.brand?.name || "Brand"}
                className="
                  h-5
                  w-5
                  shrink-0
                  rounded-full
                  border
                  dark:bg-white
                  border-gray-200
                  object-contain
                  sm:h-6
                  sm:w-6
                "
              />
            )}

            {/* Product Name */}

            <h3
              className="
                min-w-0
                flex-1
                overflow-hidden
                text-xs
                font-semibold
                leading-4
                text-gray-900
                dark:text-gray-200
                [display:-webkit-box]
                [-webkit-box-orient:vertical]
                [-webkit-line-clamp:2]
                sm:text-sm
                sm:leading-5
                md:text-base
              "
            >
              {product?.basicInfo?.productName}
            </h3>
          </div>

          {/* =========================
              RATING
          ========================= */}

          <div className="mt-1.5 min-w-0 sm:mt-2">
            <ProductRating
              rating={product?.rating?.average || 0}
              reviews={product?.rating?.count || 0}
            />
          </div>

          {/* =========================
              PRICE
          ========================= */}

          <div className="mt-1 min-w-0 overflow-hidden sm:mt-2">
            <ProductPrice price={price} oldPrice={oldPrice} />
          </div>

          {/* =========================
              ATTRIBUTES
          ========================= */}

          {attributes.length > 0 && (
            <div
              className="
                mt-3
                grid
                grid-rows-[0fr]
                opacity-0
                transition-all
                duration-300
                group-hover:grid-rows-[1fr]
                group-hover:opacity-100
                sm:mt-4
              "
            >
              <div className="overflow-hidden">
                <div
                  className="
                    flex
                    flex-wrap
                    gap-x-2
                    gap-y-3
                    sm:gap-x-3
                    sm:gap-y-4
                  "
                >
                  {attributes.map((attribute) => {
                    const values = Array.isArray(attribute?.values)
                      ? attribute.values
                      : [];

                    if (!values.length) return null;

                    return (
                      <div key={attribute?.id} className="min-w-0">
                        <p
                          className="
                            mb-1
                            text-[9px]
                            font-semibold
                            text-gray-700
                            dark:text-gray-300
                            sm:mb-2
                            sm:text-xs
                          "
                        >
                          {attribute?.name}
                        </p>

                        {/* COLOR */}

                        {attribute?.displayType === "color" && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {values.map((value) => (
                              <span
                                key={value?.id}
                                title={value?.label}
                                className="
                                  block
                                  h-5
                                  w-5
                                  rounded-full
                                  border
                                  border-gray-300
                                  p-0.5
                                  transition
                                  hover:scale-110
                                  sm:h-7
                                  sm:w-7
                                "
                              >
                                <span
                                  className="block h-full w-full rounded-full"
                                  style={{
                                    backgroundColor: value?.color || "#eee",
                                  }}
                                />
                              </span>
                            ))}
                          </div>
                        )}

                        {/* IMAGE */}
                        {attribute?.displayType === "image" && (
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {values.map((value) => {
                              const primaryImage =
                                value?.images?.find(
                                  (image) => image?.isPrimary === true,
                                ) || value?.images?.[0];

                              return (
                                <span
                                  key={value?.id}
                                  title={value?.label}
                                  className="block h-8 w-8 overflow-hidden rounded-lg border border-gray-300 bg-gray-100 sm:h-10 sm:w-10"
                                >
                                  {primaryImage?.url ? (
                                    <img
                                      src={primaryImage.url}
                                      alt={
                                        primaryImage.alt || value?.label || ""
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                      —
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* BUTTON */}

                        {attribute?.displayType === "button" && (
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {values.map((value) => (
                              <span
                                key={value?.id}
                                className="
                                  rounded-md
                                  border
                                  border-gray-300
                                  px-1.5
                                  py-1
                                  text-[8px]
                                  font-medium
                                  text-gray-700
                                  dark:text-gray-300
                                  sm:rounded-lg
                                  sm:px-3
                                  sm:py-1.5
                                  sm:text-xs
                                "
                              >
                                {value?.label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* DROPDOWN */}

                        {attribute?.displayType === "dropdown" && (
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {values.map((value) => (
                              <span
                                key={value?.id}
                                className="
                                  rounded-md
                                  border
                                  border-gray-300
                                  bg-gray-50
                                  px-1.5
                                  py-1
                                  text-[8px]
                                  font-medium
                                  text-gray-700
                                  sm:rounded-lg
                                  sm:px-3
                                  sm:py-1.5
                                  sm:text-xs
                                "
                              >
                                {value?.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
