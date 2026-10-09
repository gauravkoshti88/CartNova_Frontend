import React, { useState } from "react";
import TableCard from "../../components/TableCard";
import { SearchBar } from "../../components/FormController";
import { LogSignBtn } from "../../components/Buttons";
import { Heading } from "../../components/Heading";
import { Download, Plus } from "lucide-react";
import { categoryExportToExcel } from "../../utils/excelHelper";
import { useDispatch, useSelector } from "react-redux";
import { useCategories } from "../../hooks/useCategories";
import { DescriptionCell } from "../../components/admin_comp/DescriptionCell";
import { searchFilter } from "../../utils/searchFilter";
import { updateCategoryStatus } from "../../redux/thunks/categoryThunk";
import Select from "react-select";
import NoDataFound from "../../components/NoDataFound";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import toast from "react-hot-toast";

const columns = (handleStatusChange) => [
  {
    key: "image",
    label: "Image",
    render: (row) => (
      <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-xl shadow-inner">
        <img src={row.image.url} alt="" />
      </div>
    ),
  },
  {
    key: "name",
    label: "Category Name",
    render: (row) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {row.name}
      </span>
    ),
  },
  {
    key: "categoryId",
    label: "Category Id",
    render: (row) => (
      <span className="bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md text-xs">
        {row._id.toUpperCase().slice(-7)}
      </span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (row) => <DescriptionCell text={row.description} />,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <button
        onClick={() => handleStatusChange(row)}
        className={`px-3 py-1 rounded-full text-xs cursor-pointer font-medium ${
          row.status === "active"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.status}
      </button>
    ),
  },
];

const Categories = () => {
  useDocumentTitle("Categories | Admin");
  const { categories, loading: categoryLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const dispatch = useDispatch();

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: 42,
      borderRadius: 12,
      borderColor: "#d1d5db",
      boxShadow: "none",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "#fff" : "#111827",
    }),
  };

  const handleStatusChange = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";

    const ok = window.confirm(
      `Are you sure you want to change status to ${newStatus}?`,
    );

    if (!ok) return;

    try {
      const res = await dispatch(
        updateCategoryStatus({
          slug: row?.slug,
          status: newStatus,
        }),
      ).unwrap();

      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Handle Header Master Checkbox toggle
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allFilteredIds = filtered.map((p) => p.id);
      setSelectedCategoryIds(allFilteredIds);
    } else {
      setSelectedCategoryIds([]);
    }
  };

  // Export feature handler (All vs Selected)
  const handleExportAction = () => {
    if (categories.length === 0) {
      toast.success("No data available to export.");
      return;
    }

    const dataToExport =
      selectedCategoryIds.length > 0
        ? categories.filter((p) => selectedCategoryIds.includes(p.id))
        : categories;

    const fileName =
      selectedCategoryIds.length > 0 ? "Selected_Categories" : "All_Categories";
    categoryExportToExcel(dataToExport, fileName);
  };

  const searchedCategory = searchFilter(categories, searchTerm, [
    (c) => c.name,
    (c) => c._id,
    (c) => c.description,
  ]);

  const filteredCategory =
    statusFilter.value === "all"
      ? searchedCategory
      : searchedCategory.filter((item) => item.status === statusFilter.value);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-800 text-gray-800 dark:text-white font-sans">
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* View container */}
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto">
          <Heading
            heading={"Category Management"}
            para={"Create, edit, and view all product categories"}
          />

          {/* Action Bar controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-slate-100 dark:bg-slate-700 p-3 rounded-xl">
            <div className="flex gap-3 w-full sm:w-auto">
              <LogSignBtn
                text={"Add New Category"}
                to={"/admin/add?type=category"}
                Icon={Plus}
                color={"bg-accent-600 text-white"}
              />

              {/* Export Button */}
              <LogSignBtn
                text={"Export All"}
                Icon={Download}
                handleFunc={handleExportAction}
                color={"bg-white text-black"}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-52">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  isSearchable={false}
                  classNamePrefix="select"
                  placeholder="Filter Status"
                  styles={customSelectStyles}
                />
              </div>

              <SearchBar
                placeholder="Search categories..."
                value={searchTerm}
                setValue={setSearchTerm}
              />
            </div>
          </div>

          {/* --- DATA TABLE WINDOW --- */}
          {categories.length > 0 && (
            <TableCard
              handleSelectAll={handleSelectAll}
              filteredData={filteredCategory}
              selectedDataIds={selectedCategoryIds}
              handleSelectRow={handleSelectRow}
              columns={columns(handleStatusChange)}
              pageName={"Category"}
            />
          )}

          {categories.length === 0 && (
            <NoDataFound title={"Category"} link={"/admin/add?type=category"} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;
