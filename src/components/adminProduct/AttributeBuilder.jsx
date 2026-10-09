import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { addAttribute } from "../../redux/slices/productSlice";
import AttributeCard from "./AttributeCard";
import ProductCard from "../Cards";
import ProductButton from "../Buttons";

export default function AttributeBuilder({ imageFiles }) {
  const dispatch = useDispatch();

  const attributes = useSelector((state) => state.product.attributes);

  return (
    <ProductCard title="Attributes" description="Create dynamic attributes">
      <div className="flex justify-end mb-6">
        <ProductButton Icon={Plus} onClick={() => dispatch(addAttribute())}>
          Add Attribute
        </ProductButton>
      </div>

      <AnimatePresence>
        {attributes.map((attribute) => (
          <AttributeCard
            key={attribute.id}
            attribute={attribute}
            imageFiles={imageFiles}
          />
        ))}
      </AnimatePresence>
    </ProductCard>
  );
}
