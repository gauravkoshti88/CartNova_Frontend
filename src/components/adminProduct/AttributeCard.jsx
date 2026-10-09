import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

import ValueBuilder from "./ValueBuilder";

import {
  removeAttribute,
  updateAttribute,
  setPrimaryAttribute,
} from "../../redux/slices/productSlice.js";
import ProductInput, { Select } from "../FormController";

export default function AttributeCard({ attribute, imageFiles }) {
  const dispatch = useDispatch();

  const updateField = (field, value) => {
    dispatch(
      updateAttribute({
        id: attribute.id,

        field,

        value,
      }),
    );
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <ProductInput
          name={"attributeName"}
          label="Attribute Name"
          placeholder="Color"
          value={attribute.name}
          onChange={(e) =>
            updateField(
              "name",

              e.target.value,
            )
          }
        />

        <Select
          label="Display Type"
          name={"displayType"}
          value={attribute.displayType}
          onChange={(e) =>
            updateField(
              "displayType",

              e.target.value,
            )
          }
          options={[
            {
              label: "Button",

              value: "button",
            },

            {
              label: "Dropdown",

              value: "dropdown",
            },

            {
              label: "Color Swatch",

              value: "color",
            },

            {
              label: "Image Swatch",

              value: "image",
            },
          ]}
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <label className="flex items-center gap-2">
          <input
            name="isPrimary"
            type="radio"
            checked={attribute.isPrimary}
            onChange={() => dispatch(setPrimaryAttribute(attribute.id))}
          />

          <span className="text-sm">Primary Display Attribute</span>
        </label>

        <button
          type="button"
          onClick={() => dispatch(removeAttribute(attribute.id))}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <ValueBuilder attribute={attribute} imageFiles={imageFiles} />
    </motion.div>
  );
}
