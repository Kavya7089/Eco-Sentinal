import React from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { SystemData } from '../../hooks/useSystemMonitor';

interface VibrationAnalysisProps {
    data: SystemData[];
}

const VibrationAnalysis: React.FC<VibrationAnalysisProps> = ({ data }) => {
    const graphData = [...data].reverse();

    return (
        <div className="w-full h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col">
            <h3 className="text-cyber-green font-mono text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                VIBRATION VS EFFICIENCY
            </h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unix) => new Date(unix).toLocaleTimeString()}
                            stroke="#ffffff50"
                            fontSize={10}
                            tick={{ fill: '#ffffff50' }}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#ffffff50"
                            fontSize={10}
                            label={{ value: 'Vibration (Hz)', angle: -90, position: 'insideLeft', fill: '#ffffff50', fontSize: 10 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#ffffff50"
                            fontSize={10}
                            domain={[0, 100]}
                            label={{ value: 'Efficiency %', angle: 90, position: 'insideRight', fill: '#ffffff50', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000000dd', borderColor: '#ffffff20', color: '#fff' }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="vibration"
                            barSize={20}
                            fill="#ffffff20"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="efficiency"
                            stroke="#00ccff"
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VibrationAnalysis;
