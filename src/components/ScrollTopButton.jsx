import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useSelector } from "react-redux";

export default function ScrollTopButton() {
  const [showButton, setShowButton] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.userAuth);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed
        ${isAuthenticated ? "bottom-24 right-5" : "bottom-5 right-5"}
        z-[998]

        flex
        h-14
        w-14
        items-center
        justify-center

        rounded-full

        bg-gradient-to-br
        from-indigo-600
        to-violet-600

        text-white

        shadow-xl
        shadow-indigo-500/30

        transition-all
        duration-200

        hover:scale-105
        hover:shadow-2xl

        active:scale-95

        sm:bottom-24
        sm:right-6

        ${
          showButton
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-75 opacity-0"
        }
      `}
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}
