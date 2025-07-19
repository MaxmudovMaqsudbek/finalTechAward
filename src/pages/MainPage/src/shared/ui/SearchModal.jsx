// src/shared/ui/SearchModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, TrendingUp, TrendingDown, Minus, Package, Building, FileText, BarChart3 } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, searchQuery, data, language }) => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search function with high performance
  const searchData = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2 || !data) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const searchResults = [];

    // Search in KPI data
    if (data.kpiData) {
      Object.entries(data.kpiData).forEach(([key, kpiItem]) => {
        const keyName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        if (keyName.includes(query) || 
            kpiItem.value?.toString().includes(query) ||
            kpiItem.unit?.toLowerCase().includes(query)) {
          searchResults.push({
            type: 'kpi',
            id: key,
            title: keyName.charAt(0).toUpperCase() + keyName.slice(1),
            value: kpiItem.value,
            unit: kpiItem.unit,
            trend: kpiItem.trend,
            category: 'KPI Metrics'
          });
        }
      });
    }

    // Search in bar chart data
    if (data.barDataByKPI) {
      Object.entries(data.barDataByKPI).forEach(([category, items]) => {
        const categoryName = category.replace(/([A-Z])/g, ' $1').toLowerCase();
        
        items.forEach((item, index) => {
          if (item.name?.toLowerCase().includes(query) ||
              categoryName.includes(query) ||
              item.value?.toString().includes(query) ||
              item.percent?.toString().includes(query)) {
            searchResults.push({
              type: 'chart_data',
              id: `${category}_${index}`,
              title: item.name,
              value: item.value,
              percent: item.percent,
              category: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
              categoryType: category
            });
          }
        });
      });
    }

    return searchResults;
  }, [searchQuery, data]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      // Simulate search delay for better UX
      const timer = setTimeout(() => {
        setResults(searchData);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [searchData, searchQuery]);

  const formatValue = (value, unit) => {
    if (unit) {
      return `${value} ${unit}`;
    }
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  const getTrendIcon = (trend) => {
    if (!trend || !trend.length) return <Minus className="w-4 h-4 text-gray-400" />;
    
    const lastTwo = trend.slice(-2);
    if (lastTwo.length < 2) return <Minus className="w-4 h-4 text-gray-400" />;
    
    const isIncreasing = lastTwo[1] > lastTwo[0];
    return isIncreasing ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getCategoryIcon = (type, categoryType) => {
    if (type === 'kpi') {
      return <BarChart3 className="w-5 h-5 text-blue-600" />;
    }
    
    switch (categoryType) {
      case 'numberOfLots':
        return <Package className="w-5 h-5 text-green-600" />;
      case 'procuringEntities':
        return <Building className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-400000 flex items-start ">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/5"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full  max-h-[60vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'ru' ? 'Результаты поиска' : 'Search Results'}
              </h2>
              <p className="text-sm text-gray-600">
                {language === 'ru' ? `Поиск: "${searchQuery}"` : `Search: "${searchQuery}"`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          {isSearching ? (
            // Loading state
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">
                  {language === 'ru' ? 'Поиск данных...' : 'Searching data...'}
                </p>
              </div>
            </div>
          ) : results.length > 0 ? (
            // Results
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {language === 'ru' 
                    ? `Найдено ${results.length} результат${results.length > 1 ? 'ов' : ''}` 
                    : `Found ${results.length} result${results.length > 1 ? 's' : ''}`
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getCategoryIcon(result.type, result.categoryType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {result.title}
                            </h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {result.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-mono font-medium text-blue-600">
                              {formatValue(result.value, result.unit)}
                            </span>
                            {result.percent && (
                              <span className="text-gray-500">
                                {result.percent}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {result.trend && (
                        <div className="ml-4">
                          {getTrendIcon(result.trend)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery.length >= 2 ? (
            // No results
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'ru' ? 'Ничего не найдено' : 'No matches found'}
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {language === 'ru' 
                  ? 'Не найдено совпадений в ваших текущих данных. Попробуйте другой поисковый запрос.'
                  : 'No matches within your current search. Try a different search term.'
                }
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>{language === 'ru' ? 'Советы:' : 'Tips:'}</strong>
                </p>
                <ul className="text-sm text-blue-600 mt-2 space-y-1">
                  <li>• {language === 'ru' ? 'Используйте более общие термины' : 'Use more general terms'}</li>
                  <li>• {language === 'ru' ? 'Проверьте правописание' : 'Check your spelling'}</li>
                  <li>• {language === 'ru' ? 'Попробуйте числовые значения' : 'Try numerical values'}</li>
                </ul>
              </div>
            </div>
          ) : (
            // Initial state
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'ru' ? 'Начните вводить для поиска' : 'Start typing to search'}
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {language === 'ru' 
                  ? 'Введите минимум 2 символа для поиска по данным панели.'
                  : 'Enter at least 2 characters to search through dashboard data.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
