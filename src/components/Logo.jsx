import React from "react";
import { useSelector } from "react-redux";

export const Logo = () => {
  const { mode } = useSelector((state) => state.theme);
  const website = useSelector((state) => state.website.website);
  return (
    <div className="flex items-center">
      <img
        src={
          mode !== "light"
            ? website?.general?.lightLogo?.url
            : website?.general?.darkLogo?.url
        }
        alt="Logo"
        className="w-30 md:w-50"
      />
    </div>
  );
};
