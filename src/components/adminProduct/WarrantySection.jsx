import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck } from "lucide-react";

import { updateWarranty } from "../../redux/slices/productSlice";
import ProductCard from "../Cards";
import ProductInput from "../FormController";

export default function WarrantySection() {
    const dispatch = useDispatch();

    const warranty = useSelector(
        state => state.product.warranty
    );

    const update = (field, value) => {
        dispatch(
            updateWarranty({
                field,
                value,
            })
        );
    };

    return (
        <ProductCard
            title="Warranty"
            description="Warranty & replacement information"
            icon={<ShieldCheck size={20} />}
        >
            <div className="grid md:grid-cols-2 gap-5">

                {/* Warranty Type */}
                <div>
                    <label className="text-sm font-medium">
                        Warranty Type
                    </label>

                    <select
                        name="warrantyType"
                        value={warranty.warrantyType}
                        onChange={(e) =>
                            update(
                                "warrantyType",
                                e.target.value
                            )
                        }
                        className="mt-1 w-full border rounded-xl p-3"
                    >
                        <option value="none">
                            None
                        </option>

                        <option value="brand">
                            Brand Warranty
                        </option>

                        <option value="seller">
                            Seller Warranty
                        </option>

                        <option value="international">
                            International Warranty
                        </option>
                    </select>
                </div>

                {/* Duration */}
                <ProductInput
                    name="warrantyDuration"
                    label="Warranty Duration"
                    type="number"
                    min="0"
                    value={warranty.warrantyDuration}
                    onChange={(e) =>
                        update(
                            "warrantyDuration",
                            Number(e.target.value)
                        )
                    }
                />

                {/* Unit */}
                <div>
                    <label className="text-sm font-medium">
                        Warranty Unit
                    </label>

                    <select
                        name="warrantyUnit"
                        value={warranty.warrantyUnit}
                        onChange={(e) =>
                            update(
                                "warrantyUnit",
                                e.target.value
                            )
                        }
                        className="mt-1 w-full border rounded-xl p-3"
                    >
                        <option value="days">
                            Days
                        </option>

                        <option value="months">
                            Months
                        </option>

                        <option value="years">
                            Years
                        </option>
                    </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="text-sm font-medium">
                        Warranty Description
                    </label>

                    <textarea
                        name="warrantyDescription"
                        rows={4}
                        value={warranty.warrantyDescription}
                        onChange={(e) =>
                            update(
                                "warrantyDescription",
                                e.target.value
                            )
                        }
                        placeholder="1 Year Brand Warranty"
                        className="mt-1 w-full border rounded-xl p-3 resize-none"
                    />
                </div>
            </div>

            {/* Has Warranty */}
            <div className="mt-6">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="hasWarranty"
                        checked={warranty.hasWarranty}
                        onChange={(e) =>
                            update(
                                "hasWarranty",
                                e.target.checked
                            )
                        }
                    />

                    Product Has Warranty
                </label>
            </div>
        </ProductCard>
    );
}