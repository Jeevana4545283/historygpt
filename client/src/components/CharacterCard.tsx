import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "../lib/utils";

interface CharacterCardProps {
    name: string;
    image: string;
    isSelected: boolean;
    onClick: () => void;
}

export const CharacterCard = ({ name, image, isSelected, onClick }: CharacterCardProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useTransform(x, [-0.5, 0.5], ["-7deg", "7deg"]);
    const mouseYSpring = useTransform(y, [-0.5, 0.5], ["7deg", "-7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
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
            style={{
                rotateY: mouseXSpring,
                rotateX: mouseYSpring,
                transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl cursor-pointer w-[180px] transition-colors duration-300",
                "bg-slate-800/60 backdrop-blur-md border border-slate-700/50",
                isSelected ? "border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)] bg-slate-800/80" : "hover:border-slate-500/50 hover:bg-slate-800/70"
            )}
        >
            <div
                className="w-full h-[200px] rounded-xl overflow-hidden mb-3"
                style={{ transform: "translateZ(30px)" }}
            >
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <p
                className={cn(
                    "font-bold text-center",
                    isSelected ? "text-sky-300" : "text-slate-200"
                )}
                style={{ transform: "translateZ(20px)" }}
            >
                {name}
            </p>
            {isSelected && (
                <motion.div
                    layoutId="outline"
                    className="absolute inset-0 rounded-2xl border-2 border-sky-400"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </motion.div>
    );
};
