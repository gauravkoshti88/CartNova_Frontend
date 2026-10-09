import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import {
    addMedia,
    removeMedia,
    setPrimaryMedia
} from "../../redux/slices/productSlice.js";

import ProductCard from "../Cards";
import MediaUpload from "./media/MediaUpload.jsx";
import MediaGrid from "./media/MediaGrid.jsx";
import MediaPreviewModal from "./MediaPreviewModal.jsx";

import { useState } from "react";

export default function ProductMedia({ imageFiles }) {

    const [previewImage, setPreviewImage] = useState(null);

    const dispatch = useDispatch();

    const media = useSelector(
        state => state.product.media
    );

    const handleUpload = (files) => {

        const images = files.map((file, index) => {

            const id = nanoid();

            // =================================
            // Actual File Redux mein nahi jayegi
            // =================================
            imageFiles.current.set(id, file);

            return {

                // Frontend only
                id,

                // Backend schema compatible
                publicId: "",
                url: URL.createObjectURL(file),
                alt: "",

                isPrimary:
                    media.length === 0 && index === 0,

                attributeValueId: null,

                width: 0,
                height: 0
            };
        });

        dispatch(addMedia(images));
    };

    const handleDelete = (id) => {

        // File bhi remove karo
        imageFiles.current.delete(id);

        dispatch(removeMedia(id));
    };

    return (

        <ProductCard
            title="Product Media"
            description="Upload product images"
        >

            <MediaUpload
                onUpload={handleUpload}
            />

            <MediaGrid
                media={media}

                onDelete={handleDelete}

                onPrimary={(id) =>
                    dispatch(setPrimaryMedia(id))
                }

                onPreview={setPreviewImage}
            />

            <MediaPreviewModal
                open={!!previewImage}
                media={media}
                currentImage={previewImage}
                onClose={() =>
                    setPreviewImage(null)
                }
            />

        </ProductCard>
    );
}