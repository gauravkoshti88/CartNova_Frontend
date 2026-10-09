import { useSelector } from "react-redux";

import { Logo } from "../../../components/Logo";
import AdminFooterColumn from "./AdminFooterColumn";
import { adminFooterLinks } from "./adminFooterData";
import { Link } from "react-router-dom";

export default function AdminFooter() {
  const website = useSelector((state) => state.website.website);

  return (
    <footer
      className="
        mt-auto
        border-t
        border-gray-200
        bg-gray-50
        dark:border-slate-800
        dark:bg-slate-950
        ml-64
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-6
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-7
            sm:grid-cols-2
            lg:grid-cols-[1.4fr_1fr_1fr_1fr]
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
                max-w-sm
                text-xs
                leading-5
                text-gray-500
                dark:text-gray-400
              "
            >
              Manage your G-Shop store, orders, products, customers and website
              settings from the admin dashboard.
            </p>

            {/* Admin Status */}

            <div
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-3
                py-1.5
                text-xs
                font-medium
                text-emerald-700
                dark:border-emerald-900/50
                dark:bg-emerald-950/40
                dark:text-emerald-400
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-emerald-500
                "
              />
              Admin Panel
            </div>
          </div>

          {/* =================================================
              MANAGEMENT
          ================================================== */}

          <AdminFooterColumn
            title="Management"
            links={adminFooterLinks.management}
          />

          {/* =================================================
              WEBSITE
          ================================================== */}

          <AdminFooterColumn title="Website" links={adminFooterLinks.website} />

          {/* =================================================
              SETTINGS
          ================================================== */}

          <AdminFooterColumn
            title="Settings"
            links={adminFooterLinks.settings}
          />
        </div>

        {/* =====================================================
            COPYRIGHT
        ====================================================== */}

        <div
          className="
            mt-4
            flex
            gap-2
            border-t
            border-gray-200
            pt-4
            text-xs
            text-gray-500
            dark:border-slate-800
            dark:text-gray-400
            items-center
            justify-center
          "
        >
          <p>
            © {new Date().getFullYear()}{" "}
            {website?.footer?.copyright || "G-Shop. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
