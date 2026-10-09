import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Tag,
  Store,
} from "lucide-react";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductRating from "../../components/product/ProductRating";
import ProductPrice from "../../components/product/ProductPrice";
import ProductCard from "../../components/product/ProductCard";

import { Loader } from "../../components/States";

import {
  getProductDetails,
  getRelatedProducts,
} from "../../redux/thunks/publicProductThunk";

import { CategoryBreadcrumb } from "../../components/Breadcrumb";

import useCart from "../../hooks/useCart";
import useGuestCart from "../../hooks/useGuestCart";
import toast from "react-hot-toast";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { Heading } from "../../components/Heading";

const ProductDetails = () => {
  const { slug } = useParams();
  useDocumentTitle(slug.toUpperCase());
  const dispatch = useDispatch();

  /* =========================================================
     REDUX
  ========================================================= */

  const { product, relatedProducts, detailsLoading, relatedLoading, error } =
    useSelector((state) => state.publicProduct);

  const { isAuthenticated } = useSelector((state) => state.userAuth);

  /* =========================================================
     LOCAL STATE
  ========================================================= */

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [activeTab, setActiveTab] = useState("description");
  const [wishlist, setWishlist] = useState(false);

  /* =========================================================
     CART
  ========================================================= */

  const { addGuestItem, isGuestItemInCart } = useGuestCart();

  const {
    items = [],
    addItem: addCartItem,
    adding,
    error: cartError,
    success,
    message,
  } = useCart();

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = async () => {
    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

    if (!product?._id) {
      toast.error("Product not found");
      return;
    }

    if (!selectedVariant?.id) {
      toast.error("Please select all required options");
      return;
    }

    if (!quantity || quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    // ==========================================================
    // PRODUCT LIMIT
    // ==========================================================

    const maxOrderQty = Number(product?.inventory?.maxOrderQty || 10);

    // ==========================================================
    // CHECK SELECTED QUANTITY
    // ==========================================================

    if (quantity > maxOrderQty) {
      toast.error(
        `You can add a maximum of ${maxOrderQty} items of this product.`,
      );
      return;
    }

    // ==========================================================
    // GUEST CART
    // ==========================================================

    if (!isAuthenticated) {
      const result = addGuestItem({
        productId: product._id,
        variantId: selectedVariant.id,
        quantity,
      });

      toast.success("Added To Cart ✅");
      return;
    }

    // ==========================================================
    // AUTHENTICATED CART
    // ==========================================================

    // Find same product + same variant already in cart
    const existingCartItem = items.find((item) => {
      const cartProductId =
        item.product?._id ||
        item.productId?._id ||
        item.productId ||
        item.product;

      const cartVariantId = item.variantId?._id || item.variantId;

      return (
        String(cartProductId) === String(product._id) &&
        String(cartVariantId) === String(selectedVariant.id)
      );
    });

    const currentQuantity = Number(existingCartItem?.quantity || 0);

    // ==========================================================
    // CHECK TOTAL QUANTITY
    // ==========================================================

    const newQuantity = currentQuantity + Number(quantity);

    if (newQuantity > maxOrderQty) {
      const remainingQuantity = Math.max(maxOrderQty - currentQuantity, 0);

      if (remainingQuantity === 0) {
        toast.error(`Maximum limit of ${maxOrderQty} items already reached.`);
      } else {
        toast.error(
          `You can add only ${remainingQuantity} more item${
            remainingQuantity > 1 ? "s" : ""
          }. Maximum limit is ${maxOrderQty}.`,
        );
      }

      return;
    }

    // ==========================================================
    // ADD TO CART
    // ==========================================================

    const payload = {
      productId: product._id,
      variantId: selectedVariant.id,
      quantity: Number(quantity),
    };

    try {
      await addCartItem(payload);

      toast.success("Added To Cart ✅");
    } catch (error) {
      toast.error(error?.message || "Failed to add item to cart.");
    }
  };
  /* =========================================================
     GET PRODUCT DETAILS
  ========================================================= */

  useEffect(() => {
    if (!slug) return;

    dispatch(getProductDetails(slug));
    dispatch(getRelatedProducts(slug));
  }, [dispatch, slug]);

  /* =========================================================
     GET RELATED PRODUCTS
  ========================================================= */

  /* =========================================================
     RESET STATE WHEN PRODUCT CHANGES
  ========================================================= */

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedAttributes({});
    setActiveTab("description");
  }, [product?.slug]);

  /* =========================================================
     BASIC DATA
  ========================================================= */

  const attributes = useMemo(() => {
    return Array.isArray(product?.attributes) ? product.attributes : [];
  }, [product?.attributes]);

  const variants = useMemo(() => {
    return Array.isArray(product?.variants) ? product.variants : [];
  }, [product?.variants]);

  const brand = product?.basicInfo?.brand || null;

  const category = product?.basicInfo?.category || null;

  const subCategory = product?.basicInfo?.subCategory || null;

  /* =========================================================
     PRODUCT MEDIA
  ========================================================= */

  const mediaImages = useMemo(() => {
    if (!Array.isArray(product?.media)) {
      return [];
    }

    return product.media.filter((image) => image?.url);
  }, [product?.media]);

  /* =========================================================
     DEFAULT VARIANT
  ========================================================= */

  const defaultVariant = variants[0] || null;

  /* =========================================================
     FIND ATTRIBUTE BY ID
  ========================================================= */

  const getAttributeById = (attributeId) => {
    return attributes.find(
      (attribute) => String(attribute?.id) === String(attributeId),
    );
  };

  /* =========================================================
     FIND ATTRIBUTE VALUE
  ========================================================= */

  const getAttributeValue = (attributeId, valueId) => {
    const attribute = getAttributeById(attributeId);

    if (!attribute) return null;

    return (
      attribute.values?.find(
        (value) => String(value?.id) === String(valueId),
      ) || null
    );
  };

  /* =========================================================
     GET SELECTED ATTRIBUTE VALUE
  ========================================================= */

  const getSelectedAttributeValue = (attribute) => {
    if (!attribute) return null;

    const valueId = selectedAttributes[attribute.id];

    if (!valueId) return null;

    return (
      attribute.values?.find(
        (value) => String(value?.id) === String(valueId),
      ) || null
    );
  };

  /* =========================================================
     VARIANT ATTRIBUTE VALUE IDS
     
     Your variant structure:

     attributes: {
       Color: {
         id: "...",
         label: "Red",
         color: "#ff0000"
       },

       Size: {
         id: "...",
         label: "M"
       }
     }
  ========================================================= */

  const getVariantAttributeIds = (variant) => {
    if (!variant?.attributes) {
      return [];
    }

    return Object.values(variant.attributes)
      .map((value) => {
        if (!value) return null;

        if (typeof value === "string") {
          return value;
        }

        return value?.id || value?.valueId || value?.attributeValueId || null;
      })
      .filter(Boolean)
      .map(String);
  };

  /* =========================================================
     FIND MATCHING VARIANT
  ========================================================= */

  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    const selectedIds = Object.values(selectedAttributes)
      .filter(Boolean)
      .map(String);

    /*
      Nothing selected:
      use first variant.
    */

    if (!selectedIds.length) {
      return defaultVariant;
    }

    /*
      Find variant containing ALL selected values.
    */

    const exactVariant = variants.find((variant) => {
      const variantIds = getVariantAttributeIds(variant);

      if (!variantIds.length) {
        return false;
      }

      return selectedIds.every((selectedId) => variantIds.includes(selectedId));
    });

    return exactVariant || defaultVariant;
  }, [variants, selectedAttributes, defaultVariant]);

  /* =========================================================
     SELECTED ATTRIBUTE IMAGES
     
     Priority:
     selected Color/Image value -> all images
  ========================================================= */

  const selectedAttributeImages = useMemo(() => {
    const selectedEntries = Object.entries(selectedAttributes);

    if (!selectedEntries.length) {
      return [];
    }

    /*
      Check every selected attribute.

      Example:

      Color -> Red

      Red.images[]
    */

    for (const [attributeId, valueId] of selectedEntries) {
      const value = getAttributeValue(attributeId, valueId);

      if (!value) continue;

      /*
        Preferred structure:

        value.images = []
      */

      if (Array.isArray(value.images) && value.images.length > 0) {
        const validImages = value.images.filter((image) => image?.url);

        if (validImages.length > 0) {
          return validImages;
        }
      }

      /*
        Fallback:

        value.image = {}
      */

      if (value?.image?.url) {
        return [value.image];
      }
    }

    return [];
  }, [selectedAttributes, attributes]);

  /* =========================================================
     SELECTED VARIANT IMAGE
     
     If selected attribute doesn't have images,
     use matching variant image.
  ========================================================= */

  const selectedVariantImages = useMemo(() => {
    if (!selectedVariant) {
      return [];
    }

    const image = selectedVariant?.image;

    if (!image?.url) {
      return [];
    }

    return [image];
  }, [selectedVariant]);

  /* =========================================================
     INITIAL ATTRIBUTE IMAGE FALLBACK
     
     When media doesn't exist and nothing is selected,
     use the default variant's attribute image.
  ========================================================= */

  const defaultAttributeImages = useMemo(() => {
    if (mediaImages.length > 0) {
      return [];
    }

    if (!defaultVariant?.attributes) {
      return [];
    }

    for (const attribute of attributes) {
      const variantValue = defaultVariant.attributes?.[attribute.name];

      const valueId =
        variantValue?.id ||
        variantValue?.valueId ||
        variantValue?.attributeValueId;

      if (!valueId) continue;

      const value = attribute.values?.find(
        (item) => String(item?.id) === String(valueId),
      );

      if (!value) continue;

      if (Array.isArray(value.images) && value.images.length) {
        const validImages = value.images.filter((image) => image?.url);

        if (validImages.length) {
          return validImages;
        }
      }

      if (value?.image?.url) {
        return [value.image];
      }
    }

    return [];
  }, [mediaImages, defaultVariant, attributes]);

  /* =========================================================
     FINAL IMAGE GALLERY
     
     Priority:

     1. Selected attribute images
     2. Selected variant image
     3. Product media
     4. Default variant attribute images
  ========================================================= */

  const images = useMemo(() => {
    /*
      User selected Color/Image attribute
    */

    if (selectedAttributeImages.length > 0) {
      return selectedAttributeImages;
    }

    /*
      Matching variant image
    */

    if (
      Object.keys(selectedAttributes).length > 0 &&
      selectedVariantImages.length > 0
    ) {
      return selectedVariantImages;
    }

    /*
      Normal product media
    */

    if (mediaImages.length > 0) {
      return mediaImages;
    }

    /*
      No media -> default variant attribute images
    */

    return defaultAttributeImages;
  }, [
    selectedAttributeImages,
    selectedVariantImages,
    selectedAttributes,
    mediaImages,
    defaultAttributeImages,
  ]);

  /* =========================================================
     PRIMARY IMAGE
  ========================================================= */

  const primaryImageIndex = useMemo(() => {
    const index = images.findIndex((image) => image?.isPrimary === true);

    return index >= 0 ? index : 0;
  }, [images]);

  /* =========================================================
     CURRENT IMAGE
  ========================================================= */

  const currentImage =
    images[selectedImage]?.url || images[primaryImageIndex]?.url || "";

  /* =========================================================
     RESET IMAGE WHEN GALLERY CHANGES
  ========================================================= */

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedAttributes]);

  /* =========================================================
     IMAGE HANDLERS
  ========================================================= */

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  const nextImage = () => {
    if (images.length <= 1) return;

    setSelectedImage((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const previousImage = () => {
    if (images.length <= 1) return;

    setSelectedImage((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  /* =========================================================
     PRICE
  ========================================================= */

  const mrp = Number(selectedVariant?.mrp || 0);

  const salePrice = Number(selectedVariant?.salePrice || 0);

  const discount =
    Number(
      selectedVariant?.discountPercentage ||
        (mrp > salePrice ? ((mrp - salePrice) / mrp) * 100 : 0),
    ) || 0;

  /* =========================================================
     STOCK
  ========================================================= */

  const stock = Number(
    selectedVariant?.stock ?? selectedVariant?.quantity ?? 0,
  );

  const isInStock =
    selectedVariant?.inStock !== undefined
      ? selectedVariant.inStock
      : stock > 0;

  /* =========================================================
     BADGES
  ========================================================= */

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

  /* =========================================================
     ATTRIBUTE SELECT
  ========================================================= */

  const handleAttributeChange = (attributeId, valueId) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: valueId,
    }));

    setSelectedImage(0);

    /*
      New variant -> quantity starts from 1
    */

    setQuantity(1);
  };

  /* =========================================================
     QUANTITY
  ========================================================= */
  const maxOrderQty = Math.min(
    stock > 0 ? stock : Infinity,
    product?.inventory?.maxOrderQty ?? Infinity,
  );

  const increaseQuantity = () => {
    if (!isInStock) return;

    if (quantity >= maxOrderQty) {
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  /* =========================================================
     BRAND IMAGE
  ========================================================= */

  const brandImage = brand?.image?.url || brand?.image?.preview || "";

  /* =========================================================
     RENDER ATTRIBUTE
  ========================================================= */

  const renderAttribute = (attribute) => {
    const values = Array.isArray(attribute?.values) ? attribute.values : [];

    if (!values.length) {
      return null;
    }

    const selectedValueId = selectedAttributes[attribute.id];

    return (
      <div key={attribute.id} className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-300">
            {attribute?.name?.toUpperCase()}
          </span>

          {selectedValueId && (
            <span className="text-xs text-gray-500">
              {
                values.find(
                  (value) => String(value.id) === String(selectedValueId),
                )?.label
              }
            </span>
          )}
        </div>

        {/* =================================================
            COLOR
        ================================================= */}

        {attribute.displayType === "color" && (
          <div className="flex flex-wrap gap-3">
            {values.map((value) => {
              const selected = String(selectedValueId) === String(value.id);

              return (
                <button
                  key={value.id}
                  type="button"
                  title={value.label}
                  onClick={() => handleAttributeChange(attribute.id, value.id)}
                  className={`
                    relative
                    h-9
                    w-9
                    rounded-full
                    border-2
                    p-0.5
                    transition-all
                    duration-200

                    ${
                      selected
                        ? "scale-110 border-gray-900 ring-2 ring-gray-900/10"
                        : "border-gray-300 hover:border-gray-500"
                    }
                  `}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{
                      backgroundColor: value?.color || "#eee",
                    }}
                  />

                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check size={15} className="text-white drop-shadow" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* =================================================
            IMAGE ATTRIBUTE
        ================================================= */}

        {attribute.displayType === "image" && (
          <div className="flex flex-wrap gap-3">
            {values.map((value) => {
              const selected = String(selectedValueId) === String(value.id);

              const imageUrl =
                value?.images?.find(
                  (image) => image?.isPrimary === true && image?.url,
                )?.url ||
                value?.images?.find((image) => image?.url)?.url ||
                value?.image?.url ||
                value?.image?.preview ||
                "";

              return (
                <button
                  key={value.id}
                  type="button"
                  title={value.label}
                  onClick={() => handleAttributeChange(attribute.id, value.id)}
                  className={`
                    group
                    relative
                    h-16
                    w-16
                    overflow-hidden
                    rounded-xl
                    border-2
                    bg-white
                    p-0.5
                    transition-all
                    duration-200

                    ${
                      selected
                        ? "scale-105 border-gray-900 ring-2 ring-gray-900/10"
                        : "border-gray-200 hover:border-gray-400"
                    }
                  `}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={value.label}
                      className="
                        h-full
                        w-full
                        rounded-lg
                        object-cover
                        transition-transform
                        duration-200
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <span
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                      "
                      style={{
                        backgroundColor: value?.color || "#eee",
                      }}
                    />
                  )}

                  {selected && (
                    <span
                      className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      rounded-lg
                      bg-black/20
                    "
                    >
                      <span
                        className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        dark:bg-green-400
                        shadow
                      "
                      >
                        <Check
                          size={14}
                          className="text-black dark:text-white"
                        />
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* =================================================
            BUTTON
        ================================================= */}

        {attribute.displayType === "button" && (
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const selected = String(selectedValueId) === String(value.id);

              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => handleAttributeChange(attribute.id, value.id)}
                  className={`
                    rounded-lg
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition

                    ${
                      selected
                        ? "border-gray-900 dark:bg-white dark:text-black bg-gray-900 text-white"
                        : "border-gray-300 dark:bg-slate-800 dark:text-gray-300 bg-white text-gray-700 hover:border-gray-900"
                    }
                  `}
                >
                  {value.label}
                </button>
              );
            })}
          </div>
        )}

        {/* =================================================
            DROPDOWN
        ================================================= */}

        {attribute.displayType === "dropdown" && (
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const selected = String(selectedValueId) === String(value.id);

              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => handleAttributeChange(attribute.id, value.id)}
                  className={`
                    rounded-lg
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition

                    ${
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                    }
                  `}
                >
                  {value.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (detailsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  /* =========================================================
     PRODUCT NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Product not found
      </div>
    );
  }

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div
        className="
        mx-auto
        max-w-7xl
        px-4
        py-1
        sm:px-6
        lg:px-8
        md:py-5
      "
      >
        {/* ===================================================
            BREADCRUMB
        =================================================== */}

        <CategoryBreadcrumb
          category={product?.basicInfo?.category}
          categorySlug={product?.basicInfo?.category?.slug}
          subCategory={product?.basicInfo?.subCategory}
          subCategorySlug={product?.basicInfo?.subCategory?.slug}
          childCategory={product?.basicInfo?.childCategory}
          childCategorySlug={product?.basicInfo?.childCategory?.slug}
          product={product?.basicInfo}
          productSlug={product?.slug}
        />

        {/* ===================================================
            PRODUCT TOP
        =================================================== */}

        <section
          className="
          grid
          grid-cols-1
          gap-8
          lg:grid-cols-2
        "
        >
          {/* =================================================
              LEFT - IMAGE GALLERY
          ================================================= */}

          <div className="min-w-0">
            <div
              className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
            "
            >
              {/* BADGES */}

              {badges.length > 0 && (
                <div
                  className="
                  absolute
                  left-4
                  top-4
                  z-10
                  flex
                  max-w-[80%]
                  flex-wrap
                  gap-2
                "
                >
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      className="
                        rounded-full
                        bg-orange-500
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-white
                        shadow
                      "
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* MAIN IMAGE */}

              <div
                className="
                group
                relative
                aspect-square
                overflow-hidden
                bg-white
                dark:bg-gray-950
                sm:aspect-[4/3]
                lg:aspect-square
              "
              >
                {currentImage ? (
                  <motion.img
                    key={currentImage}
                    initial={{
                      opacity: 0.4,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    src={currentImage}
                    alt={product?.basicInfo?.productName || "Product"}
                    className="
                      h-full
                      w-full
                      object-contain
                      p-4
                      sm:p-8
                    "
                  />
                ) : (
                  <div
                    className="
                    flex
                    h-full
                    items-center
                    justify-center
                    text-sm
                    text-gray-400
                  "
                  >
                    No image available
                  </div>
                )}

                {/* PREVIOUS */}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-white
                        p-2
                        opacity-0
                        shadow-md
                        transition
                        hover:scale-105
                        group-hover:opacity-100
                      "
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={nextImage}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-white
                        p-2
                        opacity-0
                        shadow-md
                        transition
                        hover:scale-105
                        group-hover:opacity-100
                      "
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* =================================================
                THUMBNAILS
            ================================================= */}

            {images.length > 0 && (
              <div
                className="
                mt-4
                flex
                gap-3
                overflow-x-auto
                pb-2
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
              >
                {images.map((image, index) => (
                  <button
                    key={image?.publicId || image?.url || index}
                    type="button"
                    onClick={() => handleImageSelect(index)}
                    className={`
                      h-20
                      w-20
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      border-2
                      bg-white
                      dark:bg-slate-950
                      transition
                      sm:h-24
                      sm:w-24

                      ${
                        selectedImage === index
                          ? "border-gray-900"
                          : "border-gray-200 hover:border-gray-400"
                      }
                    `}
                  >
                    <img
                      src={image.url}
                      alt={image?.alt || product?.basicInfo?.productName || ""}
                      className="
                        h-full
                        w-full
                        object-contain
                        p-1
                      "
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              RIGHT - PRODUCT INFO
          ================================================= */}

          <div className="min-w-0">
            {/* BRAND */}

            {brand && (
              <div
                className="
                mb-3
                flex
                items-center
                gap-3
              "
              >
                {brandImage ? (
                  <div
                    className="
                    h-9
                    w-9
                    overflow-hidden
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                  "
                  >
                    <img
                      src={brandImage}
                      alt={brand.name || "Brand"}
                      className="
                        h-full
                        w-full
                        object-contain
                      "
                    />
                  </div>
                ) : (
                  <div
                    className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                  "
                  >
                    <Store size={16} />
                  </div>
                )}

                <span
                  className="
                  text-sm
                  font-semibold
                  text-gray-600
                  dark:text-gray-400
                "
                >
                  {brand.name}
                </span>
              </div>
            )}

            {/* PRODUCT NAME */}

            <h1
              className="
              text-2xl
              font-bold
              leading-tight
              text-gray-900
              dark:text-gray-200
              sm:text-3xl
              lg:text-4xl
            "
            >
              {product?.basicInfo?.productName}
            </h1>

            {/* SHORT DESCRIPTION */}

            {product?.basicInfo?.shortDescription && (
              <p
                className="
                mt-4
                text-sm
                leading-6
                text-gray-600
                sm:text-base
                dark:text-gray-400
              "
              >
                {product.basicInfo.shortDescription}
              </p>
            )}

            {/* RATING */}

            <div
              className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-3
            "
            >
              <ProductRating
                rating={product?.rating?.average || 0}
                reviews={product?.rating?.count || 0}
              />

              <span
                className="
                text-sm
                text-gray-500
                dark:text-gray-300
              "
              >
                {product?.rating?.count || 0} reviews
              </span>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            {/* PRICE + STOCK */}

            <div
              className="
              flex
              flex-wrap
              items-start
              gap-6
            "
            >
              <div>
                <ProductPrice price={salePrice} oldPrice={mrp} />

                {discount > 0 && (
                  <p
                    className="
                    mt-1
                    text-sm
                    font-semibold
                    text-green-600
                  "
                  >
                    Save {Math.round(discount)}%
                  </p>
                )}
              </div>

              {/* STOCK */}

              <div className="mt-2">
                {isInStock ? (
                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-green-600
                  "
                  >
                    <span
                      className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-green-500
                    "
                    />
                    In Stock
                  </div>
                ) : (
                  <div
                    className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-red-500
                  "
                  >
                    <span
                      className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-red-500
                    "
                    />
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                ATTRIBUTES
            ================================================= */}

            {attributes.length > 0 && (
              <div
                className="
                mt-6
                flex
                flex-col
                gap-5
              "
              >
                {attributes.map((attribute) => renderAttribute(attribute))}
              </div>
            )}

            {/* =================================================
                QUANTITY
            ================================================= */}

            <div className="mt-6">
              <p
                className="
                mb-2
                text-sm
                font-semibold
                text-gray-900
                dark:text-gray-300
              "
              >
                Quantity
              </p>

              <div
                className="
                flex
                w-fit
                items-center
                rounded-xl
                border
                border-gray-300
                bg-white
                dark:bg-slate-800
              "
              >
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="
                    p-3
                    transition
                  "
                >
                  <Minus
                    size={17}
                    className="text-black dark:text-white hover:scale-105 active:scale-125"
                  />
                </button>

                <span
                  className="
                  min-w-12
                  text-center
                  text-sm
                  font-semibold
                  dark:text-gray-200
                "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={!isInStock || quantity >= maxOrderQty}
                  className="
                    p-3
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <Plus
                    size={17}
                    className="dark:text-white hover:scale-105 active:scale-125"
                  />
                </button>
              </div>
              {isInStock && maxOrderQty === quantity && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Maximum {maxOrderQty} item{maxOrderQty > 1 ? "s" : ""} per
                  order
                </p>
              )}
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div
              className="
              mt-6
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-[1fr_auto]
            "
            >
              <button
                type="button"
                disabled={!isInStock || !selectedVariant?.id}
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 dark:bg-blue-600 hover:dark:bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 active:scale-98"
              >
                <ShoppingCart size={19} />

                {isInStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>

            {/* =================================================
                SKU / BARCODE
            ================================================= */}

            {selectedVariant?.sku && (
              <div
                className="
                mt-5
                flex
                flex-wrap
                gap-x-5
                gap-y-2
                text-xs
                text-gray-500
                dark:text-gray-400
              "
              >
                <span>
                  SKU:{" "}
                  <strong className="text-gray-700 dark:text-gray-300">
                    {selectedVariant.sku}
                  </strong>
                </span>

                {selectedVariant.barcode && (
                  <span>
                    Barcode:{" "}
                    <strong className="text-gray-700">
                      {selectedVariant.barcode}
                    </strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            SERVICE FEATURES
        ===================================================== */}

        <div
          className="
          mt-7
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
        "
        >
          {product?.shipping?.freeShipping && (
            <div
              className="
              flex
              gap-3
              rounded-xl
              border
              border-gray-200
              bg-white
              dark:bg-slate-700
              p-4
            "
            >
              <Truck
                size={20}
                className="shrink-0 text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="text-sm font-semibold dark:text-gray-300">
                  Free Shipping
                </p>

                <p
                  className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
                >
                  Free delivery available
                </p>
              </div>
            </div>
          )}

          {product?.warranty?.hasWarranty && (
            <div
              className="
              flex
              gap-3
              rounded-xl
              border
              border-gray-200
              bg-white
              dark:bg-slate-700
              p-4
            "
            >
              <ShieldCheck
                size={20}
                className="shrink-0 text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="text-sm font-semibold dark:text-gray-300">
                  Warranty
                </p>

                <p
                  className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
                >
                  {product.warranty.warrantyDuration}{" "}
                  {product.warranty.warrantyUnit}
                </p>
              </div>
            </div>
          )}

          {product?.returnPolicy?.returnAvailable && (
            <div
              className="
              flex
              gap-3
              rounded-xl
              border
              border-gray-200
              bg-white
              dark:bg-slate-700
              p-4
            "
            >
              <RotateCcw
                size={20}
                className="shrink-0 text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="text-sm font-semibold dark:text-gray-300">
                  Easy Returns
                </p>

                <p
                  className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
                >
                  {product.returnPolicy.returnDays} days{" "}
                  {product.returnPolicy.returnType}
                </p>
              </div>
            </div>
          )}

          {product?.inventory?.trackInventory && (
            <div
              className="
              flex
              gap-3
              rounded-xl
              border
              border-gray-200
              bg-white
              dark:bg-slate-700
              p-4
            "
            >
              <Package
                size={20}
                className="shrink-0 text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="text-sm font-semibold dark:text-gray-300">
                  Secure Packaging
                </p>

                <p
                  className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
                >
                  Carefully packed for delivery
                </p>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            INFORMATION TABS
        ===================================================== */}

        <section
          className="
          mt-12
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          dark:bg-slate-700
        "
        >
          {/* TABS */}

          <div
            className="
            flex
            overflow-x-auto
            border-b
            border-gray-200
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
          >
            {[
              ["description", "Description"],
              ["specifications", "Specifications"],
              ["shipping", "Shipping"],
              ["warranty", "Warranty & Returns"],
              ["inventory", "Inventory"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`
                  shrink-0
                  border-b-2
                  px-5
                  py-4
                  text-sm
                  font-semibold
                  transition
                  sm:px-7

                  ${
                    activeTab === id
                      ? "border-gray-900 dark:border-white dark:text-white text-gray-900"
                      : "border-transparent text-gray-500 dark:text-black hover:text-gray-900"
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}

          <div className="p-5 sm:p-8 bg-white dark:bg-slate-950">
            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {activeTab === "description" && (
              <div className="space-y-7">
                <div>
                  <h2
                    className="
                    text-xl
                    font-bold
                    text-gray-900
                    dark:text-gray-300
                  "
                  >
                    Product Description
                  </h2>

                  <p
                    className="
                    mt-4
                    whitespace-pre-line
                    text-sm
                    leading-7
                    text-gray-600
                    sm:text-base
                    dark:text-gray-400
                  "
                  >
                    {product?.basicInfo?.description ||
                      "No description available."}
                  </p>
                </div>

                {/* TAGS */}

                {Array.isArray(product?.basicInfo?.tags) &&
                  product.basicInfo.tags.length > 0 && (
                    <div>
                      <h3
                        className="
                        mb-3
                        text-sm
                        font-bold
                        text-gray-900
                        dark:text-gray-300
                      "
                      >
                        Tags
                      </h3>

                      <div
                        className="
                        flex
                        flex-wrap
                        gap-2
                      "
                      >
                        {product.basicInfo.tags.map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="
                                flex
                                items-center
                                gap-1
                                rounded-full
                                bg-gray-100
                                dark:bg-gray-800
                                px-3
                                py-1.5
                                text-xs
                                text-gray-600
                                dark:text-gray-300
                              "
                          >
                            <Tag size={12} className="dark:text-white" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* =================================================
                SPECIFICATIONS
            ================================================= */}

            {activeTab === "specifications" && (
              <div className="space-y-8">
                <SpecificationSection
                  title="Basic Information"
                  rows={[
                    ["Product Name", product?.basicInfo?.productName],
                    ["Brand", brand?.name],
                    ["Category", category?.name],
                    ["Sub Category", subCategory?.name],
                  ]}
                />

                {attributes.length > 0 && (
                  <div>
                    <h3
                      className="
                      mb-4
                      text-lg
                      font-bold
                      dark:text-gray-300
                    "
                    >
                      Attributes
                    </h3>

                    <div
                      className="
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                    "
                    >
                      {attributes.map((attribute) => (
                        <div
                          key={attribute.id}
                          className="
                              grid
                              grid-cols-1
                              border-b
                              border-gray-200
                              last:border-0
                              sm:grid-cols-[180px_1fr]
                            "
                        >
                          <div
                            className="
                              bg-gray-50
                              dark:bg-slate-900
                              px-4
                              py-3
                              text-sm
                              font-semibold
                              dark:text-gray-300
                            "
                          >
                            {attribute.name}
                          </div>

                          <div
                            className="
                              flex
                              flex-wrap
                              gap-2
                              px-4
                              py-3
                            "
                          >
                            {attribute.values?.map((value) => (
                              <span
                                key={value.id}
                                className="
                                      rounded-md
                                      bg-gray-100
                                      dark:bg-slate-800
                                      px-2.5
                                      py-1
                                      text-xs
                                      text-gray-700
                                      dark:text-white
                                    "
                              >
                                {value.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VARIANTS */}

                {variants.length > 0 && (
                  <div>
                    <h3
                      className="
                      mb-4
                      text-lg
                      font-bold
                      dark:text-gray-300
                    "
                    >
                      Variants
                    </h3>

                    <div
                      className="
                      grid
                      grid-cols-1
                      gap-3
                      md:grid-cols-2
                    "
                    >
                      {variants.map((variant, index) => (
                        <div
                          key={variant._id || variant.sku || index}
                          className="
                              rounded-xl
                              border
                              border-gray-200
                              p-4
                            "
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                            "
                          >
                            <span
                              className="
                                text-xs
                                font-semibold
                                text-gray-500
                                dark:text-gray-300
                              "
                            >
                              Variant {index + 1}
                            </span>

                            {Number(variant.stock || 0) > 0 && (
                              <span
                                className="
                                  rounded-full
                                  bg-green-50
                                  px-2
                                  py-1
                                  text-xs
                                  font-medium
                                  text-green-600
                                  dark:text-green-400
                                "
                              >
                                In Stock
                              </span>
                            )}
                          </div>

                          <div
                            className="
                              mt-3
                              grid
                              grid-cols-2
                              gap-3
                              text-sm
                            "
                          >
                            <InfoBox label="SKU" value={variant.sku} />

                            <InfoBox
                              label="MRP"
                              value={`₹${Number(
                                variant.mrp || 0,
                              ).toLocaleString("en-IN")}`}
                            />

                            <InfoBox
                              label="Sale Price"
                              value={`₹${Number(
                                variant.salePrice || 0,
                              ).toLocaleString("en-IN")}`}
                            />

                            <InfoBox
                              label="Discount"
                              value={`${variant.discountPercentage || 0}%`}
                            />

                            {variant.barcode && (
                              <InfoBox
                                label="Barcode"
                                value={variant.barcode}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                SHIPPING
            ================================================= */}

            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div
                  className="
                  flex
                  gap-4
                "
                >
                  <Truck className="shrink-0 dark:text-gray-300" />

                  <div>
                    <h3 className="font-bold dark:text-gray-300">
                      Shipping Information
                    </h3>

                    <p
                      className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                    >
                      Shipping class:{" "}
                      {product?.shipping?.shippingClass || "Standard"}
                    </p>
                  </div>
                </div>

                <SpecificationSection
                  title="Package Details"
                  rows={[
                    [
                      "Free Shipping",
                      product?.shipping?.freeShipping ? "Yes" : "No",
                    ],
                    ["Shipping Class", product?.shipping?.shippingClass],
                    ["Weight", product?.shipping?.packageWeight],
                    ["Length", product?.shipping?.packageLength],
                    ["Width", product?.shipping?.packageWidth],
                    ["Height", product?.shipping?.packageHeight],
                  ]}
                />
              </div>
            )}

            {/* =================================================
                WARRANTY
            ================================================= */}

            {activeTab === "warranty" && (
              <div className="space-y-8">
                <SpecificationSection
                  title="Warranty"
                  rows={[
                    [
                      "Warranty Available",
                      product?.warranty?.hasWarranty ? "Yes" : "No",
                    ],
                    ["Warranty Type", product?.warranty?.warrantyType],
                    ["Duration", product?.warranty?.warrantyDuration],
                    ["Unit", product?.warranty?.warrantyUnit],
                    ["Description", product?.warranty?.warrantyDescription],
                  ]}
                />

                <SpecificationSection
                  title="Return Policy"
                  rows={[
                    [
                      "Return Available",
                      product?.returnPolicy?.returnAvailable ? "Yes" : "No",
                    ],
                    ["Return Type", product?.returnPolicy?.returnType],
                    ["Return Days", product?.returnPolicy?.returnDays],
                    ["Description", product?.returnPolicy?.returnDescription],
                  ]}
                />
              </div>
            )}

            {/* =================================================
                INVENTORY
            ================================================= */}

            {activeTab === "inventory" && (
              <div>
                <SpecificationSection
                  title="Inventory Details"
                  rows={[
                    [
                      "Track Inventory",
                      product?.inventory?.trackInventory ? "Yes" : "No",
                    ],
                    [
                      "Allow Backorder",
                      product?.inventory?.allowBackorder ? "Yes" : "No",
                    ],
                    ["SKU Prefix", product?.inventory?.skuPrefix],
                    ["Barcode", product?.inventory?.barcode],
                  ]}
                />
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ===================================================== */}

        <section className="mt-12">
          <div
            className="
            mb-6
            flex
            items-end
            justify-between
            gap-4
          "
          >
            <Heading
              heading={"Related Products"}
              para={"You may also like these products"}
            />
          </div>

          {/* LOADING */}

          {relatedLoading ? (
            <div
              className="
              flex
              min-h-40
              items-center
              justify-center
              rounded-2xl
              border
              border-gray-200
              bg-white
            "
            >
              <Loader />
            </div>
          ) : Array.isArray(relatedProducts) && relatedProducts.length > 0 ? (
            <div
              className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              sm:gap-4
              lg:grid-cols-4
              mb-5
            "
            >
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id || relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          ) : (
            <div
              className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              dark:bg-slate-900
              dark:text-slate-300
              p-8
              text-center
              text-sm
              text-gray-500
              mb-5
            "
            >
              No related products found.
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

/* =============================================================
   INFO BOX
============================================================= */

const InfoBox = ({ label, value }) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="min-w-0">
      <p
        className="
        text-xs
        text-gray-400
        dark:text-gray-300
      "
      >
        {label}
      </p>

      <p
        className="
        mt-1
        break-words
        text-sm
        font-medium
        text-gray-700
        dark:text-gray-500
      "
      >
        {String(value)}
      </p>
    </div>
  );
};

/* =============================================================
   SPECIFICATION SECTION
============================================================= */

const SpecificationSection = ({ title, rows = [] }) => {
  const validRows = rows.filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  if (!validRows.length) {
    return null;
  }

  return (
    <div>
      {title && (
        <h3
          className="
          mb-4
          text-lg
          font-bold
          text-gray-900
          dark:text-gray-300
        "
        >
          {title}
        </h3>
      )}

      <div
        className="
        overflow-hidden
        rounded-xl
        border
        border-gray-200
      "
      >
        {validRows.map(([label, value], index) => (
          <div
            key={`${label}-${index}`}
            className="
                grid
                grid-cols-1
                border-b
                border-gray-200
                last:border-0
                sm:grid-cols-[190px_1fr]
              "
          >
            <div
              className="
                bg-gray-50
                dark:bg-slate-900
                px-4
                py-3
                text-sm
                font-semibold
                text-gray-700
                dark:text-slate-50
              "
            >
              {label}
            </div>

            <div
              className="
                break-words
                px-4
                py-3
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              {String(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
