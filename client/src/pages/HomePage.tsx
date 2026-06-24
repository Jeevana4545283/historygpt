import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { characters } from "../data/characters";
import { OrbCenterpiece } from "../components/OrbCenterpiece";

export const HomePage = () => {
    // Select 4 diverse legends for the homepage showcase
    const showcaseNames = ["Albert Einstein", "Steve Jobs", "Mahatma Gandhi", "Marie Curie"];
    const showcaseCharacters = showcaseNames.map(name => characters.find(c => c.name === name)).filter(Boolean);

    return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-start p-6 text-slate-100 font-sans selection:bg-sky-500/30 overflow-y-auto relative">
            
            {/* Main Hero Stack */}
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-10 md:pt-20 pb-8 z-10">
                
                {/* Large animated luxury orb centerpiece (top of the page hierarchy) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px] mb-8 md:mb-10 flex items-center justify-center relative"
                >
                    <OrbCenterpiece 
                        type="energy" 
                        className="w-full h-full" 
                    />
                </motion.div>

                {/* Hero text container */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
                    className="w-full max-w-3xl"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-blue-400 to-fuchsia-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.25)] tracking-tight">
                        HistoryGPT
                    </h1>
                    <p className="text-xl md:text-2xl font-semibold text-slate-200 mb-6 tracking-wide drop-shadow-md">
                        Talk With Legends Across Time
                    </p>
                    <p className="text-base md:text-lg text-slate-300/90 max-w-xl mx-auto leading-relaxed mb-10 drop-shadow-sm">
                        Step into the quantum observatory. Engage in live conversations with history's greatest minds, innovators, and leaders.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12">
                        <Link to="/chat">
                            <motion.button 
                                whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px rgba(14,165,233,0.5)" }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full sm:w-auto px-8 py-4 bg-sky-500 text-white rounded-full font-bold text-base shadow-[0_0_15px_rgba(14,165,233,0.25)] transition-all cursor-pointer"
                            >
                                Start Chatting
                            </motion.button>
                        </Link>
                        <Link to="/chat">
                            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 hover:border-slate-500/70 text-slate-200 rounded-full font-bold text-base hover:bg-slate-800/80 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer">
                                Explore {characters.length} Legends
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Character Showcase Grid */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="w-full max-w-5xl z-10 pb-16"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {showcaseCharacters.map((char, i) => char && (
                        <motion.div 
                            key={char.name}
                            initial={{ y: 0 }}
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
                            className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 p-5 rounded-2xl flex flex-col items-center text-center shadow-[0_4px_30px_rgba(0,0,0,0.25)] hover:bg-slate-800/40 transition-colors"
                        >
                            <img src={char.image} alt={char.name} className="w-14 h-14 rounded-full object-cover object-top border-2 border-slate-700/50 mb-3 shadow-md" />
                            <h3 className="font-bold text-slate-200 text-sm mb-1">{char.name}</h3>
                            <p className="text-[9px] text-sky-400 uppercase tracking-widest">{char.category}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
