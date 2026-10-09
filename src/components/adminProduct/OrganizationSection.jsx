import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Plus, X } from "lucide-react";

import {
    updateOrganization,
    addTag,
    removeTag,
    addCollection,
    removeCollection
} from "../../redux/slices/productSlice.js";
import ProductInput from "../FormController";
import ProductCard from "../Cards";

export default function OrganizationSection() {

    const dispatch = useDispatch();

    const organization = useSelector(
        state => state.product.organization
    );

    const [tag, setTag] = useState("");
    const [collection, setCollection] = useState("");

    const update = (field, value) => {

        dispatch(
            updateOrganization({
                field,
                value
            })
        );

    };

    return (

        <ProductCard
            title="Organization"
            description="Brand & product organization"
            icon={<Building2 size={20} />}
        >

            <div className="grid md:grid-cols-2 gap-5">

                <ProductInput
                    name={"Brand"}
                    label="Brand"
                    value={organization.brand}
                    onChange={(e) =>
                        update("brand", e.target.value)
                    }
                />

                <ProductInput
                    label="Vendor"
                    name={"vendor"}
                    value={organization.vendor}
                    onChange={(e) =>
                        update("vendor", e.target.value)
                    }
                />

                <ProductInput
                    label="Manufacturer"
                    value={organization.manufacturer}
                    name={"manufacturer"}
                    onChange={(e) =>
                        update("manufacturer", e.target.value)
                    }
                />

                <ProductInput
                    label="Country Of Origin"
                    value={organization.countryOfOrigin}
                    name={"countryOfOrigin"}
                    onChange={(e) =>
                        update(
                            "countryOfOrigin",
                            e.target.value
                        )
                    }
                />

                <ProductInput
                    label="Product Type"
                    value={organization.productType}
                    name={"productType"}
                    onChange={(e) =>
                        update(
                            "productType",
                            e.target.value
                        )
                    }
                />

            </div>

            <div className="mt-8">

                <label className="font-medium">

                    Collections

                </label>

                <div className="flex gap-3 mt-2">

                    <input

                        className="border rounded-xl px-4 py-2 flex-1"
                        name="collection"
                        value={collection}

                        onChange={(e) =>

                            setCollection(e.target.value)

                        }

                    />

                    <button

                        onClick={() => {

                            dispatch(
                                addCollection(collection)
                            );

                            setCollection("");

                        }}

                        className="bg-blue-600 text-white px-4 rounded-xl"

                    >

                        <Plus size={18} />

                    </button>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                    {

                        organization.collections.map(item => (

                            <div

                                key={item}

                                className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2"

                            >

                                {item}

                                <button

                                    onClick={() =>

                                        dispatch(

                                            removeCollection(item)

                                        )

                                    }

                                >

                                    <X size={14} />

                                </button>

                            </div>

                        ))

                    }

                </div>

            </div>

            <div className="mt-8">

                <label className="font-medium">

                    Tags

                </label>

                <div className="flex gap-3 mt-2">

                    <input

                        className="border rounded-xl px-4 py-2 flex-1"
                        name="tag"
                        value={tag}

                        onChange={(e) =>

                            setTag(e.target.value)

                        }

                    />

                    <button

                        onClick={() => {

                            dispatch(addTag(tag));

                            setTag("");

                        }}

                        className="bg-green-600 text-white px-4 rounded-xl"

                    >

                        <Plus size={18} />

                    </button>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                    {

                        organization.tags.map(item => (

                            <div

                                key={item}

                                className="bg-green-100 rounded-full px-3 py-1 flex items-center gap-2"

                            >

                                {item}

                                <button

                                    onClick={() =>

                                        dispatch(

                                            removeTag(item)

                                        )

                                    }

                                >

                                    <X size={14} />

                                </button>

                            </div>

                        ))

                    }

                </div>

            </div>

        </ProductCard>

    );

}