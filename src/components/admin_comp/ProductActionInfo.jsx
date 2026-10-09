import React from "react";
import { X, Package, Truck, Globe, Tag, RotateCcw, ShieldCheck } from "lucide-react";
import { Loader } from "../States";
import { useGetProductActionInfo } from "../../hooks/useGetProductActionInfo";

const ProductActionInfo = ({ slug, onClose, mode }) => {

    const { product, loading } = useGetProductActionInfo(slug);

    const calculateDiscount = (mrp, salePrice) => {
        if (!mrp || !salePrice) return 0;

        return Math.round(
            ((mrp - salePrice) / mrp) * 100
        );
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <Loader />
            </div>
        );
    }

    if (!product) return null;

    const primaryImage =
        product.media?.find(
            img => img.isPrimary
        )?.url ||
        product.media?.[0]?.url;

    return (

        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white dark:bg-slate-800 w-full max-w-6xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* HEADER */}
                <div
                    className="sticky top-0 z-20 flex justify-between items-center px-5 py-3 border-b border-gray-300 bg-white dark:bg-slate-800">

                    <h1 className="text-lg font-bold">
                        {mode === "view" ? "Product Details" : "Delete Product"}
                    </h1>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                        <X size={22} />
                    </button>
                </div>

                {/* BODY */}

                <div
                    className="overflow-y-auto flex-1 p-4 space-y-5">
                    {/* PRODUCT HERO */}
                    <section
                        className="flex flex-col items-center text-center gap-3">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {product.basicInfo?.productName}
                        </h2>

                    </section>

                    {/* ALL IMAGES */}

                    <section>
                        <h2 className="text-lg font-semibold mb-2">
                            Product Images
                        </h2>

                        <div className="flex flex-wrap gap-3">
                            {
                                product.media?.map(
                                    (img, index) => (
                                        <div
                                            key={index}
                                            className="relative"
                                        >
                                            <img
                                                src={img.url}
                                                className="w-24 h-24 rounded-xl object-cover border"
                                            />
                                            {
                                                img.isPrimary && (

                                                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                        Primary
                                                    </span>
                                                )
                                            }
                                        </div>
                                    ))
                            }
                        </div>
                    </section>

                    {/* BASIC INFO */}

                    <section
                        className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">

                        <h2 className="font-semibold text-lg mb-3">
                            Basic Information
                        </h2>

                        <div
                            className="grid md:grid-cols-2 gap-3">
                            <Info
                                label="Product Name"
                                value={
                                    product.basicInfo?.productName
                                }
                            />

                            <Info
                                label="Brand"
                                value={
                                    product.basicInfo?.brand?.name ||
                                    product.basicInfo?.brand
                                }
                            />

                            <Info
                                label="Category"
                                value={
                                    product.basicInfo?.category?.name ||
                                    product.basicInfo?.category
                                }
                            />

                            <Info
                                label="Sub Category"
                                value={
                                    product.basicInfo?.subCategory?.name ||
                                    product.basicInfo?.subCategory
                                }
                            />
                        </div>

                        <div className="mt-3">
                            <Info
                                label="Description"
                                value={
                                    product.basicInfo?.description
                                }
                            />
                        </div>
                    </section>

                    {/* ATTRIBUTES */}

                    <section>
                        <h2 className="text-lg font-semibold mb-3 flex gap-2 items-center">
                            <Tag size={20} />
                            Attributes
                        </h2>

                        <div
                            className="grid md:grid-cols-2 gap-3">
                            {
                                product.attributes?.map(
                                    attr => (
                                        <div
                                            key={attr.id}
                                            className="border rounded-xl p-3">
                                            <h3 className="font-semibold">
                                                {attr.name}
                                            </h3>

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {
                                                    attr.values?.map(
                                                        value => (

                                                            <span
                                                                key={value.id}
                                                                className="px-3 py-1 bg-gray-100 dark:bg-slate-600 rounded-lg text-sm">
                                                                {value.label}
                                                            </span>
                                                        ))
                                                }
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </section>

                    {/* VARIANTS */}

                    <section>
                        <h2 className="text-lg font-semibold mb-3">
                            Product Variants
                        </h2>

                        <div className="space-y-3">
                            {
                                product.variants?.map(
                                    (variant, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-xl p-3 flex gap-4 items-center">
                                            {
                                                variant.image?.url && (
                                                    <img
                                                        src={variant.image.url}
                                                        className="w-20 h-20 rounded-xl object-cover border"
                                                    />
                                                )
                                            }

                                            <div className="space-y-1">
                                                <p>
                                                    <span className="text-gray-500">
                                                        SKU:
                                                    </span>

                                                    <b>
                                                        {" "}
                                                        {variant.sku}
                                                    </b>
                                                </p>

                                                <p>
                                                    <span className="text-gray-500">
                                                        MRP:
                                                    </span>

                                                    ₹{variant.mrp}
                                                </p>

                                                <p>
                                                    <span className="text-gray-500">
                                                        Sale Price:
                                                    </span>

                                                    ₹{variant.salePrice}
                                                </p>

                                                <p className="text-green-600 font-semibold">
                                                    {
                                                        calculateDiscount(
                                                            variant.mrp,
                                                            variant.salePrice
                                                        )
                                                    }%
                                                    OFF
                                                </p>

                                                <p>
                                                    <span className="text-gray-500">
                                                        Stock:
                                                    </span>

                                                    {" "}
                                                    {variant.stock}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            }

                        </div>
                    </section>

                    {/* INVENTORY */}

                    <Section title="Inventory" icon={<Package size={18} />}>

                        <Info
                            label="SKU Prefix"
                            value={
                                product.inventory?.skuPrefix
                            }
                        />

                        <Info
                            label="Barcode"
                            value={
                                product.inventory?.barcode
                            }
                        />

                        <Info
                            label="Low Stock Alert"
                            value={
                                product.inventory?.lowStockAlert
                            }
                        />

                        <Info
                            label="Minimum Order Qty"
                            value={
                                product.inventory?.minOrderQty
                            }
                        />

                        <Info
                            label="Maximum Order Qty"
                            value={
                                product.inventory?.maxOrderQty
                            }
                        />

                        <Info
                            label="Weight"
                            value={
                                `${product.inventory?.weight || 0} kg`
                            }
                        />

                    </Section>

                    {/* SHIPPING */}

                    <Section title="Shipping" icon={<Truck size={18} />}>

                        <Info
                            label="Shipping Class"
                            value={
                                product.shipping?.shippingClass
                            }
                        />

                        <Info
                            label="Delivery Time"
                            value={
                                `${product.shipping?.estimatedDelivery || "-"} Days`
                            }
                        />

                        <Info
                            label="Country"
                            value={
                                product.shipping?.originCountry
                            }
                        />

                        <Info
                            label="Package Weight"
                            value={
                                `${product.shipping?.packageWeight || 0} kg`
                            }
                        />

                        <Info
                            label="Package Size"
                            value={
                                `
                                ${product.shipping?.packageLength || 0} x
                                ${product.shipping?.packageWidth || 0} x
                                ${product.shipping?.packageHeight || 0}
                                `
                            }
                        />
                    </Section>

                    {/* WARRANTY */}

                    {product.warranty?.hasWarranty && (

                        <Section
                            title="Warranty"
                            icon={<ShieldCheck size={18} />}
                        >

                            <Info
                                label="Warranty Type"
                                value={product.warranty?.warrantyType}
                            />

                            <Info
                                label="Duration"
                                value={`${product.warranty?.warrantyDuration || 0} ${product.warranty?.warrantyUnit || ""}`}
                            />

                            {product.warranty?.replacementDays > 0 && (
                                <Info
                                    label="Replacement"
                                    value={`${product.warranty.replacementDays} Days`}
                                />
                            )}

                            {product.warranty?.warrantyDescription && (
                                <Info
                                    label="Description"
                                    value={product.warranty.warrantyDescription}
                                />
                            )}

                        </Section>

                    )}

                    {/* ORGANIZATION */}

                    <Section title="Organization">

                        <Info
                            label="Vendor"
                            value={
                                product.organization?.vendor
                            }
                        />

                        <Info
                            label="Product Type"
                            value={
                                product.organization?.productType
                            }
                        />

                        <Info
                            label="Manufacturer"
                            value={
                                product.organization?.manufacturer
                            }
                        />

                        <Info
                            label="Country Of Origin"
                            value={
                                product.organization?.countryOfOrigin
                            }
                        />

                    </Section>

                    {/* SEO */}

                    <Section title="SEO" icon={<Globe size={18} />}>

                        <Info
                            label="Meta Title"
                            value={
                                product.seo?.metaTitle
                            }
                        />

                        <Info
                            label="Meta Description"
                            value={
                                product.seo?.metaDescription
                            }
                        />

                        <Info
                            label="Slug"
                            value={
                                product.seo?.slug
                            }
                        />

                        <Info
                            label="Canonical URL"
                            value={
                                product.seo?.canonicalUrl
                            }
                        />
                    </Section>

                    {/* PUBLISH */}

                    <Section title="Publish">
                        <Info
                            label="Status"
                            value={
                                product.publish?.status
                            }
                        />

                        <Info
                            label="Visibility"
                            value={
                                product.publish?.visibility
                            }
                        />

                        <Info
                            label="Featured"
                            value={
                                product.publish?.featured
                                    ? "Yes"
                                    : "No"
                            }
                        />

                        <Info
                            label="New Arrival"
                            value={
                                product.publish?.newArrival
                                    ? "Yes"
                                    : "No"
                            }
                        />

                        <Info
                            label="Best Seller"
                            value={
                                product.publish?.bestSeller
                                    ? "Yes"
                                    : "No"
                            }
                        />
                    </Section>

                    {/* RETURN POLICY */}

                    {product.returnPolicy?.returnAvailable && (

                        <Section
                            title="Return Policy"
                            icon={<RotateCcw size={18} />}
                        >

                            <Info
                                label="Return Type"
                                value={product.returnPolicy?.returnType}
                            />

                            <Info
                                label="Return Days"
                                value={`${product.returnPolicy?.returnDays || 0} Days`}
                            />

                            {product.returnPolicy?.returnDescription && (
                                <Info
                                    label="Description"
                                    value={product.returnPolicy.returnDescription}
                                />
                            )}

                        </Section>
                    )}
                </div>
                {mode === "delete" && (
                    <div className="mx-4 mt-4 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-700 p-4">
                        <div className="flex items-start gap-3">
                            <div className="text-red-600 text-xl">
                                ⚠️
                            </div>

                            <div>
                                <h3 className="font-semibold text-red-700 dark:text-red-400">
                                    Delete Product
                                </h3>

                                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                                    You are about to permanently delete this product.
                                    This action cannot be undone. Please verify the
                                    product details before continuing.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {mode === "delete" && <div className="border-t border-gray-200 dark:border-slate-700 p-4 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
                    >
                        Close
                    </button>

                    {mode === "delete" && (
                        <button
                            // onClick={() => onDelete(product._id)}
                            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium"
                        >
                            Delete Product
                        </button>
                    )}

                </div>}
            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>

        <p className="font-medium break-words">{value || "-"}</p>
    </div>
);

const Section = ({ title, icon, children }) => (
    <section className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
        <h2 className="font-semibold text-base flex items-center gap-2 mb-3">
            {icon}
            {title}
        </h2>

        <div className="grid md:grid-cols-3 gap-3">
            {children}
        </div>
    </section>
);

export default ProductActionInfo;