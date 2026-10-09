export default function validateProduct(product) {
  const errors = {};

  // Basic Info

  if (!product.basicInfo.productName.trim()) {
    errors.productName = "Product name is required";
  }

  if (!product.basicInfo.description.trim()) {
    errors.description = "Description is required";
  }

  if (!product.basicInfo.category) {
    errors.category = "Category is required";
  }

  // Images

  // if (!product.media.length) {

  //     errors.media = "Upload at least one image";

  // }

  // Attributes

  if (!product.attributes.length) {
    errors.attributes = "Create at least one attribute";
  }

  // Variants

  if (!product.variants.length) {
    errors.variants = "Generate variants first";
  }

  product.variants.forEach((variant, index) => {
    if (!variant.mrp) {
      errors[`mrp_${index}`] = "MRP required";
    }

    if (!variant.discountPercentage) {
      errors[`discount_${index}`] = "Discount required";
    }

    if (!variant.salePrice) {
      errors[`salePrice_${index}`] = "Sale Price required";
    }

    if (!variant.stock && variant.stock !== 0) {
      errors[`stock_${index}`] = "Stock required";
    }
  });

  return errors;
}
