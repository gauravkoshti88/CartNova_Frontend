import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { ButtonLoader } from "./States";
import { useDispatch } from "react-redux";
import { googleLogin } from "../redux/thunks/userAuthThunk";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

export const LogSignBtn = ({
  Icon,
  text,
  to,
  handleFunc,
  color,
  type,
  loading,
}) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (handleFunc) handleFunc(e);
    if (to) navigate(to);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      className={`flex items-center gap-2 rounded-xl ${text === "Logout" ? "bg-red-500 hover:bg-red-600 text-white" : `${color}`}  px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-100 cursor-pointer`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <ButtonLoader /> : <Icon size={18} />}
      <span className="hidden lg:block first-letter:capitalize">
        {loading ? "Please wait..." : text}
      </span>
    </motion.button>
  );
};

export const IconBtn = ({
  handleFunc,
  Icon1,
  Icon2,
  initVal,
  color,
  fill,
  state,
}) => {
  return (
    <button
      onClick={handleFunc}
      className="p-2 rounded-full hover:shadow-glow transition-shadow"
    >
      {state ? (
        <Icon1
          size={22}
          color={color}
          fill={fill}
          className={"active:scale-95 text-black dark:text-white"}
        />
      ) : (
        <Icon2 size={22} className={"text-black dark:text-white"} />
      )}
    </button>
  );
};

export default function ProductButton({
  children,
  Icon,
  disabled = false,
  loading = false,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",

    success: "bg-green-600 hover:bg-green-700 text-white",

    danger: "bg-red-600 hover:bg-red-700 text-white",

    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all",

        styles[variant],

        className,
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        Icon && <Icon size={18} />
      )}

      <span>{loading ? "Saving..." : children}</span>
    </motion.button>
  );
}

export function GoogleAuthButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error("Google credential not received.");
      }

      await dispatch(googleLogin(credentialResponse.credential)).unwrap();

      toast.success("Google login successful!");

      navigate("/");
    } catch (error) {
      toast.error(error || "Google login failed.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="px-6">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        width="100%"
      />
    </div>
  );
}
