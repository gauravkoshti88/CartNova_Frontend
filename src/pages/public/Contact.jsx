import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import ContactForm from "../../components/website/contact/ContactForm";
import ContactInfo from "../../components/website/contact/ContactInfo";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Contact() {
  useDocumentTitle("Contact");
  const website = useSelector((state) => state.website.website);
  return (
    <section className="bg-gray-50 min-h-screen">
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-5">
        <div className="grid gap-16 lg:grid-cols-2">
          <ContactInfo contact={website?.contact} />

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
