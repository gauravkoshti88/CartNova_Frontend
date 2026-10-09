import React, { useMemo, useState } from "react";

import { useWebsite } from "../../../hooks/useWebsite";

import BannerCard from "./BannerCard";
import BannerModal from "./BannerModal";

const BannerList = ({ type = "hero" }) => {

    const {
        website,

        deleteHeroBanner,
        toggleHeroBanner,

        deleteOfferBanner,
        toggleOfferBanner,

    } = useWebsite();

    const [open, setOpen] = useState(false);

    const [selectedBanner, setSelectedBanner] = useState(null);

    const banners = useMemo(() => {

        if (!website) return [];

        return type === "hero"
            ? website.heroBanners || []
            : website.offerBanners || [];

    }, [website, type]);

    const handleEdit = (banner) => {

        setSelectedBanner(banner);

        setOpen(true);

    };

    const handleClose = () => {

        setSelectedBanner(null);

        setOpen(false);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this banner?"
        );

        if (!confirmDelete) return;

        if (type === "hero") {

            await deleteHeroBanner(id);

        } else {

            await deleteOfferBanner(id);

        }

    };

    const handleToggle = async (id) => {

        if (type === "hero") {

            await toggleHeroBanner(id);

        } else {

            await toggleOfferBanner(id);

        }

    };

    if (banners.length === 0) {

        return (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

                <h3 className="text-lg font-semibold">

                    No {type} banners found

                </h3>

                <p className="text-gray-500 mt-2">

                    Add your first {type} banner.

                </p>

            </div>

        );

    }

    return (

        <>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {
                    banners.map((banner) => (

                        <BannerCard
                            key={banner._id}
                            type={type}
                            banner={banner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggle={handleToggle}
                        />

                    ))
                }

            </div>

            <BannerModal
                open={open}
                onClose={handleClose}
                type={type}
                banner={selectedBanner}
            />

        </>

    );

};

export default BannerList;