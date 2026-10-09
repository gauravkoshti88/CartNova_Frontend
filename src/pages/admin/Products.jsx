import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Plus,
  Download,
  Search,
  Pencil,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bell,
  MessageSquare,
} from "lucide-react";
import { Heading } from "../../components/Heading.jsx";
import { LogSignBtn } from "../../components/Buttons.jsx";
import { SearchBar } from "../../components/FormController.jsx";
import { productExportToExcel } from "../../utils/excelHelper.js";
import TableCard from "../../components/TableCard.jsx";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts.js";
import { useDispatch, useSelector } from "react-redux";
import { searchFilter } from "../../utils/searchFilter.js";
import Select from "react-select";
import { updateProductStatus } from "../../redux/thunks/productThunk.js";
import NoDataFound from "../../components/NoDataFound.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import toast from "react-hot-toast";

const columns = (handleStatusChange) => [
  {
    key: "image",
    label: "Image",
    render: (row) => {
      // 1. Product media ki primary image
      const mediaPrimaryImage = row.media?.find(
        (image) => image.isPrimary === true && image.url,
      );

      // 2. Attribute image ki primary image
      const imageAttribute = row.attributes?.find(
        (attribute) => attribute.displayType === "image",
      );

      const attributePrimaryImage = imageAttribute?.values
        ?.flatMap((value) => value.images || [])
        ?.find((image) => image.isPrimary === true && image.url);

      // 3. Media first, attribute image fallback
      const primaryImage = mediaPrimaryImage || attributePrimaryImage;

      return (
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {primaryImage?.url ? (
            <img
              src={primaryImage.url}
              alt={row.basicInfo?.productName || "Product"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>
      );
    },
  },

  {
    key: "productName",
    label: "Product Name",
    render: (row) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {row.basicInfo?.productName || "N/A"}
      </span>
    ),
  },

  {
    key: "category",
    label: "Category",
    render: (row) => (
      <span className="text-gray-700 dark:text-gray-50">
        {row.basicInfo?.category?.name || "N/A"}
      </span>
    ),
  },

  {
    key: "subcategory",
    label: "Subcategory",
    render: (row) => (
      <span className="bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md text-xs">
        {row.basicInfo?.subCategory?.name || "N/A"}
      </span>
    ),
  },

  {
    key: "price",
    label: "Price (INR)",
    render: (row) => {
      const prices = row.variants?.map((v) => Number(v.salePrice)) || [];

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return (
        <span className="font-semibold text-gray-900 dark:text-gray-50">
          ₹{minPrice} {minPrice !== maxPrice && `- ₹${maxPrice}`}
        </span>
      );
    },
  },

  {
    key: "stock",
    label: "Stock",
    render: (row) => {
      const totalStock =
        row.variants?.reduce(
          (sum, variant) => sum + Number(variant.stock || 0),
          0,
        ) || 0;

      if (totalStock === 0) {
        return (
          <span className="w-fit inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-red-600 text-white">
            Out of Stock
          </span>
        );
      }

      if (totalStock < 100) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-amber-500 text-white">
            {totalStock} Stock
          </span>
        );
      }

      return (
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-emerald-600 text-white">
          {totalStock} Stock
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const statusOptions = [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "scheduled", label: "Scheduled" },
        { value: "archived", label: "Archived" },
      ];

      return (
        <div className="w-30">
          <Select
            options={statusOptions}
            value={statusOptions.find(
              (option) => option.value === row.publish?.status,
            )}
            onChange={(selected) => handleStatusChange(row, selected.value)}
            classNamePrefix="select"
            isSearchable={false}
          />
        </div>
      );
    },
  },
  {
    key: "createdAt",
    label: "Created",
    render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
  },
];

export default function Product() {
  useDocumentTitle("Products | Admin");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const dispatch = useDispatch();

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "scheduled", label: "Scheduled" },
    { value: "archived", label: "Archived" },
  ];

  const handleStatusChange = async (row, newStatus) => {
    if (row.publish?.status === newStatus) return;

    const ok = window.confirm(`Change product status to "${newStatus}"?`);

    if (!ok) return;

    try {
      const res = await dispatch(
        updateProductStatus({
          slug: row?.slug,
          status: newStatus,
        }),
      ).unwrap();

      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Handle Header Master Checkbox toggle
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allFilteredIds = filteredProducts.map((p) => p._id);
      setSelectedProductIds(allFilteredIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleExportAction = () => {
    if (products.length === 0) {
      toast.success("No data available to export.");
      return;
    }

    const dataToExport =
      selectedProductIds.length > 0
        ? products.filter((p) => selectedProductIds.includes(p._id))
        : products;

    const fileName =
      selectedProductIds.length > 0
        ? "Selected_Products"
        : "Full_Product_Inventory";
    productExportToExcel(dataToExport, fileName);
  };

  const searchedProducts = searchFilter(products, searchTerm, [
    (p) => p.basicInfo?.productName,
    (p) => p.variants?.map((v) => v.sku).join(" "),
    (p) => p.basicInfo?.brand?.name,
    (p) => p.basicInfo?.category?.name,
    (p) => p.organization?.vendor,
    (p) => p.organization?.productType,
  ]);

  const filteredProducts = selectedStatus?.value
    ? searchedProducts.filter((p) => p.publish?.status === selectedStatus.value)
    : searchedProducts;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-800 text-gray-800 dark:text-white font-sans">
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* View container */}
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto">
          <Heading
            heading={"Product Inventory"}
            para={"Manage and view all your store products"}
          />

          {/* Action Bar controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-slate-100 dark:bg-slate-700 p-3 rounded-xl">
            <div className="flex gap-3 w-full sm:w-auto">
              <LogSignBtn
                text={"Add New Product"}
                to={"/admin/add-new-product"}
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

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-40">
                <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Filter Status"
                  classNamePrefix="select"
                />
              </div>

              <SearchBar
                placeholder="Search products..."
                value={searchTerm}
                setValue={setSearchTerm}
              />
            </div>
          </div>

          {/* --- DATA TABLE WINDOW --- */}
          {products.length > 0 && (
            <TableCard
              filteredData={filteredProducts}
              selectedDataIds={selectedProductIds}
              columns={columns(handleStatusChange)}
              handleSelectAll={handleSelectAll}
              handleSelectRow={handleSelectRow}
              pageName={"Product"}
            />
          )}

          {products.length === 0 && (
            <NoDataFound title={"Products"} link={"/admin/add-new-product"} />
          )}
        </main>
      </div>
    </div>
  );
}
