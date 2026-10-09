import { useDispatch, useSelector } from "react-redux";

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

} from "../redux/thunks/websiteThunk";
import { clearError, clearMessage } from "../redux/slices/websiteSlice";


export const useWebsite = () => {

    const dispatch = useDispatch();


    const {
        website,
        loading,
        success,
        error,
        message,
    } = useSelector((state) => state.website);


    return {

        website,
        loading,
        success,
        error,
        message,

        clearMessage: ()=> dispatch(clearMessage()),

        clearError: ()=> dispatch(clearError()),

        // Get
        getWebsite: () => dispatch(getWebsite()),


        // General
        updateGeneral: (data) =>
            dispatch(updateGeneral(data)),


        // Hero Banner
        createHeroBanner: (data) =>
            dispatch(createHeroBanner(data)),

        updateHeroBanner: (bannerId, data) =>
            dispatch(
                updateHeroBanner({
                    bannerId,
                    formData: data
                })
            ),

        deleteHeroBanner: (bannerId) =>
            dispatch(deleteHeroBanner(bannerId)),

        toggleHeroBanner: (bannerId) =>
            dispatch(toggleHeroBanner(bannerId)),

        reorderHeroBanners: (bannerIds) =>
            dispatch(reorderHeroBanners(bannerIds)),


        // Offer Banner
        createOfferBanner: (data) =>
            dispatch(createOfferBanner(data)),

        updateOfferBanner: (bannerId, data) =>
            dispatch(
                updateOfferBanner({
                    bannerId,
                    formData: data
                })
            ),

        deleteOfferBanner: (bannerId) =>
            dispatch(deleteOfferBanner(bannerId)),

        toggleOfferBanner: (bannerId) =>
            dispatch(toggleOfferBanner(bannerId)),

        reorderOfferBanners: (bannerIds) =>
            dispatch(reorderOfferBanners(bannerIds)),


        // About
        updateAbout: (data) =>
            dispatch(updateAbout(data)),


        // Contact
        updateContact: (data) =>
            dispatch(updateContact(data)),


        // Social
        updateSocial: (data) =>
            dispatch(updateSocial(data)),


        // Footer
        updateFooter: (data) =>
            dispatch(updateFooter(data)),


        // SEO
        updateSeo: (data) =>
            dispatch(updateSeo(data)),


    };

};