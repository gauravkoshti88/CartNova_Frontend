import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSubCategories } from "../../hooks/useSubCategories";
import { usePublicProducts } from "../../hooks/usePublicProducts";

import { SubCategoryCard } from "../../components/Cards";

import {
  getChildCategoriesByCategory,
  getChildCategoriesBySubCategory,
  getSubCategoriesByCategory,
} from "../../redux/thunks/publicCategoryThunk";

import { useDispatch, useSelector } from "react-redux";

import { clearChildCategories } from "../../redux/slices/publicCategorySlice";

import { CategoryBreadcrumb } from "../../components/Breadcrumb";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import ProductCard from "../../components/product/ProductCard";
import { Heading } from "../../components/Heading";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  useDocumentTitle(slug ? slug.toUpperCase() : "Category");

  // ==========================
  // CATEGORY STATES
  // ==========================

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState(null);

  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [selectedChildCategorySlug, setSelectedChildCategorySlug] =
    useState(null);

  const urlSubCategorySlug = searchParams.get("subcategory");
  const urlChildCategorySlug = searchParams.get("childcategory");

  // ==========================
  // SUB CATEGORIES
  // ==========================

  const { subCategories, loading: subCategoriesLoading } = useSelector(
    (state) => state.publicCategory,
  );

  useEffect(() => {
    dispatch(getSubCategoriesByCategory(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (!urlSubCategorySlug) {
      setSelectedSubCategory(null);
      setSelectedSubCategorySlug(null);

      return;
    }

    const subCategory = subCategories.find(
      (item) => item?.slug === urlSubCategorySlug,
    );

    setSelectedSubCategory(subCategory || null);
    setSelectedSubCategorySlug(urlSubCategorySlug);
  }, [urlSubCategorySlug, subCategories]);
  // ==========================
  // CHILD CATEGORIES
  // ==========================

  const {
    childCategories = [],
    childCategoriesLoading,
    childCategoriesError,
  } = useSelector((state) => state.publicCategory);

  useEffect(() => {
    if (!urlChildCategorySlug) {
      setSelectedChildCategory(null);
      setSelectedChildCategorySlug(null);

      return;
    }

    const childCategory = childCategories.find(
      (item) => item?.slug === urlChildCategorySlug,
    );

    setSelectedChildCategory(childCategory || null);
    setSelectedChildCategorySlug(urlChildCategorySlug);
  }, [urlChildCategorySlug, childCategories]);

  // ==========================
  // PRODUCTS
  // ==========================

  const {
    categoryProducts,
    subCategoryProducts,
    childCategoryProducts,

    categoryProductsLoading,
    subCategoryProductsLoading,
    childCategoryProductsLoading,

    categoryTotalProducts,
    subCategoryTotalProducts,
    childCategoryTotalProducts,

    categoryCurrentPage,
    subCategoryCurrentPage,
    childCategoryCurrentPage,

    categoryHasNextPage,
    subCategoryHasNextPage,
    childCategoryHasNextPage,
  } = usePublicProducts({
    getCategoryProducts: Boolean(slug),
    getSubCategoryProducts: Boolean(selectedSubCategorySlug),
    getChildCategoryProducts: Boolean(selectedChildCategorySlug),

    categorySlug: slug,
    subCategorySlug: selectedSubCategorySlug,
    childCategorySlug: selectedChildCategorySlug,

    params: {
      page: 1,
      limit: 12,
    },
  });

  // ==========================
  // PAGE LOAD / CATEGORY CHANGE
  // ==========================

  useEffect(() => {
    if (!slug) return;

    dispatch(clearChildCategories());

    dispatch(getChildCategoriesByCategory(slug));
  }, [dispatch, slug]);

  // ==========================
  // SUB CATEGORY CHANGE
  // ==========================

  useEffect(() => {
    if (!selectedSubCategorySlug) return;

    setSelectedChildCategory(null);
    setSelectedChildCategorySlug(null);

    dispatch(getChildCategoriesBySubCategory(selectedSubCategorySlug));
  }, [dispatch, selectedSubCategorySlug]);

  // ==========================
  // SUB CATEGORY CLICK
  // ==========================

  const handleSubCategoryClick = (subCategory) => {
    const clickedSlug = subCategory?.slug;

    if (!clickedSlug) return;

    // Same subcategory clicked again
    if (selectedSubCategorySlug === clickedSlug) {
      setSelectedSubCategory(null);
      setSelectedSubCategorySlug(null);

      setSelectedChildCategory(null);
      setSelectedChildCategorySlug(null);

      // Remove query params
      setSearchParams({});

      dispatch(clearChildCategories());

      if (slug) {
        dispatch(getChildCategoriesByCategory(slug));
      }

      return;
    }

    // Select subcategory
    setSelectedSubCategory(subCategory);
    setSelectedSubCategorySlug(clickedSlug);

    // Reset child category
    setSelectedChildCategory(null);
    setSelectedChildCategorySlug(null);

    // URL:
    // /categories/woman?subcategory=dresses
    setSearchParams({
      subcategory: clickedSlug,
    });

    // Load child categories
    dispatch(clearChildCategories());
    dispatch(getChildCategoriesBySubCategory(clickedSlug));
  };

  // ==========================
  // CHILD CATEGORY CLICK
  // ==========================

  const handleChildCategoryClick = (childCategory) => {
    const clickedSlug = childCategory?.slug;

    if (!clickedSlug) return;

    // Same child category clicked again
    if (selectedChildCategorySlug === clickedSlug) {
      setSelectedChildCategory(null);
      setSelectedChildCategorySlug(null);

      // Keep subcategory selected
      setSearchParams({
        subcategory: selectedSubCategorySlug,
      });

      return;
    }

    setSelectedChildCategory(childCategory);
    setSelectedChildCategorySlug(clickedSlug);

    // URL:
    // /categories/woman?subcategory=dresses&childcategory=party-dresses
    setSearchParams({
      subcategory: selectedSubCategorySlug,
      childcategory: clickedSlug,
    });
  };

  // ==========================
  // CURRENT PRODUCTS
  // ==========================

  const currentProducts = selectedChildCategorySlug
    ? childCategoryProducts
    : selectedSubCategorySlug
      ? subCategoryProducts
      : categoryProducts;

  const currentProductsLoading = selectedChildCategorySlug
    ? childCategoryProductsLoading
    : selectedSubCategorySlug
      ? subCategoryProductsLoading
      : categoryProductsLoading;

  const currentTotalProducts = selectedChildCategorySlug
    ? childCategoryTotalProducts
    : selectedSubCategorySlug
      ? subCategoryTotalProducts
      : categoryTotalProducts;

  // ==========================
  // RENDER
  // ==========================

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-7xl
        px-5
        py-1 md:py-5
        sm:px-5
        md:px-5
        xl:px-4
        xl:py-5
      "
    >
      <CategoryBreadcrumb
        categorySlug={slug}
        category={null}
        subCategory={selectedSubCategory}
        subCategorySlug={selectedSubCategorySlug}
        childCategory={selectedChildCategory}
        childCategorySlug={selectedChildCategorySlug}
      />

      {/* ==========================
          SUB CATEGORIES
      ========================== */}

      <section>
        <div className="mb-5">
          <Heading
            heading={"Shop by Category"}
            para={"Choose a category to explore"}
          />
        </div>

        {subCategoriesLoading ? (
          <CategorySkeleton />
        ) : subCategories.length > 0 ? (
          <div
            className="
              flex
              gap-5
              overflow-x-auto
              px-5
              py-2
              pb-3
              scrollbar-hide
              sm:gap-6
            "
          >
            {subCategories.map((subCategory) => (
              <SubCategoryCard
                key={subCategory?._id}
                subCategory={subCategory}
                selected={selectedSubCategorySlug === subCategory?.slug}
                onClick={() => handleSubCategoryClick(subCategory)}
              />
            ))}
          </div>
        ) : (
          <Empty text="No sub categories available." />
        )}
      </section>

      {/* ==========================
          CHILD CATEGORIES
      ========================== */}

      {childCategories.length > 0 && (
        <section className="mt-5 sm:mt-5">
          <div className="mb-5">
            <Heading
              heading={
                selectedSubCategorySlug
                  ? `${
                      selectedSubCategory?.name || selectedSubCategorySlug
                    } Collection`
                  : "Child Categories"
              }
              para={
                selectedSubCategorySlug
                  ? `Explore ${
                      selectedSubCategory?.name || selectedSubCategorySlug
                    } categories`
                  : `Explore ${slug} categories`
              }
            />
          </div>

          {childCategoriesLoading ? (
            <CategorySkeleton />
          ) : childCategoriesError ? (
            <Empty text={childCategoriesError} error />
          ) : childCategories.length > 0 ? (
            <div
              className="
                flex
                gap-5
                overflow-x-auto
                px-5
                py-2
                pb-3
                scrollbar-hide
                sm:gap-6
              "
            >
              {childCategories.map((childCategory) => (
                <SubCategoryCard
                  key={childCategory?._id}
                  subCategory={childCategory}
                  selected={selectedChildCategorySlug === childCategory?.slug}
                  onClick={() => handleChildCategoryClick(childCategory)}
                />
              ))}
            </div>
          ) : (
            <Empty text="No child categories found." />
          )}
        </section>
      )}

      {/* ==========================
          PRODUCTS
      ========================== */}

      <section className="mt-5">
        <div className="mb-5">
          <Heading
            heading={
              selectedChildCategory
                ? selectedChildCategory.name
                : selectedSubCategory
                  ? selectedSubCategory.name
                  : slug
            }
            para={`${currentTotalProducts} products found`}
          />
        </div>

        {currentProductsLoading ? (
          <ProductSkeleton />
        ) : currentProducts?.length > 0 ? (
          <div
            className="
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-3
              lg:grid-cols-4
            "
          >
            {currentProducts.map((product) => (
              <div key={product?._id}>
                <ProductCard product={product} />
                <pre className="hidden">{JSON.stringify(product, null, 2)}</pre>
              </div>
            ))}
          </div>
        ) : (
          <Empty text="No products found." />
        )}
      </section>
    </main>
  );
};

const CategorySkeleton = () => (
  <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide sm:gap-6">
    {Array.from({ length: 7 }).map((_, index) => (
      <div key={index} className="w-14 min-w-14 shrink-0 sm:w-16 sm:min-w-16">
        <div className="h-14 w-14 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 sm:h-16 sm:w-16" />

        <div className="mx-auto mt-2 h-3 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    ))}
  </div>
);

const ProductSkeleton = () => (
  <div
    className="
      grid
      grid-cols-2
      gap-4
      sm:grid-cols-3
      lg:grid-cols-4
    "
  >
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse overflow-hidden rounded-xl">
        <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-700" />

        <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />

        <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    ))}
  </div>
);

const Empty = ({ text, error = false }) => (
  <div className="py-5 text-center">
    <p
      className={`text-sm ${
        error
          ? "text-red-500 dark:text-red-400"
          : "text-slate-500 dark:text-slate-400"
      }`}
    >
      {text}
    </p>
  </div>
);

export default CategoryProducts;
