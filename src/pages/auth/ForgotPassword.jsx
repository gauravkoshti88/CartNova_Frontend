import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  MessageSquareText,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPassword,
} from "../../redux/thunks/userAuthThunk";

import { clearError } from "../../redux/slices/userAuthSlice";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, resetOtp } = useSelector((state) => state.userAuth);

  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanPhone) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10 digit phone number.");
      return;
    }

    try {
      const response = await dispatch(
        sendResetPasswordOtp(cleanPhone),
      ).unwrap();

      setPhone(cleanPhone);
      setOtp("");

      if (response?.otp) {
        setGeneratedOtp(String(response.otp));
        setShowOtp(true);
      } else {
        setGeneratedOtp("");
        setShowOtp(false);
      }

      setStep(2);

      toast.success(response?.message || "OTP sent successfully.");
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    if (!otp) {
      toast.error("Please enter OTP.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    try {
      const response = await dispatch(
        verifyResetPasswordOtp({
          phone,
          otp,
        }),
      ).unwrap();

      if (!response?.resetToken) {
        toast.error("OTP verified but reset token was not received.");
        return;
      }

      setResetToken(response.resetToken);
      setStep(3);

      toast.success(response?.message || "OTP verified successfully.");
    } catch (error) {
      toast.error(error?.message || "Invalid OTP.");
    }
  };

  const handleResendOtp = async () => {
    dispatch(clearError());

    try {
      const response = await dispatch(sendResetPasswordOtp(phone)).unwrap();

      setOtp("");

      if (response?.otp) {
        setGeneratedOtp(String(response.otp));
        setShowOtp(true);
      }

      toast.success(response?.message || "OTP resent successfully.");
    } catch (error) {
      toast.error(error?.message || "Failed to resend OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!resetToken) {
      toast.error("Password reset session expired. Please request OTP again.");

      setStep(1);
      setOtp("");
      setResetToken("");

      return;
    }

    try {
      const response = await dispatch(
        resetPassword({
          phone,
          resetToken,
          newPassword,
          confirmPassword,
        }),
      ).unwrap();

      toast.success(response?.message || "Password reset successfully.");

      setPhone("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      setGeneratedOtp("");
      setShowOtp(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.message || "Password reset failed.");
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
  };

  const handleChangePhone = () => {
    setStep(1);
    setOtp("");
    setResetToken("");
    setGeneratedOtp("");
    setShowOtp(false);
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950 sm:flex sm:items-center sm:justify-center">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="px-6 pb-6 pt-8 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
              {step === 1 && <KeyRound size={27} />}
              {step === 2 && <ShieldCheck size={27} />}
              {step === 3 && <LockKeyhole size={27} />}
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
              {step === 1 &&
                "Enter your registered phone number to receive an OTP."}

              {step === 2 &&
                `Enter the 6 digit OTP sent to your phone ending in ${phone.slice(-4)}.`}

              {step === 3 &&
                "Create a new secure password for your CartNova account."}
            </p>
          </div>

          <div className="px-6 sm:px-8">
            <div className="flex items-center">
              {[1, 2, 3].map((item, index) => (
                <div
                  key={item}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      step >= item
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-400 dark:bg-slate-800"
                    }`}
                  >
                    {step > item ? <CheckCircle2 size={17} /> : item}
                  </div>

                  {index < 2 && (
                    <div
                      className={`mx-2 h-1 flex-1 rounded-full ${
                        step > item
                          ? "bg-orange-500"
                          : "bg-gray-100 dark:bg-slate-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 pb-8 pt-7 sm:px-8">
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      maxLength={10}
                      required
                      placeholder="Enter 10 digit phone number"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <MessageSquareText size={18} />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="mt-4 flex justify-center">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-center shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Your OTP
                    </p>

                    <div className="rounded-lg border border-emerald-300 bg-white px-5 py-3 text-2xl font-bold tracking-[0.5em] text-emerald-700 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-400">
                      {resetOtp}
                    </div>

                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Enter this OTP below to continue
                    </p>
                  </div>
                </div>
                {showOtp && generatedOtp && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                          Development OTP
                        </p>

                        <p className="mt-2 text-3xl font-bold tracking-[0.35em] text-emerald-700 dark:text-emerald-300">
                          {generatedOtp}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowOtp(false)}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Hide
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-emerald-700/70 dark:text-emerald-400/70">
                      Test mode OTP. Do not expose OTP like this in production.
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="000000"
                    maxLength={6}
                    className="h-14 w-full rounded-xl border border-gray-300 bg-white text-center text-2xl font-bold tracking-[0.5em] outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Verify OTP
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleChangePhone}
                    className="flex items-center gap-1 text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                  >
                    <ArrowLeft size={15} />
                    Change number
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="flex items-center gap-1 font-semibold text-orange-500 transition hover:text-orange-600 disabled:opacity-50"
                  >
                    <RefreshCw
                      size={15}
                      className={loading ? "animate-spin" : ""}
                    />
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    New Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-11 pr-12 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-11 pr-12 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={18} />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 border-t border-gray-100 pt-5 text-center dark:border-slate-800">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
              >
                <ArrowLeft size={15} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} />
          Your account security is protected
        </p>
      </div>
    </section>
  );
}
