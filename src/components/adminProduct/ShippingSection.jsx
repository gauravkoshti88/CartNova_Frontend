import { useDispatch, useSelector } from "react-redux";
import { Truck } from "lucide-react";

import {
    updateShipping
} from "../../redux/slices/productSlice.js";
import ProductCard from "../Cards.jsx";
import ProductInput from "../FormController.jsx";

export default function ShippingSection() {

    const dispatch = useDispatch();

    const shipping = useSelector(
        state => state.product.shipping
    );

    const update = (field, value) => {

        dispatch(
            updateShipping({
                field,
                value
            })
        );

    };

    return (

        <ProductCard

            title="Shipping"

            description="Shipping information"

            icon={<Truck size={20}/>}

        >

            <div className="grid md:grid-cols-2 gap-5">

                <div>

                    <label className="text-sm font-medium">

                        Shipping Class

                    </label>

                    <select

                        value={shipping.shippingClass}
                        name="shippingClass"
                        onChange={(e)=>

                            update(
                                "shippingClass",
                                e.target.value
                            )

                        }

                        className="mt-1 w-full border rounded-xl p-3"

                    >

                        <option value="standard">

                            Standard

                        </option>

                        <option value="express">

                            Express

                        </option>

                        <option value="fragile">

                            Fragile

                        </option>

                        <option value="heavy">

                            Heavy

                        </option>

                    </select>

                </div>

                <ProductInput

                    label="Package Weight (kg)"

                    type="number"
                    name={"packageWeight"}
                    value={shipping.packageWeight}

                    onChange={(e)=>

                        update(

                            "packageWeight",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    label="Length (cm)"

                    type="number"
                    name={"packageLength"}
                    value={shipping.packageLength}

                    onChange={(e)=>

                        update(

                            "packageLength",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    label="Width (cm)"

                    type="number"
                    name={"packageWidth"}
                    value={shipping.packageWidth}

                    onChange={(e)=>

                        update(

                            "packageWidth",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    label="Height (cm)"

                    type="number"
                    name={"packageHeight"}
                    value={shipping.packageHeight}

                    onChange={(e)=>

                        update(

                            "packageHeight",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    label="Estimated Delivery"

                    placeholder="3-5 Days"
                    name={"estimatedDelivery"}
                    value={shipping.estimatedDelivery}

                    onChange={(e)=>

                        update(

                            "estimatedDelivery",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    label="Origin Country"
                    name={"originCountry"}
                    value={shipping.originCountry}

                    onChange={(e)=>

                        update(

                            "originCountry",

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="mt-6">

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"
                        name="freeShipping"
                        checked={shipping.freeShipping}

                        onChange={(e)=>

                            update(

                                "freeShipping",

                                e.target.checked

                            )

                        }

                    />

                    Free Shipping

                </label>

            </div>

        </ProductCard>

    );

}