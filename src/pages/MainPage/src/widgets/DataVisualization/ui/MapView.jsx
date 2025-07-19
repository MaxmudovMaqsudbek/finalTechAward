// src/widgets/DataVisualization/MapView.jsx
import React, { memo, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, MoreHorizontal, X, MapPin, Layers } from 'lucide-react';
import { formatNumber } from '../../../shared/lib/utils';
import { uzbekistanGeoJSON } from '../../../shared/api/mockData';
import { useTranslation } from '../../../shared/lib/i18n/translations';
import useStore from '../../../app/store';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Generate region data based on KPI type and actual kpiData
const generateRegionData = (kpiType, kpiData) => {
  const regions = [
    { name: 'Toshkent shahri', code: 'tashkent_city' },
    { name: 'Toshkent viloyati', code: 'tashkent' },
    { name: 'Samarqand viloyati', code: 'samarkand' },
    { name: 'Andijon viloyati', code: 'andijan' },
    { name: 'Farg\'ona viloyati', code: 'fergana' },
    { name: 'Namangan viloyati', code: 'namangan' },
    { name: 'Qashqadaryo viloyati', code: 'kashkadarya' },
    { name: 'Surxondaryo viloyati', code: 'surkhandarya' },
    { name: 'Buxoro viloyati', code: 'bukhara' },
    { name: 'Navoiy viloyati', code: 'navoi' },
    { name: 'Jizzax viloyati', code: 'jizzakh' },
    { name: 'Sirdaryo viloyati', code: 'syrdarya' },
    { name: 'Xorazm viloyati', code: 'khorezm' },
    { name: 'Qoraqalpog\'iston Respublikasi', code: 'karakalpakstan' }
  ];

  // Get base value from kpiData if available - handle different KPI data structures
  let baseValue = 100;
  
  if (kpiData && kpiData[kpiType]) {
    const kpiValue = kpiData[kpiType];
    if (typeof kpiValue === 'object' && kpiValue.value) {
      // Handle object format: { value: "5,55", trend: "+2.3%" }
      baseValue = parseFloat(kpiValue.value.toString().replace(',', '.'));
    } else if (typeof kpiValue === 'string' || typeof kpiValue === 'number') {
      // Handle direct value format
      baseValue = parseFloat(kpiValue.toString().replace(',', '.'));
    }
  }

  return regions.map(region => {
    // Generate values based on KPI type with regional variation - different regions excel in different KPIs
    const getMultiplierByKPI = (regionCode, kpiType) => {
      const multipliers = {
        'numberOfLots': {
          'samarkand': 1.3,      // Samarkand leads in number of lots
          'tashkent': 1.1,
          'tashkent_city': 1.0,
          'fergana': 0.9,
          'andijan': 0.8,
          'namangan': 0.7,
          'kashkadarya': 0.6,
          'bukhara': 0.5,
          'surkhandarya': 0.4,
          'navoi': 0.4,
          'jizzakh': 0.5,
          'syrdarya': 0.6,
          'khorezm': 0.3,
          'karakalpakstan': 0.25
        },
        'procuringEntities': {
          'tashkent_city': 1.4,   // Tashkent City leads in procuring entities
          'tashkent': 1.1,
          'samarkand': 0.9,
          'fergana': 0.8,
          'andijan': 0.7,
          'namangan': 0.6,
          'kashkadarya': 0.7,
          'bukhara': 0.5,
          'surkhandarya': 0.4,
          'navoi': 0.5,
          'jizzakh': 0.4,
          'syrdarya': 0.6,
          'khorezm': 0.3,
          'karakalpakstan': 0.25
        },
        'expectedValue': {
          'navoi': 1.4,          // Navoi leads in expected value (mining region)
          'tashkent_city': 1.2,
          'tashkent': 1.0,
          'samarkand': 0.8,
          'bukhara': 0.9,
          'fergana': 0.7,
          'andijan': 0.6,
          'namangan': 0.5,
          'kashkadarya': 0.6,
          'surkhandarya': 0.4,
          'jizzakh': 0.4,
          'syrdarya': 0.5,
          'khorezm': 0.3,
          'karakalpakstan': 0.25
        },
        'avgBidders': {
          'fergana': 1.3,        // Fergana leads in average bidders
          'andijan': 1.1,
          'namangan': 1.0,
          'tashkent_city': 0.9,
          'tashkent': 0.8,
          'samarkand': 0.7,
          'kashkadarya': 0.6,
          'bukhara': 0.5,
          'surkhandarya': 0.4,
          'navoi': 0.4,
          'jizzakh': 0.5,
          'syrdarya': 0.6,
          'khorezm': 0.3,
          'karakalpakstan': 0.25
        }
      };
      
      return multipliers[kpiType]?.[regionCode] || 0.5;
    };

    const multiplier = getMultiplierByKPI(region.code, kpiType);

    let value;
    switch (kpiType) {
      case 'numberOfLots':
        value = Math.floor((baseValue * 1000000 * multiplier) / 5); // Convert millions to actual numbers
        break;
      case 'procuringEntities':
        value = Math.floor((baseValue * 1000 * multiplier) / 30); // Convert thousands to actual numbers
        break;
      case 'expectedValue':
        value = Math.floor(baseValue * 1000000000 * multiplier); // Convert trillions to millions
        break;
      case 'avgBidders':
        value = parseFloat((baseValue * multiplier).toFixed(2));
        break;
      default:
        value = Math.floor(baseValue * 1000 * multiplier);
    }

    return {
      ...region,
      value: Number(value), // Ensure value is always a number
      kpiType,
      intensity: Math.min(1, Math.max(0.2, (multiplier - 0.2) / 1.0)) // Normalize intensity 0.2-1
    };
  });
};

