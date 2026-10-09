import { nanoid } from "nanoid";

export const generateVariants = (attributes) => {
  if (!Array.isArray(attributes) || attributes.length === 0) {
    return [];
  }

  const validAttributes = attributes.filter(
    (attribute) =>
      attribute?.name?.trim() &&
      Array.isArray(attribute.values) &&
      attribute.values.length > 0,
  );

  if (validAttributes.length === 0) {
    return [];
  }

  let combinations = [{}];

  validAttributes.forEach((attribute) => {
    const temp = [];

    attribute.values.forEach((value) => {
      combinations.forEach((combination) => {
        temp.push({
          ...combination,

          [attribute.name]: {
            id: value.id,
            label: value.label,
            color: value.color || "",
          },
        });
      });
    });

    combinations = temp;
  });

  const imageAttribute = validAttributes.find(
    (attribute) => attribute.displayType === "image",
  );

  return combinations.map((attributesCombination) => {
    const selectedImageValue = imageAttribute?.values?.find(
      (value) =>
        String(value.id) ===
        String(attributesCombination?.[imageAttribute.name]?.id),
    );

    const primaryImage =
      selectedImageValue?.images?.find((image) => image.isPrimary === true) ||
      selectedImageValue?.images?.[0] ||
      null;

    return {
      id: nanoid(),

      attributes: attributesCombination,

      sku: "",
      mrp: "",
      discountPercentage: 0,
      salePrice: "",
      stock: "",
      barcode: "",
      weight: "",

      image: primaryImage
        ? {
            publicId: primaryImage.publicId || "",
            url: primaryImage.url || "",
            alt: primaryImage.alt || "",
            isPrimary: true,
            attributeValueId: selectedImageValue?.id || null,
            width: primaryImage.width || 0,
            height: primaryImage.height || 0,
          }
        : {
            publicId: "",
            url: "",
            alt: "",
            isPrimary: false,
            attributeValueId: selectedImageValue?.id || null,
            width: 0,
            height: 0,
          },

      active: true,
    };
  });
};
