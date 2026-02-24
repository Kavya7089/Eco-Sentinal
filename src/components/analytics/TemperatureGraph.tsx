import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { SystemData } from '../../hooks/useSystemMonitor';

interface TemperatureGraphProps {
    data: SystemData[];
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ data }) => {
    // We want the graph to show recent history, maybe reverse the array if it's new-first
    // The hook adds new items to the START of the array. Recharts needs them in chronological order (typically).
    const graphData = [...data].reverse();

    return (
        <div className="w-full h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col">
            <h3 className="text-cyber-green font-mono text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                TEMPERATURE TREND (LIVE)
            </h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(unix) => new Date(unix).toLocaleTimeString()}
                            stroke="#ffffff50"
                            fontSize={10}
                            tick={{ fill: '#ffffff50' }}
                        />
                        <YAxis
                            domain={[500, 1200]}
                            stroke="#ffffff50"
                            fontSize={10}
                            tick={{ fill: '#ffffff50' }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000000dd', borderColor: '#ffffff20', color: '#fff' }}
                            itemStyle={{ color: '#00ff9d' }}
                            labelStyle={{ color: '#ffffff80' }}
                            labelFormatter={(unix) => new Date(unix).toLocaleTimeString()}
                        />
                        <ReferenceLine y={900} stroke="#ff4d4d" strokeDasharray="3 3" label={{ value: 'CRITICAL', fill: '#ff4d4d', fontSize: 10 }} />
                        <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#00ff9d"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#00ff9d' }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TemperatureGraph;
