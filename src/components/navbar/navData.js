import {
  Shirt,
  Smartphone,
  Sofa,
  Heart,
  ShoppingBag,
  Book,
  Trophy,
  Car,
  Gamepad2,
  Home,
  Store,
  Grid2X2,
  Tag,
  Sparkles,
  TrendingUp,
  Info,
  Phone,
  PackageSearch,
  CircleHelp,
  User,
  Package,
  MapPin,
  Settings,
} from "lucide-react";

/* ===========================
   Main Navigation
=========================== */

export const navLinks = [
  {
    title: "Home",
    path: "/",
    icon: Home,
  },
  {
    title: "Shop",
    path: "/shop",
    icon: Store,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: Grid2X2,
  },
  {
    title: "Offers",
    path: "/offers",
    icon: Tag,
  },
  {
    title: "New Arrivals",
    path: "/new-arrivals",
    icon: Sparkles,
  },
  {
    title: "Best Sellers",
    path: "/best-sellers",
    icon: TrendingUp,
  },
];

/* ===========================
   Account / Quick Links
=========================== */

export const quickLinks = [
  {
    title: "Account",
    path: "/user/my-profile",
    icon: User,
  },
  {
    title: "Wishlist",
    path: "/wishlist",
    icon: Heart,
  },
  {
    title: "My Orders",
    path: "/user/my-orders",
    icon: Package,
  },
];

/* ===========================
   More Links
=========================== */

export const moreLinks = [
  {
    title: "About",
    path: "/about",
    icon: Info,
  },
  {
    title: "Contact",
    path: "/contact",
    icon: Phone,
  },
  {
    title: "Help Center",
    path: "/help-center",
    icon: CircleHelp,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

/* ===========================
   User Dropdown Menu
=========================== */

export const userMenu = [
  {
    title: "My Profile",
    path: "/profile",
    icon: User,
  },
  {
    title: "My Orders",
    path: "/orders",
    icon: Package,
  },
  {
    title: "Wishlist",
    path: "/wishlist",
    icon: Heart,
  },
  {
    title: "Saved Addresses",
    path: "/addresses",
    icon: MapPin,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];
