import React from 'react';
import { motion } from 'framer-motion';

const MOCK_DATA = Array.from({ length: 15 }).map((_, i) => ({
    id: `SENSOR-${i.toString().padStart(3, '0')}`,
    temp: Math.floor(Math.random() * 800 + 200) + '°C',
    pressure: Math.floor(Math.random() * 50 + 10) + 'psi',
    status: Math.random() > 0.8 ? 'WARN' : 'OK'
}));

const StreamTicker: React.FC = () => {
    return (
        <div className="w-full bg-black/60 backdrop-blur-sm border-y border-white/10 py-3 overflow-hidden flex relative z-20">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-void-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-void-black to-transparent z-10" />

            <motion.div
                className="flex whitespace-nowrap gap-8"
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            >
                {[...MOCK_DATA, ...MOCK_DATA, ...MOCK_DATA].map((data, i) => (
                    <div key={i} className="flex items-center gap-4 font-mono text-sm opacity-70">
                        <span className="text-cyber-green/60">[{data.id}]</span>
                        <span className="text-white">T:{data.temp}</span>
                        <span className="text-white">P:{data.pressure}</span>
                        <span className={data.status === 'WARN' ? 'text-alert-red animate-pulse' : 'text-cyber-green'}>
                            {data.status}
                        </span>
                        <span className="text-white/20">|</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default StreamTicker;
