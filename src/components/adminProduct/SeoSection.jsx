import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Plus, X } from "lucide-react";

import {

    updateSeo,

    addKeyword,

    removeKeyword

} from "../../redux/slices/productSlice.js";
import ProductInput from "../FormController";
import ProductCard from "../Cards";

export default function SeoSection() {

    const dispatch = useDispatch();

    const seo = useSelector(

        state => state.product.seo

    );

    const productName = useSelector(

        state => state.product.basicInfo.productName

    );

    const [keyword, setKeyword] = useState("");

    const update = (field, value) => {

        dispatch(

            updateSeo({

                field,

                value

            })

        );

    };

    return (

        <ProductCard

            title="SEO"

            description="Search engine optimization"

            icon={<Search size={20} />}

        >

            <div className="grid md:grid-cols-2 gap-5">

                <ProductInput

                    label="Meta Title"
                    name={"metaTitle"}
                    value={seo.metaTitle}

                    onChange={(e) =>

                        update(

                            "metaTitle",

                            e.target.value

                        )

                    }

                />

                <div className="md:col-span-2">

                    <label className="font-medium">

                        Meta Description

                    </label>

                    <textarea

                        rows={4}
                        id="metaDescription"
                        name="metaDescription"
                        value={seo.metaDescription}

                        onChange={(e) =>

                            update(

                                "metaDescription",

                                e.target.value

                            )

                        }

                        className="mt-2 w-full border rounded-xl p-3"

                    />

                    <div className="text-xs text-gray-500 mt-1">

                        {seo.metaDescription.length}/160

                    </div>

                </div>

                <ProductInput

                    label="Canonical URL"
                    name={"seoUrl"}
                    value={seo.canonicalUrl}

                    onChange={(e) =>

                        update(

                            "canonicalUrl",

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="mt-8">

                <label className="font-medium">

                    Keywords

                </label>

                <div className="flex gap-3 mt-2">

                    <input
                        id="seoKeywords"
                        value={keyword}
                        name="seoKeywords"
                        onChange={(e) =>

                            setKeyword(

                                e.target.value

                            )

                        }

                        className="border rounded-xl px-4 py-2 flex-1"

                    />

                    <button

                        onClick={() => {

                            dispatch(

                                addKeyword(keyword)

                            );

                            setKeyword("");

                        }}

                        className="bg-blue-600 text-white rounded-xl px-4"

                    >

                        <Plus size={18} />

                    </button>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                    {

                        seo.keywords.map(item => (

                            <div

                                key={item}

                                className="bg-blue-100 rounded-full px-3 py-1 flex items-center gap-2"

                            >

                                {item}

                                <button

                                    onClick={() =>

                                        dispatch(

                                            removeKeyword(item)

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