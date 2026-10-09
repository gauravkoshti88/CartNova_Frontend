import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Grid2x2,
  Users,
  TicketPercent,
  Image,
  BarChart3,
  FileText,
  Globe,
  Settings,
  CreditCard,
  Truck,
  UserCog,
  ShieldCheck,
  Cog,
  ListTree,
  Tags,
  Phone,
  Share2,
  Layout,
  Search,
  ChevronDown,
  ChevronRight,
  List,
  GitBranch,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { useSelector } from "react-redux";

// =====================================================
// MENU ITEMS
// =====================================================

const menuItems = [
  {
    title: "Main",

    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin",
      },

      {
        name: "Orders",
        icon: ShoppingBag,
        path: "/admin/orders",
      },

      {
        name: "Products",
        icon: Package,
        path: "/admin/products",
      },

      {
        name: "Categories",
        icon: Grid2x2,
        path: "/admin/categories",
      },

      // ================================================
      // SUB CATEGORIES DROPDOWN
      // ================================================

      {
        name: "Sub Categories",
        icon: ListTree,
        dropdown: true,

        children: [
          {
            name: "Sub Categories",
            icon: List,
            path: "/admin/sub-categories",
          },

          {
            name: "Child Categories",
            icon: GitBranch,
            path: "/admin/child-categories",
          },
        ],
      },

      {
        name: "Brands",
        icon: Tags,
        path: "/admin/brands",
      },

      {
        name: "Customers",
        icon: Users,
        path: "/admin/customers",
      },

      {
        name: "Coupons",
        icon: TicketPercent,
        path: "/admin/coupons",
      },

      {
        name: "Analytics",
        icon: BarChart3,
        path: "/admin/analytics",
      },

      {
        name: "Reports",
        icon: FileText,
        path: "/admin/reports",
      },
    ],
  },

  // =====================================================
  // WEBSITE SETTINGS
  // =====================================================

  {
    title: "Website",

    dropdown: true,

    items: [
      {
        name: "General",
        icon: Globe,
        path: "/admin/website/general",
      },

      {
        name: "Hero Banners",
        icon: Image,
        path: "/admin/website/hero-banners",
      },

      {
        name: "Offer Banners",
        icon: Image,
        path: "/admin/website/offer-banners",
      },

      {
        name: "About",
        icon: FileText,
        path: "/admin/website/about",
      },

      {
        name: "Contact",
        icon: Phone,
        path: "/admin/website/contact",
      },

      {
        name: "Social",
        icon: Share2,
        path: "/admin/website/social",
      },

      {
        name: "Footer",
        icon: Layout,
        path: "/admin/website/footer",
      },

      {
        name: "SEO",
        icon: Search,
        path: "/admin/website/seo",
      },
    ],
  },

  // =====================================================
  // SETTINGS
  // =====================================================

  {
    title: "Settings",

    dropdown: true,

    items: [
      {
        name: "General",
        icon: Settings,
        path: "/admin/settings",
      },

      {
        name: "Payment Methods",
        icon: CreditCard,
        path: "/admin/payment",
      },

      {
        name: "Shipping",
        icon: Truck,
        path: "/admin/shipping",
      },

      {
        name: "Roles",
        icon: ShieldCheck,
        path: "/admin/roles",
      },

      {
        name: "System Settings",
        icon: Cog,
        path: "/admin/system",
      },
    ],
  },
];

// =====================================================
// ADMIN SIDEBAR
// =====================================================

