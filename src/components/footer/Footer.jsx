import { Mail, Send } from "lucide-react";
import { useSelector } from "react-redux";

import { Logo } from "../Logo";
import FooterColumn from "./FooterColumn";
import FooterSocial from "./FooterSocial";
import { footerLinks } from "./footerData";

export default function Footer() {
  const website = useSelector((state) => state.website.website);

  return (
    <footer
      className="
        border-t
        border-gray-200
        bg-gray-50
        dark:border-slate-800
        dark:bg-slate-950

        h-auto
        lg:h-[35vh]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          max-w-7xl
          flex-col
          px-5
          py-6
          sm:px-6
          lg:px-6
          lg:py-5
        "
      >
        {/* =====================================================
            TOP SECTION
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-7

            sm:grid-cols-2

            lg:grid-cols-[1.5fr_1fr_1fr_1fr]
            lg:gap-8
          "
        >
          {/* =================================================
              BRAND
          ================================================== */}

          <div className="min-w-0">
            <Logo />

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-gray-600
                dark:text-gray-400
              "
            >
              {website?.footer?.footerDescription ||
                "Discover premium products at unbeatable prices. Fast delivery, secure checkout and a shopping experience you'll love."}
            </p>
          </div>

          {/* =================================================
              CUSTOMER SUPPORT
          ================================================== */}

          <FooterColumn title="Customer Support" links={footerLinks.support} />

          {/* =================================================
              SHOP
          ================================================== */}

          <FooterColumn title="Shop" links={footerLinks.shop} />

          {/* =================================================
              COMPANY
          ================================================== */}

          <FooterColumn title="Company" links={footerLinks.company} />
        </div>

        {/* =====================================================
            FOLLOW US + NEWSLETTER
        ====================================================== */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-6

            border-t
            border-gray-200
            pt-0

            dark:border-slate-800

            lg:mt-auto
            sm:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-10
          "
        >
          {/* =================================================
              FOLLOW US
          ================================================== */}

          <div className="shrink-0">
            <FooterSocial social={website?.social} />
          </div>

          {/* =================================================
              NEWSLETTER
          ================================================== */}

          <div
            className="
              flex
              w-full
              flex-col
              gap-3

              lg:max-w-2xl
              md:flex-row
              md:items-center
              md:justify-end
            "
          >
            {/* Newsletter Text */}
            <div className="w-[200px] shrink-0 lg:text-left">
              <h3
                className="
      text-lg
      font-bold
      text-slate-700
      dark:text-gray-300
    "
              >
                Join Our Newsletter
              </h3>

              <p
                className="
      mt-1
      w-full
      text-[10px]
      leading-4
      text-gray-500
      dark:text-gray-400
    "
              >
                Get exclusive offers, discounts and new arrivals directly in
                your inbox.
              </p>
            </div>

            {/* Newsletter Form */}

            <form
              className="
                flex
                w-full
                max-w-xl
                flex-col
                gap-3

                sm:flex-row
              "
            >
              <div className="relative flex-1">
                <Mail
                  size={17}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    pl-11
                    pr-4
                    text-sm
                    text-gray-900
                    outline-none
                    transition

                    placeholder:text-gray-400

                    focus:border-emerald-500

                    dark:border-gray-700
                    dark:bg-gray-900
                    dark:text-white
                    dark:placeholder:text-gray-500
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  flex
                  h-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-emerald-600
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-700
                "
              >
                <Send size={17} />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* =====================================================
            COPYRIGHT
        ====================================================== */}

        <div
          className="
            mt-3
            flex
            flex-col
            gap-3

            border-t
            border-gray-200
            pt-3 md:pt-0
            md:py-3

            text-xs
            text-gray-500

            dark:border-slate-800
            dark:text-gray-400

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Copyright */}

          <p>
            © {new Date().getFullYear()}{" "}
            {website?.footer?.copyright || "CartNova. All rights reserved."}
          </p>

          {/* Legal Links */}

          <div className="flex flex-wrap gap-5">
            <a
              href="/privacy-policy"
              className="transition hover:text-emerald-500"
            >
              Privacy Policy
            </a>

            <a
              href="/terms-of-service"
              className="transition hover:text-emerald-500"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
