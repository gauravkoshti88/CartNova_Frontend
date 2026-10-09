import React, { useEffect, useState } from "react";

import WebsiteCard from "../../../components/website/WebsiteCard";
import FormInput from "../../../components/website/FormInput";
import ImageUpload from "../../../components/website/ImageUpload";
import SaveButton from "../../../components/website/SaveButton";
import { useWebsite } from "../../../hooks/useWebsite";
import { useToast } from "../../../hooks/useToast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const General = () => {
  useDocumentTitle("General-Form | Admin");
  const {
    website,
    loading,
    success,
    message,
    error,

    getWebsite,
    updateGeneral,

    clearMessage,
    clearError,
  } = useWebsite();

  const [formData, setFormData] = useState({
    websiteName: "",
    lightLogo: null,
    darkLogo: null,
    favicon: null,
  });

  const [preview, setPreview] = useState({
    lightLogo: "",
    darkLogo: "",
    favicon: "",
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
    if (website?.general) {
      setFormData({
        websiteName: website.general.websiteName || "",
        lightLogo: null,
        darkLogo: null,
        favicon: null,
      });

      setPreview({
        lightLogo: website.general.lightLogo?.url || "",

        darkLogo: website.general.darkLogo?.url || "",

        favicon: website.general.favicon?.url || "",
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    const file = files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    setPreview((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("websiteName", formData.websiteName);

    if (formData.lightLogo) {
      data.append("lightLogo", formData.lightLogo);
    }

    if (formData.darkLogo) {
      data.append("darkLogo", formData.darkLogo);
    }

    if (formData.favicon) {
      data.append("favicon", formData.favicon);
    }

    const response = updateGeneral(data);

    if (response?.meta?.requestStatus === "fulfilled") {
      setFormData({
        websiteName: "",
        lightLogo: null,
        darkLogo: null,
        favicon: null,
      });

      setPreview({
        lightLogo: "",
        darkLogo: "",
        favicon: "",
      });
    }
  };

  return (
    <div className="p-6">
      <WebsiteCard title="General Settings">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Website Name"
            name="websiteName"
            value={formData.websiteName}
            onChange={handleChange}
            placeholder="Enter website name"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUpload
              label="Light Logo"
              name="lightLogo"
              preview={preview.lightLogo}
              onChange={handleFileChange}
            />

            <ImageUpload
              label="Dark Logo"
              name="darkLogo"
              preview={preview.darkLogo}
              onChange={handleFileChange}
            />

            <ImageUpload
              label="Favicon"
              name="favicon"
              preview={preview.favicon}
              onChange={handleFileChange}
            />
          </div>

          <SaveButton loading={loading} />
        </form>
      </WebsiteCard>
    </div>
  );
};

export default General;
