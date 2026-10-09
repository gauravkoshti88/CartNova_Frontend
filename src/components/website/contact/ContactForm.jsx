export default function ContactForm() {
    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

            <div className="grid gap-6 md:grid-cols-2">

                <div>

                    <label className="mb-2 block font-medium">
                        Name
                    </label>

                    <input
                        type="text"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                </div>

                <div>

                    <label className="mb-2 block font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                </div>

            </div>

            <div className="mt-6">

                <label className="mb-2 block font-medium">
                    Subject
                </label>

                <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                />

            </div>

            <div className="mt-6">

                <label className="mb-2 block font-medium">
                    Message
                </label>

                <textarea
                    rows={6}
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                />

            </div>

            <button
                className="
                    mt-8
                    w-full
                    rounded-xl
                    bg-emerald-600
                    py-4
                    text-lg
                    font-semibold
                    text-white
                    transition
                    hover:bg-emerald-700
                "
            >
                Send Message
            </button>

        </div>
    );
}