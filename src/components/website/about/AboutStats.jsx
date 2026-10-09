import { Star } from "lucide-react";

const stats = [
    {
        value: "50K+",
        label: "Products",
    },
    {
        value: "100+",
        label: "Brands",
    },
    {
        value: "80+",
        label: "Countries",
    },
    {
        value: "4.9",
        label: "Rating",
        star: true,
    },
];

export default function AboutStats() {
    return (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

            {stats.map((item) => (
                <div key={item.label}>

                    <div className="flex justify-center items-center gap-1 text-5xl font-bold text-emerald-600">

                        {item.value}

                        {item.star && (
                            <Star
                                size={34}
                                fill="currentColor"
                            />
                        )}

                    </div>

                    <p className="mt-2 text-gray-500 text-lg">
                        {item.label}
                    </p>

                </div>
            ))}

        </div>
    );
}