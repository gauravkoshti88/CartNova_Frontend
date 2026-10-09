import { motion } from "framer-motion";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

export const SubCategoryCard = ({ subCategory, selected = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        w-14
        min-w-14
        shrink-0
        text-center
        sm:w-16
        sm:min-w-16
        ${selected ? "scale-105" : ""}
      `}
    >
      <div
        className={`
          overflow-hidden
          rounded-xl
          transition-all
          duration-300
          ${
            selected
              ? "ring-2 ring-accent-500 ring-offset-2 dark:ring-offset-slate-950"
              : "group-hover:ring-1 group-hover:ring-slate-300 dark:group-hover:ring-slate-600"
          }
        `}
      >
        {subCategory?.image?.url ? (
          <img
            src={subCategory.image.url}
            alt={subCategory?.name || "Category"}
            className="
              h-14
              w-14
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
              sm:h-16
              sm:w-16
            "
          />
        ) : (
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-xl
              bg-slate-100
              text-[10px]
              text-slate-400
              dark:bg-slate-800
              sm:h-16
              sm:w-16
            "
          >
            No Image
          </div>
        )}
      </div>

      <p
        className={`
          mt-1.5
          truncate
          text-xs
          font-medium
          sm:text-sm
          ${
            selected
              ? "text-accent-600 dark:text-accent-400"
              : "text-slate-700 dark:text-slate-300"
          }
        `}
      >
        {subCategory?.name || "-"}
      </p>
    </button>
  );
};

export default function ProductCard({
  children,
  className = "",
  title,
  description,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
      className={clsx(
        "bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-6",
        className,
      )}
    >
      {title && (
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}

      {children}
    </motion.div>
  );
}
