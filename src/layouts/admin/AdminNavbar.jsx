import { motion } from "framer-motion";
import { LogOut, ChevronDown, UserCircle2, Headset } from "lucide-react";
import { Logo } from "../../components/Logo";
import ThemeButton from "../../components/ThemeButton";
import { LogSignBtn } from "../../components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../redux/thunks/adminAuthThunk";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { admin } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(logoutAdmin()).unwrap();
      toast.success(res.message || "Admin Logout");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <header className="w-full fixed top-0 z-50 h-18 border-b border-gray-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Logo />
        </motion.div>

        {/* Right */}

        <div className="flex items-center gap-3">
          {/* Theme */}

          <ThemeButton />

          {/* Notification */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-11 w-11 justify-center items-center p-2 rounded-full hover:shadow-glow transition-shadow"
            onClick={() => navigate("/admin/chat")}
          >
            <Headset size={20} className="text-black dark:text-white" />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </motion.button>

          {/* Profile */}

          <div className="h-9 w-9 shrink-0 rounded-full ring-2 ring-green-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 overflow-hidden">
            {admin?.profileImage?.url ? (
              <img
                src={admin?.profileImage?.url}
                alt={admin?.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold uppercase">
                {admin?.name?.charAt(0) || "A"}
              </div>
            )}
          </div>
          {/* Logout */}
          <LogSignBtn Icon={LogOut} text={"Logout"} handleFunc={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
