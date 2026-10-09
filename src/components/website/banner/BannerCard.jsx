import React from "react";
import {
    Pencil,
    Trash2,
    Power,
    PowerOff,
    ExternalLink,
} from "lucide-react";

const BannerCard = ({
    type = "hero",
    banner,
    onEdit,
    onDelete,
    onToggle,
}) => {

    return (

        <div className="bg-white rounded-2xl shadow border overflow-hidden">

            {/* Image */}

            <div className="h-56 bg-gray-100">

                <img
                    src={banner.image?.url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                />

            </div>

            {/* Content */}

            <div className="p-5 space-y-4">

                <div>

                    <div className="flex items-center justify-between">

                        <h3 className="text-lg font-semibold">

                            {banner.title}

                        </h3>

                        {
                            type === "hero" && (

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium
                                    ${
                                        banner.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {
                                        banner.isActive
                                            ? "Active"
                                            : "Inactive"
                                    }
                                </span>

                            )
                        }

                    </div>

                    {
                        type === "hero" && banner.subtitle && (

                            <p className="mt-2 text-sm text-gray-500">

                                {banner.subtitle}

                            </p>

                        )
                    }

                </div>

                {
                    type === "hero" ? (

                        <>

                            <div>

                                <p className="text-xs text-gray-500">

                                    Button Text

                                </p>

                                <p className="font-medium">

                                    {banner.buttonText || "-"}

                                </p>

                            </div>

                            <div>

                                <p className="text-xs text-gray-500">

                                    Button Link

                                </p>

                                <a
                                    href={banner.buttonLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 text-sm flex items-center gap-1 break-all"
                                >
                                    {banner.buttonLink}

                                    <ExternalLink size={14} />

                                </a>

                            </div>

                        </>

                    ) : (

                        <div>

                            <p className="text-xs text-gray-500">

                                Link

                            </p>

                            <a
                                href={banner.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 text-sm flex items-center gap-1 break-all"
                            >
                                {banner.link}

                                <ExternalLink size={14} />

                            </a>

                        </div>

                    )
                }

                {/* Actions */}

                <div className="flex items-center justify-between border-t pt-4">

                    <button
                        onClick={() => onEdit(banner)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Pencil size={18} />

                        Edit
                    </button>

                    {
                        type === "hero" && (

                            <button
                                onClick={() => onToggle(banner._id)}
                                className={`flex items-center gap-2
                                ${
                                    banner.isActive
                                        ? "text-orange-600"
                                        : "text-green-600"
                                }`}
                            >
                                {
                                    banner.isActive
                                        ? <PowerOff size={18} />
                                        : <Power size={18} />
                                }

                                {
                                    banner.isActive
                                        ? "Disable"
                                        : "Enable"
                                }

                            </button>

                        )
                    }

                    <button
                        onClick={() => onDelete(banner._id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                        <Trash2 size={18} />

                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

};

export default BannerCard;