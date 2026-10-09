import React, { useEffect, useState } from "react";

import WebsiteCard from "../../../components/website/WebsiteCard";
import FormInput from "../../../components/website/FormInput";
import FormTextarea from "../../../components/website/FormTextarea";
import SaveButton from "../../../components/website/SaveButton";

import { useWebsite } from "../../../hooks/useWebsite";
import { useToast } from "../../../hooks/useToast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const Footer = () => {
  useDocumentTitle("Footer-Form | Admin");
  const {
    website,
    loading,

    success,
    message,
    error,

    getWebsite,
    updateFooter,

    clearMessage,
    clearError,
  } = useWebsite();

  const [formData, setFormData] = useState({
    copyright: "",

    footerDescription: "",
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
    if (website?.footer) {
      setFormData({
        copyright: website.footer.copyright || "",

        footerDescription: website.footer.footerDescription || "",
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

    const response = await updateFooter(formData);

    if (response?.meta?.requestStatus === "fulfilled") {
      setFormData({
        copyright: "",

        footerDescription: "",
      });
    }
  };

  return (
    <WebsiteCard title="Footer Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Copyright"
          name="copyright"
          value={formData.copyright}
          onChange={handleChange}
          placeholder="© 2026 CartNova. All Rights Reserved."
        />

        <FormTextarea
          label="Footer Description"
          name="footerDescription"
          value={formData.footerDescription}
          onChange={handleChange}
          placeholder="Write a short footer description..."
        />

        <div className="flex justify-end">
          <SaveButton loading={loading} />
        </div>
      </form>
    </WebsiteCard>
  );
};

export default Footer;
