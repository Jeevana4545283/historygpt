import { motion } from "framer-motion";

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" style={{ backgroundColor: "#090607" }}>
            
            {/* Animated Purple Gradient Blob */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen opacity-70"
                style={{
                    backgroundColor: "#ac1ed6",
                    filter: "blur(140px)",
                }}
                animate={{
                    x: ["0%", "15%", "-5%", "0%"],
                    y: ["0%", "10%", "5%", "0%"],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Animated Rose/Pink Gradient Blob */}
            <motion.div
                className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-60"
                style={{
                    backgroundColor: "#c26e73",
                    filter: "blur(130px)",
                }}
                animate={{
                    x: ["0%", "-10%", "10%", "0%"],
                    y: ["0%", "15%", "-5%", "0%"],
                    scale: [1, 1.05, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Subtle floating Dark Charcoal element for contrast and depth */}
            <motion.div
                className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[50vw] rounded-full mix-blend-multiply opacity-90"
                style={{
                    backgroundColor: "#221f20",
                    filter: "blur(120px)",
                }}
                animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Subtle Noise Texture overlay to prevent banding and add premium grainy feel */}
            <div 
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
            />
            
            {/* Additional Dark Overlay to ensure perfect contrast with UI text */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090607]/40 to-[#090607]/90" />
        </div>
    );
};
