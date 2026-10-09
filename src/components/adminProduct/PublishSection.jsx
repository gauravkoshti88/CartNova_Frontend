import { useDispatch, useSelector } from "react-redux";
import { Globe2 } from "lucide-react";
import ProductInput from "../FormController";
import ProductCard from "../Cards";
import { updatePublish } from "../../redux/slices/productSlice";

export default function PublishSection() {

    const dispatch = useDispatch();

    const publish = useSelector(
        state => state.product.publish
    );

    const update = (field, value) => {

        dispatch(
            updatePublish({
                field,
                value
            })
        );

    };

    return (

        <ProductCard
            title="Publish"
            description="Product publishing settings"
            icon={<Globe2 size={20} />}
        >

            <div className="grid md:grid-cols-2 gap-5">

                {/* Status */}

                <div>

                    <label className="font-medium">

                        Status

                    </label>

                    <select

                        value={publish.status}
                        name="status"
                        onChange={(e) =>

                            update(
                                "status",
                                e.target.value
                            )

                        }

                        className="w-full border rounded-xl p-3 mt-2"

                    >

                        <option value="draft">

                            Draft

                        </option>

                        <option value="published">

                            Published

                        </option>

                        <option value="scheduled">

                            Scheduled

                        </option>

                        <option value="archived">

                            Archived

                        </option>

                    </select>

                </div>

                {/* Visibility */}

                <div>

                    <label className="font-medium">

                        Visibility

                    </label>

                    <select

                        value={publish.visibility}
                        name="visibility"
                        onChange={(e) =>

                            update(
                                "visibility",
                                e.target.value
                            )

                        }

                        className="w-full border rounded-xl p-3 mt-2"

                    >

                        <option value="public">

                            Public

                        </option>

                        <option value="private">

                            Private

                        </option>

                        <option value="hidden">

                            Hidden

                        </option>

                    </select>

                </div>

            </div>

            {

                publish.status === "scheduled" && (

                    <div className="grid md:grid-cols-2 gap-5 mt-6">

                        <ProductInput

                            type="date"

                            label="Publish Date"
                            name={"scheduledDate"}
                            value={publish.scheduledDate}

                            onChange={(e) =>

                                update(

                                    "scheduledDate",

                                    e.target.value

                                )

                            }

                        />

                        <ProductInput

                            type="time"

                            label="Publish Time"
                            name={"scheduledTime"}
                            value={publish.scheduledTime}

                            onChange={(e) =>

                                update(

                                    "scheduledTime",

                                    e.target.value

                                )

                            }

                        />

                    </div>

                )

            }

            <div className="grid md:grid-cols-3 gap-5 mt-8">

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"
                        name="featured"
                        checked={publish.featured}

                        onChange={(e) =>

                            update(

                                "featured",

                                e.target.checked

                            )

                        }

                    />

                    Featured Product

                </label>

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"
                        name="newArrival"
                        checked={publish.newArrival}

                        onChange={(e) =>

                            update(

                                "newArrival",

                                e.target.checked

                            )

                        }

                    />

                    New Arrival

                </label>

                <label className="flex items-center gap-3">

                    <input

                        type="checkbox"
                        name="bestSeller"
                        checked={publish.bestSeller}

                        onChange={(e) =>

                            update(

                                "bestSeller",

                                e.target.checked

                            )

                        }

                    />

                    Best Seller

                </label>

            </div>

        </ProductCard>

    );

}