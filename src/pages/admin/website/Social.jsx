import React, { useEffect, useState } from "react";

import WebsiteCard from "../../../components/website/WebsiteCard";
import FormInput from "../../../components/website/FormInput";
import SaveButton from "../../../components/website/SaveButton";

import { useWebsite } from "../../../hooks/useWebsite";
import { useToast } from "../../../hooks/useToast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const Social = () => {
  useDocumentTitle("Social-Form | Admin");
  const {
    website,
    loading,

    success,
    message,
    error,

    getWebsite,
    updateSocial,

    clearMessage,
    clearError,
  } = useWebsite();

  const [formData, setFormData] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    whatsapp: "",
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
    if (website?.social) {
      setFormData({
        facebook: website.social.facebook || "",

        instagram: website.social.instagram || "",

        twitter: website.social.twitter || "",

        youtube: website.social.youtube || "",

        linkedin: website.social.linkedin || "",

        whatsapp: website.social.whatsapp || "",
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

    const response = await updateSocial(formData);

    if (response?.meta?.requestStatus === "fulfilled") {
      setFormData({
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
        whatsapp: "",
      });
    }
  };

  return (
    <WebsiteCard title="Social Media Links">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Facebook"
          name="facebook"
          value={formData.facebook}
          onChange={handleChange}
          placeholder="https://facebook.com/yourpage"
        />

        <FormInput
          label="Instagram"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          placeholder="https://instagram.com/yourpage"
        />

        <FormInput
          label="Twitter / X"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          placeholder="https://x.com/yourpage"
        />

        <FormInput
          label="YouTube"
          name="youtube"
          value={formData.youtube}
          onChange={handleChange}
          placeholder="https://youtube.com/@yourchannel"
        />

        <FormInput
          label="LinkedIn"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/company/yourcompany"
        />

        <FormInput
          label="WhatsApp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="https://wa.me/919876543210"
        />

        <div className="flex justify-end">
          <SaveButton loading={loading} />
        </div>
      </form>
    </WebsiteCard>
  );
};

export default Social;
