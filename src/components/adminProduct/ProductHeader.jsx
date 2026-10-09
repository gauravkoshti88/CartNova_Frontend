import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProductHeader({ isEdit = false }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 items-center mb-5"
    >
      {/* Left */}
      <div className="flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Center */}
      <div className="text-center">
        <h1 className="text-xl md:2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>

        <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {isEdit
            ? "Update your product details and save changes."
            : "Create a new product for your store."}
        </p>
      </div>

      {/* Right */}
      <div />
    </motion.div>
  );
}
