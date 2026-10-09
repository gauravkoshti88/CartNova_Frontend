import { createSlice } from "@reduxjs/toolkit";
import { generateVariants } from "../../utils/generateVariants";
import { nanoid } from "nanoid";
import {
  addNewProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  updateProductStatus,
} from "../thunks/productThunk";

const calculateSalePrice = (mrp, discount) => {
  mrp = Number(mrp) || 0;
  discount = Number(discount) || 0;

  if (!mrp) return "";

  return (mrp - (mrp * discount) / 100).toFixed(2);
};

const initialState = {
  loading: false,
  loaded: false,
  success: false,
  error: null,
  message: null,

  products: [],
  product: null,
  relatedProducts: [],

  featuredProducts: [],
  newArrivalProducts: [],
  bestSellerProducts: [],

  totalProducts: 0,
  totalPages: 1,
  currentPage: 1,

  slug: "",

  basicInfo: {
    productName: "",
    shortDescription: "",
    description: "",
    brand: "",
    category: "",
    subCategory: "",
    childCategory: "",
    tags: [],
  },

  media: [],

  attributes: [],
  variants: [],

  selectedVariants: [],

  inventory: {
    trackInventory: true,
    allowBackorder: false,
    skuPrefix: "",
    barcode: "",
    lowStockAlert: 5,
    minOrderQty: 1,
    maxOrderQty: 10,
    weight: "",
    length: "",
    width: "",
    height: "",
  },

  shipping: {
    freeShipping: false,
    shippingClass: "standard",
    packageWeight: "",
    packageLength: "",
    packageWidth: "",
    packageHeight: "",
    estimatedDelivery: "",
    originCountry: "India",
  },

  warranty: {
    hasWarranty: false,
    warrantyType: "none",
    warrantyDuration: 0,
    warrantyUnit: "months",
    warrantyDescription: "",
  },

  organization: {
    brand: "",
    vendor: "",
    productType: "",
    collections: [],
    tags: [],
    countryOfOrigin: "",
    manufacturer: "",
  },

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonicalUrl: "",
    ogImage: "",
  },

  publish: {
    status: "draft",
    visibility: "public",
    featured: false,
    newArrival: false,
    bestSeller: false,
    scheduledDate: "",
    scheduledTime: "",
  },
  returnPolicy: {
    returnAvailable: true,
    returnType: "return",
    returnDays: 7,
    returnDescription: "",
  },
};

