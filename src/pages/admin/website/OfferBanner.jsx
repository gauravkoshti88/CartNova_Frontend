import React from "react";

import BannerForm from "../../../components/website/banner/BannerForm";
import BannerList from "../../../components/website/banner/BannerList";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const OfferBanner = () => {
  useDocumentTitle("Offer-Banner-Form | Admin");
  return (
    <div className="space-y-8">
      <BannerForm type="offer" />

      <BannerList type="offer" />
    </div>
  );
};

export default OfferBanner;
