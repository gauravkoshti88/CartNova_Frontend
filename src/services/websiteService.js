// src/services/websiteService.js

import api from "./api";

const websiteService = {

    // ===============================
    // Website
    // ===============================

    getWebsite: async () => {
        const { data } = await api.get("/api/website");
        return data;
    },

    // ===============================
    // General
    // ===============================

    updateGeneral: async (formData) => {
        const { data } = await api.put(
            "/api/website/general",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    // ===============================
    // Hero Banner
    // ===============================

    createHeroBanner: async (formData) => {
        const { data } = await api.post(
            "/api/website/hero-banner",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    updateHeroBanner: async (bannerId, formData) => {
        const { data } = await api.put(
            `/api/website/hero-banner/${bannerId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    deleteHeroBanner: async (bannerId) => {
        const { data } = await api.delete(
            `/api/website/hero-banner/${bannerId}`
        );

        return data;
    },

    toggleHeroBanner: async (bannerId) => {
        const { data } = await api.patch(
            `/api/website/hero-banner/${bannerId}/toggle`
        );

        return data;
    },

    reorderHeroBanners: async (bannerIds) => {
        const { data } = await api.patch(
            "/api/website/hero-banner/reorder",
            {
                bannerIds,
            }
        );

        return data;
    },

    // ===============================
    // Offer Banner
    // ===============================

    createOfferBanner: async (formData) => {
        const { data } = await api.post(
            "/api/website/offer-banner",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    updateOfferBanner: async (bannerId, formData) => {
        const { data } = await api.put(
            `/api/website/offer-banner/${bannerId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    deleteOfferBanner: async (bannerId) => {
        const { data } = await api.delete(
            `/api/website/offer-banner/${bannerId}`
        );

        return data;
    },

    toggleOfferBanner: async (bannerId) => {
        const { data } = await api.patch(
            `/api/website/offer-banner/${bannerId}/toggle`
        );

        return data;
    },

    reorderOfferBanners: async (bannerIds) => {
        const { data } = await api.patch(
            "/api/website/offer-banner/reorder",
            {
                bannerIds,
            }
        );

        return data;
    },

    // ===============================
    // About
    // ===============================

    updateAbout: async (formData) => {
        const { data } = await api.put(
            "/api/website/about",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return data;
    },

    // ===============================
    // Contact
    // ===============================

    updateContact: async (contactData) => {
        const { data } = await api.put(
            "/api/website/contact",
            contactData
        );

        return data;
    },

    // ===============================
    // Social
    // ===============================

    updateSocial: async (socialData) => {
        const { data } = await api.put(
            "/api/website/social",
            socialData
        );

        return data;
    },

    // ===============================
    // Footer
    // ===============================

    updateFooter: async (footerData) => {
        const { data } = await api.put(
            "/api/website/footer",
            footerData
        );

        return data;
    },

    // ===============================
    // SEO
    // ===============================

    updateSeo: async (seoData) => {
        const { data } = await api.put(
            "/api/website/seo",
            seoData
        );

        return data;
    },

};

export default websiteService;