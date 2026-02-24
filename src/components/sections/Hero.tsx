import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GlitchText = ({ text }: { text: string }) => {
    return (
        <div className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 translate-x-[2px] text-cyber-green opacity-0 group-hover:opacity-70 animate-pulse">{text}</span>
            <span className="absolute top-0 left-0 -z-10 -translate-x-[2px] text-alert-red opacity-0 group-hover:opacity-70 animate-pulse delay-75">{text}</span>
        </div>
    );
};

const Hero: React.FC = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 1.5]);

    return (
        <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <motion.div
                style={{ y, opacity, scale }}
                className="text-center z-10 p-8"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-4"
                >
                    <div className="inline-block px-3 py-1 mb-6 border border-cyber-green/30 rounded-full bg-cyber-green/10 text-cyber-green font-mono text-sm tracking-widest backdrop-blur-sm">
                        SYSTEM ONLINE
                    </div>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 relative hover:scale-105 transition-transform duration-300 cursor-default">
                    <GlitchText text="ECO-SENTINEL" />
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl md:text-2xl text-white/60 font-mono max-w-2xl mx-auto"
                >
                    Powered by Pathway: <span className="text-white">Beyond Batch Processing.</span>
                </motion.p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Initialize</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-cyber-green/0 via-cyber-green/50 to-cyber-green/0" />
            </motion.div>
        </section>
    );
};

export default Hero;
