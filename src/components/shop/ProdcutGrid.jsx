import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import ProductCard from "../product/ProductCard";
import { usePublicProducts } from "../../hooks/usePublicProducts";

export default function ProductGrid({ filters = {} }) {
  const [page, setPage] = useState(1);

  const observerRef = useRef(null);

  const location = useLocation();

  // ==================================================
  // GET SEARCH FROM URL
  // ==================================================

  const searchParams = new URLSearchParams(location.search);

  const search = searchParams.get("search") || "";

  // ==================================================
  // RESET PAGE WHEN FILTER / SEARCH CHANGES
  // ==================================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    filters.category,
    filters.subCategory,
    filters.brand,
    filters.rating,
    filters.minPrice,
    filters.maxPrice,
  ]);

  // ==================================================
  // API PARAMS
  // ==================================================

  const params = {
    page,
    limit: 20,

    ...(search && {
      search,
    }),

    ...(filters.category && {
      category: filters.category,
    }),

    ...(filters.subCategory && {
      subCategory: filters.subCategory,
    }),

    ...(filters.brand && {
      brand: filters.brand,
    }),

    ...(filters.rating && {
      rating: filters.rating,
    }),

    ...(filters.minPrice && {
      minPrice: Number(filters.minPrice),
    }),

    ...(filters.maxPrice && {
      maxPrice: Number(filters.maxPrice),
    }),
  };

  // ==================================================
  // PRODUCTS
  // ==================================================

  const {
    products = [],
    loading,
    totalProducts,
    hasNextPage,
  } = usePublicProducts({
    getProducts: true,
    params,
  });

  // ==================================================
  // INFINITE SCROLL
  // ==================================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        rootMargin: "300px",
      },
    );

    const target = observerRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }

      observer.disconnect();
    };
  }, [hasNextPage, loading]);

  // ==================================================
  // INITIAL LOADING
  // ==================================================

  if (loading && products.length === 0) {
    return (
      <div
        className="
          grid
          grid-cols-2
          gap-3
          sm:gap-4
          md:grid-cols-3
          lg:grid-cols-3
          xl:grid-cols-4
          xl:gap-5
        "
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="
              overflow-hidden
              rounded-xl
              border
              border-gray-100
              bg-white
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="aspect-[4/5] animate-pulse bg-gray-200 dark:bg-slate-800" />

            <div className="space-y-3 p-3 sm:p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />

              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-800" />

              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />

              <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ==================================================
  // EMPTY
  // ==================================================

  if (!products.length) {
    return (
      <div
        className="
          flex
          min-h-[300px]
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-gray-300
          bg-gray-50
          px-4
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 sm:text-lg">
            {search ? `No products found for "${search}"` : "No products found"}
          </h3>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            {search
              ? "Try searching with a different product name or keyword."
              : "Try changing your filters or search criteria."}
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // PRODUCTS
  // ==================================================

  return (
    <div className="w-full min-w-0">
      <div
        className="
          grid
          min-w-0
          grid-cols-2
          gap-3
          sm:gap-4
          md:grid-cols-3
          lg:grid-cols-3
          lg:gap-5
          xl:grid-cols-4
          xl:gap-5
        "
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* Loading More */}
      {loading && products.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <div
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-gray-200
                border-t-emerald-500
              "
            />

            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Loading more products...
            </span>
          </div>
        </div>
      )}

      {/* End */}
      {!hasNextPage && products.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
            You have reached the end of the products.
          </p>
        </div>
      )}
    </div>
  );
}