const AdminSidebar = () => {
  const location = useLocation();
  const { admin } = useSelector((state) => state.adminAuth);

  const [openSections, setOpenSections] = useState({
    "Website Settings": false,
    Settings: false,
  });

  // ===================================================
  // INNER DROPDOWNS
  // ===================================================

  const [openDropdowns, setOpenDropdowns] = useState({
    "Sub Categories": false,
  });

  // ===================================================
  // CHECK ACTIVE SECTION
  // ===================================================

  const isSectionActive = (section) => {
    return section.items?.some((item) => {
      if (item.children) {
        return item.children.some((child) =>
          location.pathname.startsWith(child.path),
        );
      }

      return item.path && location.pathname.startsWith(item.path);
    });
  };

  // ===================================================
  // CHECK ACTIVE DROPDOWN
  // ===================================================

  const isDropdownActive = (item) => {
    return item.children?.some((child) =>
      location.pathname.startsWith(child.path),
    );
  };

  // ===================================================
  // AUTO OPEN ACTIVE DROPDOWN
  // ===================================================

  useEffect(() => {
    // Sub Categories
    const subCategoryItem = menuItems
      .flatMap((section) => section.items || [])
      .find((item) => item.dropdown && item.children && isDropdownActive(item));

    if (subCategoryItem) {
      setOpenDropdowns((prev) => ({
        ...prev,
        [subCategoryItem.name]: true,
      }));
    }

    // Website Settings / Settings
    menuItems.forEach((section) => {
      if (section.dropdown && isSectionActive(section)) {
        setOpenSections((prev) => ({
          ...prev,
          [section.title]: true,
        }));
      }
    });
  }, [location.pathname]);

  // ===================================================
  // TOGGLE SECTION
  // ===================================================

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // ===================================================
  // TOGGLE INNER DROPDOWN
  // ===================================================

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        w-22
        md:w-64
        flex-col
        border-r
        border-gray-200
        bg-white
        dark:border-gray-700
        dark:bg-gray-900
      "
    >
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mt-20">
        <div className="flex items-center gap-5 mt-3 ml-6">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-green-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
            {admin?.profileImage?.url ? (
              <img
                src={admin.profileImage.url}
                alt={admin?.name || "Admin"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold uppercase text-white">
                {admin?.name?.charAt(0) || "A"}
              </div>
            )}
          </div>

          <div className="min-w-0 hidden lg:block">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {admin?.name || "Admin"}
            </p>

            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {admin?.email || "admin@example.com"}
            </p>
          </div>
        </div>
        {menuItems.map((section) => {
          const sectionHasDropdown = section.dropdown;

          const sectionOpen = openSections[section.title];

          return (
            <div key={section.title} className="mt-6">
              <div
                className={`
                  mb-3
                  flex
                  items-center
                  justify-between
                  px-3 md:px-6
                  ${sectionHasDropdown ? "cursor-pointer" : ""}
                `}
                onClick={() => {
                  if (sectionHasDropdown) {
                    toggleSection(section.title);
                  }
                }}
              >
                <h4
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  {section.title}
                </h4>

                {sectionHasDropdown && (
                  <button
                    type="button"
                    className="
                      text-gray-400
                      transition-colors
                      hover:text-gray-700
                      dark:hover:text-gray-200
                    "
                  >
                    {sectionOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
              </div>

              {/* ==========================================
                  SECTION CONTENT
              ========================================== */}

              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ease-in-out
                  ${
                    sectionHasDropdown && !sectionOpen
                      ? "max-h-0 opacity-0"
                      : "max-h-[1000px] opacity-100"
                  }
                `}
              >
                {section.items.map((item) => {
                  const Icon = item.icon;

                  // ========================================
                  // DROPDOWN ITEM
                  // ========================================

                  if (item.dropdown && item.children) {
                    const dropdownOpen = openDropdowns[item.name];

                    const dropdownActive = isDropdownActive(item);

                    return (
                      <div key={item.name} className="mb-1">
                        {/* Parent */}

                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.name)}
                          className={`
                            mx-3
                            flex
                            w-[calc(100%-24px)]
                            items-center
                            justify-between
                            rounded-xl
                            px-2 md:px-4
                            py-3
                            transition-all
                            duration-200
                            ${
                              dropdownActive
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={20} />

                            <span className="text-sm font-medium hidden md:block">
                              {item.name}
                            </span>
                          </div>

                          {dropdownOpen ? (
                            <ChevronDown size={17} />
                          ) : (
                            <ChevronRight size={17} />
                          )}
                        </button>

                        {/* =================================
                            CHILDREN
                        ================================= */}

                        <div
                          className={`ml-5 md:ml-7 overflow-hidden border-l border-gray-200 pl-0.5 md:pl-2 transition-all duration-300 dark:border-gray-700 ${dropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;

                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) =>
                                  `mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-950 40 dark:text-blue-400" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"}`
                                }
                              >
                                <ChildIcon size={16} strokeWidth={1.8} />

                                <span className="text-sm font-medium hidden md:block">
                                  {child.name}
                                </span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // ========================================
                  // NORMAL NAVIGATION ITEM
                  // ========================================

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === "/admin"}
                      className={({ isActive }) =>
                        `
                        mx-3
                        mb-1
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        px-4
                        py-3
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        }
                      `
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />

                        <span className="text-sm font-medium hidden md:block">
                          {item.name}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;
