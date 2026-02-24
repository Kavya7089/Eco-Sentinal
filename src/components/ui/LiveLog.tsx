import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemData } from '../../hooks/useSystemMonitor';

interface LogProps {
    logs: SystemData[];
}

const LiveLog: React.FC<LogProps> = ({ logs }) => {
    return (
        <div className="h-full overflow-hidden flex flex-col font-mono text-xs">
            <div className="p-2 border-b border-white/10 text-white/50 text-[10px] tracking-wider sticky top-0 bg-void-black/90 backdrop-blur z-10">
        // LIVE SENSOR STREAM
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 relative mask-linear-fade">
                <AnimatePresence>
                    {logs.map((log) => (
                        <motion.div
                            key={log.timestamp}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={`grid grid-cols-[auto_1fr] gap-2 p-1 border-l-2 ${log.status === 'CRITICAL'
                                ? 'border-alert-red bg-alert-red/10 text-alert-red'
                                : 'border-cyber-green/50 text-cyber-green/80'
                                }`}
                        >
                            <span className="opacity-50">{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}</span>
                            <div className="flex justify-between gap-4">
                                <span>{log.id}</span>
                                <span>{log.temperature}°C</span>
                                <span>{log.pressure}PSI</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LiveLog;
