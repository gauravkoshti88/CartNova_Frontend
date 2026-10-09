import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import ScrollTopButton from "../../components/ScrollTopButton";
import ChatWidget from "../../components/chat/ChatWidget";
import { Loader } from "../../components/States";

const PublicLayout = () => {
  const { mode } = useSelector((state) => state.theme);

  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const { loading } = useSelector((state) => state.website);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="pt-33 min-h-screen dark:bg-slate-950">
        <Outlet />
      </main>
      <Footer />

      {isAuthenticated && <ChatWidget />}
      <ScrollTopButton />
    </>
  );
};

export default PublicLayout;
