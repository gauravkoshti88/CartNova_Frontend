import { motion } from "framer-motion";
import { useState } from "react";

import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/FormController";
import { Logo } from "../../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../redux/thunks/adminAuthThunk";
import {
  registerUser,
  loginUser,
  sendLoginOtp,
  verifyLoginOtp,
} from "../../redux/thunks/userAuthThunk";
import { ButtonLoader } from "../../components/States";
import { getCart, mergeGuestCart } from "../../redux/thunks/cartThunk";
import {
  clearGuestCart as clearStoredGuestCart,
  getGuestCart,
} from "../../utils/guestCart";
import { useToast } from "../../hooks/useToast";
import { clearError, clearMessage } from "../../redux/slices/userAuthSlice";
import toast from "react-hot-toast";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { GoogleAuthButton } from "../../components/Buttons";

export function Register() {
  useDocumentTitle("Sign Up");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, success, message, error } = useSelector(
    (state) => state.userAuth,
  );

  useToast({
    success,
    message,
    error,
    clearMessage: () => dispatch(clearMessage()),
    clearError: () => dispatch(clearError()),
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedGuestCart = getGuestCart();

      const guestItems = Array.isArray(storedGuestCart?.items)
        ? storedGuestCart.items
        : [];

      const response = await dispatch(registerUser(formData)).unwrap();

      if (guestItems.length > 0) {
        await dispatch(mergeGuestCart(guestItems)).unwrap();
      }

      await dispatch(getCart()).unwrap();

      clearStoredGuestCart();

      navigate("/login");
    } catch (error) {
      toast.error(error?.message || error?.error || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-slate-900">
      <div className="relative z-10 flex min-h-screen items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black backdrop-blur-xl"
        >
          {/* LOGO */}

          <div className="flex items-center justify-center lg:hidden">
            <Logo />
          </div>

          {/* HEADING */}

          <div className="mt-2 text-center">
            <h1 className="text-2xl font-bold text-black md:text-3xl dark:text-white">
              Create Account
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-200">
              Join our premium community today.
            </p>
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 px-5">
            {/* FIRST + LAST NAME */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                Icon={User}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                focus="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />

              <Input
                Icon={User}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                focus="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* EMAIL */}

            <Input
              Icon={Mail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              focus="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />

            {/* PHONE */}

            <Input
              Icon={Phone}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              maxLength={10}
              required
              focus="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />

            {/* PASSWORD */}

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-200"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full rounded-xl border border-gray-500 bg-white/10 py-3 pl-12 pr-12 text-gray-800 outline-none transition-all placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:text-gray-200 dark:placeholder:text-gray-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* REGISTER */}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.96 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <ButtonLoader />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* DIVIDER */}

          <div className="my-5 flex items-center px-6">
            <div className="h-px flex-1 bg-gray-400" />

            <span className="mx-4 text-sm text-gray-600 dark:text-green-200">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-400" />
          </div>

          <GoogleAuthButton />

          {/* LOGIN */}

          <p className="mt-5 text-center text-gray-600 dark:text-green-200">
            Already have an account?
            <button
              type="button"
              className="ml-2 cursor-pointer font-medium text-blue-600 dark:text-blue-500"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function Login() {
  useDocumentTitle("Login");
  const [loginMode, setLoginMode] = useState("password");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    success,
    message,
    error,
    otpSent,
    otpLoading,
    otpVerifying,
    otpError,
    devOtp,
  } = useSelector((state) => state.userAuth);

  useToast({
    success,
    message,
    error,
    clearMessage: () => dispatch(clearMessage()),
    clearError: () => dispatch(clearError()),
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      return;
    }

    try {
      await dispatch(sendLoginOtp(phone.trim())).unwrap();
    } catch (error) {
      console.error("SEND OTP ERROR:", error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      return;
    }

    try {
      const result = await dispatch(
        verifyLoginOtp({
          phone: phone.trim(),
          otp: otp.trim(),
        }),
      ).unwrap();

      navigate("/");
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedGuestCart = getGuestCart();

      const guestItems = Array.isArray(storedGuestCart?.items)
        ? storedGuestCart.items
        : [];

      const response = await dispatch(loginUser(formData)).unwrap();

      if (guestItems.length > 0) {
        await dispatch(mergeGuestCart(guestItems)).unwrap();
      }

      await dispatch(getCart()).unwrap();

      clearStoredGuestCart();

      navigate("/");
    } catch (error) {
      toast.error(
        error?.message || error?.response?.data?.message || "Login Failed",
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-slate-900">
      <div className="relative z-10 flex min-h-screen items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black backdrop-blur-xl"
        >
          <div className="mb-2 flex items-center justify-center lg:hidden">
            <Logo />
          </div>

          <h1 className="text-center text-3xl font-bold text-black dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-center text-gray-600 dark:text-gray-200">
            Login to continue shopping.
          </p>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1 dark:bg-slate-800 mt-5">
            <button
              type="button"
              onClick={() => setLoginMode("password")}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                loginMode === "password"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-gray-500"
              }`}
            >
              Password
            </button>

            <button
              type="button"
              onClick={() => setLoginMode("otp")}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                loginMode === "otp"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-gray-500"
              }`}
            >
              Login with OTP
            </button>
          </div>

          {loginMode === "otp" && (
            <div className="space-y-5">
              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="Enter mobile number"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                  maxLength={10}
                  required
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || phone.length < 10}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {otpLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <>
                  {/* DEV OTP */}

                  {import.meta.env.DEV && devOtp && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-center dark:border-amber-700 dark:bg-amber-950/30">
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        Development OTP
                      </p>

                      <p className="mt-1 text-2xl font-bold tracking-[0.35em] text-amber-900 dark:text-amber-300">
                        {devOtp}
                      </p>
                    </div>
                  )}

                  {/* OTP INPUT */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Enter OTP
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Enter 6 digit OTP"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  {otpError && (
                    <p className="text-sm text-red-500">{otpError}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpVerifying || otp.length !== 6}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {otpVerifying ? "Verifying..." : "Verify & Login"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtp("");
                      handleSendOtp();
                    }}
                    disabled={otpLoading}
                    className="w-full text-sm font-medium text-indigo-600 hover:underline"
                  >
                    {otpLoading ? "Sending..." : "Resend OTP"}
                  </button>
                </>
              )}
            </div>
          )}

          {loginMode === "password" && (
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* EMAIL */}

              <Input
                Icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                focus="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />

              {/* PASSWORD */}

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-200"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-gray-500 bg-white/10 py-3 pl-12 pr-12 text-gray-800 outline-none transition-all placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:text-gray-200 dark:placeholder:text-gray-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* REMEMBER */}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    required
                  />
                  Remember Me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* LOGIN */}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <ButtonLoader />
                    Signing In...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* DIVIDER */}

          <div className="my-5 flex items-center">
            <div className="h-px flex-1 bg-gray-400" />

            <span className="mx-4 text-sm text-gray-500 dark:text-gray-200">
              OR CONTINUE WITH
            </span>

            <div className="h-px flex-1 bg-gray-400" />
          </div>

          <GoogleAuthButton />

          {/* REGISTER */}

          <p className="mt-5 text-center text-gray-600 dark:text-gray-200">
            Don't have an account?
            <button
              type="button"
              className="ml-2 cursor-pointer font-medium text-blue-600 dark:text-blue-500"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function AdminLogin() {
  useDocumentTitle("Admin-Login");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, message, error } = useSelector(
    (state) => state.adminAuth,
  );

  useToast({
    success,
    message,
    error,
    clearMessage: () => dispatch(clearMessage()),
    clearError: () => dispatch(clearError()),
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(loginAdmin(formData)).unwrap();

      navigate("/admin");
    } catch (error) {
      toast.error(error.message || "Login Failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white dark:bg-slate-900 p-5">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-center mb-2 lg:hidden">
          <Logo />
        </div>

        <h1 className="text-center text-3xl font-bold text-black dark:text-white">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-gray-600 dark:text-gray-200">
          Sign in to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Admin Email"
            Icon={Mail}
            focus="focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          />

          {/* Password */}
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-200"
              size={20}
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-xl border border-gray-500 bg-white/10 py-3 pl-12 pr-12 text-gray-800 dark:text-gray-200 placeholder:text-gray-600 dark:placeholder:text-gray-200 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-900 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
              <input type="checkbox" className="accent-red-600" required />
              Remember Me
            </label>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-white disabled:opacity-60"
          >
            {loading ? (
              <>
                <ButtonLoader />
                Signing In...
              </>
            ) : (
              <>
                Login to Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500 p-3 text-center text-sm text-white font-semibold">
          Authorized administrators only.
        </div>
      </motion.div>
    </div>
  );
}
