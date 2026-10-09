import React, { useRef, useState } from "react";
import ProductBasicInfo from "../adminProduct/ProductBasicInfo";
import { ProductHeader } from "../adminProduct/ProductHeader";
import AttributeBuilder from "../adminProduct/AttributeBuilder";
import VariantGenerator from "../adminProduct/VariantGenrator";
import ProductMedia from "../adminProduct/ProductMedia";
import InventorySection from "../adminProduct/InventorySection";
import ShippingSection from "../adminProduct/ShippingSection";
import OrganizationSection from "../adminProduct/OrganizationSection";

import PublishSection from "../adminProduct/PublishSection";
import WarrantySection from "../adminProduct/WarrantySection";
import ReturnPolicySection from "../adminProduct/ReturnPolicySection";

import useProductValidation from "../../hooks/useProductValidation";

import { AlertCircle, Save, X } from "lucide-react";
import ProductButton from "../Buttons";

import { useNavigate } from "react-router-dom";
import VariantTable from "../adminProduct/VariantTable";

import SEOSection from "../adminProduct/SEOSection";

import { useDispatch, useSelector } from "react-redux";

import {
  clearMessage,
  clearError,
  resetProduct,
} from "../../redux/slices/productSlice";

import { addNewProduct, updateProduct } from "../../redux/thunks/productThunk";
import { useToast } from "../../hooks/useToast";
import toast from "react-hot-toast";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

// import { resetProduct } from "../../redux/slices/productSlice";

