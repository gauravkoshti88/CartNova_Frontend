export default function CategoryTabs({
    active,
    setActive,
    categories,
}) {
    return (
        <div className="flex flex-wrap justify-center gap-4">

            {categories.map((item) => (

                <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={`rounded-full px-6 py-3 text-sm font-semibold transition

                    ${active === item
                            ? "bg-orange-500 text-white shadow-lg"
                            : "border border-gray-300 bg-white hover:border-orange-500 hover:text-orange-500"
                        }`}
                >
                    {item}
                </button>

            ))}

        </div>
    );
}