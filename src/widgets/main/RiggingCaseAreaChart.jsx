import React, { useState } from "react";
import { useTheme } from "../../shared/lib/contexts/ThemeContext";
import { mockApi } from "../../shared/api/MockApi";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Card } from "../../shared/ui/Card";
import { CustomTooltip } from "../../shared/ui/ChartTooltip";

export const RiggingCaseAreaChart = () => {
    const [data, setData] = useState([]);
    const { theme } = useTheme();

    React.useEffect(() => {
        mockApi.getRiggingCaseAreaData().then(d => setData(d.sort((a,b) => a['Столбцы (1)'] - b['Столбцы (1)'])));
    }, []);
    
    const colors = {
      light: { grid: '#e5e7eb', text: '#6b7280', bar: '#00ffff' },
      dark: { grid: '#374151', text: '#9ca3af', bar: '#00ffff' },
    };
    const currentColors = colors[theme];


    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Rigging Case <br /> Area</h3>
             <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={currentColors.grid} horizontal={false}/>
                        <XAxis type="number" stroke={currentColors.text}/>
                        <YAxis type="category" dataKey="name" stroke={currentColors.text} width={80} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} />
                        <Legend />
                        <Bar dataKey="Столбцы (1)" fill={currentColors.bar} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}