import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = false }) => {
    return (
        <motion.div
            className={cn(
                "bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden",
                hoverEffect && "hover:border-cyber-green/50 transition-colors duration-300 group",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            {/* Glossy sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-green/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-green/30" />
        </motion.div>
    );
};

export default GlassCard;
