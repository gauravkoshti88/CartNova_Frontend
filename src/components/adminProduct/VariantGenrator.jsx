import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Layers, AlertTriangle } from "lucide-react";
import { countVariants } from "../../utils/countVariants";
import { generateVariantsSuccess } from "../../redux/slices/productSlice.js";
import ProductCard from "../Cards.jsx";
import ProductButton from "../Buttons.jsx";

export default function VariantGenerator() {
  const dispatch = useDispatch();

  const attributes = useSelector((state) => state.product.attributes);

  const variants = useSelector((state) => state.product.variants);

  const totalVariants = countVariants(attributes);

  const handleGenerate = () => {
    if (totalVariants === 0) return;

    if (
      variants.length > 0 &&
      !window.confirm("Existing variants will be replaced. Continue?")
    ) {
      return;
    }

    dispatch(generateVariantsSuccess());
  };

  return (
    <ProductCard
      title="Variant Generator"
      description="Generate all possible product variants."
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <Layers size={22} />

            <span className="font-semibold">
              {totalVariants} Variant
              {totalVariants !== 1 && "s"}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Based on your selected attributes.
          </p>

          {variants.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-orange-600">
              <AlertTriangle size={18} />
              Existing variants will be replaced.
            </div>
          )}
        </div>

        <ProductButton
          Icon={Layers}
          variant="success"
          onClick={handleGenerate}
          disabled={totalVariants === 0}
        >
          Generate Variants
        </ProductButton>
      </motion.div>
    </ProductCard>
  );
}
