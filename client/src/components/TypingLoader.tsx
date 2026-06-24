import { motion } from "framer-motion";

export const TypingLoader = () => {
    return (
        <div className="flex gap-2 p-6 rounded-2xl bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 mt-8 shadow-xl w-fit">
            <motion.div
                className="w-3 h-3 rounded-full bg-sky-400"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
                className="w-3 h-3 rounded-full bg-sky-400"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
                className="w-3 h-3 rounded-full bg-sky-400"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );
};
