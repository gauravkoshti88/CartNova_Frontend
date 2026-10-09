import React, { useEffect, useState } from "react";

import WebsiteCard from "../WebsiteCard";
import FormInput from "../FormInput";
import ImageUpload from "../ImageUpload";
import SaveButton from "../SaveButton";

import { useWebsite } from "../../../hooks/useWebsite";
import { useToast } from "../../../hooks/useToast";

const initialState = {
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    link: "",
    image: null,
};

const BannerForm = ({
    type = "hero",
    banner = null,
    onClose,
}) => {

    const isEdit = Boolean(banner);

    const {
        loading,

        success,
        message,
        error,

        clearMessage,
        clearError,

        createHeroBanner,
        updateHeroBanner,

        createOfferBanner,
        updateOfferBanner,

    } = useWebsite();

    const [formData, setFormData] = useState(initialState);

    const [preview, setPreview] = useState("");

    useToast({
        success,
        message,
        error,
        clearMessage,
        clearError,
    });
    useEffect(() => {

        if (banner) {

            setFormData({

                title: banner.title || "",

                subtitle: banner.subtitle || "",

                buttonText: banner.buttonText || "",

                buttonLink: banner.buttonLink || "",

                link: banner.link || "",

                image: null,

            });

            setPreview(
                banner.image?.url || ""
            );

        } else {

            setFormData(initialState);

            setPreview("");

        }

    }, [banner]);

    useEffect(() => {

        return () => {

            if (
                preview &&
                preview.startsWith("blob:")
            ) {

                URL.revokeObjectURL(preview);

            }

        };

    }, [preview]);

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

        if (
            preview &&
            preview.startsWith("blob:")
        ) {

            URL.revokeObjectURL(preview);

        }

        setFormData((prev) => ({

            ...prev,

            image: file,

        }));

        setPreview(
            URL.createObjectURL(file)
        );

    };

    const resetForm = () => {

        setFormData(initialState);

        setPreview("");

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const data = new FormData();

        data.append(
            "title",
            formData.title
        );

        if (type === "hero") {

            data.append(
                "subtitle",
                formData.subtitle
            );

            data.append(
                "buttonText",
                formData.buttonText
            );

            data.append(
                "buttonLink",
                formData.buttonLink
            );

        } else {

            data.append(
                "link",
                formData.link
            );

        }

        if (formData.image) {

            data.append(
                "image",
                formData.image
            );

        }

        let response;

        if (type === "hero") {

            response = isEdit
                ? await updateHeroBanner(
                    banner._id,
                    data
                )
                : await createHeroBanner(
                    data
                );

        } else {

            response = isEdit
                ? await updateOfferBanner(
                    banner._id,
                    data
                )
                : await createOfferBanner(
                    data
                );

        }

        if (
            response?.meta?.requestStatus ===
            "fulfilled"
        ) {

            if (!isEdit) {

                resetForm();

            }

            onClose?.();

        }

    };

    return (

        <WebsiteCard
            title={
                isEdit
                    ? `Edit ${type === "hero" ? "Hero" : "Offer"} Banner`
                    : `Add ${type === "hero" ? "Hero" : "Offer"} Banner`
            }
        >

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <FormInput
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter banner title"
                />

                {
                    type === "hero" && (
                        <>

                            <FormInput
                                label="Subtitle"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                placeholder="Enter banner subtitle"
                            />

                            <FormInput
                                label="Button Text"
                                name="buttonText"
                                value={formData.buttonText}
                                onChange={handleChange}
                                placeholder="Shop Now"
                            />

                            <FormInput
                                label="Button Link"
                                name="buttonLink"
                                value={formData.buttonLink}
                                onChange={handleChange}
                                placeholder="/products"
                            />

                        </>
                    )
                }

                {
                    type === "offer" && (

                        <FormInput
                            label="Offer Link"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="/offers"
                        />

                    )
                }

                <ImageUpload
                    label="Banner Image"
                    name="image"
                    preview={preview}
                    onChange={handleFileChange}
                />

                <div className="flex justify-end gap-3">

                    {
                        onClose && (

                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                        )
                    }

                    <SaveButton
                        loading={loading}
                    />

                </div>

            </form>

        </WebsiteCard>

    );

};

export default BannerForm;