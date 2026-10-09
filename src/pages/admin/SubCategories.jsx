import React, { useState } from "react";
import TableCard from "../../components/TableCard";
import { SearchBar } from "../../components/FormController";
import { LogSignBtn } from "../../components/Buttons";
import { Heading } from "../../components/Heading";
import { Download, Plus } from "lucide-react";
import { subcategoryExportToExcel } from "../../utils/excelHelper";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useCategories } from "../../hooks/useCategories";
import { DescriptionCell } from "../../components/admin_comp/DescriptionCell";
import { searchFilter } from "../../utils/searchFilter";
import { updateSubCategoryStatus } from "../../redux/thunks/subCategoryThunk";
import { useDispatch } from "react-redux";
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
        {typeof row.image === "string" ? (
          row.image
        ) : (
          <img src={row.image.url} alt={row.name} />
        )}
      </div>
    ),
  },
  {
    key: "name",
    label: "Sub-Category Name",
    render: (row) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {row.name}
      </span>
    ),
  },
  {
    key: "subcategoryId",
    label: "Subcategory Id",
    render: (row) => (
      <span className="bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md text-xs">
        {row._id?.toUpperCase().slice(-7)}
      </span>
    ),
  },
  {
    key: "category",
    label: "Category",
    render: (row) => (
      <span className="text-gray-700 dark:text-gray-50">
        {row.category.name}
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
        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer
                ${
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

const SubCategories = () => {
  useDocumentTitle("Sub-Categories | Admin");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All Status",
  });
  const { categories, loading: categoryLoading } = useCategories();
  const { subCategories, loading: subCategoryLoading } = useSubCategories(
    selectedCategory?.value || "",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState([]);
  const dispatch = useDispatch();

  const categoryOptions = [
    { value: "", label: "All Categories" },

    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleStatusChange = async (row) => {
    const newStatus = row.status === "active" ? "inactive" : "active";

    const ok = window.confirm(`Change status to ${newStatus}?`);

    if (!ok) return;

    try {
      const res = await dispatch(
        updateSubCategoryStatus({
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
    setSelectedSubcategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allFilteredIds = filteredSubcategory.map((p) => p._id);
      setSelectedSubcategoryIds(allFilteredIds);
    } else {
      setSelectedSubcategoryIds([]);
    }
  };

  const handleExportAction = () => {
    if (subCategories.length === 0) {
      toast.success("No data available to export.");
      return;
    }

    const dataToExport =
      selectedSubcategoryIds.length > 0
        ? subCategories.filter((p) => selectedSubcategoryIds.includes(p.id))
        : subCategories;

    const fileName =
      selectedSubcategoryIds.length > 0
        ? "Selected_Subcategories"
        : "All_Subcategories";
    subcategoryExportToExcel(dataToExport, fileName);
  };

  const searchedSubCategory = searchFilter(subCategories, searchTerm, [
    (c) => c.name,
    (c) => c._id,
    (c) => c.category?.name,
    (c) => c.description,
  ]);

  const filteredSubcategory =
    statusFilter.value === "all"
      ? searchedSubCategory
      : searchedSubCategory.filter(
          (item) => item.status === statusFilter.value,
        );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-800 text-gray-800 dark:text-white font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto">
          <Heading
            heading={"Subcategory Management"}
            para={"Create, edit, and view all product subcategories"}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-slate-100 dark:bg-slate-700 p-3 rounded-xl">
            <div className="flex gap-3 w-full sm:w-auto">
              <LogSignBtn
                text={"Add New Subcategory"}
                to={"/admin/add?type=sub-category"}
                Icon={Plus}
                color={"bg-accent-600 text-white"}
              />
              <LogSignBtn
                text={"Export All"}
                Icon={Download}
                handleFunc={handleExportAction}
                color={"bg-white text-black"}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-64">
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  classNamePrefix="select"
                  placeholder="Filter Category"
                  isClearable
                />
              </div>

              <div className="w-52">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  classNamePrefix="select"
                  placeholder="Filter Status"
                  isSearchable={false}
                />
              </div>

              <SearchBar
                placeholder="Search subcategories..."
                value={searchTerm}
                setValue={setSearchTerm}
              />
            </div>
          </div>

          {subCategories.length > 0 && (
            <TableCard
              handleSelectAll={handleSelectAll}
              filteredData={filteredSubcategory}
              selectedDataIds={selectedSubcategoryIds}
              handleSelectRow={handleSelectRow}
              columns={columns(handleStatusChange)}
              pageName={"Sub-Category"}
              selectOption={selectedCategory}
            />
          )}
          {subCategories.length === 0 && (
            <NoDataFound
              title={"Sub-Category"}
              link={"/admin/add?type=sub-category"}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default SubCategories;
