import React, { useState } from "react";
import { useTheme } from "../../shared/lib/contexts/ThemeContext";
import { mockApi } from "../../shared/api/MockApi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import { Card } from "../../shared/ui/Card";
import { CustomTooltip } from "../../shared/ui/ChartTooltip";

export const RiggingDetectionChart = () => {
    const [data, setData] = useState([]);
    const { theme } = useTheme();

    React.useEffect(() => {
        mockApi.getRiggingDetectionByType().then(setData);
    }, []);

    const colors = {
      light: { grid: '#e5e7eb', text: '#6b7280', line1: '#3B82F6', line2: '#60A5FA', line3: '#93C5FD' },
      dark: { grid: '#374151', text: '#9ca3af', line1: '#3B82F6', line2: '#60A5FA', line3: '#93C5FD' },
    };
    const currentColors = colors[theme];

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Rigging detection by type of detection</h3>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={currentColors.grid} />
                        <XAxis dataKey="name" stroke={currentColors.text} />
                        <YAxis stroke={currentColors.text} />
                        <Tooltip content={<CustomTooltip/>} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                        <Legend />
                        <Area type="monotone" dataKey="Столбцы (1)" stackId="1" stroke={currentColors.line1} fill={currentColors.line1} fillOpacity={0.6}/>
                        <Area type="monotone" dataKey="Столбцы (2)" stackId="1" stroke={currentColors.line2} fill={currentColors.line2} fillOpacity={0.6}/>
                        <Area type="monotone" dataKey="Столбцы (3)" stackId="1" stroke={currentColors.line3} fill={currentColors.line3} fillOpacity={0.6}/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};