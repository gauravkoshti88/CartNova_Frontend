import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Save } from "lucide-react";

import { LogSignBtn } from "../Buttons";

import { useCategories } from "../../hooks/useCategories";
import { useSubCategories } from "../../hooks/useSubCategories";

import {
  createChildCategory,
  updateChildCategory,
} from "../../redux/thunks/childCategoryThunk";

import {
  resetChildCategory,
  resetChildCategoryState,
  updateChildCategoryField,
  clearChildCategoryError,
} from "../../redux/slices/childCategorySlice";
import toast from "react-hot-toast";

export default function ChildCategoryForm({ isEdit = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { slug } = useParams();

  const [categorySlug, setCategorySlug] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { categories = [], loading: categoryLoading } = useCategories();

  const {
    childCategory,
    childCategoryLoading,
    childCategoryError,
    createLoading,
    createError,
    updateLoading,
    updateError,
  } = useSelector((state) => state.childCategory);

  const { subCategories = [], loading: subCategoryLoading } =
    useSubCategories(categorySlug);

  const selectedSubCategories = childCategory?.subCategories || [];

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      value: category.slug,
      label: category.name,
      _id: category._id,
    }));
  }, [categories]);

  const selectedCategory = useMemo(() => {
    if (!categorySlug) {
      return null;
    }

    return (
      categories.find(
        (category) => String(category.slug) === String(categorySlug),
      ) || null
    );
  }, [categories, categorySlug]);

  const subCategoryOptions = useMemo(() => {
    return subCategories.map((item) => ({
      value: item._id,
      label: item.name,
    }));
  }, [subCategories]);

  const selectedSubCategoryOptions = useMemo(() => {
    return selectedSubCategories
      .map((item) => {
        const id = typeof item === "object" ? item?._id : item;

        if (!id) {
          return null;
        }

        const subCategory = subCategories.find(
          (sub) => String(sub._id) === String(id),
        );

        if (subCategory) {
          return {
            value: subCategory._id,
            label: subCategory.name,
          };
        }

        if (typeof item === "object" && item?._id) {
          return {
            value: item._id,
            label: item.name,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [selectedSubCategories, subCategories]);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    if (!selectedSubCategories.length) {
      return;
    }

    const firstSubCategory = selectedSubCategories[0];

    if (typeof firstSubCategory === "object" && firstSubCategory?.category) {
      const category = firstSubCategory.category;

      const slugValue =
        typeof category === "object" ? category?.slug : category;

      if (slugValue) {
        setCategorySlug(slugValue);
      }

      return;
    }

    if (childCategory?.category && typeof childCategory.category === "object") {
      const slugValue = childCategory.category?.slug;

      if (slugValue) {
        setCategorySlug(slugValue);
      }
    }
  }, [isEdit, selectedSubCategories, childCategory?.category]);

  useEffect(() => {
    if (!childCategory?.image) {
      return;
    }

    if (typeof childCategory.image === "object" && childCategory.image?.url) {
      setImagePreview(childCategory.image.url);
    } else if (typeof childCategory.image === "string") {
      setImagePreview(childCategory.image);
    }
  }, [childCategory?.image]);

  useEffect(() => {
    if (!imageFile) {
      return;
    }

    const url = URL.createObjectURL(imageFile);

    setImagePreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0] || null;

      setImageFile(file);

      return;
    }

    dispatch(
      updateChildCategoryField({
        field: name,
        value,
      }),
    );
  };

  const handleCategoryChange = (selected) => {
    const value = selected?.value || "";

    setCategorySlug(value);

    dispatch(
      updateChildCategoryField({
        field: "subCategories",
        value: [],
      }),
    );
  };

  const handleSubCategoryChange = (selected) => {
    const values = selected?.map((item) => item.value) || [];

    dispatch(
      updateChildCategoryField({
        field: "subCategories",
        value: values,
      }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!childCategory?.name?.trim()) {
      toast.error("Child category name is required");
      return;
    }

    if (!categorySlug) {
      toast.error("Please select a category");
      return;
    }

    if (!selectedSubCategories.length) {
      toast.error("Please select at least one sub category");
      return;
    }

    const data = new FormData();

    data.append("name", childCategory.name.trim());

    data.append("description", childCategory.description || "");

    data.append("status", childCategory.status || "active");

    selectedSubCategories.forEach((item) => {
      const id = typeof item === "object" ? item?._id : item;

      if (id) {
        data.append("subCategories", id);
      }
    });

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      let response;

      if (isEdit) {
        if (!slug) {
          toast.error("Child category slug is missing");
          return;
        }

        response = await dispatch(
          updateChildCategory({
            slug,
            data,
          }),
        ).unwrap();
      } else {
        response = await dispatch(createChildCategory(data)).unwrap();
      }

      if (response?.success) {
        toast.success(
          response?.message ||
            `Child category ${isEdit ? "updated" : "created"} successfully`,
        );

        setImageFile(null);
        setImagePreview(null);

        dispatch(resetChildCategory());
        dispatch(resetChildCategoryState());

        navigate(-1);
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong",
      );
    }
  };

  const formLoading = childCategoryLoading || createLoading || updateLoading;

  const formError = childCategoryError || createError || updateError;

  const handleCancel = () => {
    setImageFile(null);
    setImagePreview(null);

    dispatch(resetChildCategory());

    navigate(-1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          {isEdit ? "Edit" : "Add New"} Child-Category
        </h1>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          {isEdit
            ? "Update the child category details below."
            : "Fill out the details below to create a new child category."}
        </p>
      </div>

      {formError && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <span>{formError}</span>

          <button
            type="button"
            onClick={() => dispatch(clearChildCategoryError())}
            className="font-semibold hover:underline"
          >
            ×
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                Child Category Name
              </label>

              <input
                type="text"
                name="name"
                value={childCategory?.name || ""}
                onChange={handleChange}
                placeholder="Enter child category name"
                required
                disabled={formLoading}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-700"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                Status
              </label>

              <select
                name="status"
                value={childCategory?.status || "active"}
                onChange={handleChange}
                disabled={formLoading}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="active">Active</option>

                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              Category
            </label>

            <Select
              name="category"
              options={categoryOptions}
              value={
                selectedCategory
                  ? {
                      value: selectedCategory.slug,
                      label: selectedCategory.name,
                      _id: selectedCategory._id,
                    }
                  : null
              }
              onChange={handleCategoryChange}
              isLoading={categoryLoading}
              isDisabled={categoryLoading || formLoading}
              className="text-sm"
              classNamePrefix="select"
              placeholder="Select Category..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              Sub Categories
            </label>

            <Select
              isMulti
              options={subCategoryOptions}
              value={selectedSubCategoryOptions}
              onChange={handleSubCategoryChange}
              isLoading={subCategoryLoading}
              isDisabled={!categorySlug || subCategoryLoading || formLoading}
              className="text-sm"
              classNamePrefix="select"
              placeholder={
                !categorySlug
                  ? "Select Category first..."
                  : subCategoryLoading
                    ? "Loading Sub Categories..."
                    : "Select Sub Categories..."
              }
              noOptionsMessage={() =>
                categorySlug
                  ? "No sub categories found"
                  : "Select a category first"
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              value={childCategory?.description || ""}
              onChange={handleChange}
              placeholder="Enter child category description"
              required
              disabled={formLoading}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
              Logo / Image
            </label>

            <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-gray-200 p-5 text-center text-gray-400 dark:border-slate-600 sm:p-6">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={formLoading}
                required={!isEdit}
                className="w-full text-center text-xs sm:text-sm"
              />

              <span className="mb-1 mt-3 block text-xs sm:text-sm">
                📸 Click or drag file here to upload
              </span>

              <span className="text-[10px] sm:text-xs">PNG, JPG up to 2MB</span>
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Child category preview"
                className="mt-3 h-24 w-24 rounded-lg border object-cover"
              />
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 dark:border-slate-700 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={formLoading}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            >
              Cancel
            </button>

            <LogSignBtn
              type="submit"
              text={isEdit ? "Update Child-Category" : "Save Child-Category"}
              Icon={Save}
              color="bg-green-500 text-white"
              loading={formLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