// Generate sample city markers based on KPI data
const generateCityMarkers = (kpiType, kpiData) => {
  const cities = [
    { name: 'Tashkent', position: [41.2995, 69.2401], multiplier: 1.2 },
    { name: 'Samarkand', position: [39.6270, 66.9750], multiplier: 0.9 },
    { name: 'Bukhara', position: [39.7747, 64.4286], multiplier: 0.7 },
    { name: 'Fergana', position: [40.3842, 71.7843], multiplier: 1.0 },
    { name: 'Andijan', position: [40.7821, 72.3442], multiplier: 0.8 },
    { name: 'Navoi', position: [40.0844, 65.3792], multiplier: 0.6 },
  ];

  // Get base value from kpiData if available
  const baseValue = kpiData?.[kpiType]?.value ? 
    parseFloat(kpiData[kpiType].value.replace(',', '.')) : 100;
  
  return cities.map(city => {
    let value;
    switch (kpiType) {
      case 'numberOfLots':
        value = Math.floor((baseValue * 1000000 * city.multiplier) / 20);
        break;
      case 'procuringEntities':
        value = Math.floor((baseValue * 1000 * city.multiplier) / 100);
        break;
      case 'expectedValue':
        value = Math.floor(baseValue * 100000000 * city.multiplier);
        break;
      case 'avgBidders':
        value = (baseValue * city.multiplier).toFixed(2);
        break;
      default:
        value = Math.floor(baseValue * 100 * city.multiplier);
    }

    return {
      ...city,
      value,
      type: kpiType,
      intensity: Math.min(1, (city.multiplier - 0.5) / 0.7) // Normalize for color intensity
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

// Create custom markers based on intensity
const createCustomMarker = (intensity, isFullscreen = false) => {
  const size = isFullscreen ? 
    Math.max(20, Math.min(40, intensity * 40)) : 
    Math.max(12, Math.min(25, intensity * 25));
  
  const color = intensity > 0.7 ? '#dc2626' : 
               intensity > 0.4 ? '#f59e0b' : '#10b981';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px; 
      height: ${size}px; 
      background-color: ${color}; 
      border: 2px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="color: white; font-size: ${isFullscreen ? '10px' : '8px'}; font-weight: bold;">
        ${Math.round(intensity * 100)}
      </div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

const FullscreenModal = ({ isOpen, onClose, children, title, t }) => {
  const { isDarkMode } = useStore();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60000 bg-black/50 dark:bg-black/70 flex items-center justify-center dark-transition">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full h-full flex flex-col shadow-2xl dark:shadow-slate-900/50 dark-transition">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 dark-transition">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-1 dark-transition">{title}</h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 font-medium dark-transition">{t.interactiveGeographicAnalytics}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:scale-105 dark-transition"
            title={t.closeFullscreenView}
          >
            <X className="w-8 h-8 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
        </div>
        
        {/* Enhanced Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="h-full p-6">
            {children}
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex justify-between items-center dark-transition">
          <div className="text-sm text-gray-500 dark:text-slate-400 font-medium dark-transition">
            {t.geographicDataVisualization} • {t.governmentAnalyticsPlatform}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              {t.exportMap}
            </button>
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              {t.downloadData}
            </button>
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              {t.shareLocation}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapView = memo(({ title, kpiType = 'numberOfLots', kpiData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('geography'); // 'geography' or 'density'
  const { selectedKPI, language, isDarkMode } = useStore();
  const t = useTranslation(language);
  
  const currentKPI = kpiType || selectedKPI;
  const kpiTitle = useMemo(() => getKPITitle(currentKPI), [currentKPI]);
  const cityMarkers = useMemo(() => generateCityMarkers(currentKPI, kpiData), [currentKPI, kpiData]);
  const regionData = useMemo(() => generateRegionData(currentKPI, kpiData), [currentKPI, kpiData]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), []);

  // Enhanced map styling with KPI-based coloring and highlighting
  const mapStyle = useCallback((feature) => {
    const regionInfo = regionData.find(r => r.name === feature.properties.name);
    const intensity = regionInfo?.intensity || 0.3;
    
    // Find the region with highest value for current KPI (this will be highlighted)
    const highestValueRegion = regionData.reduce((max, region) => {
      const regionValue = Number(region.value) || 0;
      const maxValue = Number(max.value) || 0;
      return (regionValue > maxValue) ? region : max;
    }, regionData[0] || { value: 0 });
    
    const isHighlighted = regionInfo?.name === highestValueRegion?.name;
    
    // Color based on KPI intensity - only highlight one region in blue
    const getRegionColor = (isHighlighted) => {
      if (viewMode === 'geography') {
        if (isHighlighted) {
          // Blue highlighting for the top region only
          return '#3b82f6'; // Blue for the selected/highlighted region
        }
        // Transparent for all other regions (show original map)
        return 'transparent'; // Transparent for non-highlighted regions
      } else {
        // Density heatmap - red to green scale
        if (intensity > 0.7) return '#dc2626'; // Red for high
        if (intensity > 0.4) return '#f59e0b'; // Yellow for medium  
        return '#10b981'; // Green for low
      }
    };

    return {
      fillColor: getRegionColor(isHighlighted),
      weight: isHighlighted ? 3 : 0, // No border for non-highlighted regions
      opacity: isHighlighted ? 1 : 0, // No border opacity for non-highlighted
      color: isHighlighted ? '#1d4ed8' : 'transparent', // Blue border for highlighted only
      fillOpacity: isHighlighted ? 0.7 : 0, // Only highlighted region has opacity
    };
  }, [viewMode, regionData]);

  const onEachFeature = useCallback((feature, layer) => {
    if (feature.properties) {
      const regionInfo = regionData.find(r => r.name === feature.properties.name);
      const kpiValue = regionInfo ? formatNumber(regionInfo.value) : 'N/A';
      
      // Find the region with highest value for current KPI
      const highestValueRegion = regionData.reduce((max, region) => {
        const regionValue = Number(region.value) || 0;
        const maxValue = Number(max.value) || 0;
        return (regionValue > maxValue) ? region : max;
      }, regionData[0] || { value: 0 });
      
      const isHighlighted = regionInfo?.name === highestValueRegion?.name;
      
      layer.bindPopup(`
        <div class="p-3 min-w-48 ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-900'}">
          <h4 class="font-bold text-lg mb-2 ${isHighlighted ? (isDarkMode ? 'text-blue-400' : 'text-blue-700') : (isDarkMode ? 'text-slate-100' : 'text-gray-700')}">${feature.properties.name}</h4>
          ${isHighlighted ? `<div class="mb-2 px-2 py-1 ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'} text-xs font-semibold rounded-full text-center">🏆 ${t.highest} ${kpiTitle.toUpperCase()}</div>` : ''}
          <div class="space-y-2">
            <p class="text-sm flex justify-between">
              <span class="font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}">${t.currentKPI} (${kpiTitle}):</span>
              <span class="${isHighlighted ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-300' : 'text-gray-600')} font-bold">${kpiValue}</span>
            </p>
            <hr class="${isDarkMode ? 'border-slate-600' : 'border-gray-200'}">
            <p class="text-sm flex justify-between">
              <span class="font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}">${t.mapProcuringEntities}:</span>
              <span class="${isDarkMode ? 'text-green-400' : 'text-green-600'}">${formatNumber(feature.properties.procuringEntities)}</span>
            </p>
            <p class="text-sm flex justify-between">
              <span class="font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}">${t.lots}:</span>
              <span class="${isDarkMode ? 'text-purple-400' : 'text-purple-600'}">${formatNumber(feature.properties.lots)}</span>
            </p>
            <p class="text-sm flex justify-between">
              <span class="font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}">${t.value}:</span>
              <span class="${isDarkMode ? 'text-orange-400' : 'text-orange-600'}">${feature.properties.value}</span>
            </p>
          </div>
        </div>
      `, {
        maxWidth: 320,
        className: `custom-popup ${isDarkMode ? 'dark-popup' : ''}`
      });

      // Add hover effects only for highlighted region
      layer.on({
        mouseover: function(e) {
          if (isHighlighted) {
            const layer = e.target;
            layer.setStyle({
              weight: 4,
              color: '#1d4ed8',
              fillOpacity: 0.9
            });
          }
        },
        mouseout: function(e) {
          const layer = e.target;
          const style = mapStyle(feature);
          layer.setStyle(style);
        }
      });
    }
  }, [regionData, kpiTitle, mapStyle, t, isDarkMode]);

  const renderTabHeader = useCallback((isFullscreenView = false) => (
    <div className={isFullscreenView ? "mb-6" : "mb-3"}>
      {/* Static Main Tabs - Geography and Density */}
      <div className="flex border-b border-gray-200 dark:border-slate-600 mb-2 dark-transition">
        <button
          onClick={() => setViewMode('geography')}
          className={`${isFullscreenView ? 'px-6 py-3 text-lg' : 'px-3 py-1.5 text-sm'} font-semibold border-b-2 transition-all duration-200 dark-transition ${
            viewMode === 'geography'
              ? 'text-green-600 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'text-gray-600 dark:text-slate-300 border-transparent hover:text-gray-800 dark:hover:text-slate-100 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
        >
          {t.mapGeography} ({t.uzbekistanRegions})
        </button>
        <button
          onClick={() => setViewMode('density')}
          className={`${isFullscreenView ? 'px-6 py-3 text-lg' : 'px-3 py-1.5 text-sm'} font-semibold border-b-2 transition-all duration-200 dark-transition ${
            viewMode === 'density'
              ? 'text-green-600 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
              : 'text-gray-600 dark:text-slate-300 border-transparent hover:text-gray-800 dark:hover:text-slate-100 hover:border-gray-300 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
        >
          {t.densityHeatmap}
        </button>
      </div>
      
      {/* Dynamic KPI Title - Only show under Geography */}
      {viewMode === 'geography' && (
        <div className={isFullscreenView ? "pb-3" : "pb-1"}>
          <h4 className={`${isFullscreenView ? 'text-lg' : 'text-sm'} font-medium text-gray-700 dark:text-slate-300 pl-1 dark-transition`}>
            {kpiTitle}
          </h4>
        </div>
      )}
    </div>
  ), [viewMode, kpiTitle, t, isDarkMode]);

  const renderMap = useCallback((isFullscreenView = false) => {
    const mapHeight = isFullscreenView ? 600 : 170;
    
    return (
      <div className="h-full">
        <div 
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 dark-transition"
          style={{ height: `${mapHeight}px` }}
        >
          <MapContainer 
            center={[41.377491, 64.585262]} 
            zoom={isFullscreenView ? 7 : 6} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={isFullscreenView}
          >
            <TileLayer
              url={isDarkMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution={isDarkMode
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              }
            />
            <GeoJSON
              data={uzbekistanGeoJSON} 
              style={mapStyle}
              onEachFeature={onEachFeature}
            />
            {/* City Markers */}
            {viewMode === 'density' && cityMarkers.map((city, index) => (
              <Marker 
                key={index}
                position={city.position}
                icon={createCustomMarker(city.intensity, isFullscreenView)}
              >
                <Popup>
                  <div className={`p-2 ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-900'}`}>
                    <h4 className={`font-bold text-base mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{city.name}</h4>
                    <p className="text-sm">
                      <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{kpiTitle}:</span> 
                      <span className={`ml-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{formatNumber(city.value)}</span>
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {t.intensity}: {Math.round(city.intensity * 100)}%
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    );
  }, [viewMode, mapStyle, onEachFeature, cityMarkers, kpiTitle, t, isDarkMode]);

  return (
    <>
      <div 
        className="h-full relative group transition-shadow duration-200 hover:shadow-lg dark:hover:shadow-slate-900/20 dark-transition"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ height: '320px' }}
      >
        {/* Hover Actions */}
        <div className={`absolute top-4 right-4 flex items-center gap-2 transition-all duration-200 z-10000 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-150 dark-transition"
            title={t.fullscreenView}
          >
            <Maximize2 className="w-4 h-4 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
          <button
            className="p-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-150 dark-transition"
            title={t.mapOptions}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-full flex flex-col">
          {renderTabHeader()}
          
          <div className="flex-1 min-h-0 mb-3">
            {renderMap()}
          </div>
          
          {/* Enhanced Legend based on view mode */}
          {viewMode === 'geography' ? (
            <div className="pb-1">
              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-sm border border-blue-700"></div>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 dark-transition">{t.topRegion} - {kpiTitle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-slate-600 shadow-sm border border-gray-300 dark:border-slate-500 dark-transition" style={{opacity: 0.3}}></div>
                  <span className="text-xs font-medium text-gray-500 dark:text-slate-400 dark-transition">{t.baseMapView}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="pb-1">
              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300 dark-transition">{t.highDensity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300 dark-transition">{t.mediumDensity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-slate-300 dark-transition">{t.lowDensity}</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Footer */}
          <div className="flex justify-center">
            <button className="text-xs text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 flex items-end gap-1 transition-colors group dark-transition">
              <MapPin className="w-3 h-3" />
              <span className="font-medium">
                {viewMode === 'geography' ? kpiTitle : t.densityMap}
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
        title={`${title} - ${t.geographicAnalytics}`}
        t={t}
      >
        <div className="h-full flex flex-col">
          {renderTabHeader(true)}
          <div className="flex-1 min-h-0 mb-6">
            {renderMap(true)}
          </div>
          {/* Enhanced Legend for fullscreen */}
          {viewMode === 'geography' ? (
            <div className="pb-6">
              <div className="flex justify-center items-center gap-12">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-md bg-blue-500 shadow-md border-2 border-blue-700"></div>
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-400 dark-transition">{t.topRegion} - {kpiTitle}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-600 shadow-md border-2 border-gray-300 dark:border-slate-500 dark-transition" style={{opacity: 0.4}}></div>
                  <span className="text-lg font-semibold text-gray-500 dark:text-slate-400 dark-transition">{t.originalMapView}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="pb-6">
              <div className="flex justify-center items-center gap-12">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-red-500 shadow-md"></div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-slate-300 dark-transition">{t.highDensity}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-yellow-500 shadow-md"></div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-slate-300 dark-transition">{t.mediumDensity}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-500 shadow-md"></div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-slate-300 dark-transition">{t.lowDensity}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </FullscreenModal>
    </>
  );
});

MapView.displayName = 'MapView';

export default MapView;