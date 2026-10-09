import { createAsyncThunk } from "@reduxjs/toolkit";
import websiteService from "../../services/websiteService";

// ==============================
// Get Website
// ==============================

export const getWebsite = createAsyncThunk(
    "website/getWebsite",
    async (_, thunkAPI) => {
        try {
            return await websiteService.getWebsite();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// General
// ==============================

export const updateGeneral = createAsyncThunk(
    "website/updateGeneral",
    async (formData, thunkAPI) => {
        try {
            return await websiteService.updateGeneral(formData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// Hero Banner
// ==============================

export const createHeroBanner = createAsyncThunk(
    "website/createHeroBanner",
    async (formData, thunkAPI) => {
        try {
            return await websiteService.createHeroBanner(formData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const updateHeroBanner = createAsyncThunk(
    "website/updateHeroBanner",
    async ({ bannerId, formData }, thunkAPI) => {
        try {
            return await websiteService.updateHeroBanner(
                bannerId,
                formData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const deleteHeroBanner = createAsyncThunk(
    "website/deleteHeroBanner",
    async (bannerId, thunkAPI) => {
        try {
            return await websiteService.deleteHeroBanner(bannerId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const toggleHeroBanner = createAsyncThunk(
    "website/toggleHeroBanner",
    async (bannerId, thunkAPI) => {
        try {
            return await websiteService.toggleHeroBanner(bannerId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const reorderHeroBanners = createAsyncThunk(
    "website/reorderHeroBanners",
    async (bannerIds, thunkAPI) => {
        try {
            return await websiteService.reorderHeroBanners(bannerIds);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// Offer Banner
// ==============================

export const createOfferBanner = createAsyncThunk(
    "website/createOfferBanner",
    async (formData, thunkAPI) => {
        try {
            return await websiteService.createOfferBanner(formData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const updateOfferBanner = createAsyncThunk(
    "website/updateOfferBanner",
    async ({ bannerId, formData }, thunkAPI) => {
        try {
            return await websiteService.updateOfferBanner(
                bannerId,
                formData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const deleteOfferBanner = createAsyncThunk(
    "website/deleteOfferBanner",
    async (bannerId, thunkAPI) => {
        try {
            return await websiteService.deleteOfferBanner(bannerId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const toggleOfferBanner = createAsyncThunk(
    "website/toggleOfferBanner",
    async (bannerId, thunkAPI) => {
        try {
            return await websiteService.toggleOfferBanner(bannerId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const reorderOfferBanners = createAsyncThunk(
    "website/reorderOfferBanners",
    async (bannerIds, thunkAPI) => {
        try {
            return await websiteService.reorderOfferBanners(bannerIds);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// About
// ==============================

export const updateAbout = createAsyncThunk(
    "website/updateAbout",
    async (formData, thunkAPI) => {
        try {
            return await websiteService.updateAbout(formData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// Contact
// ==============================

export const updateContact = createAsyncThunk(
    "website/updateContact",
    async (contactData, thunkAPI) => {
        try {
            return await websiteService.updateContact(contactData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// Social
// ==============================

export const updateSocial = createAsyncThunk(
    "website/updateSocial",
    async (socialData, thunkAPI) => {
        try {
            return await websiteService.updateSocial(socialData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// Footer
// ==============================

export const updateFooter = createAsyncThunk(
    "website/updateFooter",
    async (footerData, thunkAPI) => {
        try {
            return await websiteService.updateFooter(footerData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// ==============================
// SEO
// ==============================

export const updateSeo = createAsyncThunk(
    "website/updateSeo",
    async (seoData, thunkAPI) => {
        try {
            return await websiteService.updateSeo(seoData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);