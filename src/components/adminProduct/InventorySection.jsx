import { useDispatch, useSelector } from "react-redux";
import { Package } from "lucide-react";

import { updateInventory } from "../../redux/slices/productSlice.js";
import ProductCard from "../Cards.jsx";
import ProductInput from "../FormController.jsx";

export default function InventorySection() {

    const dispatch = useDispatch();

    const inventory = useSelector(
        state => state.product.inventory
    );

    const update = (field, value) => {

        dispatch(

            updateInventory({

                field,

                value

            })

        );

    };

    return (

        <ProductCard

            title="Inventory"

            description="Inventory & warehouse settings"

        >

            <div className="grid md:grid-cols-2 gap-5">

                <ProductInput

                    label="SKU Prefix"

                    value={inventory.skuPrefix}
                    name={"skuPrefix"}
                    onChange={(e)=>

                        update(

                            "skuPrefix",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    label="Barcode"

                    value={inventory.barcode}
                    name={"barcode"}
                    onChange={(e)=>

                        update(

                            "barcode",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    type="number"

                    label="Low Stock Alert"
                    name={"lowStockAlert"}
                    value={inventory.lowStockAlert}

                    onChange={(e)=>

                        update(

                            "lowStockAlert",

                            Number(e.target.value)

                        )

                    }

                />

                <ProductInput

                    type="number"

                    label="Minimum Order Qty"
                    name={"minOrderQty"}
                    value={inventory.minOrderQty}

                    onChange={(e)=>

                        update(

                            "minOrderQty",

                            Number(e.target.value)

                        )

                    }

                />

                <ProductInput

                    type="number"

                    label="Maximum Order Qty"
                    name={"maxOrderQty"}
                    value={inventory.maxOrderQty}

                    onChange={(e)=>

                        update(

                            "maxOrderQty",

                            Number(e.target.value)

                        )

                    }

                />

                <ProductInput

                    type="number"

                    label="Weight (kg)"

                    value={inventory.weight}
                    name={"weight"}
                    onChange={(e)=>

                        update(

                            "weight",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    type="number"

                    label="Length (cm)"
                    name={"length"}
                    value={inventory.length}

                    onChange={(e)=>

                        update(

                            "length",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    type="number"

                    label="Width (cm)"
                    name={"width"}
                    value={inventory.width}

                    onChange={(e)=>

                        update(

                            "width",

                            e.target.value

                        )

                    }

                />

                <ProductInput

                    type="number"

                    label="Height (cm)"
                    name={"height"}
                    value={inventory.height}

                    onChange={(e)=>

                        update(

                            "height",

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="flex flex-col gap-4 mt-6">

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"
                        name="trackInventory"
                        checked={inventory.trackInventory}

                        onChange={(e)=>

                            update(

                                "trackInventory",

                                e.target.checked

                            )

                        }

                    />

                    Track Inventory

                </label>

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"

                        checked={inventory.allowBackorder}
                        name="allowBackorder"
                        onChange={(e)=>

                            update(

                                "allowBackorder",

                                e.target.checked

                            )

                        }

                    />

                    Allow Backorder

                </label>

            </div>

        </ProductCard>

    );

}