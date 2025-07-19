// src/widgets/DataVisualization/BarChart.jsx
import React, { memo, useState, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from 'recharts';
import { Maximize2, MoreHorizontal, X } from 'lucide-react';
import { formatNumber } from '../../../shared/lib/utils';
import useStore from '../../../app/store';
import { useTranslation } from '../../../shared/lib/i18n/translations';

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
const getKPITitle = (kpiType, t) => {
  const titles = {
    numberOfLots: t.chartNoOfLots,
    procuringEntities: t.chartNoOfProcuringEntities,
    expectedValue: t.chartExpectedValue,
    allTimePeriods: t.chartAllTimePeriods,
    avgBidders: t.chartAvgBidders
  };
  return titles[kpiType] || t.chartNoOfLots;
};

// Function to translate data names
const translateDataNames = (data, t) => {
  return data.map(item => ({
    ...item,
    name: t.dataNames[item.name] || item.name
  }));
};

// Enhanced tooltips with government-grade styling
const CustomTooltip = ({ active, payload, t }) => {
  const { isDarkMode } = useStore();
  
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 dark-transition">
        <div className="border-b border-gray-100 dark:border-slate-600 pb-2 mb-2">
          <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 dark-transition">{data.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 dark-transition">
            {formatNumber(payload[0].value)}
          </p>
          {data.percent && (
            <p className="text-sm text-gray-600 dark:text-slate-300 dark-transition">
              <span className="font-medium">{data.percent}%</span> {t.chartOfTotal}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const DynamicsTooltip = ({ active, payload, label, t }) => {
  const { isDarkMode } = useStore();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 dark-transition">
        <div className="border-b border-gray-100 dark:border-slate-600 pb-2 mb-3">
          <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 dark-transition">{label} 2024-2025</p>
        </div>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200 dark-transition">{entry.dataKey}</span>
              </div>
              <span className="text-sm font-bold dark-transition" style={{ color: entry.color }}>
                {entry.value}k
              </span>
            </div>
          ))}
          {payload.length === 2 && (
            <div className="pt-2 border-t border-gray-100 dark:border-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-slate-400 dark-transition">{t.chartChange}:</span>
                <span className={`text-xs font-semibold ${
                  payload[1].value > payload[0].value ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                } dark-transition`}>
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

const FullscreenModal = ({ isOpen, onClose, children, title, t }) => {
  const { isDarkMode } = useStore();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60000 bg-black/50 dark:bg-black/70 w-screen dark-transition">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full h-full max-h-[96] flex flex-col shadow-2xl dark:shadow-slate-900/50 dark-transition">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 dark-transition">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-1 dark-transition">{title}</h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 font-medium dark-transition">{t.chartAdvancedDataDashboard}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:scale-105 dark-transition"
            title={t.chartCloseFullscreen}
          >
            <X className="w-8 h-8 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
        </div>
        
        {/* Enhanced Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="h-full rounded-xl p-6">
            {children}
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex justify-between items-center dark-transition">
          <div className="text-sm text-gray-500 dark:text-slate-400 font-medium dark-transition">
            {t.chartInteractiveVisualization} • {t.chartGovernmentPlatform}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              {t.chartExportData}
            </button>
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              {t.chartPrintReport}
            </button>
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              {t.chartShareView}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BarChartComponent = memo(({ data, title, kpiType = 'numberOfLots', kpiData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('bars'); // 'bars' or 'dynamics'
  
  // Get language, translation, and dark mode
  const { language, isDarkMode } = useStore();
  const t = useTranslation(language);
  
  // Translate data names for current language
  const translatedData = useMemo(() => translateDataNames(data, t), [data, t]);
  
  // Generate dynamic data based on actual KPI data
  const dynamicsData = useMemo(() => {
    const kpiTrend = kpiData && kpiData[kpiType] ? kpiData[kpiType].trend : null;
    return generateDynamicsData(kpiType, data, kpiTrend);
  }, [data, kpiType, kpiData]);
  
  const maxValue = useMemo(() => Math.max(...translatedData.map(d => d.value)), [translatedData]);
  const kpiTitle = useMemo(() => getKPITitle(kpiType, t), [kpiType, t]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  
  const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), []);

  // Calculate average and trend for reference lines
  const dynamicsStats = useMemo(() => {
    const avg2024 = dynamicsData.reduce((sum, item) => sum + item['2024'], 0) / dynamicsData.length;
    const avg2025 = dynamicsData.reduce((sum, item) => sum + item['2025'], 0) / dynamicsData.length;
    return { avg2024, avg2025 };
  }, [dynamicsData]);

  const renderChart = useCallback((isFullscreenView = false) => {
    const heightBar = isFullscreenView ? 600 : 200;
    const heightLine = isFullscreenView ? 600 : 180;
    
    // Dynamic colors based on dark mode
    const gridColor = isDarkMode ? '#475569' : '#e5e7eb';
    const textColor = isDarkMode ? '#94a3b8' : '#6b7280';
    const axisTextColor = isDarkMode ? '#cbd5e1' : '#374151';
    
    if (viewMode === 'dynamics') {
      return (
        <div className="h-full">
          <ResponsiveContainer width="100%" height={heightLine}>
            <LineChart 
              data={dynamicsData} 
              margin={{ 
                top: isFullscreenView ? 20 : 10, 
                right: isFullscreenView ? 40 : 20, 
                left: isFullscreenView ? 10 : 2, 
                bottom: isFullscreenView ? 15 : 2 
              }}
            >
              <CartesianGrid 
                strokeDasharray="1 1" 
                stroke={gridColor}
                horizontal={true}
                vertical={false}
                opacity={0.5}
              />
              <XAxis 
                dataKey="month" 
                style={{ 
                  fontSize: isFullscreenView ? '14px' : '9px', 
                  fontWeight: '500' 
                }}
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: textColor, 
                  dy: isFullscreenView ? 6 : 3 
                }}
                height={isFullscreenView ? 35 : 22}
                interval={0}
              />
              <YAxis 
                tickFormatter={(value) => `${value}k`}
                style={{ 
                  fontSize: isFullscreenView ? '14px' : '9px', 
                  fontWeight: '500' 
                }}
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: textColor, 
                  dx: isFullscreenView ? -8 : -3 
                }}
                domain={['dataMin - 2', 'dataMax + 2']}
                width={isFullscreenView ? 50 : 28}
                tickCount={5}
              />
              
              {/* Reference lines for averages */}
              <ReferenceLine 
                y={dynamicsStats.avg2024} 
                stroke="#4ade80" 
                strokeDasharray="2 2" 
                strokeWidth={isFullscreenView ? 1.5 : 0.8}
                opacity={0.3}
              />
              <ReferenceLine 
                y={dynamicsStats.avg2025} 
                stroke="#f472b6" 
                strokeDasharray="2 2" 
                strokeWidth={isFullscreenView ? 1.5 : 0.8}
                opacity={0.3}
              />
              
              <Tooltip content={<DynamicsTooltip t={t} />} />
              
              {/* 2024 Line */}
              <Line 
                type="monotone" 
                dataKey="2024" 
                stroke="#22c55e" 
                strokeWidth={isFullscreenView ? 3 : 2}
                dot={{ 
                  fill: '#22c55e', 
                  strokeWidth: isFullscreenView ? 2 : 1, 
                  r: isFullscreenView ? 4 : 2.5,
                  stroke: '#fff'
                }}
                activeDot={{ 
                  r: isFullscreenView ? 6 : 4, 
                  fill: '#22c55e',
                  stroke: '#fff',
                  strokeWidth: isFullscreenView ? 2 : 1.5,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              />
              
              {/* 2025 Line */}
              <Line 
                type="monotone" 
                dataKey="2025" 
                stroke="#ec4899" 
                strokeWidth={isFullscreenView ? 3 : 2}
                dot={{ 
                  fill: '#ec4899', 
                  strokeWidth: isFullscreenView ? 2 : 1, 
                  r: isFullscreenView ? 4 : 2.5,
                  stroke: '#fff'
                }}
                activeDot={{ 
                  r: isFullscreenView ? 6 : 4, 
                  fill: '#ec4899',
                  stroke: '#fff',
                  strokeWidth: isFullscreenView ? 2 : 1.5,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="h-full">
        <div 
          className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-500 scrollbar-track-gray-50 dark:scrollbar-track-slate-700 hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-slate-400 transition-colors duration-200 dark-transition"
          style={{ height: `${heightBar}px` }}
        >
          <ResponsiveContainer width="100%" height={Math.max(heightBar, translatedData.length * (isFullscreenView ? 50 : 35))}>
            <BarChart 
              data={translatedData} 
              layout="vertical" 
              margin={{ 
                top: isFullscreenView ? 10 : 3, 
                right: isFullscreenView ? 40 : 20, 
                left: isFullscreenView ? 5 : 0, 
                bottom: isFullscreenView ? 10 : 3 
              }}
            >
              <CartesianGrid 
                strokeDasharray="1 1" 
                horizontal={true} 
                vertical={false} 
                stroke={gridColor}
                opacity={0.5}
              />
              <XAxis 
                type="number" 
                tickFormatter={(value) => formatNumber(value)}
                style={{ 
                  fontSize: isFullscreenView ? '14px' : '9px', 
                  fontWeight: '500' 
                }}
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: textColor, 
                  dy: isFullscreenView ? 6 : 3 
                }}
                height={isFullscreenView ? 35 : 20}
                tickCount={4}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={isFullscreenView ? 200 : 100}
                style={{ 
                  fontSize: isFullscreenView ? '12px' : '8px', 
                  fontWeight: '500' 
                }}
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: axisTextColor, 
                  dx: isFullscreenView ? -8 : -3 
                }}
                interval={0}
              />
              <Tooltip content={<CustomTooltip t={t} />} />
              <Bar 
                dataKey="value" 
                radius={[0, isFullscreenView ? 4 : 2, isFullscreenView ? 4 : 2, 0]}
                animationDuration={600}
                animationEasing="ease-out"
              >
                {translatedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value === maxValue ? '#4477AA' : '#4477AA'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }, [translatedData, viewMode, dynamicsData, maxValue, dynamicsStats, t, isDarkMode]);

  const renderTabHeader = useCallback((isFullscreenView = false) => (
    <div className={isFullscreenView ? "mb-6" : "mb-3"}>
      {/* Static Main Tabs - Ratings and Dynamics in years */}
      <div className="flex border-b border-gray-200 dark:border-slate-600 mb-2 dark-transition">
        <button
          onClick={() => setViewMode('bars')}
          className={`${isFullscreenView ? 'px-6 py-3 text-lg' : 'px-3 py-1.5 text-sm'} font-semibold border-b-2 transition-all duration-200 dark-transition ${
            viewMode === 'bars'
              ? 'text-green-600 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'text-gray-600 dark:text-slate-300 border-transparent hover:text-gray-800 dark:hover:text-slate-100 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
        >
          {t.chartRatings}
        </button>
        <button
          onClick={() => setViewMode('dynamics')}
          className={`${isFullscreenView ? 'px-6 py-3 text-lg' : 'px-3 py-1.5 text-sm'} font-semibold border-b-2 transition-all duration-200 dark-transition ${
            viewMode === 'dynamics'
              ? 'text-green-600 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'text-gray-600 dark:text-slate-300 border-transparent hover:text-gray-800 dark:hover:text-slate-100 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
        >
          {t.chartDynamicsInYears}
        </button>
      </div>
      
      {/* Dynamic KPI Title - Only show under Ratings */}
      {viewMode === 'bars' && (
        <div className={isFullscreenView ? "pb-3" : "pb-1"}>
          <h4 className={`${isFullscreenView ? 'text-lg' : 'text-sm'} font-medium text-gray-700 dark:text-slate-300 pl-1 dark-transition`}>
            {kpiTitle}
          </h4>
        </div>
      )}
    </div>
  ), [viewMode, kpiTitle, t, isDarkMode]);

  return (
    <>
      <div 
        className="h-full relative group transition-shadow duration-200 hover:shadow-md dark:hover:shadow-slate-900/20 dark-transition"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ height: '320px' }} // Optimized container height for 200px charts
      >
        {/* Hover Actions */}
        <div className={`absolute top-4 right-4 flex items-center gap-2 transition-all duration-200 z-10000 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-150 dark-transition"
            title={t.chartFullscreenView}
          >
            <Maximize2 className="w-4 h-4 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
          <button
            className="p-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-150 dark-transition"
            title={t.chartMoreOptions}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 h-full flex flex-col">
          {renderTabHeader()}
          
          <div className="flex-1 min-h-0 mb-3">
            {renderChart()}
          </div>
          
          {/* Enhanced Legend for dynamics view */}
          {viewMode === 'dynamics' && (
            <div className="pb-1">
              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300 dark-transition">2025</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300 dark-transition">2024</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Footer */}
          <div className="flex justify-center mt-4 pt-4">
            <button className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors group dark-transition">
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
        title={`${title} - ${t.chartAdvancedAnalytics}`}
        t={t}
      >
        <div className="h-full flex flex-col">
          {renderTabHeader(true)}
          <div className="flex-1 min-h-0 mb-6">
            {renderChart(true)}
          </div>
          {viewMode === 'dynamics' && (
            <div className="pb-6">
              <div className="flex justify-center items-center gap-12">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-pink-500 shadow-md"></div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-slate-300 dark-transition">2025</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-500 shadow-md"></div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-slate-300 dark-transition">2024</span>
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