const ProductForm = ({ isEdit = false }) => {
  useDocumentTitle(isEdit ? "Edit Product | Admin" : "Add New Product | Admin");
  const imageFiles = useRef(new Map());

  const { errors, isValid } = useProductValidation();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    success,
    message,
    error,
    loading: productLoading,
    product,
    basicInfo,
    attributes,
    variants,
    inventory,
    shipping,
    warranty,
    organization,
    seo,
    publish,
    returnPolicy,
    media,
  } = useSelector((state) => state.product);

  useToast({
    success,
    message,
    error,

    clearMessage: () => dispatch(clearMessage()),
    clearError: () => dispatch(clearError()),
  });

  const onCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!isValid) {
      const validationErrors = Object.values(errors).filter(Boolean);

      toast.error(
        <div>
          <p className="font-semibold">Please fix the following:</p>

          <ul className="mt-2 space-y-1">
            {validationErrors.map((error, index) => (
              <li
                key={index}
                className="flex list-none items-start gap-2 text-sm"
              >
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>,
      );

      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      const existingMedia = [];

      media.forEach((item) => {
        const file = imageFiles.current.get(item.id);

        if (file instanceof File) {
          formData.append("images", file);
        } else {
          existingMedia.push({
            publicId: item.publicId || "",
            url: item.url || "",
            alt: item.alt || "",
            isPrimary: item.isPrimary === true,
            attributeValueId: item.attributeValueId || null,
            width: item.width || 0,
            height: item.height || 0,
          });
        }
      });

      const mediaMeta = media.map((item) => ({
        id: item.id,
        isPrimary: item.isPrimary === true,
        alt: item.alt || "",
        attributeValueId: item.attributeValueId || null,
      }));

      formData.append("mediaMeta", JSON.stringify(mediaMeta));

      const attributeImageMeta = [];

      attributes.forEach((attribute) => {
        attribute.values.forEach((value) => {
          const files = imageFiles.current.get(value.id);

          if (!Array.isArray(files)) {
            return;
          }

          files.forEach((file, index) => {
            if (!(file instanceof File)) {
              return;
            }

            formData.append("attributeImages", file);

            attributeImageMeta.push({
              attributeId: attribute.id || null,
              attributeName: attribute.name || "",
              attributeValueId: value.id,
              attributeValueLabel: value.label || "",
              index,
            });
          });
        });
      });

      formData.append("attributeImageMeta", JSON.stringify(attributeImageMeta));

      const attributesData = attributes.map((attribute) => ({
        id: attribute.id,
        name: attribute.name,
        displayType: attribute.displayType,
        isPrimary: attribute.isPrimary || false,

        values: attribute.values.map((value) => ({
          id: value.id,
          label: value.label,
          color: value.color || "",

          images: (value.images || []).map((image) => ({
            id: image.id || "",
            url: image.url || "",
            publicId: image.publicId || "",
            alt: image.alt || "",
            isPrimary: image.isPrimary === true,
            width: image.width || 0,
            height: image.height || 0,
          })),
        })),
      }));

      const imageAttribute = attributes.find(
        (attribute) => attribute.displayType === "image",
      );

      const variantsData = variants.map((variant) => {
        const selectedValue = imageAttribute?.values?.find(
          (value) =>
            String(value.id) ===
            String(variant.attributes?.[imageAttribute.name]?.id),
        );

        const primaryImage =
          selectedValue?.images?.find((image) => image.isPrimary === true) ||
          null;

        const variantImage = variant.image || {};

        return {
          id: variant.id,

          sku: variant.sku || "",

          attributes: variant.attributes || {},

          mrp: Number(variant.mrp) || 0,

          discountPercentage: Number(variant.discountPercentage) || 0,

          salePrice: Number(variant.salePrice) || 0,

          stock: Number(variant.stock) || 0,

          barcode: variant.barcode || "",

          weight: variant.weight || "",

          active: variant.active !== undefined ? variant.active : true,

          image: primaryImage
            ? {
                publicId: primaryImage.publicId || "",
                url: primaryImage.url || "",
                alt: primaryImage.alt || "",
                isPrimary: true,
                attributeValueId: selectedValue?.id || null,
                width: primaryImage.width || 0,
                height: primaryImage.height || 0,
              }
            : {
                publicId: variantImage.publicId || "",
                url: variantImage.url || "",
                alt: variantImage.alt || "",
                isPrimary: variantImage.isPrimary === true,
                attributeValueId:
                  variantImage.attributeValueId || selectedValue?.id || null,
                width: variantImage.width || 0,
                height: variantImage.height || 0,
              },
        };
      });

      formData.append("basicInfo", JSON.stringify(basicInfo));

      formData.append("existingMedia", JSON.stringify(existingMedia));

      formData.append("attributes", JSON.stringify(attributesData));

      formData.append("variants", JSON.stringify(variantsData));

      formData.append("inventory", JSON.stringify(inventory));

      formData.append("shipping", JSON.stringify(shipping));

      formData.append("warranty", JSON.stringify(warranty));

      formData.append("organization", JSON.stringify(organization));

      formData.append("seo", JSON.stringify(seo));

      formData.append("publish", JSON.stringify(publish));

      formData.append("returnPolicy", JSON.stringify(returnPolicy));

      if (isEdit) {
        const result = await dispatch(
          updateProduct({
            slug: product?.slug,
            formData,
          }),
        ).unwrap();
      } else {
        const result = await dispatch(addNewProduct(formData)).unwrap();
      }

      dispatch(resetProduct());

      imageFiles.current.clear();
      navigate("/admin/products");
    } catch (error) {
      console.error("PRODUCT SAVE ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl bg-gray-100 p-3 dark:bg-slate-900">
      <ProductHeader isEdit={isEdit} />

      <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-700">
        <ProductBasicInfo />

        <ProductMedia imageFiles={imageFiles} />

        <AttributeBuilder imageFiles={imageFiles} />

        <VariantGenerator />

        <VariantTable />

        <InventorySection />

        <ShippingSection />

        <WarrantySection />

        <OrganizationSection />

        <SEOSection />

        <PublishSection />

        <ReturnPolicySection />

        <div className="mt-5 flex justify-end gap-4 border-t border-gray-300 pt-6">
          <ProductButton
            variant="secondary"
            Icon={X}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </ProductButton>

          <ProductButton
            variant="success"
            Icon={Save}
            onClick={handleSave}
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Saving..."
              : isEdit
                ? "Update Product"
                : "Save Product"}
          </ProductButton>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
