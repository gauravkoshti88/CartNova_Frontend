import Breadcrumb from "../../components/Breadcrumb";
import AboutHero from "../../components/website/about/AboutHero";
import AboutStats from "../../components/website/about/AboutStats";
import FeatureSection from "../../components/home/featursSection/FeatureSection";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useSelector } from "react-redux";

export default function About() {
  useDocumentTitle("About");
  const website = useSelector((state) => state.website.website);
  return (
    <section className="bg-gray-50 min-h-screen">
      <Breadcrumb />

      <div className="max-w-7xl mx-auto px-5 py-2">
        {/* Hero */}
        <AboutHero about={website?.about} />

        {/* Features */}
        <div className="mt-16">
          <FeatureSection />
        </div>

        {/* Stats */}
        <AboutStats />
      </div>
    </section>
  );
}
