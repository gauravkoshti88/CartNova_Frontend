import { motion } from "framer-motion";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("404 - Page Not Found");
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-[calc(100vh)] items-center justify-center overflow-hidden bg-white px-4 py-16 dark:bg-gray-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="absolute -right-20 bottom-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-2xl text-center"
      >
        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="select-none text-[clamp(7rem,20vw,12rem)] font-black leading-none tracking-tighter text-red-600"
        >
          404
        </motion.h1>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.25,
          }}
          className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.3,
          }}
          className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base dark:text-gray-400"
        >
          Sorry, the page you're looking for doesn't exist or may have been
          moved. Let's get you back to CartNova.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.4,
          }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          {/* Go Home */}
          <Link
            to="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-300 sm:w-auto dark:shadow-none"
          >
            <Home
              size={18}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Go Home
          </Link>

          {/* Go Back */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 sm:w-auto dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Go Back
          </button>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.6,
          }}
          className="mt-5 flex justify-center"
        >
          <Logo />
        </motion.div>
      </motion.div>
    </main>
  );
}
