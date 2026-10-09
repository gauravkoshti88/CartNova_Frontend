import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Plus, X } from "lucide-react";

import {
  updateSeo,
  addKeyword,
  removeKeyword,
} from "../../redux/slices/productSlice.js";

import ProductInput from "../FormController.jsx";
import ProductCard from "../Cards.jsx";

const SEOSection = () => {
  const dispatch = useDispatch();

  const seo = useSelector((state) => state.product.seo) || {
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    keywords: [],
  };

  const [keyword, setKeyword] = useState("");

  const update = (field, value) => {
    dispatch(updateSeo({ field, value }));
  };

  const handleAddKeyword = () => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) return;

    if (
      (seo.keywords || []).some(
        (item) => item.toLowerCase() === trimmedKeyword.toLowerCase(),
      )
    ) {
      setKeyword("");
      return;
    }

    dispatch(addKeyword(trimmedKeyword));
    setKeyword("");
  };

  return (
    <ProductCard
      title="SEO"
      description="Search engine optimization"
      icon={<Search size={20} />}
    >
      {" "}
      <div className="grid gap-5 md:grid-cols-2">
        <ProductInput
          label="Meta Title"
          name="metaTitle"
          value={seo.metaTitle || ""}
          onChange={(e) => update("metaTitle", e.target.value)}
        />

        <div className="md:col-span-2">
          <label htmlFor="metaDescription" className="font-medium">
            Meta Description
          </label>

          <textarea
            rows={4}
            id="metaDescription"
            name="metaDescription"
            maxLength={160}
            value={seo.metaDescription || ""}
            onChange={(e) => update("metaDescription", e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />

          <div className="mt-1 text-xs text-gray-500">
            {(seo.metaDescription || "").length}/160
          </div>
        </div>

        <ProductInput
          label="Canonical URL"
          name="seoUrl"
          value={seo.canonicalUrl || ""}
          onChange={(e) => update("canonicalUrl", e.target.value)}
        />
      </div>
      <div className="mt-8">
        <label htmlFor="seoKeywords" className="font-medium">
          Keywords
        </label>

        <div className="mt-2 flex gap-3">
          <input
            id="seoKeywords"
            name="seoKeywords"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
            className="flex-1 rounded-xl border px-4 py-2"
            placeholder="Enter a keyword"
          />

          <button
            type="button"
            onClick={handleAddKeyword}
            className="rounded-xl bg-blue-600 px-4 text-white"
            aria-label="Add keyword"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(seo.keywords || []).map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1"
            >
              <span>{item}</span>

              <button
                type="button"
                onClick={() => dispatch(removeKeyword(item))}
                aria-label={`Remove ${item}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ProductCard>
  );
};

export default SEOSection;
