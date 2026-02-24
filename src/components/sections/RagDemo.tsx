import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, MessageSquare, Send } from 'lucide-react';
import GlassCard from '../layout/GlassCard';

const RagDemo: React.FC = () => {
    const [messages, setMessages] = useState([
        { role: 'system', text: "Eco-Sentinel RAG System Initialized. Indexing technical manuals..." },
        { role: 'ai', text: "Ready. Ask me about the turbine maintenance protocols." }
    ]);
    const [_scanning, setScanning] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Simulate scanning effect on scroll
    useEffect(() => {
        const interval = setInterval(() => {
            setScanning(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg = { role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const aiMsg = {
                role: 'ai',
                text: "Based on current sensor readings, turbine #4 is showing thermal instability. I recommend checking the coolant flow sensors and reviewing the last maintenance log for valve anomalies."
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <section className="container mx-auto px-6 py-20 relative z-10 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: 3D Document Scanner Visualization */}
                <div className="relative group perspective-1000">
                    <motion.div
                        className="w-full aspect-[3/4] bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl relative overflow-hidden transform-style-3d rotate-y-12 group-hover:rotate-y-0 transition-transform duration-700"
                        initial={{ rotateY: 12 }}
                        whileInView={{ rotateY: 0 }}
                        viewport={{ margin: "-100px" }}
                    >
                        {/* Document Content Mock */}
                        <div className="p-8 opacity-40 font-mono text-[10px] leading-relaxed select-none">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="mb-4">
                                    <div className="w-1/3 h-2 bg-white/20 mb-2" />
                                    <div className="w-full h-1 bg-white/10 mb-1" />
                                    <div className="w-full h-1 bg-white/10 mb-1" />
                                    <div className="w-2/3 h-1 bg-white/10 mb-1" />
                                </div>
                            ))}
                        </div>

                        {/* Scanning Laser */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1 bg-cyber-green shadow-[0_0_20px_#00ff9d]"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-2 text-cyber-green font-mono text-xs bg-black/50 px-2 py-1 rounded border border-cyber-green/30">
                            <Scan size={14} className="animate-spin-slow" />
                            INDEXING LIVE
                        </div>
                    </motion.div>

                    {/* Background decoration */}
                    <div className="absolute -inset-4 bg-cyber-green/5 blur-2xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Right: Chat Interface */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold font-mono">Instant Context</h2>
                        <p className="text-white/60">
                            Pathway indexes unstructured data as it arrives. No retraining required.
                            The AI agent understands the latest operational context immediately.
                        </p>
                    </div>

                    <GlassCard className="h-[400px] flex flex-col p-0">
                        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                            <div className="w-8 h-8 rounded bg-cyber-green/20 flex items-center justify-center text-cyber-green">
                                <MessageSquare size={16} />
                            </div>
                            <span className="font-mono text-sm">Operator Assistant</span>
                            <span className="ml-auto w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-sm">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'ai' || msg.role === 'system' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg border ${msg.role === 'ai'
                                        ? 'bg-black/40 border-cyber-green/30 text-cyber-green'
                                        : msg.role === 'system'
                                            ? 'bg-transparent border-transparent text-white/40 text-xs italic'
                                            : 'bg-white/10 border-white/10 text-white'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] p-3 rounded-lg border bg-black/40 border-cyber-green/30 text-cyber-green animate-pulse">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ask RAG Agent..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-cyber-green/50 text-white"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isTyping}
                                    className="p-2 bg-cyber-green/20 text-cyber-green rounded hover:bg-cyber-green/30 transition-colors disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>

            </div>
        </section>
    );
};

export default RagDemo;
