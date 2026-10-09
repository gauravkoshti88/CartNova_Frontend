import { Mail, Phone, MapPin } from "lucide-react";
import ContactCard from "./ContactCard";

export default function ContactInfo({ contact }) {

    const contactInfo = [
        {
            id: 1,
            icon: Mail,
            title: "Email",
            value: contact?.email,
            href: contact?.email
                ? `mailto:${contact.email}`
                : null,
        },
        {
            id: 2,
            icon: Phone,
            title: "Phone",
            value: contact?.phone,
            href: contact?.phone
                ? `tel:${contact.phone}`
                : null,
        },
        {
            id: 3,
            icon: MapPin,
            title: "Address",
            value: contact?.address,
            href: contact?.mapUrl || null,
        },
    ].filter((item) => item.value);

    return (
        <div>

            <h2 className="text-5xl font-bold">
                Get in Touch
            </h2>

            <p className="mt-5 max-w-lg text-lg text-gray-500">
                Have a question? We're here to help.
                Reach out and our team will get back to you
                within 24 hours.
            </p>

            <div className="mt-10 space-y-7">

                {contactInfo.map((item) => (
                    <ContactCard
                        key={item.id}
                        {...item}
                    />
                ))}

            </div>

        </div>
    );
}