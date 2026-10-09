import React, { useEffect, useState } from "react";

import WebsiteCard from "../../../components/website/WebsiteCard";
import FormInput from "../../../components/website/FormInput";
import SaveButton from "../../../components/website/SaveButton";

import { useWebsite } from "../../../hooks/useWebsite";
import { useToast } from "../../../hooks/useToast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const Contact = () => {
  useDocumentTitle("Contact-Form | Admin");
  const {
    website,
    loading,

    success,
    message,
    error,

    getWebsite,
    updateContact,

    clearMessage,
    clearError,
  } = useWebsite();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    mapUrl: "",
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
    if (website?.contact) {
      setFormData({
        email: website.contact.email || "",

        phone: website.contact.phone || "",

        address: website.contact.address || "",

        mapUrl: website.contact.mapUrl || "",
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

    const response = await updateContact(formData);

    if (response?.meta?.requestStatus === "fulfilled") {
      setFormData({
        email: "",
        phone: "",
        address: "",
        mapUrl: "",
      });
    }
  };

  return (
    <WebsiteCard title="Contact Information">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="support@example.com"
        />

        <FormInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 9876543210"
        />

        <FormInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Company Address"
        />

        <FormInput
          label="Google Map URL"
          name="mapUrl"
          value={formData.mapUrl}
          onChange={handleChange}
          placeholder="https://maps.google.com/..."
        />

        <div className="flex justify-end">
          <SaveButton loading={loading} />
        </div>
      </form>
    </WebsiteCard>
  );
};

export default Contact;
