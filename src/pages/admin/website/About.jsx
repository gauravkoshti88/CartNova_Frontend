import React, { useEffect, useState } from "react";

import WebsiteCard from "../../../components/website/WebsiteCard";
import FormInput from "../../../components/website/FormInput";
import FormTextarea from "../../../components/website/FormTextarea";
import ImageUpload from "../../../components/website/ImageUpload";
import SaveButton from "../../../components/website/SaveButton";

import { useWebsite } from "../../../hooks/useWebsite";

import { useToast } from "../../../hooks/useToast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const About = () => {
  useDocumentTitle("About-Form | Admin");
  const {
    website,
    loading,

    success,
    message,
    error,

    clearMessage,
    clearError,

    getWebsite,
    updateAbout,
  } = useWebsite();

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

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
    if (website?.about) {
      setFormData({
        heading: website.about.heading || "",
        description: website.about.description || "",
        image: null,
      });

      setPreview(website.about.image?.url || "");
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
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("heading", formData.heading);

    data.append("description", formData.description);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const response = await updateAbout(data);

    if (response?.meta?.requestStatus === "fulfilled") {
      setFormData({
        heading: "",
        description: "",
        image: null,
      });

      setPreview("");
    }
  };

  return (
    <WebsiteCard title="About Section">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Heading"
          name="heading"
          value={formData.heading}
          onChange={handleChange}
          placeholder="About Heading"
        />

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write about your company..."
        />

        <ImageUpload
          label="About Image"
          name="image"
          preview={preview}
          onChange={handleFileChange}
        />

        <div className="flex justify-end">
          <SaveButton loading={loading} />
        </div>
      </form>
    </WebsiteCard>
  );
};

export default About;
