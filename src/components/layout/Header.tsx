import React from 'react';
import { Activity, ShieldCheck, Database } from 'lucide-react';

interface HeaderProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
    const navItems = [
        { id: 'monitor', label: 'SYSTEM STATUS', icon: Activity },
        { id: 'analytics', label: 'ANALYTICS', icon: Database },
        { id: 'security', label: 'SECURITY / RAG', icon: ShieldCheck },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/5">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('monitor')}>
                <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]" />
                <span className="font-mono font-bold text-lg tracking-wider">ECO-SENTINEL</span>
            </div>

            <nav className="hidden md:flex gap-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-300 font-mono text-sm ${activeTab === item.id
                            ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'
                            : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <item.icon size={14} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="text-xs font-mono text-white/50 border border-white/10 px-3 py-1 rounded">
                V.2.0.4 [LIVE]
            </div>
        </header>
    );
};

export default Header;
