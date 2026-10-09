import React from "react";
import { Link } from "react-router-dom";

import { useCategories } from "../../hooks/useCategories";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Breadcrumb from "../../components/Breadcrumb";
import { Heading } from "../../components/Heading";

const Categories = () => {
  useDocumentTitle("Categories");

  const { categories = [], loading } = useCategories();

  return (
    <section className="w-full">
      <main className="mx-auto w-full max-w-7xl px-4 py-1 sm:py-5 sm:px-6 lg:px-6">
        <Breadcrumb />

        <div className="mt-5">
          <Heading
            heading="All Categories"
            para="Explore products by category"
          />
        </div>

        {loading ? (
          <CategorySkeleton />
        ) : categories.length > 0 ? (
          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
              rounded-xl
              border
              border-gray-300
              p-3
              shadow-md
              shadow-gray-300
              sm:grid-cols-3
              sm:gap-4
              sm:p-4
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
            "
          >
            {categories.map((category) => (
              <Link
                key={category?._id}
                to={`/categories/${category?.slug}`}
                className="
                  group
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                  dark:border-slate-700
                  dark:bg-slate-800
                "
              >
                <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {category?.image?.url ? (
                    <img
                      src={category.image.url}
                      alt={category?.name || "Category"}
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
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-2.5 text-center sm:p-3">
                  <h2 className="truncate text-xs font-semibold text-slate-800 dark:text-white sm:text-sm">
                    {category?.name}
                  </h2>

                  {category?.description && (
                    <p className="mt-1 line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No categories found.
            </p>
          </div>
        )}
      </main>
    </section>
  );
};

const CategorySkeleton = () => (
  <div
    className="
      mt-5
      grid
      grid-cols-2
      gap-3
      sm:grid-cols-3
      sm:gap-4
      md:grid-cols-4
      lg:grid-cols-5
      xl:grid-cols-6
    "
  >
    {Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        className="
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          dark:border-slate-700
          dark:bg-slate-800
        "
      >
        <div className="aspect-square animate-pulse bg-slate-200 dark:bg-slate-700" />

        <div className="p-2.5 sm:p-3">
          <div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

          <div className="mx-auto mt-2 h-2.5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    ))}
  </div>
);

export default Categories;
