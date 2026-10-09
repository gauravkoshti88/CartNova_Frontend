import { useState } from "react";
import TopNavbar from "./TopNavbar";
import BottomNavbar from "./BottomNavbar";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-2 md:px-0">
      <TopNavbar openSidebar={openSidebar} />

      <BottomNavbar />

      <MobileSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
    </header>
  );
}
