import React, { useEffect, useState } from "react";

import WebsiteCard from "../../../components/website/WebsiteCard";
import FormInput from "../../../components/website/FormInput";
import FormTextarea from "../../../components/website/FormTextarea";
import SaveButton from "../../../components/website/SaveButton";

import { useWebsite } from "../../../hooks/useWebsite";
import { useToast } from "../../../hooks/useToast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const Seo = () => {
  useDocumentTitle("Seo-Form | Admin");
  const {
    website,
    loading,

    success,
    message,
    error,

    getWebsite,
    updateSeo,

    clearMessage,
    clearError,
  } = useWebsite();

  const [formData, setFormData] = useState({
    metaTitle: "",

    metaDescription: "",

    metaKeywords: "",
  });

  useToast({
    success,
    message,
    error,
    clearMessage,
    clearError,
  });

  useEffect(() => {
    if (!website) {
      getWebsite();
    }
  }, []);

  useEffect(() => {
    if (website?.seo) {
      setFormData({
        metaTitle: website.seo.metaTitle || "",

        metaDescription: website.seo.metaDescription || "",

        metaKeywords: website.seo.metaKeywords || "",
      });
    }
  }, [website]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await updateSeo(formData);

    if (response?.meta?.requestStatus === "fulfilled") {
      setFormData({
        metaTitle: "",

        metaDescription: "",

        metaKeywords: "",
      });
    }
  };

  return (
    <WebsiteCard title="SEO Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Meta Title"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          placeholder="CartNova | Premium Online Shopping"
        />

        <FormTextarea
          label="Meta Description"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          placeholder="Write SEO meta description..."
        />

        <FormTextarea
          label="Meta Keywords"
          name="metaKeywords"
          value={formData.metaKeywords}
          onChange={handleChange}
          placeholder="shopping, ecommerce, fashion, electronics"
        />

        <div className="flex justify-end">
          <SaveButton loading={loading} />
        </div>
      </form>
    </WebsiteCard>
  );
};

export default Seo;
