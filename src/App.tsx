import { useState } from 'react';
import Scene from './components/3d/Scene';
import Header from './components/layout/Header';
import LiveLog from './components/ui/LiveLog';
import AiTerminal from './components/ui/AiTerminal';
import { useSystemMonitor } from './hooks/useSystemMonitor';
import Hero from './components/sections/Hero';
import FeatureCards from './components/sections/FeatureCards';
import RagDemo from './components/sections/RagDemo';
import TemperatureGraph from './components/analytics/TemperatureGraph';
import VibrationAnalysis from './components/analytics/VibrationAnalysis';
import { Bot } from 'lucide-react';

function App() {
    const { currentData, history, systemStatus, aiInsight, isRagLoading } = useSystemMonitor();
    const [activeTab, setActiveTab] = useState('monitor');
    const [isAiOpen, setIsAiOpen] = useState(false);

    return (
        <div className={`relative min-h-screen text-white overflow-hidden bg-void-black transition-colors duration-1000 ${systemStatus === 'CRITICAL' ? 'selection:bg-alert-red selection:text-white' : 'selection:bg-cyber-green selection:text-black'
            }`}>
            {/* Background Layer - Always present but modified by tab */}
            <div className={`fixed inset-0 transition-opacity duration-1000 ${activeTab === 'monitor' ? 'opacity-100' : 'opacity-20'}`}>
                <Scene temperature={currentData?.temperature} status={systemStatus} />
            </div>

            {/* Global Alert Overlay */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-300 z-0 ${systemStatus === 'CRITICAL' ? 'opacity-20 bg-alert-red mix-blend-overlay animate-pulse' : 'opacity-0'
                }`} />

            <Header activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Dashboard Layout */}
            <div className="relative z-10 flex h-screen pt-16">

                {/* Left Sidebar: Live Stream - Only on Monitor & Analytics */}
                {activeTab !== 'security' && (
                    <div className="hidden md:flex flex-col w-80 h-full border-r border-white/10 bg-black/40 backdrop-blur-sm">
                        <LiveLog logs={history} />
                    </div>
                )}

                {/* Center Stage */}
                <main className="flex-1 relative flex flex-col overflow-hidden">
                    {/* Status Header - Only on Monitor */}
                    {activeTab === 'monitor' && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                            <div className={`px-4 py-2 rounded-full border backdrop-blur-md flex items-center gap-2 font-mono text-sm transition-colors duration-300 ${systemStatus === 'CRITICAL'
                                ? 'bg-alert-red/20 border-alert-red text-alert-red animate-pulse'
                                : 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${systemStatus === 'CRITICAL' ? 'bg-alert-red' : 'bg-cyber-green'} animate-pulse`} />
                                SYSTEM STATUS: {systemStatus}
                            </div>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {activeTab === 'monitor' && (
                            <div className="flex items-center justify-center h-full">
                                <Hero />
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="container mx-auto max-w-6xl space-y-8 pt-10">
                                <h2 className="text-3xl font-bold font-mono text-cyber-green mb-8 flex items-center gap-3">
                                    <div className="w-12 h-1 bg-cyber-green" />
                                    REAL-TIME ANALYTICS
                                </h2>
                                <FeatureCards />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 h-[400px]">
                                    <TemperatureGraph data={history} />
                                    <VibrationAnalysis data={history} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="h-full flex flex-col justify-center">
                                <RagDemo />
                            </div>
                        )}
                    </div>

                    {/* AI Terminal Popup (Bottom) */}
                    {/* Explicitly visible if 'isAiOpen' OR if there's an insight/loading during critical */}
                    <AiTerminal
                        insight={aiInsight}
                        isLoading={isRagLoading}
                        status={systemStatus}
                        forceVisible={isAiOpen}
                        onClose={() => setIsAiOpen(false)}
                    />
                </main>
            </div>

            {/* Global AI Toggle Button (Floating) */}
            {!isAiOpen && (
                <button
                    onClick={() => setIsAiOpen(true)}
                    className={`fixed bottom-8 right-8 p-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 z-50 hover:scale-110 ${systemStatus === 'CRITICAL' ? 'bg-alert-red text-white animate-bounce' : 'bg-cyber-green text-black'
                        }`}
                >
                    <Bot size={24} />
                </button>
            )}
        </div>
    );
}

export default App;
