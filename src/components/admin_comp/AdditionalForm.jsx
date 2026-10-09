import { useNavigate, useSearchParams } from "react-router-dom";
import { LogSignBtn } from "../Buttons";
import Select from "react-select";
import { Save } from "lucide-react";
import { FormInput } from "../FormController";
import { useCategories } from "../../hooks/useCategories";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
} from "../../redux/thunks/categoryThunk";
import {
  createSubCategory,
  updateSubCategory,
} from "../../redux/thunks/subCategoryThunk";
import { createBrand, updateBrand } from "../../redux/thunks/brandThunk";
import {
  clearCategoryState,
  resetCategory,
  updateCategoryField,
} from "../../redux/slices/categorySlice";
import {
  clearSubCategoryState,
  resetSubCategory,
  updateSubCategoryField,
} from "../../redux/slices/subCategorySlice";
import {
  clearBrandState,
  resetBrand,
  updateBrandField,
} from "../../redux/slices/brandSlice";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import toast from "react-hot-toast";

export default function AdditionalForm({ isEdit = false }) {
  const [searchParama] = useSearchParams();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formType = searchParama.get("type");
  useDocumentTitle(`${formType.toUpperCase()} - Form | Admin`);
  const [categoryId, setCategoryId] = useState("");
  const { categories, loading: categoryLoading } = useCategories();
  const { category, loading: categoryiLoading } = useSelector(
    (state) => state.category,
  );
  const { subCategory, loading: subCategoryLoading } = useSelector(
    (state) => state.subCategory,
  );
  const { brand, loading: brandLoading } = useSelector((state) => state.brand);

  const currentData =
    formType === "category"
      ? category
      : formType === "sub-category"
        ? subCategory
        : brand;

  const getTitle = () => {
    if (formType === "category") return "Category";
    if (formType === "sub-category") return "Sub-Category";
    if (formType === "brand") return "Brand";
    return "Product";
  };

  const onCancel = () => {
    navigate(-1);
  };

  const handleChange = (eOrField, fieldValue) => {
    let field;
    let value;

    if (typeof eOrField === "string") {
      field = eOrField;
      value = fieldValue;
    } else {
      field = eOrField.target.name;

      if (field === "image") {
        const file = eOrField.target.files?.[0] || null;

        setImageFile(file);

        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
        } else {
          setImagePreview(null);
        }

        return;
      }

      value = eOrField.target.value;
    }

    switch (formType) {
      case "category":
        dispatch(updateCategoryField({ field, value }));
        break;

      case "sub-category":
        dispatch(updateSubCategoryField({ field, value }));
        break;

      case "brand":
        dispatch(updateBrandField({ field, value }));
        break;

      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", currentData.name);
    data.append("status", currentData.status);
    data.append("description", currentData.description);

    // Category / Brand
    if (formType === "brand") {
      currentData.categories.forEach((item) => {
        data.append("categories", typeof item === "object" ? item._id : item);
      });
    } else if (formType === "sub-category") {
      data.append("category", currentData.category);
    }

    // Image only if new file selected
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      let res;

      switch (formType) {
        case "category":
          if (isEdit) {
            res = await dispatch(
              updateCategory({
                slug: currentData?.slug,
                data,
              }),
            ).unwrap();
          } else {
            res = await dispatch(createCategory(data)).unwrap();
          }

          dispatch(clearCategoryState());
          break;

        case "sub-category":
          if (isEdit) {
            res = await dispatch(
              updateSubCategory({
                slug: currentData?.slug,
                data,
              }),
            ).unwrap();
          } else {
            res = await dispatch(createSubCategory(data)).unwrap();
          }

          dispatch(clearSubCategoryState());
          break;

        case "brand":
          if (isEdit) {
            res = await dispatch(
              updateBrand({
                slug: currentData?.slug,
                data,
              }),
            ).unwrap();
          } else {
            res = await dispatch(createBrand(data)).unwrap();
          }

          dispatch(clearBrandState());
          break;

        default:
          return;
      }

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error("Update failed");
      }

      if (!isEdit) {
        if (formType === "category") {
          dispatch(resetCategory());
        }
        if (formType === "sub-category") {
          dispatch(resetSubCategory());
        }
        if (formType === "brand") {
          dispatch(resetBrand());
        }
      }

      navigate(-1);
    } catch (error) {
      toast.error(error || "Something went wrong");
    }
  };
  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
    slug: category.slug,
  }));
  const displayImage = imagePreview || currentData?.image?.url || null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 shadow-sm p-5 max-w-5xl mx-5 md:mx-auto my-10">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-950 dark:text-gray-100">
            {isEdit ? "Edit" : "Add New"} {getTitle()}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
            Fill out the details below to add a {formType} to your inventory.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">{`${formType} Name`}</label>
              <input
                type="text"
                name="name"
                value={currentData?.name || ""}
                placeholder={`Enter ${formType} name`}
                onChange={handleChange}
                className="w-full px-3.5 py-2  border border-gray-200 rounded-xl text-sm text-gray-950 dark:text-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={currentData?.status || "active"}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white dark:bg-slate-600 text-black dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category */}
          {formType !== "category" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">
                Category
              </label>

              {formType === "brand" ? (
                <Select
                  isMulti
                  name="categories"
                  options={categoryOptions}
                  value={categoryOptions.filter((option) =>
                    (currentData?.categories || []).some((category) => {
                      const categoryId =
                        typeof category === "object" ? category?._id : category;

                      return String(categoryId) === String(option.value);
                    }),
                  )}
                  onChange={(selected) =>
                    handleChange(
                      "categories",
                      selected ? selected.map((item) => item.value) : [],
                    )
                  }
                  className="text-sm"
                  classNamePrefix="select"
                  placeholder="Select Categories..."
                />
              ) : (
                <Select
                  name="category"
                  options={categoryOptions}
                  value={
                    currentData?.category
                      ? categoryOptions.find(
                          (option) =>
                            String(option.value) ===
                            String(
                              typeof currentData.category === "object"
                                ? currentData.category._id
                                : currentData.category,
                            ),
                        ) || null
                      : null
                  }
                  onChange={(selected) =>
                    handleChange("category", selected?.value || "")
                  }
                  className="text-sm"
                  classNamePrefix="select"
                  placeholder="Select Category..."
                />
              )}
            </div>
          )}

          {/* Row 3: Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">
              Description
            </label>
            <textarea
              type="text"
              name="description"
              placeholder="Type here"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm text-gray-950 dark:text-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              rows={5}
              value={currentData?.description || ""}
              onChange={handleChange}
            />
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase mb-1.5">
              Logo / Image
            </label>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50/50 text-gray-400 hover:text-gray-800 cursor-pointer transition-colors flex flex-col items-center">
              <input
                type="file"
                name="image"
                accept="image/*"
                className="text-center"
                onChange={handleChange}
              />

              <span className="text-sm block mb-1">
                📸 Click or drag file here to upload
              </span>

              <span className="text-xs">PNG, JPG up to 2MB</span>
            </div>

            {displayImage && (
              <img
                src={displayImage}
                alt="Preview"
                className="mt-3 h-24 w-24 rounded-lg object-cover border"
              />
            )}
          </div>

          {/* Action Controls */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 dark:text-white dark:hover:text-black hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <LogSignBtn
              type="submit"
              text={isEdit ? `Update ${getTitle()}` : `Save ${getTitle()}`}
              Icon={Save}
              color={"bg-green-500 text-white"}
              loading={categoryLoading || subCategoryLoading || brandLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
