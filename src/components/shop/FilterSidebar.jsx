import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCategories,
  getSubCategoriesByCategory,
  getBrandsByCategory,
} from "../../redux/thunks/publicCategoryThunk";

export default function FilterSidebar({ filters, updateFilter, resetFilters }) {
  const dispatch = useDispatch();

  const {
    categories = [],
    categoriesLoading = false,

    subCategories = [],
    subCategoriesLoading = false,

    categoryBrands = [],
    categoryBrandsLoading = false,
  } = useSelector((state) => state.publicCategory || {});

  // ==========================================================
  // DROPDOWN STATES
  // ==========================================================

  const [openSections, setOpenSections] = useState({
    category: true,
    subCategory: true,
    brand: true,
    price: true,
    rating: true,
  });

  // ==========================================================
  // RATINGS
  // ==========================================================

  const ratings = [4, 3, 2];

  // ==========================================================
  // FETCH CATEGORIES
  // ==========================================================

  useEffect(() => {
    if (!categories.length) {
      dispatch(getCategories());
    }
  }, [dispatch, categories.length]);

  // ==========================================================
  // FETCH SUB CATEGORY + BRAND
  // ==========================================================

  useEffect(() => {
    if (!filters?.category) {
      return;
    }

    dispatch(getSubCategoriesByCategory(filters.category));

    dispatch(getBrandsByCategory(filters.category));
  }, [dispatch, filters?.category]);

  // ==========================================================
  // TOGGLE SECTION
  // ==========================================================

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ==========================================================
  // CATEGORY CHANGE
  // ==========================================================

  const handleCategoryChange = (slug) => {
    updateFilter("category", slug);

    // Category change hone par dependent filters reset
    updateFilter("subCategory", "");
    updateFilter("brand", "");

    setOpenSections((prev) => ({
      ...prev,
      subCategory: true,
      brand: true,
    }));
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset = () => {
    resetFilters();

    setOpenSections({
      category: true,
      subCategory: true,
      brand: true,
      price: true,
      rating: true,
    });
  };

  // ==========================================================
  // ANIMATION
  // ==========================================================

  const sectionAnimation = {
    initial: {
      height: 0,
      opacity: 0,
    },

    animate: {
      height: "auto",
      opacity: 1,
    },

    exit: {
      height: 0,
      opacity: 0,
    },

    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  };

  return (
    <aside
      className="
        w-full
        shrink-0
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        dark:border-slate-700
        dark:bg-slate-900
        sm:p-5
        lg:w-70
        xl:w-72
        xl:p-5
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <SlidersHorizontal
            className="
              h-5
              w-5
              shrink-0
              dark:text-gray-300
              sm:h-[22px]
              sm:w-[22px]
            "
          />

          <h2
            className="
              text-xl
              font-semibold
              dark:text-gray-300
              sm:text-xl
              md:text-2xl
            "
          >
            Filters
          </h2>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="
            shrink-0
            text-xs
            font-medium
            text-emerald-600
            hover:underline
            dark:text-emerald-400
            sm:text-sm
            md:text-md
          "
        >
          Reset All
        </button>
      </div>

      <div className="mt-5 border-b border-gray-400" />

      {/* ======================================================
          CATEGORY
      ====================================================== */}

      <div className="mt-2 sm:mt-3">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="flex w-full items-center justify-between text-left"
        >
          <h3
            className="
              text-base
              font-semibold
              dark:text-gray-300
              sm:text-lg
            "
          >
            Category
          </h3>

          <motion.div
            animate={{
              rotate: openSections.category ? 180 : 0,
            }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown
              className="
                h-4
                w-4
                dark:text-gray-300
                sm:h-[19px]
                sm:w-[19px]
              "
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {openSections.category && (
            <motion.div {...sectionAnimation} className="overflow-hidden">
              <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                {categoriesLoading ? (
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Loading categories...
                  </p>
                ) : categories.length > 0 ? (
                  categories.map((item) => (
                    <label
                      key={item._id}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2.5
                        sm:gap-3
                      "
                    >
                      <input
                        type="radio"
                        name="category"
                        value={item.slug}
                        checked={filters.category === item.slug}
                        onChange={() => handleCategoryChange(item.slug)}
                        className="
                          h-4
                          w-4
                          accent-emerald-500
                          sm:h-5
                          sm:w-5
                        "
                      />

                      <span
                        className="
                          text-sm
                          leading-5
                          text-gray-700
                          dark:text-gray-300
                          sm:text-base
                        "
                      >
                        {item.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 sm:text-sm">
                    No categories found
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ======================================================
          SUB CATEGORY
      ====================================================== */}

      <AnimatePresence initial={false}>
        {filters.category && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <div
              className="
                mt-4
                border-l-2
                border-emerald-100
                pl-3
                sm:mt-5
                sm:pl-4
              "
            >
              <button
                type="button"
                onClick={() => toggleSection("subCategory")}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  text-left
                "
              >
                <h3
                  className="
                    text-base
                    font-semibold
                    dark:text-gray-300
                    sm:text-lg
                  "
                >
                  Sub Category
                </h3>

                <motion.div
                  animate={{
                    rotate: openSections.subCategory ? 180 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown
                    className="
                      h-4
                      w-4
                      dark:text-gray-300
                      sm:h-[19px]
                      sm:w-[19px]
                    "
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openSections.subCategory && (
                  <motion.div {...sectionAnimation} className="overflow-hidden">
                    <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                      {subCategoriesLoading ? (
                        <p className="text-xs text-gray-400 sm:text-sm">
                          Loading sub categories...
                        </p>
                      ) : subCategories.length > 0 ? (
                        subCategories.map((item) => (
                          <label
                            key={item._id}
                            className="
                              flex
                              cursor-pointer
                              items-center
                              gap-2.5
                              sm:gap-3
                            "
                          >
                            <input
                              type="radio"
                              name="subCategory"
                              value={item.slug}
                              checked={filters.subCategory === item.slug}
                              onChange={() =>
                                updateFilter("subCategory", item.slug)
                              }
                              className="
                                h-4
                                w-4
                                accent-emerald-500
                                sm:h-5
                                sm:w-5
                              "
                            />

                            <span
                              className="
                                text-sm
                                leading-5
                                text-gray-700
                                dark:text-gray-300
                                sm:text-base
                              "
                            >
                              {item.name}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 sm:text-sm">
                          No sub categories found
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================
          BRAND
      ====================================================== */}

      <div className="mt-5 sm:mt-5">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="
            flex
            w-full
            items-center
            justify-between
            text-left
          "
        >
          <h3
            className="
              text-base
              font-semibold
              dark:text-gray-300
              sm:text-lg
            "
          >
            Brand
          </h3>

          <motion.div
            animate={{
              rotate: openSections.brand ? 180 : 0,
            }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown
              className="
                h-4
                w-4
                dark:text-gray-300
                sm:h-[19px]
                sm:w-[19px]
              "
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {openSections.brand && (
            <motion.div {...sectionAnimation} className="overflow-hidden">
              <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                {categoryBrandsLoading ? (
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Loading brands...
                  </p>
                ) : categoryBrands.length > 0 ? (
                  categoryBrands.map((item) => (
                    <label
                      key={item._id}
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2.5
                        sm:gap-3
                      "
                    >
                      <input
                        type="radio"
                        name="brand"
                        value={item.slug}
                        checked={filters.brand === item.slug}
                        onChange={() => updateFilter("brand", item.slug)}
                        className="
                          h-4
                          w-4
                          accent-emerald-500
                          sm:h-5
                          sm:w-5
                        "
                      />

                      <span
                        className="
                          text-sm
                          leading-5
                          text-gray-700
                          dark:text-gray-300
                          sm:text-base
                        "
                      >
                        {item.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 sm:text-sm">
                    {filters.category ? "No brands found" : "Select a category"}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ======================================================
          PRICE RANGE
      ====================================================== */}

      <div className="mt-8 sm:mt-5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="
            flex
            w-full
            items-center
            justify-between
            text-left
          "
        >
          <h3
            className="
              text-base
              font-semibold
              dark:text-gray-300
              sm:text-lg
            "
          >
            Price Range
          </h3>

          <motion.div
            animate={{
              rotate: openSections.price ? 180 : 0,
            }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown
              className="
                h-4
                w-4
                dark:text-gray-300
                sm:h-[19px]
                sm:w-[19px]
              "
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {openSections.price && (
            <motion.div {...sectionAnimation} className="overflow-hidden">
              <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
                <input
                  name="minPrice"
                  type="number"
                  min="0"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  placeholder="0"
                  className="
                    w-full
                    min-w-0
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2
                    text-sm
                    outline-none
                    focus:border-emerald-500
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-gray-300
                    dark:placeholder:text-gray-400
                    sm:px-4
                    sm:text-base
                  "
                />

                <span
                  className="
                    shrink-0
                    text-sm
                    text-gray-500
                    dark:text-gray-300
                    sm:text-base
                  "
                >
                  -
                </span>

                <input
                  name="maxPrice"
                  type="number"
                  min="0"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  placeholder="2000"
                  className="
                    w-full
                    min-w-0
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2
                    text-sm
                    outline-none
                    focus:border-emerald-500
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-gray-300
                    dark:placeholder:text-gray-400
                    sm:px-4
                    sm:text-base
                  "
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ======================================================
          RATING
      ====================================================== */}

      <div className="mt-8 sm:mt-5">
        <button
          type="button"
          onClick={() => toggleSection("rating")}
          className="
            flex
            w-full
            items-center
            justify-between
            text-left
          "
        >
          <h3
            className="
              text-base
              font-semibold
              dark:text-gray-300
              sm:text-lg
            "
          >
            Rating
          </h3>

          <motion.div
            animate={{
              rotate: openSections.rating ? 180 : 0,
            }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown
              className="
                h-4
                w-4
                dark:text-gray-300
                sm:h-[19px]
                sm:w-[19px]
              "
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {openSections.rating && (
            <motion.div {...sectionAnimation} className="overflow-hidden">
              <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                {ratings.map((rating) => (
                  <label
                    key={rating}
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2.5
                      sm:gap-3
                    "
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === String(rating)}
                      onChange={(e) => updateFilter("rating", e.target.value)}
                      className="
                        h-4
                        w-4
                        accent-emerald-500
                        sm:h-5
                        sm:w-5
                      "
                    />

                    <span
                      className="
                        text-sm
                        leading-5
                        text-gray-700
                        dark:text-gray-300
                        sm:text-base
                      "
                    >
                      {rating} ⭐ & above
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
