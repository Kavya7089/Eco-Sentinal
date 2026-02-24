import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface SystemData {
    id: string;
    timestamp: number;
    temperature: number; // 600 - 950
    pressure: number;    // 200 - 500
    co2: number;         // 400 - 600
    efficiency: number;
    status: 'SAFE' | 'CRITICAL';
}

export interface AiInsight {
    message: string;
    actionItems: string[];
    compliance: string;
    reference: string;
}

export const useSystemMonitor = () => {
    const [currentData, setCurrentData] = useState<SystemData | null>(null);
    const [history, setHistory] = useState<SystemData[]>([]);
    const [systemStatus, setSystemStatus] = useState<'SAFE' | 'CRITICAL'>('SAFE');
    const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
    const [isRagLoading, setIsRagLoading] = useState(false);

    // Refs for simulation loop
    const anomalyTimerRef = useRef<number | null>(null);

    // 1. Supabase Real-Time Listener
    useEffect(() => {
        if (!supabase) return;

        console.log("🔌 Connecting to Supabase Real-Time...");

        const channel = supabase
            .channel('alerts-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'alerts' },
                (payload) => {
                    console.log('🚨 New Alert Received:', payload.new);
                    const newAlert = payload.new;
                    const isCritical = newAlert.temperature > 900;

                    // Update System State from Real Backend Data
                    const tempData: SystemData = {
                        id: newAlert.sensor_id || 'SENSOR-01',
                        temperature: newAlert.temperature || 950,
                        pressure: 4200, // Mock if missing
                        co2: 450,
                        efficiency: 65,
                        timestamp: Date.now(),
                        status: isCritical ? 'CRITICAL' : 'SAFE'
                    };

                    setCurrentData(tempData);
                    setHistory(prev => [tempData, ...prev].slice(0, 50));

                    // Check if critical
                    if (isCritical) {
                        setSystemStatus('CRITICAL');

                        // Parse AI Response from Backend if available, else simulate loading
                        if (newAlert.repair_action) {
                            setIsRagLoading(false);
                            setAiInsight({
                                message: newAlert.repair_action,
                                actionItems: ["Initiate cooling sequence", "Check valve pressure"],
                                compliance: "ISO 14001:2015",
                                reference: "DOC-REL-2024-X"
                            });
                        } else {
                            // If backend hasn't processed it yet (latency), verify loading state
                            setIsRagLoading(true);
                        }
                    } else {
                        setSystemStatus('SAFE');
                        setAiInsight(null);
                    }
                }
            )
            .subscribe();

        if (supabase) {
            supabase.removeChannel(channel);
        }
    }, []);


    // 2. Fallback Simulation Engine
    useEffect(() => {
        const interval = setInterval(() => {
            const isAnomaly = Math.random() > 0.85;

            const timestamp = Date.now();

            // Generate SAFE data locally
            const temp = 600 + Math.random() * 200;
            const newData: SystemData = {
                id: 'SENSOR-01',
                temperature: Math.round(temp),
                pressure: Math.round(3000 + Math.random() * 500),
                co2: Math.round(400 + Math.random() * 50),
                efficiency: Math.round(90 + Math.random() * 10),
                timestamp,
                status: 'SAFE'
            };

            setCurrentData(newData);
            setHistory((prev) => [newData, ...prev].slice(0, 50));

            // Local Anomaly Logic (Only if NOT using Supabase for alerts)
            if (!supabase && isAnomaly) {
                handleLocalAnomaly();
            }

        }, 800);

        return () => clearInterval(interval);
    }, []);

    const handleLocalAnomaly = () => {
        setSystemStatus('CRITICAL');
        setIsRagLoading(true);

        // Force a temp spike locally
        const timestamp = Date.now();
        const anomalyData: SystemData = {
            id: 'SENSOR-01',
            temperature: Math.round(950 + Math.random() * 100),
            pressure: 4500,
            co2: 550,
            efficiency: 40,
            timestamp,
            status: 'CRITICAL'
        };

        setCurrentData(anomalyData);
        setHistory((prev) => [anomalyData, ...prev].slice(0, 50));

        if (anomalyTimerRef.current) clearTimeout(anomalyTimerRef.current);

        // Simulate AI Latency
        setTimeout(() => {
            setIsRagLoading(false);
            setAiInsight({
                message: "CRITICAL: Turbine Overheat Detected. Potential coolant leak in Sector 7.",
                actionItems: [
                    "Isolate Main Valve 4B",
                    "Activate Emergency cooling pumps",
                    "Notify Site Supervisor"
                ],
                compliance: "OSHA-1910.119",
                reference: "MANUAL-TURB-2024: Sec 4.2"
            });

            // Auto-resolve after 6 seconds
            anomalyTimerRef.current = setTimeout(() => {
                setSystemStatus('SAFE');
                setAiInsight(null);
            }, 6000) as unknown as number;

        }, 1500);
    };

    return { currentData, history, systemStatus, aiInsight, isRagLoading };
};
