import React from "react";

import BannerForm from "../../../components/website/banner/BannerForm";
import BannerList from "../../../components/website/banner/BannerList";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

const HeroBanner = () => {
  useDocumentTitle("Hero-Banner-Form | Admin");
  return (
    <div className="space-y-6">
      <BannerForm type="hero" />

      <BannerList type="hero" />
    </div>
  );
};

export default HeroBanner;
