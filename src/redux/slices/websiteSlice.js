import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import {
    getWebsite,

    updateGeneral,

    createHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    toggleHeroBanner,
    reorderHeroBanners,

    createOfferBanner,
    updateOfferBanner,
    deleteOfferBanner,
    toggleOfferBanner,
    reorderOfferBanners,

    updateAbout,
    updateContact,
    updateSocial,
    updateFooter,
    updateSeo,
} from "../thunks/websiteThunk";

const initialState = {
    website: null,

    loading: false,
    success: false,

    error: null,
    message: null,
};

const websiteSlice = createSlice({
    name: "website",

    initialState,

    reducers: {

        clearError: (state) => {
            state.error = null;
        },

        clearMessage: (state) => {
            state.message = null;
        },

        resetWebsiteState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.message = null;
        },

    },

    extraReducers: (builder) => {

        // ============================
        // GET WEBSITE
        // ============================

        builder.addCase(getWebsite.fulfilled, (state, action) => {

            state.loading = false;
            state.website = action.payload.website;

        });

        // ============================
        // PENDING
        // ============================

        builder.addMatcher(

            isAnyOf(

                getWebsite.pending,

                updateGeneral.pending,

                createHeroBanner.pending,
                updateHeroBanner.pending,
                deleteHeroBanner.pending,
                toggleHeroBanner.pending,
                reorderHeroBanners.pending,

                createOfferBanner.pending,
                updateOfferBanner.pending,
                deleteOfferBanner.pending,
                toggleOfferBanner.pending,
                reorderOfferBanners.pending,

                updateAbout.pending,

                updateContact.pending,

                updateSocial.pending,

                updateFooter.pending,

                updateSeo.pending

            ),

            (state) => {

                state.loading = true;

                state.error = null;

                state.success = false;

            }

        );

        // ============================
        // SUCCESS
        // ============================

        builder.addMatcher(

            isAnyOf(

                updateGeneral.fulfilled,

                createHeroBanner.fulfilled,
                updateHeroBanner.fulfilled,
                deleteHeroBanner.fulfilled,
                toggleHeroBanner.fulfilled,
                reorderHeroBanners.fulfilled,

                createOfferBanner.fulfilled,
                updateOfferBanner.fulfilled,
                deleteOfferBanner.fulfilled,
                toggleOfferBanner.fulfilled,
                reorderOfferBanners.fulfilled,

                updateAbout.fulfilled,

                updateContact.fulfilled,

                updateSocial.fulfilled,

                updateFooter.fulfilled,

                updateSeo.fulfilled

            ),

            (state, action) => {

                state.loading = false;

                state.success = true;

                state.message = action.payload.message;

                state.website = action.payload.website;

            }

        );

        // ============================
        // ERROR
        // ============================

        builder.addMatcher(

            isAnyOf(

                getWebsite.rejected,

                updateGeneral.rejected,

                createHeroBanner.rejected,
                updateHeroBanner.rejected,
                deleteHeroBanner.rejected,
                toggleHeroBanner.rejected,
                reorderHeroBanners.rejected,

                createOfferBanner.rejected,
                updateOfferBanner.rejected,
                deleteOfferBanner.rejected,
                toggleOfferBanner.rejected,
                reorderOfferBanners.rejected,

                updateAbout.rejected,

                updateContact.rejected,

                updateSocial.rejected,

                updateFooter.rejected,

                updateSeo.rejected

            ),

            (state, action) => {

                state.loading = false;

                state.success = false;

                state.error = action.payload;

            }

        );

    },

});

export const {

    clearError,

    clearMessage,

    resetWebsiteState,

} = websiteSlice.actions;

export default websiteSlice.reducer;