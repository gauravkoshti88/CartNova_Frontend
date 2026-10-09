import React, { useState } from "react";
import TableCard from "../../components/TableCard";
import { LogSignBtn } from "../../components/Buttons";
import { Heading } from "../../components/Heading";
import { Download, Plus } from "lucide-react";
import { DescriptionCell } from "../../components/admin_comp/DescriptionCell";
import Select from "react-select";

import { useSelector } from "react-redux";

import { useCategories } from "../../hooks/useCategories";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useChildCategories } from "../../hooks/useChildCategories";

import { updateChildCategoryStatus } from "../../redux/thunks/childCategoryThunk";

import NoDataFound from "../../components/NoDataFound";
import { childCategoryExportToExcel } from "../../utils/excelHelper";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import toast from "react-hot-toast";

const ChildCategories = () => {
  useDocumentTitle("Child-Categories | Admin");
  const { categories = [], loading: categoryLoading } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedChildCategoryIds, setSelectedChildCategoryIds] = useState([]);

  // Category ke according sub-categories
  const { subCategories = [], loading: subCategoryLoading } = useSubCategories(
    selectedCategory?.value,
  );

  // Sub-category selected hai to slug ke according
  // warna saare child categories
  const {
    childCategories = [],
    loading: childCategoryLoading,
    error: childCategoryError,
  } = useChildCategories(selectedSubCategory?.value);

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: 42,
      borderRadius: 12,
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
      cursor: "pointer",
      backgroundColor: "white",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "#fff" : "#111827",
      cursor: "pointer",
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 50,
      borderRadius: 12,
      overflow: "hidden",
    }),
  };

  // -----------------------------------------
  // CATEGORY OPTIONS
  // -----------------------------------------

  const categoryOptions = categories.map((category) => ({
    value: category?.slug,
    label: category?.name,
  }));

  // -----------------------------------------
  // SUB CATEGORY OPTIONS
  // -----------------------------------------

  const subCategoryOptions = subCategories.map((subCategory) => ({
    value: subCategory?.slug,
    label: subCategory?.name,
  }));

  // -----------------------------------------
  // CATEGORY CHANGE
  // -----------------------------------------

  const handleCategoryChange = (option) => {
    setSelectedCategory(option);

    // Category change hone par sub-category reset
    setSelectedSubCategory(null);

    // Selected rows reset
    setSelectedChildCategoryIds([]);
  };

  // -----------------------------------------
  // SUB CATEGORY CHANGE
  // -----------------------------------------

  const handleSubCategoryChange = (option) => {
    setSelectedSubCategory(option);

    // Selected rows reset
    setSelectedChildCategoryIds([]);
  };

  // -----------------------------------------
  // STATUS CHANGE
  // -----------------------------------------

  const handleStatusChange = async (row) => {
    const newStatus = row?.status === "active" ? "inactive" : "active";

    const ok = window.confirm(
      `Are you sure you want to change status to ${newStatus}?`,
    );

    if (!ok) return;

    try {
      await updateChildCategoryStatus({
        slug: row?.slug,
        status: newStatus,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update child category status");
    }
  };

  // -----------------------------------------
  // SELECT ROW
  // -----------------------------------------

  const handleSelectRow = (id) => {
    setSelectedChildCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // -----------------------------------------
  // SELECT ALL
  // -----------------------------------------

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = childCategories.map((item) => item?._id || item?.id);

      setSelectedChildCategoryIds(allIds);
    } else {
      setSelectedChildCategoryIds([]);
    }
  };

  // -----------------------------------------
  // EXPORT
  // -----------------------------------------

  const handleExportAction = () => {
    if (!childCategories.length) {
      toast.success("No data available to export.");
      return;
    }

    const dataToExport =
      selectedChildCategoryIds.length > 0
        ? childCategories.filter((item) =>
            selectedChildCategoryIds.includes(item?._id || item?.id),
          )
        : childCategories;

    const fileName =
      selectedChildCategoryIds.length > 0
        ? "Selected_Child_Categories"
        : "All_Child_Categories";

    childCategoryExportToExcel(dataToExport, fileName);
  };

  // -----------------------------------------
  // TABLE COLUMNS
  // -----------------------------------------

  const columns = [
    {
      key: "image",
      label: "Image",

      render: (row) => (
        <div className="flex items-center">
          {row?.image?.url ? (
            <img
              src={row.image.url}
              alt={row?.name || "Child Category"}
              className="h-12 w-12 rounded-xl border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-500">
              N/A
            </div>
          )}
        </div>
      ),
    },

    {
      key: "name",
      label: "Child Category Name",

      render: (row) => (
        <span className="font-medium text-gray-800 dark:text-white">
          {row?.name || "-"}
        </span>
      ),
    },

    {
      key: "categoryId",
      label: "Child Category ID",

      render: (row) => (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
          {row?._id ? row._id.toUpperCase().slice(-7) : "-"}
        </span>
      ),
    },

    {
      key: "subCategories",
      label: "Sub Categories",

      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row?.subCategories) && row.subCategories.length > 0 ? (
            row.subCategories.map((subCategory) => (
              <span
                key={subCategory?._id}
                className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
              >
                {subCategory?.name || "-"}
              </span>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },

    {
      key: "description",
      label: "Description",

      render: (row) => <DescriptionCell text={row?.description} />,
    },

    {
      key: "status",
      label: "Status",

      render: (row) => (
        <button
          type="button"
          onClick={() => handleStatusChange(row)}
          className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium ${
            row?.status === "active"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {row?.status || "inactive"}
        </button>
      ),
    },
  ];

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <main className="mx-auto w-full max-w-[1400px] flex-1 p-8">
        <Heading
          heading="Child Category Management"
          para="Create, edit, and view all child categories"
        />

        {/* FILTER BAR */}
        <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-700 sm:flex-row">
          {/* ACTIONS */}
          <div className="flex w-full gap-3 sm:w-auto">
            <LogSignBtn
              text="Add New Child Category"
              to="/admin/child-category"
              Icon={Plus}
              color="bg-accent-600 text-white"
            />

            <LogSignBtn
              text="Export All"
              Icon={Download}
              handleFunc={handleExportAction}
              color="bg-white text-black"
            />
          </div>

          {/* SELECTS */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {/* CATEGORY */}
            <div className="w-full sm:w-56">
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={handleCategoryChange}
                isSearchable
                isClearable
                isLoading={categoryLoading}
                placeholder="Select Category"
                styles={customSelectStyles}
              />
            </div>

            {/* SUB CATEGORY */}
            <div className="w-full sm:w-56">
              <Select
                options={subCategoryOptions}
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
                isSearchable
                isClearable
                isLoading={subCategoryLoading}
                isDisabled={!selectedCategory}
                placeholder={
                  selectedCategory
                    ? "Select Sub Category"
                    : "Select Category First"
                }
                styles={customSelectStyles}
              />
            </div>
          </div>
        </div>

        {/* ERROR */}
        {childCategoryError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {childCategoryError}
          </div>
        )}

        {/* TABLE */}
        {childCategoryLoading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          </div>
        ) : childCategories.length > 0 ? (
          <TableCard
            handleSelectAll={handleSelectAll}
            filteredData={childCategories}
            selectedDataIds={selectedChildCategoryIds}
            handleSelectRow={handleSelectRow}
            columns={columns}
            pageName="Child-Category"
          />
        ) : (
          <NoDataFound title="Child-Category" link="/admin/child-category" />
        )}
      </main>
    </div>
  );
};

export default ChildCategories;
