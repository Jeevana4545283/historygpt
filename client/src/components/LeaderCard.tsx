import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "../lib/utils";

interface LeaderCardProps {
    name: string;
    role: string;
    subtitle?: string;
    category?: string;
    image: string;
    isSelected: boolean;
    onClick: () => void;
}

export const LeaderCard = ({ name, role, subtitle, category, image, isSelected, onClick }: LeaderCardProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useTransform(x, [-0.5, 0.5], ["-5deg", "5deg"]);
    const mouseYSpring = useTransform(y, [-0.5, 0.5], ["5deg", "-5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ rotateY: mouseXSpring, rotateX: mouseYSpring, transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.04, boxShadow: "0px 0px 15px rgba(14,165,233,0.2)" }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300",
                "bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/60",
                isSelected && "border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.5)] bg-slate-800/90 scale-[1.02]"
            )}
        >
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-slate-600/50">
                <img src={image} alt={name} className="w-full h-full object-cover object-top aspect-square" />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className={cn("font-semibold text-sm truncate transition-colors", isSelected ? "text-sky-300" : "text-slate-200")}>
                        {name}
                    </p>
                    {category && (
                        <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                            {category}
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-400 truncate">{subtitle || role}</p>
            </div>

            {isSelected && (
                <motion.div
                    layoutId="active-leader"
                    className="absolute inset-0 rounded-xl border-2 border-sky-400/80 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </motion.div>
    );
};
