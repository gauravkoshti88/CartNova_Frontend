import React from "react";
import { motion } from "framer-motion";
import { X, TriangleAlert } from "lucide-react";
import { Loader } from "../States";
import { useGetActionInfo } from "../../hooks/useGetActionInfo";

const ActionInfo = ({ mode, slug, pageName, onClose, onDelete }) => {
  const {
    category,
    subCategory,
    childCategory,
    brand,
    loading,
    productCount,
    existSubCategory,
  } = useGetActionInfo(slug, mode, pageName);

  const currentData =
    pageName === "Category"
      ? category
      : pageName === "Sub-Category"
        ? subCategory
        : pageName === "Child-Category"
          ? childCategory
          : brand;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="w-[720px] rounded-2xl bg-white p-8 dark:bg-slate-800">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: 20,
      }}
      transition={{
        duration: 0.25,
      }}
      className="w-[720px] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800"
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b px-6 py-4 dark:border-slate-700">
        <h2 className="text-lg font-semibold">
          {mode === "view" ? `${pageName} Details` : `Delete ${pageName}`}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 transition hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Delete Warning */}

      {mode === "delete" && (
        <div className="mx-6 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <TriangleAlert size={22} className="mt-0.5 text-red-600" />

          <div>
            <h3 className="font-semibold text-red-700">Delete Confirmation</h3>

            <p className="mt-1 text-sm text-red-600">
              Are you sure you want to delete this {pageName.toLowerCase()}?
              This action cannot be undone.
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex gap-8">
          {/* Image */}

          <img
            src={
              currentData?.image?.url ||
              "https://placehold.co/160x160?text=No+Image"
            }
            alt={currentData?.name || pageName}
            className="h-36 w-36 rounded-xl border object-cover"
          />

          {/* Details */}

          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-4">
            {/* Name */}

            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>

              <p className="font-medium">{currentData?.name || "-"}</p>
            </div>

            {/* ID */}

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                {pageName} ID
              </h4>

              <p className="break-all">{currentData?._id || "-"}</p>
            </div>

            {/* Description */}

            {mode === "view" && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500">
                  Description
                </h4>

                <p>{currentData?.description || "-"}</p>
              </div>
            )}

            {/* Status */}

            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  currentData?.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {currentData?.status || "-"}
              </span>
            </div>

            {/* Product Count */}

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Product Count
              </h4>

              <p>{productCount ?? 0}</p>
            </div>

            {/* Relations */}

            <div className="col-span-2">
              <h4 className="mb-1 text-sm font-medium text-gray-500">
                {pageName === "Category"
                  ? "Sub Categories"
                  : pageName === "Sub-Category"
                    ? "Category"
                    : pageName === "Child-Category"
                      ? "Sub Category"
                      : "Categories"}
              </h4>

              <ul className="ml-5 list-disc space-y-1">
                {/* Category */}

                {pageName === "Category" && existSubCategory?.length > 0 ? (
                  existSubCategory.map((item) => (
                    <li key={item._id}>{item.name}</li>
                  ))
                ) : /* Sub Category */

                pageName === "Sub-Category" ? (
                  <li>{currentData?.category?.name || "-"}</li>
                ) : /* Child Category */

                pageName === "Child-Category" ? (
                  <li>
                    {currentData?.subCategory?.name ||
                      currentData?.sub_category?.name ||
                      currentData?.parent?.name ||
                      "-"}
                  </li>
                ) : /* Brand */

                pageName === "Brand" && currentData?.categories?.length > 0 ? (
                  currentData.categories.map((item) => (
                    <li key={item._id}>{item.name}</li>
                  ))
                ) : (
                  <li>Nil</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Child Category Parent Category */}

        {pageName === "Child-Category" && mode === "view" && (
          <div className="mt-6 grid grid-cols-2 gap-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900">
            <div>
              <span className="text-sm text-gray-500">Category</span>

              <p className="mt-1 font-medium">
                {currentData?.category?.name ||
                  currentData?.subCategory?.category?.name ||
                  currentData?.parentCategory?.name ||
                  "-"}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Sub Category</span>

              <p className="mt-1 font-medium">
                {currentData?.subCategory?.name ||
                  currentData?.sub_category?.name ||
                  currentData?.parent?.name ||
                  "-"}
              </p>
            </div>
          </div>
        )}

        {/* Dates */}

        <div className="mt-8 grid grid-cols-2 gap-6 border-t pt-6 text-sm dark:border-slate-700">
          <div>
            <span className="text-gray-500">Created At</span>

            <p className="mt-1">{formatDate(currentData?.createdAt)}</p>
          </div>

          <div>
            <span className="text-gray-500">Updated At</span>

            <p className="mt-1">{formatDate(currentData?.updatedAt)}</p>
          </div>
        </div>

        {/* Footer */}

        <div className="mt-8 flex justify-end gap-3 border-t pt-5 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 transition hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            {mode === "view" ? "Close" : "Cancel"}
          </button>

          {mode === "delete" && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
            >
              Delete {pageName}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActionInfo;
