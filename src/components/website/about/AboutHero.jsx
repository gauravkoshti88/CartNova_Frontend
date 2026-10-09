export default function AboutHero({ about }) {
    return (
        <section className="bg-gradient-to-b from-emerald-50 to-white py-10">

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-5 lg:flex-row lg:gap-16">

                {/* Content */}

                <div className="flex-1 text-center lg:text-left">

                    <span className="inline-block rounded-full bg-emerald-100 px-5 py-2 text-sm font-medium text-emerald-700">
                        Our Story
                    </span>

                    <h1 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
                        {about?.heading}
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        {about?.description}
                    </p>

                </div>

                {/* Image */}

                {about?.image?.url && (

                    <div className="flex-1">

                        <div className="overflow-hidden rounded-3xl shadow-2xl">

                            <img
                                src={about.image.url}
                                alt={about.image.alt || about.heading}
                                className="h-[300px] w-full object-cover transition duration-700 hover:scale-105 md:h-[400px] lg:h-[500px]"
                            />

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}