const reducers = {
  loadProduct(state, action) {
    const product = action.payload;

    state.product = product;
    state.slug = product.slug || "";

    state.basicInfo = {
      ...product.basicInfo,

      category: product.basicInfo?.category || null,

      subCategory: product.basicInfo?.subCategory || null,

      childCategory: product.basicInfo?.childCategory || null,
    };

    state.media = (product.media || []).map((image) => ({
      ...image,
      id: image.id || image.publicId,
    }));

    state.attributes = (product.attributes || []).map((attribute) => ({
      ...attribute,

      values: (attribute.values || []).map((value) => ({
        ...value,

        images: Array.isArray(value.images)
          ? value.images
          : value.image
            ? [value.image]
            : [],
      })),
    }));

    state.variants = product.variants || [];
    state.inventory = product.inventory;
    state.shipping = product.shipping;
    state.warranty = product.warranty;
    state.organization = product.organization;
    state.seo = product.seo;
    state.publish = product.publish;
    state.returnPolicy = product.returnPolicy;
  },

  updateBasicInfo(state, action) {
    const { name, value } = action.payload;
    state.basicInfo[name] = value;
  },

  // ==========================================
  // ATTRIBUTES
  // ==========================================

  addAttribute: (state) => {
    state.attributes.push({
      id: nanoid(),
      name: "",
      displayType: "button",
      isPrimary: false,
      values: [],
    });
  },

  removeAttribute: (state, action) => {
    state.attributes = state.attributes.filter(
      (attr) => attr.id !== action.payload,
    );
  },

  updateAttribute: (state, action) => {
    const { id, field, value } = action.payload;

    const attribute = state.attributes.find((item) => item.id === id);

    if (attribute) {
      attribute[field] = value;
    }
  },

  setPrimaryAttribute: (state, action) => {
    const id = action.payload;

    state.attributes.forEach((attr) => {
      attr.isPrimary = attr.id === id;
    });
  },

  // ==========================================
  // ATTRIBUTE VALUES
  // ==========================================

  addAttributeValue: (state, action) => {
    const { attributeId } = action.payload;

    const attribute = state.attributes.find((item) => item.id === attributeId);

    if (!attribute) return;

    attribute.values.push({
      id: nanoid(),
      label: "",
      color: "#000000",
      images: [],
    });
  },

  setAttributeValuePrimaryImage: (state, action) => {
    const { attributeId, valueId, imageId } = action.payload;

    const attribute = state.attributes.find(
      (attribute) => String(attribute.id) === String(attributeId),
    );

    if (!attribute) return;

    const value = attribute.values.find(
      (value) => String(value.id) === String(valueId),
    );

    if (!value || !Array.isArray(value.images)) {
      return;
    }

    value.images.forEach((image) => {
      const currentImageId = image.publicId || image.id;

      image.isPrimary = String(currentImageId) === String(imageId);
    });

    const primaryImage =
      value.images.find((image) => image.isPrimary === true) || null;

    state.variants.forEach((variant) => {
      const variantValueId = variant.attributes?.[attribute.name]?.id;

      if (String(variantValueId) !== String(valueId)) {
        return;
      }

      if (primaryImage) {
        variant.image = {
          publicId: primaryImage.publicId || "",
          url: primaryImage.url || "",
          alt: primaryImage.alt || "",
          isPrimary: true,
          attributeValueId: value.id,
          width: primaryImage.width || 0,
          height: primaryImage.height || 0,
        };
      } else {
        variant.image = {
          publicId: "",
          url: "",
          alt: "",
          isPrimary: false,
          attributeValueId: value.id,
          width: 0,
          height: 0,
        };
      }
    });
  },

  updateAttributeValue: (state, action) => {
    const { attributeId, valueId, field, value } = action.payload;

    const attribute = state.attributes.find((item) => item.id === attributeId);

    if (!attribute) return;

    const val = attribute.values.find((item) => item.id === valueId);

    if (!val) return;

    val[field] = value;
  },

  removeAttributeValue: (state, action) => {
    const { attributeId, valueId } = action.payload;

    const attribute = state.attributes.find((item) => item.id === attributeId);

    if (!attribute) return;

    attribute.values = attribute.values.filter((item) => item.id !== valueId);
  },

  // ==========================================
  // VARIANTS
  // ==========================================

  generateVariantsSuccess: (state) => {
    state.variants = generateVariants(state.attributes);
  },

  toggleVariantSelection: (state, action) => {
    const id = action.payload;

    if (state.selectedVariants.includes(id)) {
      state.selectedVariants = state.selectedVariants.filter(
        (item) => item !== id,
      );
    } else {
      state.selectedVariants.push(id);
    }
  },

  clearVariantSelection: (state) => {
    state.selectedVariants = [];
  },

  bulkUpdateVariants: (state, action) => {
    const { ids, data } = action.payload;

    state.variants.forEach((variant) => {
      if (ids.includes(variant.id)) {
        Object.assign(variant, data);

        variant.salePrice = calculateSalePrice(
          variant.mrp,
          variant.discountPercentage,
        );
      }
    });
  },

  updateVariant: (state, action) => {
    const { id, field, value } = action.payload;

    const variant = state.variants.find((item) => item.id === id);

    if (!variant) return;

    variant[field] = value;

    if (field === "mrp" || field === "discountPercentage") {
      variant.salePrice = calculateSalePrice(
        variant.mrp,
        variant.discountPercentage,
      );
    }
  },

  removeVariant: (state, action) => {
    state.variants = state.variants.filter(
      (item) => item.id !== action.payload,
    );
  },

  // ==========================================
  // PRODUCT MEDIA
  // ==========================================

  addMedia: (state, action) => {
    action.payload.forEach((image) => {
      state.media.push({
        id: image.id || image.publicId,

        publicId: image.publicId || "",
        url: image.url || "",
        alt: image.alt || "",

        isPrimary: Boolean(image.isPrimary),

        attributeValueId: image.attributeValueId || null,

        width: Number(image.width) || 0,
        height: Number(image.height) || 0,
      });
    });
  },

  removeMedia(state, action) {
    state.media = state.media.filter((img) => img.id !== action.payload);

    if (state.media.length && !state.media.some((img) => img.isPrimary)) {
      state.media[0].isPrimary = true;
    }
  },

  setPrimaryMedia: (state, action) => {
    const selectedId = action.payload;

    state.media.forEach((img) => {
      img.isPrimary = img.id === selectedId || img.publicId === selectedId;
    });
  },

  // ==========================================
  // OTHER SECTIONS
  // ==========================================

  updateInventory: (state, action) => {
    const { field, value } = action.payload;
    state.inventory[field] = value;
  },

  updateShipping: (state, action) => {
    const { field, value } = action.payload;
    state.shipping[field] = value;
  },

  updateWarranty: (state, action) => {
    const { field, value } = action.payload;
    state.warranty[field] = value;
  },

  updateOrganization: (state, action) => {
    const { field, value } = action.payload;
    state.organization[field] = value;
  },

  addTag: (state, action) => {
    const tag = action.payload.trim();

    if (tag && !state.organization.tags.includes(tag)) {
      state.organization.tags.push(tag);
    }
  },

  removeTag: (state, action) => {
    state.organization.tags = state.organization.tags.filter(
      (tag) => tag !== action.payload,
    );
  },

  addCollection: (state, action) => {
    const collection = action.payload.trim();

    if (collection && !state.organization.collections.includes(collection)) {
      state.organization.collections.push(collection);
    }
  },

  removeCollection: (state, action) => {
    state.organization.collections = state.organization.collections.filter(
      (item) => item !== action.payload,
    );
  },

  updateSeo: (state, action) => {
    const { field, value } = action.payload;
    state.seo[field] = value;
  },

  addKeyword: (state, action) => {
    const keyword = action.payload.trim();

    if (keyword && !state.seo.keywords.includes(keyword)) {
      state.seo.keywords.push(keyword);
    }
  },

  removeKeyword: (state, action) => {
    state.seo.keywords = state.seo.keywords.filter(
      (item) => item !== action.payload,
    );
  },

  updatePublish: (state, action) => {
    const { field, value } = action.payload;
    state.publish[field] = value;
  },

  updateReturnPolicy(state, action) {
    const { field, value } = action.payload;
    state.returnPolicy[field] = value;
  },

  resetProduct() {
    return initialState;
  },

  clearMessage: (state) => {
    state.message = null;
    state.success = false;
  },

  clearError: (state) => {
    state.error = null;
  },

  clearProductState(state) {
    state.loading = false;
    state.loaded = false;
    state.success = false;
    state.error = null;
    state.message = null;
  },
};

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers,

  extraReducers: (builder) => {
    builder
      // -----Add New Product -----

      .addCase(addNewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;

        state.products.unshift(action.payload.product);
      })

      .addCase(addNewProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ---- GET ALL PRODUCTS ----

      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = null;
        state.success = true;

        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })

      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // Get Product By Slug
      .addCase(getProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProductBySlug.fulfilled, (state, action) => {
        const product = action.payload.product;
        state.success = true;
        state.loading = false;
        state.loaded = true;
        state.error = null;

        state.product = product;
        state.slug = product.slug || "";

        state.basicInfo = {
          ...product.basicInfo,

          brand: product.basicInfo.brand?.slug || "",
          category: product.basicInfo.category?.slug || "",
          subCategory: product.basicInfo.subCategory?.slug || "",
          childCategory: product.basicInfo.childCategory?.slug || "",
        };

        state.media = (product.media || []).map((image) => ({
          ...image,
          id: image.id || image.publicId,
        }));

        state.attributes = (product.attributes || []).map((attribute) => ({
          ...attribute,

          id: attribute.id || nanoid(),

          values: (attribute.values || []).map((value) => ({
            ...value,
            id: value.id || nanoid(),
          })),
        }));
        state.variants = product.variants || [];

        state.inventory = product.inventory;
        state.shipping = product.shipping;
        state.warranty = product.warranty;

        state.organization = product.organization;
        state.seo = product.seo;
        state.publish = product.publish;
        state.returnPolicy = product.returnPolicy;
      })

      .addCase(getProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.loaded = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ----- UPDATE PRODUCT -----

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;

        const updatedProduct = action.payload.product;

        const index = state.products.findIndex(
          (item) => item._id === updatedProduct._id,
        );

        if (index !== -1) {
          state.products[index] = updatedProduct;
        }

        state.product = updatedProduct;
        state.slug = updatedProduct.slug || "";

        state.basicInfo = {
          ...updatedProduct.basicInfo,

          brand: updatedProduct.basicInfo.brand?.slug || "",
          category: updatedProduct.basicInfo.category?.slug || "",
          subCategory: updatedProduct.basicInfo.subCategory?.slug || "",
          childCategory: updatedProduct.basicInfo.childCategory?.slug || "",
        };

        state.media = updatedProduct.media || [];
        state.attributes = updatedProduct.attributes || [];
        state.variants = updatedProduct.variants || [];

        state.inventory = updatedProduct.inventory;
        state.shipping = updatedProduct.shipping;
        state.warranty = updatedProduct.warranty;

        state.organization = updatedProduct.organization;
        state.seo = updatedProduct.seo;
        state.publish = updatedProduct.publish;
        state.returnPolicy = updatedProduct.returnPolicy;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // UPDATE PRODUCT STATUS
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;

        const updatedProduct = action.payload.product;

        const index = state.products.findIndex(
          (item) => item._id === updatedProduct._id,
        );

        if (index !== -1) {
          state.products[index] = updatedProduct;
        }

        state.product = updatedProduct;
        state.slug = updatedProduct.slug || "";
      });
  },
});

export const {
  updateBasicInfo,
  resetProduct,
  clearError,
  clearMessage,
  clearProductState,
  addAttribute,
  removeAttribute,
  updateAttribute,
  setPrimaryAttribute,
  addAttributeValue,
  updateAttributeValue,
  removeAttributeValue,
  generateVariantsSuccess,
  updateVariant,
  removeVariant,
  addMedia,
  removeMedia,
  setPrimaryMedia,
  setAttributeValuePrimaryImage,
  updateInventory,
  updateShipping,
  updateWarranty,
  updateOrganization,
  addTag,
  removeTag,
  addCollection,
  removeCollection,
  updateSeo,
  addKeyword,
  removeKeyword,
  updatePublish,
  updateReturnPolicy,
  toggleVariantSelection,
  clearVariantSelection,
  bulkUpdateVariants,
} = productSlice.actions;

export default productSlice.reducer;
