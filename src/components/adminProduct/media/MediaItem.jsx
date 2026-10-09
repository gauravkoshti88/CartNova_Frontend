import { motion } from "framer-motion";
import {
    Star,
    Trash2,
    Expand,
    GripVertical
} from "lucide-react";

export default function MediaItem({

    image,

    onDelete,

    onPrimary,

    onPreview

}) {

    return (

        <motion.div

            layout

            whileHover={{ y: -4 }}

            className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"

        >

            {/* Image */}

            <img

                src={image.preview || image.url}

                alt={image.alt || "Product"}

                className="w-full h-52 object-cover"

            />

            {/* Overlay */}

            <div

                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3"

            >

                {/* Preview */}

                <button

                    type="button"

                    onClick={() => onPreview(image)}

                    className="bg-white rounded-full p-2"

                >

                    <Expand size={18} />

                </button>

                {/* Primary */}

                <button

                    type="button"

                    onClick={() => onPrimary(image.id || image.publicId)}

                    className={`rounded-full p-2 transition

                    ${image.isPrimary

                        ? "bg-yellow-400"

                        : "bg-white"

                    }

                    `}

                >

                    <Star

                        size={18}

                        fill={image.isPrimary ? "black" : "none"}

                    />

                </button>

                {/* Delete */}

                <button

                    type="button"

                    onClick={() => onDelete(image.id)}

                    className="bg-red-500 text-white rounded-full p-2"

                >

                    <Trash2 size={18} />

                </button>

            </div>

            {/* Primary Badge */}

            {

                image.isPrimary && (

                    <div

                        className="absolute left-2 top-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full"

                    >

                        Primary

                    </div>

                )

            }

            {/* Attribute Mapping */}

            {

                image.attributeValueLabel && (

                    <div

                        className="absolute left-2 bottom-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full"

                    >

                        {image.attributeValueLabel}

                    </div>

                )

            }

            {/* Drag Handle */}

            <div

                className="absolute right-2 bottom-2 bg-white rounded-full p-1 shadow"

            >

                <GripVertical size={18} />

            </div>

        </motion.div>

    );

}