import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Pencil,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Ban,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProductActionInfo from "./admin_comp/ProductActionInfo";
import ActionInfo from "./admin_comp/ActionInfo";

import { resetCategory } from "../redux/slices/categorySlice";
import { resetSubCategory } from "../redux/slices/subCategorySlice";
import { resetBrand } from "../redux/slices/brandSlice";

import { deleteCategory } from "../redux/thunks/categoryThunk";
import { deleteSubCategory } from "../redux/thunks/subCategoryThunk";
import { deleteBrand } from "../redux/thunks/brandThunk";
import { deleteChildCategoryBySlug } from "../redux/thunks/childCategoryThunk";

const TableCard = ({
  handleSelectAll,
  filteredData = [],
  selectedDataIds = [],
  handleSelectRow,
  columns,
  pageName,
  onBlockCustomer,
  onUnblockCustomer,
}) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [action, setAction] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);

  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setAction(null);
    setSelectedSlug(null);
    setOpenMenu(null);

    if (pageName === "Category") {
      dispatch(resetCategory());
    } else if (pageName === "Sub-Category") {
      dispatch(resetSubCategory());
    } else if (pageName === "Brand") {
      dispatch(resetBrand());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (mode, slug) => {
    setOpenMenu(null);

    if (!slug) {
      return;
    }

    if (mode === "view") {
      setSelectedSlug(slug);
      setAction("view");
      return;
    }

    if (mode === "edit") {
      if (pageName === "Product") {
        navigate(`/admin/edit-product/${slug}`);
        return;
      }

      navigate(
        `/admin/edit-${pageName.toLowerCase()}/${slug}?type=${pageName.toLowerCase()}`,
      );

      return;
    }

    if (mode === "delete") {
      setSelectedSlug(slug);
      setAction("delete");
    }
  };

  const handleDelete = async () => {
    if (!selectedSlug) {
      return;
    }

    try {
      if (pageName === "Category") {
        await dispatch(deleteCategory(selectedSlug)).unwrap();
      } else if (pageName === "Sub-Category") {
        await dispatch(deleteSubCategory(selectedSlug)).unwrap();
      } else if (pageName === "Child-Category") {
        await dispatch(deleteChildCategoryBySlug(selectedSlug)).unwrap();
      } else if (pageName === "Brand") {
        await dispatch(deleteBrand(selectedSlug)).unwrap();
      } else {
        return;
      }

      handleClose();
    } catch (error) {
      console.error(`DELETE ${pageName} ERROR:`, error);
    }
  };

  const handleCustomerBlock = (customer) => {
    setOpenMenu(null);

    if (!customer?._id) {
      console.error("Customer ID not found.");
      return;
    }

    if (onBlockCustomer) {
      onBlockCustomer(customer);
    }
  };

  const handleCustomerUnblock = (customer) => {
    setOpenMenu(null);

    if (!customer?._id) {
      console.error("Customer ID not found.");
      return;
    }

    if (onUnblockCustomer) {
      onUnblockCustomer(customer);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-700">
      <div className="hide-scrollbar overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200">
              <th className="w-12 p-4 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredData.length > 0 &&
                    selectedDataIds.length === filteredData.length
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>

              {columns.map((col) => (
                <th key={col.key} className="p-4 text-sm font-semibold">
                  {col.label}
                </th>
              ))}

              <th className="p-4 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
            {filteredData.map((data, index) => {
              const isRowChecked = selectedDataIds.includes(data._id);

              return (
                <tr
                  key={data._id}
                  className={`transition-colors ${
                    isRowChecked
                      ? "bg-blue-50/40 hover:bg-blue-50/60 dark:bg-slate-600"
                      : "hover:bg-gray-50/50 dark:hover:bg-slate-600"
                  }`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={isRowChecked}
                      onChange={() => handleSelectRow(data._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  {columns.map((col) => (
                    <td key={col.key} className="p-3">
                      {col.render ? col.render(data) : data[col.key]}
                    </td>
                  ))}

                  <td className="relative p-4">
                    <div
                      ref={menuRef}
                      className="flex items-center justify-center"
                    >
                      <button
                        type="button"
                        title="Actions"
                        onClick={() =>
                          setOpenMenu(openMenu === data._id ? null : data._id)
                        }
                        className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 dark:text-white dark:hover:bg-slate-700"
                      >
                        <EllipsisVertical size={16} />
                      </button>

                      <AnimatePresence>
                        {openMenu === data._id && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.95,
                              y: -5,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.95,
                              y: -5,
                            }}
                            transition={{
                              duration: 0.15,
                            }}
                            className={`absolute right-0 z-50 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 ${
                              index >= filteredData.length - 2
                                ? "bottom-12"
                                : "top-12"
                            }`}
                          >
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 transition hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-slate-700"
                              onClick={() => handleAction("view", data?.slug)}
                            >
                              <Eye size={18} className="text-blue-500" />
                              <span>View {pageName}</span>
                            </button>

                            <button
                              type="button"
                              className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 transition hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-slate-700"
                              onClick={() => handleAction("edit", data?.slug)}
                            >
                              <Pencil size={18} className="text-amber-500" />
                              <span>Edit {pageName}</span>
                            </button>

                            <button
                              type="button"
                              className="flex w-full items-center gap-3 px-4 py-3 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleAction("delete", data?.slug)}
                            >
                              <Trash2 size={18} />
                              <span>Delete {pageName}</span>
                            </button>

                            {pageName === "Customer" && (
                              <>
                                <div className="my-1 border-t border-gray-200 dark:border-slate-700" />

                                {!data.isBlocked ? (
                                  <button
                                    type="button"
                                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 transition hover:bg-yellow-50 dark:text-gray-200 dark:hover:bg-slate-700"
                                    onClick={() => handleCustomerBlock(data)}
                                  >
                                    <Ban
                                      size={18}
                                      className="text-yellow-500"
                                    />
                                    <span>Block {pageName}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 transition hover:bg-green-50 dark:text-gray-200 dark:hover:bg-slate-700"
                                    onClick={() => handleCustomerUnblock(data)}
                                  >
                                    <CircleCheck
                                      size={18}
                                      className="text-green-500"
                                    />
                                    <span>Unblock {pageName}</span>
                                  </button>
                                )}
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence mode="wait">
        {action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            {pageName === "Product" ? (
              <ProductActionInfo
                mode={action}
                slug={selectedSlug}
                onClose={handleClose}
              />
            ) : (
              <ActionInfo
                mode={action}
                onClose={handleClose}
                onDelete={handleDelete}
                pageName={pageName}
                slug={selectedSlug}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50/50 p-4 dark:border-slate-600 dark:bg-slate-900 sm:flex-row">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Showing{" "}
          <strong className="text-gray-700 dark:text-gray-300">
            {filteredData.length > 0 ? `1-${filteredData.length}` : "0"}
          </strong>{" "}
          of{" "}
          <strong className="text-gray-700 dark:text-gray-300">
            {filteredData.length}
          </strong>{" "}
          {pageName.toLowerCase()}s
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            1
          </button>

          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-all hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableCard;
