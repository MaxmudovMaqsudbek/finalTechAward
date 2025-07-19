import React, { useState } from "react";
import { useTheme } from "../../shared/lib/contexts/ThemeContext";
import { mockApi } from "../../shared/api/MockApi";
import {  Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from "../../shared/ui/Card";
import { CustomTooltip } from "../../shared/ui/ChartTooltip";

export const ConfidenceLevelChart = () => {
    const [data, setData] = useState([]);
     const { theme } = useTheme();

    React.useEffect(() => {
        mockApi.getConfidenceLevelData().then(setData);
    }, []);
    
    const colors = {
      light: { text: '#374151' },
      dark: { text: '#E5E7EB' },
    };
    const colorPalette = {
        light:{text:'#fff'},
        dark:{text:'#000'}
    }
    const currentColors01 = colorPalette[theme];
    const currentColors = colors[theme];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const nameRadius = outerRadius + 25;
        const nameX = cx + nameRadius * Math.cos(-midAngle * RADIAN);
        const nameY = cy + nameRadius * Math.sin(-midAngle * RADIAN);
        const textAnchor = nameX > cx ? 'start' : 'end';


        return (
            <>
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="14" fill={currentColors01.text}>
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
                 <text x={nameX} y={nameY} fill={currentColors.text} textAnchor={textAnchor} fontSize={12} >
                    {data[index].name}  
                    
                </text>
            </>

        );
    };

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Rigging detection by confidence level</h3>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={30}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={1}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};