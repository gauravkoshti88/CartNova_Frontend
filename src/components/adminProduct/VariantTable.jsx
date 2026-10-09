import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import VariantRow from "./VariantRow";
import ProductCard from "../Cards";
import {
  bulkUpdateVariants,
  clearVariantSelection,
} from "../../redux/slices/productSlice";

export default function VariantTable() {
  const dispatch = useDispatch();

  const [bulkData, setBulkData] = useState({
    mrp: "",
    discountPercentage: "",
  });

  const selectedVariants = useSelector(
    (state) => state.product.selectedVariants,
  );

  const variants = useSelector((state) => state.product.variants);

  const attributes = useSelector((state) => state.product.attributes);

  const columns = useMemo(() => {
    return attributes.filter(
      (attribute) => attribute.name && attribute.values.length > 0,
    );
  }, [attributes]);

  if (variants.length === 0) {
    return (
      <ProductCard title="Variants" description="Generate variants first.">
        <div className="text-center py-12 text-gray-500">
          No Variants Generated
        </div>
      </ProductCard>
    );
  }

  const handleClick = () => {
    dispatch(
      bulkUpdateVariants({
        ids: selectedVariants,
        data: bulkData,
      }),
    );
    dispatch(clearVariantSelection());
    setBulkData({
      mrp: "",
      discountPercentage: "",
    });
  };

  return (
    <ProductCard
      title="Variants"
      description={`${variants.length} Variants Generated`}
    >
      {/* Bulk Update Section */}
      <div className="flex gap-3 mb-5">
        <input
          className="border rounded-lg p-2"
          placeholder="MRP"
          name="mrp"
          value={bulkData.mrp ?? ""}
          onChange={(e) =>
            setBulkData({
              ...bulkData,
              mrp: e.target.value,
            })
          }
        />

        <input
          className="border rounded-lg p-2"
          placeholder="Discount %"
          value={bulkData.discountPercentage ?? ""}
          name="discountPercentage"
          onChange={(e) =>
            setBulkData({
              ...bulkData,
              discountPercentage: e.target.value,
            })
          }
        />

        <button
          className="bg-blue-600 text-white px-5 rounded-lg disabled:opacity-50"
          disabled={selectedVariants.length === 0}
          onClick={handleClick}
        >
          Apply
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-max">
          <thead>
            <tr className="bg-gray-100 dark:bg-slate-800">
              <th className="px-4 py-3">Select</th>
              <th className="px-4 py-3 text-left">Image</th>
              {columns.map((attribute) => (
                <th
                  key={attribute.id}
                  className="px-4 py-3 text-left whitespace-nowrap"
                >
                  {attribute.name}
                </th>
              ))}
              <th className="px-4 py-3">MRP</th>
              <th className="px-4 py-3">Discount (In %)</th>
              <th className="px-4 py-3">Sale Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <VariantRow
                key={variant.id}
                variant={variant}
                columns={columns}
              />
            ))}
          </tbody>
        </table>
      </div>
    </ProductCard>
  );
}
