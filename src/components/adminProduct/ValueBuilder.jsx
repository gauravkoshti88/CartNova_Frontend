import { Trash2, Plus, Star } from "lucide-react";
import { useDispatch } from "react-redux";

import {
  addAttributeValue,
  updateAttributeValue,
  removeAttributeValue,
  setAttributeValuePrimaryImage,
} from "../../redux/slices/productSlice.js";

import ProductInput from "../FormController.jsx";
import ProductButton from "../Buttons.jsx";
import { FaUpload } from "react-icons/fa";

export default function ValueBuilder({ attribute, imageFiles }) {
  const dispatch = useDispatch();

  // ============================================================
  // ADD MULTIPLE IMAGES
  // ============================================================

  const handleImageChange = (e, valueId) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    // Existing files for this attribute value
    const existingFiles = imageFiles.current.get(valueId) || [];

    // Add newly selected files
    imageFiles.current.set(valueId, [...existingFiles, ...files]);

    // Create preview objects
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      url: "",
      publicId: "",
      alt: "",
      isPrimary: false,
      width: 0,
      height: 0,
    }));

    // Current Redux value
    const currentValue = attribute.values.find((value) => value.id === valueId);

    const existingImages = currentValue?.images || [];

    dispatch(
      updateAttributeValue({
        attributeId: attribute.id,
        valueId,

        field: "images",

        value: [...existingImages, ...newImages],
      }),
    );

    // Allow selecting the same file again
    e.target.value = "";
  };

  // ============================================================
  // REMOVE IMAGE
  // ============================================================

  const handleRemoveImage = (valueId, imageId, imageIndex) => {
    const value = attribute.values.find((item) => item.id === valueId);

    if (!value) return;

    const images = value.images || [];

    const imageToRemove = images[imageIndex];

    // ----------------------------------------------------------
    // Remove uploaded File
    // ----------------------------------------------------------

    const currentFiles = imageFiles.current.get(valueId) || [];

    /*
     * Only remove File if this is a newly uploaded image.
     *
     * Existing database image has no corresponding File.
     */
    if (imageToRemove?.preview && !imageToRemove?.url) {
      const uploadedIndex = images
        .slice(0, imageIndex)
        .filter((image) => image?.preview && !image?.url).length;

      const updatedFiles = currentFiles.filter(
        (_, index) => index !== uploadedIndex,
      );

      if (updatedFiles.length) {
        imageFiles.current.set(valueId, updatedFiles);
      } else {
        imageFiles.current.delete(valueId);
      }
    }

    // ----------------------------------------------------------
    // Remove Preview URL
    // ----------------------------------------------------------

    if (imageToRemove?.preview && imageToRemove.preview.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // ----------------------------------------------------------
    // Remove from Redux
    // ----------------------------------------------------------

    const updatedImages = images.filter((_, index) => index !== imageIndex);

    dispatch(
      updateAttributeValue({
        attributeId: attribute.id,
        valueId,

        field: "images",

        value: updatedImages,
      }),
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mt-6">
      {/* HEADER */}

      <div className="mb-5 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
          Attribute Values
        </h4>

        <ProductButton
          Icon={Plus}
          variant="secondary"
          onClick={() =>
            dispatch(
              addAttributeValue({
                attributeId: attribute.id,
              }),
            )
          }
        >
          Add Value
        </ProductButton>
      </div>

      {/* VALUES */}

      <div className="space-y-4">
        {attribute.values.map((value, index) => {
          const valueKey =
            value.id && String(value.id).trim()
              ? value.id
              : `${attribute.id}-value-${index}`;

          return (
            <div
              key={valueKey}
              className="
                  rounded-2xl
                  border
                  border-gray-300
                  bg-white
                  p-5
                  shadow-sm
                  dark:border-slate-700
                  dark:bg-slate-900
                "
            >
              <div className="grid items-start gap-4 lg:grid-cols-12">
                {/* =================================================
                      VALUE NAME
                  ================================================= */}

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-medium">
                    Value Name
                  </label>

                  <ProductInput
                    name="valueName"
                    placeholder="Black"
                    value={value.label}
                    onChange={(e) =>
                      dispatch(
                        updateAttributeValue({
                          attributeId: attribute.id,

                          valueId: value.id,

                          field: "label",

                          value: e.target.value,
                        }),
                      )
                    }
                  />
                </div>

                {/* =================================================
                      COLOR
                  ================================================= */}

                {attribute.displayType === "color" && (
                  <div className="lg:col-span-3">
                    <label className="mb-2 block text-sm font-medium">
                      Pick Color
                    </label>

                    <input
                      name={`color-${valueKey}`}
                      type="color"
                      value={value.color || "#000000"}
                      onChange={(e) =>
                        dispatch(
                          updateAttributeValue({
                            attributeId: attribute.id,

                            valueId: value.id,

                            field: "color",

                            value: e.target.value,
                          }),
                        )
                      }
                      className="h-11 w-full cursor-pointer"
                    />
                  </div>
                )}

                {/* =================================================
                      IMAGE SWATCH
                  ================================================= */}

                {attribute.displayType === "image" && (
                  <div className="lg:col-span-4">
                    <label className="mb-2 block text-sm font-medium">
                      Attribute Images
                    </label>

                    {/* UPLOAD BUTTON */}

                    <label
                      htmlFor={`attribute-image-${valueKey}`}
                      className="
                          flex
                          h-20
                          cursor-pointer
                          flex-col
                          items-center
                          justify-center
                          rounded-xl
                          border-2
                          border-dashed
                          border-slate-300
                          transition
                          hover:border-blue-500
                          dark:border-slate-600
                        "
                    >
                      <FaUpload className="mb-1 text-xl text-blue-500" />

                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Add Images
                      </span>

                      <input
                        name={`attribute-image-${valueKey}`}
                        id={`attribute-image-${valueKey}`}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageChange(e, value.id)}
                      />
                    </label>

                    {/* =================================================
                          IMAGE PREVIEWS
                      ================================================= */}

                    {value.images?.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {value.images.map((image, imageIndex) => (
                          <div
                            key={image.id || `${valueKey}-${imageIndex}`}
                            className="
                                  group
                                  relative
                                  aspect-square
                                  overflow-hidden
                                  rounded-lg
                                  border
                                  border-slate-200
                                  bg-slate-100
                                  dark:border-slate-700
                                  dark:bg-slate-800
                                "
                          >
                            <img
                              src={image.preview || image.url}
                              alt={value.label || "Attribute"}
                              className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                            />

                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  setAttributeValuePrimaryImage({
                                    attributeId: attribute.id,
                                    valueId: value.id,
                                    imageId: image.publicId || image.id,
                                  }),
                                )
                              }
                              className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full transition ${
                                image.isPrimary
                                  ? "bg-yellow-400 text-black opacity-100"
                                  : "bg-black/70 text-white opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              <Star
                                size={13}
                                fill={image.isPrimary ? "currentColor" : "none"}
                              />
                            </button>

                            {/* REMOVE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(
                                  value.id,
                                  image.id,
                                  imageIndex,
                                )
                              }
                              className="
                                    absolute
                                    right-1
                                    top-1
                                    flex
                                    h-6
                                    w-6
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black/70
                                    text-white
                                    opacity-0
                                    transition
                                    group-hover:opacity-100
                                    hover:bg-red-500
                                  "
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* =================================================
                      DELETE VALUE
                  ================================================= */}

                <div className="flex justify-end lg:col-span-1">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        removeAttributeValue({
                          attributeId: attribute.id,

                          valueId: value.id,
                        }),
                      )
                    }
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-50
                        text-red-500
                        transition
                        hover:bg-red-100
                      "
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
