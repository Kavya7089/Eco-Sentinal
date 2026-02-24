import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Zap, Activity, BrainCircuit } from 'lucide-react';
import GlassCard from '../layout/GlassCard';

const Card3D = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full"
        >
            <motion.div
                style={{ rotateX, rotateY, z: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full h-full"
            >
                <GlassCard className="h-full flex flex-col gap-4 group cursor-default" hoverEffect>
                    <div className="w-12 h-12 rounded-lg bg-cyber-green/10 flex items-center justify-center text-cyber-green group-hover:scale-110 transition-transform duration-300">
                        <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold font-mono text-white group-hover:text-cyber-green transition-colors">{title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{desc}</p>

                    <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-mono text-cyber-green/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                        <span>LIVE MONITORING</span>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};

const FeatureCards: React.FC = () => {
    const features = [
        {
            title: "Live Ingestion",
            desc: "Instantaneous data streaming from IoT sensors with <10ms latency. Visualized as magnetic particle flow.",
            icon: Zap
        },
        {
            title: "Streaming Analytics",
            desc: "Real-time anomaly detection using windowed aggregations. Beyond batch processing limitations.",
            icon: Activity
        },
        {
            title: "RAG Reasoning",
            desc: "Context-aware AI that indexes documentation in real-time to answer operator queries instantly.",
            icon: BrainCircuit
        }
    ];

    return (
        <section className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <Card3D key={i} {...f} />
                ))}
            </div>
        </section>
    );
};

export default FeatureCards;
