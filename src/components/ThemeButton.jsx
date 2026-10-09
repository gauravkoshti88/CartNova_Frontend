import { Moon, Sun } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";

function ThemeButton() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="ml-4 p-2 rounded-full hover:shadow-glow transition-shadow"
    >
      {mode === "light" ? (
        <Moon size={22} className="text-black dark:text-white" />
      ) : (
        <Sun size={22} className="text-black dark:text-white" />
      )}
    </button>
  );
}

export default ThemeButton;
