import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Terminal, X } from 'lucide-react';
import { AiInsight } from '../../hooks/useSystemMonitor';
import GlassCard from '../layout/GlassCard';

interface AiTerminalProps {
    insight: AiInsight | null;
    isLoading: boolean;
    status: 'SAFE' | 'CRITICAL';
    forceVisible?: boolean;
    onClose?: () => void;
}

const AiTerminal: React.FC<AiTerminalProps> = ({ insight, isLoading, status, forceVisible, onClose }) => {
    // Show if manually opened OR critical status OR loading
    const isVisible = forceVisible || status === 'CRITICAL' || isLoading;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50"
                >
                    <GlassCard className={`border-t-4 ${status === 'CRITICAL' ? 'border-t-alert-red' : 'border-t-cyber-green'
                        }`}>

                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${status === 'CRITICAL' ? 'bg-alert-red/20 text-alert-red' : 'bg-cyber-green/20 text-cyber-green'
                                }`}>
                                {isLoading ? (
                                    <Terminal size={24} className="animate-pulse" />
                                ) : (
                                    <AlertTriangle size={24} />
                                )}
                            </div>

                            <div className="flex-1 space-y-2 font-mono">
                                <div className="flex justify-between items-center text-xs opacity-50 uppercase tracking-widest">
                                    <span>PATHWAY AI AGENT</span>
                                    <span>{isLoading ? 'ANALYZING...' : 'RESPONSE READY'}</span>
                                </div>

                                {isLoading ? (
                                    <div className="text-sm text-white/70 animate-pulse">
                                        &gt; Querying document store for overflow protocols...<br />
                                        &gt; Correlating temp spike with maintenance logs...
                                    </div>
                                ) : insight ? (
                                    <div className="space-y-3">
                                        <p className="text-lg font-bold text-white leading-tight">
                                            {insight.message}
                                        </p>
                                        <div className="flex flex-col md:flex-row gap-3 text-xs md:text-sm">
                                            <div className="px-3 py-2 rounded bg-white/5 border border-white/10 flex items-center gap-2 text-cyber-green">
                                                <ShieldCheck size={14} />
                                                {insight.compliance}
                                            </div>
                                            <div className="px-3 py-2 rounded bg-white/5 border border-white/10 text-white/50">
                                                REF: {insight.reference}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-white/70">
                                        &gt; System nominal. Monitoring real-time streams.<br />
                                        &gt; RAG Index updated: 0.8ms ago.
                                    </div>
                                )}
                            </div>

                            {onClose && (
                                <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                    </GlassCard>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AiTerminal;
