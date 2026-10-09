import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateVariant,
  removeVariant,
  toggleVariantSelection,
} from "../../redux/slices/productSlice.js";

import ProductInput from "../FormController.jsx";

export default function VariantRow({ variant, columns }) {
  const dispatch = useDispatch();

  const media = useSelector((state) => state.product.media);

  const displayImage =
    variant.image?.url ||
    media?.find((image) => image.isPrimary === true)?.url ||
    "";

  const selectedVariants = useSelector(
    (state) => state.product.selectedVariants,
  );

  const updateField = (field, value) => {
    dispatch(
      updateVariant({
        id: variant.id,
        field,
        value,
      }),
    );
  };

  return (
    <motion.tr
      layout
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
      }}
    >
      <td className="px-3 py-3">
        <input
          name="variant"
          type="checkbox"
          checked={selectedVariants.includes(variant.id)}
          onChange={() => dispatch(toggleVariantSelection(variant.id))}
        />
      </td>

      <td className="px-3 py-3">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Variant"
            className="h-14 w-14 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400 dark:bg-slate-800">
            No Image
          </div>
        )}
      </td>

      {columns.map((attribute) => (
        <td key={attribute.id} className="px-3 py-3">
          {variant.attributes?.[attribute.name]?.label}
        </td>
      ))}

      <td className="px-3 py-3">
        <ProductInput
          name="mrp"
          type="number"
          value={variant.mrp ?? ""}
          onChange={(e) => updateField("mrp", e.target.value)}
        />
      </td>

      <td className="px-3 py-3">
        <ProductInput
          type="number"
          min={10}
          max={90}
          name="discountPercentage"
          value={variant.discountPercentage ?? ""}
          onChange={(e) => updateField("discountPercentage", e.target.value)}
        />
      </td>

      <td className="px-3 py-3">
        <ProductInput
          type="number"
          name="salePrice"
          value={variant.salePrice ?? ""}
          readOnly
        />
      </td>

      <td className="px-3 py-3">
        <ProductInput
          type="number"
          name="stock"
          value={variant.stock ?? ""}
          onChange={(e) => updateField("stock", e.target.value)}
        />
      </td>

      <td className="px-3 py-3">
        <input
          type="checkbox"
          name="active"
          checked={variant.active}
          onChange={(e) => updateField("active", e.target.checked)}
        />
      </td>

      <td className="px-3 py-3">
        <button
          type="button"
          onClick={() => dispatch(removeVariant(variant.id))}
          className="text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </motion.tr>
  );
}
