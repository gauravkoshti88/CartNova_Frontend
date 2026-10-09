import { useDispatch, useSelector } from "react-redux";
import { RotateCcw } from "lucide-react";

import { updateReturnPolicy } from "../../redux/slices/productSlice";
import ProductCard from "../Cards";
import ProductInput from "../FormController";

export default function ReturnPolicySection() {
    const dispatch = useDispatch();

    const returnPolicy = useSelector(
        state => state.product.returnPolicy
    );

    const update = (field, value) => {
        dispatch(
            updateReturnPolicy({
                field,
                value,
            })
        );
    };

    return (
        <ProductCard
            title="Return Policy"
            description="Configure return and replacement policy"
            icon={<RotateCcw size={20} />}
        >
            <div className="grid md:grid-cols-2 gap-5">

                {/* Return Type */}
                <div>
                    <label className="text-sm font-medium">
                        Return Type
                    </label>

                    <select
                        name="returnType"
                        value={returnPolicy.returnType}
                        onChange={(e) =>
                            update(
                                "returnType",
                                e.target.value
                            )
                        }
                        className="mt-1 w-full border rounded-xl p-3"
                    >
                        <option value="return">
                            Return
                        </option>

                        <option value="replacement">
                            Replacement
                        </option>

                        <option value="return-replacement">
                            Return & Replacement
                        </option>

                        <option value="non-returnable">
                            Non Returnable
                        </option>
                    </select>
                </div>

                {/* Return Days */}
                <ProductInput
                    label="Return Days"
                    name="returnDays"
                    type="number"
                    min="0"
                    value={returnPolicy.returnDays}
                    onChange={(e) =>
                        update(
                            "returnDays",
                            Number(e.target.value)
                        )
                    }
                />

                {/* Description */}
                <div className="md:col-span-2">

                    <label className="text-sm font-medium">
                        Return Policy Description
                    </label>

                    <textarea
                        rows={4}
                        name="returnDescription"
                        value={returnPolicy.returnDescription}
                        onChange={(e) =>
                            update(
                                "returnDescription",
                                e.target.value
                            )
                        }
                        placeholder="7 Days Easy Return Policy"
                        className="mt-1 w-full border rounded-xl p-3 resize-none"
                    />

                </div>

            </div>

            {/* Return Available */}
            <div className="mt-6">

                <label className="flex items-center gap-3">

                    <input
                        type="checkbox"
                        name="returnAvailable"
                        checked={returnPolicy.returnAvailable}
                        onChange={(e) =>
                            update(
                                "returnAvailable",
                                e.target.checked
                            )
                        }
                    />

                    Return Available

                </label>

            </div>
        </ProductCard>
    );
}