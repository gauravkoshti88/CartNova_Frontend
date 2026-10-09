import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function Loader({
    fullPage = false,
    text = "Loading...",
    size = 40,
}) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                }}
            >
                <Loader2
                    size={size}
                    className="text-red-600"
                />
            </motion.div>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {text}
            </p>
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-950">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-10">
            {content}
        </div>
    );
}

export function ButtonLoader() {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "linear",
            }}
        >
            <Loader2 size={18} />
        </motion.div>
    );
}