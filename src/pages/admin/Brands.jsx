import React, { useEffect, useState } from "react";
import TableCard from "../../components/TableCard";
import { SearchBar } from "../../components/FormController";
import { LogSignBtn } from "../../components/Buttons";
import { Heading } from "../../components/Heading";
import { Download, Plus } from "lucide-react";
import { brandExportToExcel } from "../../utils/excelHelper";
import { useBrands } from "../../hooks/useBrand";
import { useCategories } from "../../hooks/useCategories";
import { DescriptionCell } from "../../components/admin_comp/DescriptionCell";
import { useDispatch } from "react-redux";
import { getAllBrands, updateBrandStatus } from "../../redux/thunks/brandThunk";
import { searchFilter } from "../../utils/searchFilter";
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
        <img src={row?.image?.url} alt="" />
      </div>
    ),
  },
  {
    key: "name",
    label: "Brand Name",
    render: (row) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {row?.name}
      </span>
    ),
  },
  {
    key: "brandId",
    label: "Brand Id",
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
        {Array.isArray(row.categories)
          ? row?.categories.map((c) => c?.name || "Unknown").join(", ")
          : row?.category?.name || "No Category"}
      </span>
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
        onClick={() => handleStatusChange(row)}
        className={`px-3 py-1 rounded-full text-white text-xs ${
          row.status === "active" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {row.status}
      </button>
    ),
  },
];

const Brands = () => {
  useDocumentTitle("Brand | Admin");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState({
    value: "all",
    label: "All Status",
  });
  const { categories } = useCategories();
  const { brands, loading } = useBrands(selectedCategory?.value || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandIds, setSelectedBrandIds] = useState([]);

  const dispatch = useDispatch();

  const categoryOptions = [
    {
      value: "",
      label: "All Categories",
    },

    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];

  const statusOptions = [
    {
      value: "all",
      label: "All Status",
    },
    {
      value: "active",
      label: "Active",
    },
    {
      value: "inactive",
      label: "Inactive",
    },
  ];

  const handleStatusChange = async (brand) => {
    const newStatus = brand.status === "active" ? "inactive" : "active";

    const ok = window.confirm(
      `Are you sure you want to change status to ${newStatus}?`,
    );

    if (!ok) return;

    try {
      const res = await dispatch(
        updateBrandStatus({
          slug: brand?.slug,
          status: newStatus,
        }),
      ).unwrap();

      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allFilteredIds = filteredBrands.map((p) => p._id);
      setSelectedBrandIds(allFilteredIds);
    } else {
      setSelectedBrandIds([]);
    }
  };

  const handleExportAction = () => {
    if (brands.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const dataToExport =
      selectedBrandIds.length > 0
        ? brands.filter((p) => selectedBrandIds.includes(p._id))
        : brands;

    const fileName =
      selectedBrandIds.length > 0 ? "Selected_Brands" : "All_Brands";
    brandExportToExcel(dataToExport, fileName);
  };

  const searchedBrands = searchFilter(brands, searchTerm, [
    (b) => b.name,
    (b) => b._id,
    (b) => b.categories?.map((c) => c.name).join(", "),
    (b) => b.description,
  ]);

  const filteredBrands =
    statusFilter.value === "all"
      ? searchedBrands
      : searchedBrands.filter((brand) => brand.status === statusFilter.value);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-800 text-gray-800 dark:text-white font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto">
          <Heading
            heading={"Brand Management"}
            para={"Create, edit, and view all product brands"}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-slate-100 dark:bg-slate-700 p-3 rounded-xl">
            <div className="flex gap-3 w-full sm:w-auto">
              <LogSignBtn
                text={"Add New Brand"}
                to={"/admin/add?type=brand"}
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
                  placeholder="All Categories"
                  classNamePrefix="select"
                  isClearable
                />
              </div>

              <div className="w-52">
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="All Status"
                  classNamePrefix="select"
                  isSearchable={false}
                />
              </div>

              <SearchBar
                placeholder="Search brands..."
                value={searchTerm}
                setValue={setSearchTerm}
              />
            </div>
          </div>
          {brands.length > 0 && (
            <TableCard
              handleSelectAll={handleSelectAll}
              filteredData={filteredBrands}
              selectedDataIds={selectedBrandIds}
              handleSelectRow={handleSelectRow}
              columns={columns(handleStatusChange)}
              pageName={"Brand"}
            />
          )}
          {brands.length === 0 && (
            <NoDataFound title={"Brand"} link={"/admin/add?type=brand"} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Brands;
