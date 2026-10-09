export default function ContactCard({
    icon: Icon,
    title,
    value,
}) {
    return (
        <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">

                <Icon size={22} />

            </div>

            <div>

                <h4 className="font-semibold">
                    {title}
                </h4>

                <p className="text-gray-500">
                    {value}
                </p>

            </div>

        </div>
    );
}