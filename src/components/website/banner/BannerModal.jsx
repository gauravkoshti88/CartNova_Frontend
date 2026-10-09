import React from "react";
import { X } from "lucide-react";

import BannerForm from "./BannerForm";

const BannerModal = ({
    open,
    onClose,
    type = "hero",
    banner = null,
}) => {

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

                {/* Header */}

                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">

                    <h2 className="text-xl font-semibold">

                        {
                            banner
                                ? `Edit ${type === "hero" ? "Hero" : "Offer"} Banner`
                                : `Add ${type === "hero" ? "Hero" : "Offer"} Banner`
                        }

                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="p-6">

                    <BannerForm
                        type={type}
                        banner={banner}
                        onClose={onClose}
                    />

                </div>

            </div>

        </div>

    );

};

export default BannerModal;