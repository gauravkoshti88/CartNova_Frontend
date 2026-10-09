import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Package } from "lucide-react";

import { updateBasicInfo } from "../../redux/slices/productSlice";
import ProductInput, { TagInput, Textarea } from "../FormController";
import ProductCard from "../Cards";

import { useCategories } from "../../hooks/useCategories";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useBrands } from "../../hooks/useBrand";
import { useChildCategories } from "../../hooks/useChildCategories";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
    boxShadow: state.isFocused ? "0 0 0 2px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
};

export default function ProductBasicInfo() {
  const dispatch = useDispatch();

  const { categories = [] } = useCategories();

  const basicInfo = useSelector((state) => state.product.basicInfo);

  const { subCategories = [] } = useSubCategories(basicInfo.category);

  const { brands = [] } = useBrands(basicInfo.category);

  // Child categories will be fetched using sub-category slug
  const { childCategories = [], loading: childCategoryLoading } =
    useChildCategories(basicInfo.subCategory);

  const handleChange = (e) => {
    dispatch(
      updateBasicInfo({
        name: e.target.name,
        value: e.target.value,
      }),
    );
  };

  const handleTags = (tags) => {
    dispatch(
      updateBasicInfo({
        name: "tags",
        value: tags,
      }),
    );
  };

  const handleCategoryChange = (selectedOption) => {
    dispatch(
      updateBasicInfo({
        name: "category",
        value: selectedOption?.value || "",
      }),
    );

    // Reset dependent fields
    dispatch(
      updateBasicInfo({
        name: "subCategory",
        value: "",
      }),
    );

    dispatch(
      updateBasicInfo({
        name: "childCategory",
        value: "",
      }),
    );

    dispatch(
      updateBasicInfo({
        name: "brand",
        value: "",
      }),
    );
  };

  const handleSubCategoryChange = (selectedOption) => {
    dispatch(
      updateBasicInfo({
        name: "subCategory",
        value: selectedOption?.value || "",
      }),
    );

    // Reset child category whenever sub-category changes
    dispatch(
      updateBasicInfo({
        name: "childCategory",
        value: "",
      }),
    );
  };

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.slug,
  }));

  const subCategoryOptions = subCategories.map((subCategory) => ({
    label: subCategory.name,
    value: subCategory.slug,
  }));

  const brandOptions = brands.map((brand) => ({
    label: brand.name,
    value: brand.slug,
  }));

  const childCategoryOptions = childCategories.map((childCategory) => ({
    label: childCategory.name,
    value: childCategory.slug,
  }));

  const selectedCategory =
    categoryOptions.find((option) => option.value === basicInfo.category) ||
    null;

  const selectedSubCategory =
    subCategoryOptions.find(
      (option) => option.value === basicInfo.subCategory,
    ) || null;

  const selectedBrand =
    brandOptions.find((option) => option.value === basicInfo.brand) || null;

  const selectedChildCategory =
    childCategoryOptions.find(
      (option) =>
        option.value === basicInfo.childCategory?.slug ||
        option.value === basicInfo.childCategory,
    ) || null;

  return (
    <ProductCard
      title="Basic Information"
      description="Enter your product details."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Product Name */}
        <ProductInput
          label="Product Name"
          name="productName"
          value={basicInfo.productName}
          onChange={handleChange}
          placeholder="Nike Air Max"
          Icon={Package}
        />

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>

          <Select
            placeholder="Select Category"
            styles={selectStyles}
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            isSearchable
            isClearable
          />
        </div>

        {/* Sub Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sub Category</label>

          <Select
            placeholder={
              basicInfo.category
                ? "Select Sub Category"
                : "Select Category First"
            }
            isDisabled={!basicInfo.category}
            styles={selectStyles}
            options={subCategoryOptions}
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            isSearchable
            isClearable
          />
        </div>

        {/* Child Category */}
        {basicInfo.subCategory && childCategories.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Child Category</label>

            <Select
              placeholder={
                childCategoryLoading
                  ? "Loading Child Categories..."
                  : "Select Child Category"
              }
              isDisabled={childCategoryLoading}
              isLoading={childCategoryLoading}
              styles={selectStyles}
              options={childCategoryOptions}
              value={selectedChildCategory}
              onChange={(selectedOption) =>
                dispatch(
                  updateBasicInfo({
                    name: "childCategory",
                    value: selectedOption?.value || "",
                  }),
                )
              }
              isSearchable
              isClearable
            />
          </div>
        )}

        {/* Brand */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>

          <Select
            placeholder={
              basicInfo.category ? "Select Brand" : "Select Category First"
            }
            isDisabled={!basicInfo.category}
            isSearchable
            isClearable
            styles={selectStyles}
            options={brandOptions}
            value={selectedBrand}
            onChange={(selectedOption) =>
              dispatch(
                updateBasicInfo({
                  name: "brand",
                  value: selectedOption?.value || "",
                }),
              )
            }
          />
        </div>
      </div>

      {/* Short Description */}
      <div className="mt-5">
        <Textarea
          label="Short Description"
          name="shortDescription"
          value={basicInfo.shortDescription}
          onChange={handleChange}
          placeholder="Write a short description..."
          rows={3}
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <Textarea
          label="Description"
          name="description"
          value={basicInfo.description}
          onChange={handleChange}
          placeholder="Full product description..."
          rows={6}
        />
      </div>

      {/* Tags */}
      <div className="mt-5">
        <TagInput
          name="tags"
          label="Tags"
          value={basicInfo.tags}
          onChange={handleTags}
        />
      </div>
    </ProductCard>
  );
}
