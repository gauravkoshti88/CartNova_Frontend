import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import Breadcrumb from "../../components/Breadcrumb";
import { Heading } from "../../components/Heading";
import FilterSidebar from "../../components/shop/FilterSidebar";
import FilterTopBar from "../../components/shop/FilterTopBar";
import ProductGrid from "../../components/shop/ProdcutGrid";
import SortDropdown from "../../components/shop/SortDropdown";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Shop() {
  useDocumentTitle("Shop");

  const [showFilters, setShowFilters] = useState(false);

  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "latest",
  });

  // ==========================================================
  // UPDATE FILTER
  // ==========================================================

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const resetFilters = () => {
    setFilters({
      category: "",
      subCategory: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      sort: "latest",
    });
  };

  return (
    <section className="w-full pb-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-5 py-1 md:py-5">
        <div className="md:mb-5">
          <Breadcrumb />
        </div>

        <div className="mb-3 mt-5 flex items-center justify-between md:mb-5">
          <Heading
            heading="Shop All Products"
            para="Discover our complete collection of products."
          />

          <div className="hidden lg:block">
            <SortDropdown
              value={filters.sort}
              onChange={(value) => updateFilter("sort", value)}
            />
          </div>
        </div>

        {/* ==================================================
            MOBILE FILTER + SORT
        ================================================== */}

        <div className="mb-5 lg:hidden">
          <div
            className="
              flex
              w-full
              min-w-0
              items-center
              justify-between
              gap-3
              rounded-xl
              border
              border-gray-300
              bg-white
              p-2
              shadow-sm
            "
          >
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="
                flex
                shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-xl
                border
                border-gray-200
                bg-white
                px-3
                py-2
                text-xs
                font-semibold
                text-gray-800
                shadow-sm
                transition-all
                hover:border-orange-500
                hover:text-orange-500
                active:scale-95
                sm:px-4
                sm:py-2.5
                sm:text-sm
              "
            >
              <SlidersHorizontal size={16} />

              <span>Filter</span>
            </button>

            <div className="min-w-0 shrink">
              <SortDropdown
                value={filters.sort}
                onChange={(value) => updateFilter("sort", value)}
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            MOBILE FILTER
        ================================================== */}

        {showFilters && (
          <FilterTopBar
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* ==================================================
            PRODUCTS AREA
        ================================================== */}

        <div
          className="
            flex
            min-w-0
            flex-col
            gap-5
            md:min-h-[calc(100vh-200px)]
            md:flex-row
            md:items-stretch
            md:gap-7
            xl:gap-8
          "
        >
          {/* DESKTOP FILTER */}

          <aside
            className="
              hidden
              w-60
              shrink-0
              md:block
              xl:w-64
            "
          >
            <div className="h-full">
              <FilterSidebar
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
              />
            </div>
          </aside>

          {/* PRODUCTS */}

          <div className="min-w-0 flex-1 lg:min-h-0">
            <div
              className="
                min-w-0
                lg:ml-10
                lg:h-[calc(100vh)]
                lg:overflow-y-auto
                lg:pr-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <ProductGrid filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
