// src/widgets/DataVisualization/BarChart.jsx
import React, { memo, useState, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Maximize2, MoreHorizontal, X, TrendingUp } from 'lucide-react';
import { formatNumber } from '../../../shared/lib/utils';

// src/widgets/DataVisualization/BarChart.jsx
// import React, { memo, useState, useCallback, useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from 'recharts';
// import { Maximize2, MoreHorizontal, X, TrendingUp } from 'lucide-react';
// import { formatNumber } from '../../../shared/lib/utils';

// Generate realistic dynamics data based on KPI type and actual data
const generateDynamicsData = (kpiType, baseData, kpiTrend) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate base values from actual data
  const totalValue = baseData.reduce((sum, item) => sum + item.value, 0);
  const baseMonthly2024 = totalValue / 12;
  const baseMonthly2025 = baseMonthly2024 * 1.15; // Assume 15% growth
  
  return months.map((month, index) => {
    // Add seasonal variation and trend
    const seasonalFactor = 1 + 0.1 * Math.sin((index / 12) * 2 * Math.PI);
    const trendFactor2024 = 1 + (index / 12) * 0.08; // 8% annual growth
    const trendFactor2025 = 1 + (index / 12) * 0.12; // 12% annual growth
    
    // Use KPI trend data if available
    const kpiInfluence = kpiTrend && kpiTrend[index] ? kpiTrend[index].value / kpiTrend[0].value : 1;
    
    const value2024 = (baseMonthly2024 * seasonalFactor * trendFactor2024 * kpiInfluence) / 1000;
    const value2025 = (baseMonthly2025 * seasonalFactor * trendFactor2025 * kpiInfluence) / 1000;
    
    return {
      month,
      '2024': Math.round(value2024 * 10) / 10,
      '2025': Math.round(value2025 * 10) / 10
    };
  });
};

// KPI title mapping
const getKPITitle = (kpiType) => {
  const titles = {
    numberOfLots: 'No. of lots',
    procuringEntities: 'No. of Procuring Entities',
    expectedValue: 'Expected Value',
    allTimePeriods: 'All Time Periods',
    avgBidders: 'Avg. Bidders'
  };
  return titles[kpiType] || 'No. of lots';
};

