import { useDispatch, useSelector } from "react-redux";
import BestSeller from "../../components/home/bestSeller/BestSeller";
import FlashSale from "../../components/home/flashSale/FlashSale";
import HeroSection from "../../components/home/heroSection/HeroSection";
import NewArrivals from "../../components/home/newArrivals/NewArrivals";
import Newsletter from "../../components/home/newsLetter/NewsLetter";
import TopCollections from "../../components/home/topCollections/TopCollections";
import TrendingProducts from "../../components/home/trandingFeatures/TrendingProduct";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import PromoBanner from "../../components/home/promoBanner/PromoBanner";
import FollowSection from "../../components/home/FollowSection";
import { usePublicProducts } from "../../hooks/usePublicProducts";
import { useEffect } from "react";
import ScrollToTop from "../../components/ScrollToTop.jsx";
import { Loader } from "../../components/States.jsx";

export default function Home() {
  useDocumentTitle("");
  const dispatch = useDispatch();
  const { website, loading } = useSelector((state) => state.website);

  const {
    products,
    featuredProducts,
    bestSellerProducts,
    newArrivalProducts,

    loading: publicProductLoading,
    featuredLoading,
    bestSellerLoading,
    newArrivalLoading,
  } = usePublicProducts({
    getFeatured: true,
    getBestSeller: true,
    getNewArrivals: true,
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ScrollToTop />

      <HeroSection website={website} />

      <TrendingProducts products={featuredProducts} loading={featuredLoading} />

      <FlashSale />

      <NewArrivals products={newArrivalProducts} loading={newArrivalLoading} />

      <PromoBanner website={website} />

      <BestSeller products={bestSellerProducts} loading={bestSellerLoading} />

      <TopCollections />

      <Newsletter />

      <FollowSection social={website?.social} />
    </>
  );
}