// Enhanced tooltips with government-grade styling
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <div className="border-b border-gray-100 pb-2 mb-2">
          <p className="text-sm font-semibold text-gray-800">{data.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-bold text-blue-600">
            {formatNumber(payload[0].value)}
          </p>
          {data.percent && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">{data.percent}%</span> of total
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const DynamicsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
        <div className="border-b border-gray-100 pb-2 mb-3">
          <p className="text-sm font-semibold text-gray-800">{label} 2024-2025</p>
        </div>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700">{entry.dataKey}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {entry.value}k
              </span>
            </div>
          ))}
          {payload.length === 2 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Change:</span>
                <span className={`text-xs font-semibold ${
                  payload[1].value > payload[0].value ? 'text-green-600' : 'text-red-600'
                }`}>
                  {payload[1].value > payload[0].value ? '+' : ''}
                  {((payload[1].value - payload[0].value) / payload[0].value * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const FullscreenModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full h-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const BarChartComponent = memo(({ data, title, kpiType = 'numberOfLots', kpiData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('bars'); // 'bars' or 'dynamics'
  
  // Generate dynamic data based on actual KPI data
  const dynamicsData = useMemo(() => {
    const kpiTrend = kpiData && kpiData[kpiType] ? kpiData[kpiType].trend : null;
    return generateDynamicsData(kpiType, data, kpiTrend);
  }, [data, kpiType, kpiData]);
  
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);
  const kpiTitle = useMemo(() => getKPITitle(kpiType), [kpiType]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), []);
  
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'bars' ? 'dynamics' : 'bars');
  }, []);

  // Calculate average and trend for reference lines
  const dynamicsStats = useMemo(() => {
    const avg2024 = dynamicsData.reduce((sum, item) => sum + item['2024'], 0) / dynamicsData.length;
    const avg2025 = dynamicsData.reduce((sum, item) => sum + item['2025'], 0) / dynamicsData.length;
    return { avg2024, avg2025 };
  }, [dynamicsData]);

  const renderChart = useCallback((isFullscreenView = false) => {
    const height = isFullscreenView ? 600 : 400;
    
    if (viewMode === 'dynamics') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart 
            data={dynamicsData} 
            margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="2 2" 
              stroke="#e5e7eb" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              style={{ fontSize: '12px', fontWeight: '500' }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}k`}
              style={{ fontSize: '12px', fontWeight: '500' }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280' }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            
            {/* Reference lines for averages */}
            <ReferenceLine 
              y={dynamicsStats.avg2024} 
              stroke="#4ade80" 
              strokeDasharray="3 3" 
              strokeWidth={1}
              opacity={0.6}
            />
            <ReferenceLine 
              y={dynamicsStats.avg2025} 
              stroke="#f472b6" 
              strokeDasharray="3 3" 
              strokeWidth={1}
              opacity={0.6}
            />
            
            <Tooltip content={<DynamicsTooltip />} />
            
            {/* 2024 Line */}
            <Line 
              type="monotone" 
              dataKey="2024" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ 
                fill: '#22c55e', 
                strokeWidth: 2, 
                r: 5,
                stroke: '#fff'
              }}
              activeDot={{ 
                r: 7, 
                fill: '#22c55e',
                stroke: '#fff',
                strokeWidth: 2,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
            
            {/* 2025 Line */}
            <Line 
              type="monotone" 
              dataKey="2025" 
              stroke="#ec4899" 
              strokeWidth={3}
              dot={{ 
                fill: '#ec4899', 
                strokeWidth: 2, 
                r: 5,
                stroke: '#fff'
              }}
              activeDot={{ 
                r: 7, 
                fill: '#ec4899',
                stroke: '#fff',
                strokeWidth: 2,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 20, right: 40, left: 5, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="2 2" 
            horizontal={true} 
            vertical={false} 
            stroke="#e5e7eb" 
          />
          <XAxis 
            type="number" 
            tickFormatter={(value) => formatNumber(value)}
            style={{ fontSize: '12px', fontWeight: '500' }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={isFullscreenView ? 250 : 150}
            style={{ fontSize: '11px', fontWeight: '500' }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#374151' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value === maxValue ? '#1e40af' : '#3b82f6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }, [data, viewMode, dynamicsData, maxValue, dynamicsStats]);

  const renderTabHeader = useCallback(() => (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => setViewMode('bars')}
        className={`px-6 py-3 text-sm font-semibold border-b-3 transition-all duration-200 ${
          viewMode === 'bars'
            ? 'text-green-600 border-green-500 bg-green-50'
            : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        {kpiTitle}
      </button>
      <button
        onClick={toggleViewMode}
        className={`px-6 py-3 text-sm font-semibold border-b-3 transition-all duration-200 ${
          viewMode === 'dynamics'
            ? 'text-green-600 border-green-500 bg-green-50'
            : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        Dynamics in years
      </button>
    </div>
  ), [viewMode, toggleViewMode, kpiTitle]);

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 h-full relative group transition-shadow duration-200 hover:shadow-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hover Actions */}
        <div className={`absolute top-4 right-4 flex items-center gap-2 transition-all duration-200 z-10 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
            title="Fullscreen view"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-150"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-full flex flex-col">
          {renderTabHeader()}
          
          <div className="flex-1 min-h-0">
            {renderChart()}
          </div>
          
          {/* Enhanced Legend for dynamics view */}
          {viewMode === 'dynamics' && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-center items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-pink-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">2024</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors group">
              <span className="font-medium">
                {kpiTitle}
              </span>
              <span className="text-xs transform transition-transform group-hover:translate-y-0.5">▼</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Fullscreen Modal */}
      <FullscreenModal 
        isOpen={isFullscreen}
        onClose={toggleFullscreen}
        title={`${title} - ${kpiTitle} Analysis`}
      >
        <div className="h-full flex flex-col">
          {renderTabHeader()}
          <div className="flex-1 min-h-0">
            {renderChart(true)}
          </div>
          {viewMode === 'dynamics' && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-center items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-pink-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">2024</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </FullscreenModal>
    </>
  );
});

BarChartComponent.displayName = 'BarChartComponent';

export default BarChartComponent;