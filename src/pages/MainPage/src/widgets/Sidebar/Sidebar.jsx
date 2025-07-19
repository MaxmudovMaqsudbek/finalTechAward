// src/widgets/Sidebar/Sidebar.jsx
import React, { useState, useCallback } from 'react';
import { ChevronDown, Maximize2, MoreHorizontal, X, Search, Filter, FileText, Settings, Globe } from 'lucide-react';
import useStore from '../../app/store';
import { useTranslation } from '../../shared/lib/i18n/translations';

const FullscreenModal = ({ isOpen, onClose, children, title }) => {
  const { isDarkMode } = useStore();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60000 bg-black/50 dark:bg-black/70 flex items-center justify-center dark-transition">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full h-full flex flex-col shadow-2xl dark:shadow-slate-900/50 dark-transition">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 dark-transition">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-1 dark-transition">{title}</h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 font-medium dark-transition">Government Procurement System</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-200 hover:scale-105 dark-transition"
            title="Close fullscreen view"
          >
            <X className="w-8 h-8 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
        </div>
        
        {/* Enhanced Content Area */}
        <div className="flex-1 p-8 overflow-auto bg-gray-50/30 dark:bg-slate-800/30 dark-transition">
          <div className="h-full rounded-xl p-6">
            {children}
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="px-8 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex justify-between items-center dark-transition">
          <div className="text-sm text-gray-500 dark:text-slate-400 font-medium dark-transition">
            Government Procurement Analytics • Data Management Platform
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              Export Data
            </button>
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              Generate Report
            </button>
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 font-medium transition-colors dark-transition">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLotHovered, setIsLotHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [thresholdFilter, setThresholdFilter] = useState('');
  
  const { language, setLanguage, isDarkMode } = useStore();
  const t = useTranslation(language);

  const itemsPerPage = 10;
  // const totalItems = 1234;

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleLotMouseEnter = useCallback(() => setIsLotHovered(true), []);
  const handleLotMouseLeave = useCallback(() => setIsLotHovered(false), []);
  const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), []);
  const toggleAppDropdown = useCallback(() => setIsAppDropdownOpen(prev => !prev), []);

  // Mock data for the lot table - moved before filtering logic
  const lotTableData = [
    {
      id: 1,
      lot: 'БОП струменевий Epson Ec...',
      cpvClass: '03110000-5 Сільськогоспо...',
      competitiveness: 'Competitive',
      belowThreshold: 'Above Threshold',
      status: 'Active tender lot',
      procuringEntity: '00021019'
    },
    {
      id: 2,
      lot: 'Дощджакі, код СРV за ДК 021...',
      cpvClass: '03120000-8 Продукція рос...',
      competitiveness: 'NonCompetitive',
      belowThreshold: 'Below Threshold',
      status: 'Cancelled tender lot',
      procuringEntity: '00046829'
    },
    {
      id: 3,
      lot: 'Какао, код СРV за ДК 021-2...',
      cpvClass: '03130000-1 Сільськогоспо...',
      competitiveness: 'Competitive',
      belowThreshold: 'Above Threshold',
      status: 'Complete tender lot',
      procuringEntity: '00061125'
    },
    {
      id: 4,
      lot: 'Крохмаль, манна, код СРV з...',
      cpvClass: '03140000-4 Продукція твар...',
      competitiveness: 'NonCompetitive',
      belowThreshold: 'Below Threshold',
      status: 'Unsuccessful tender lot',
      procuringEntity: '00065689'
    },
    {
      id: 5,
      lot: 'Крохмаль, манна, код СРV з...',
      cpvClass: '03140000-4 Продукція твар...',
      competitiveness: 'Competitive',
      belowThreshold: 'Above Threshold',
      status: 'Active tender lot',
      procuringEntity: '00152135'
    },
    {
      id: 6,
      lot: 'Макарони, код СРV за ДК 0...',
      cpvClass: '03210000-6 Зернові культ...',
      competitiveness: 'NonCompetitive',
      belowThreshold: 'Below Threshold',
      status: 'Cancelled tender lot',
      procuringEntity: '00159226'
    },
    {
      id: 7,
      lot: 'Макарони, код СРV за ДК 0...',
      cpvClass: '03220000-9 Овочі, фрукти т...',
      competitiveness: 'Competitive',
      belowThreshold: 'Above Threshold',
      status: 'Complete tender lot',
      procuringEntity: '00181935'
    },
    {
      id: 8,
      lot: 'Оброблені фрукти та овочі...',
      cpvClass: '03310000-5 Риба, ракоподі...',
      competitiveness: 'NonCompetitive',
      belowThreshold: 'Below Threshold',
      status: 'Active tender lot',
      procuringEntity: '00182076'
    },
    {
      id: 9,
      lot: 'Овочі та фрукти, код ДК 02...',
      cpvClass: '03320000-8 Велика рогата ...',
      competitiveness: 'Competitive',
      belowThreshold: 'Above Threshold',
      status: 'Unsuccessful tender lot',
      procuringEntity: '00208736'
    },
    {
      id: 10,
      lot: 'Послуги комерційного обл...',
      cpvClass: '03330000-3 Продукція фер...',
      competitiveness: 'NonCompetitive',
      belowThreshold: 'Below Threshold',
      status: 'Complete tender lot',
      procuringEntity: '00208752'
    }
  ];

  // Filter data based on current filters and pagination
  const filteredData = lotTableData.filter(item => {
    const matchesSearch = !searchQuery || 
      item.lot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cpvClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.procuringEntity.includes(searchQuery);
    
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesType = !typeFilter || item.competitiveness === typeFilter;
    const matchesThreshold = !thresholdFilter || item.belowThreshold === thresholdFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesThreshold;
  });

  // Pagination handlers - moved after filteredData calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

  // Reset to first page when filters change
  const handleFilterChange = useCallback((setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  }, []);

  const appOptions = [
    { value: 'dozorro', label: language === 'ru' ? 'Справочник показателей' : 'Reference Indicators', icon: FileText },
    { value: 'planning', label: language === 'ru' ? 'Этап планирования' : 'Planning Stage', icon: Settings },
    { value: 'procurement', label: language === 'ru' ? 'Этап закупок (последние два года)' : 'Procurement Stage (Last 2 Years)', icon: Search },
    { value: 'all_procurement', label: language === 'ru' ? 'Этап закупок (все годы)' : 'Procurement Stage (All Years)', icon: Globe },
    { value: 'contracts', label: language === 'ru' ? 'Этап договоров' : 'Contract Stage', icon: FileText },
    { value: 'medical', label: language === 'ru' ? 'Медицинские закупки' : 'Medical Procurement', icon: Filter },
    { value: 'monitoring', label: language === 'ru' ? 'Мониторинг закупок' : 'Procurement Monitoring', icon: Search },
    { value: 'analysis', label: language === 'ru' ? 'Анализ для Prozorro.Market' : 'Analysis for Prozorro.Market', icon: Settings },
    { value: 'index', label: language === 'ru' ? 'Индекс заказчика' : 'Customer Index', icon: FileText },
  ];

  const renderFullscreenContent = () => (
    <div className="h-full flex flex-col min-h-0">
      {/* Header with Search */}
      <div className="flex-shrink-0 mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder={language === 'ru' ? 'Поиск лотов...' : 'Search lots...'}
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
              className="w-full px-6 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 dark-transition"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-slate-500 dark-transition" />
          </div>
          <button 
            onClick={() => {
              // Trigger search action if needed
              console.log('Search triggered');
            }}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 dark:active:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 dark-transition"
          >
            {language === 'ru' ? 'Поиск' : 'Search'}
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => handleFilterChange(setStatusFilter)(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 dark-transition"
          >
            <option value="">{language === 'ru' ? 'Все статусы' : 'All Statuses'}</option>
            <option value="Active tender lot">Active tender lot</option>
            <option value="Complete tender lot">Complete tender lot</option>
            <option value="Cancelled tender lot">Cancelled tender lot</option>
            <option value="Unsuccessful tender lot">Unsuccessful tender lot</option>
          </select>
          <select 
            value={typeFilter}
            onChange={(e) => handleFilterChange(setTypeFilter)(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 dark-transition"
          >
            <option value="">{language === 'ru' ? 'Все типы' : 'All Types'}</option>
            <option value="Competitive">Competitive</option>
            <option value="NonCompetitive">NonCompetitive</option>
          </select>
          <select 
            value={thresholdFilter}
            onChange={(e) => handleFilterChange(setThresholdFilter)(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 dark-transition"
          >
            <option value="">{language === 'ru' ? 'Все пороги' : 'All Thresholds'}</option>
            <option value="Above Threshold">Above Threshold</option>
            <option value="Below Threshold">Below Threshold</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/20 dark-transition" style={{ minHeight: '400px' }}>
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 border-b border-gray-200 dark:border-slate-600 px-6 py-4 dark-transition">
          <div className="grid grid-cols-6 gap-4">
            <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 dark-transition">
              {language === 'ru' ? 'Лот' : 'Lot'}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 dark-transition">
              {language === 'ru' ? 'Класс CPV лота (агрегированный)' : 'CPV Class of lot (aggregated)'}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 dark-transition">
              {language === 'ru' ? 'Конкурентность' : 'Competitiveness'}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 dark-transition">
              {language === 'ru' ? 'Допороговость' : 'BelowThresholdness'}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 dark-transition">
              {language === 'ru' ? 'Статус лота' : 'Lot status'}
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-slate-200 dark-transition">
              {language === 'ru' ? 'Организатор' : 'Procuring entity'}
            </div>
          </div>
        </div>
        
        {/* Table Body */}
        <div className="overflow-auto" style={{ maxHeight: '300px' }}>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, index) => (
              <div 
                key={row.id} 
                className={`grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer group dark-transition ${
                  index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-700/30'
                }`}
              >
                <div className="text-sm text-gray-900 dark:text-slate-100 font-medium group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors dark-transition">
                  {row.lot}
                </div>
                <div className="text-sm text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100 transition-colors dark-transition">
                  {row.cpvClass}
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${
                    row.competitiveness === 'Competitive' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
                  } dark-transition`}>
                    {row.competitiveness}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${
                    row.belowThreshold === 'Above Threshold' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700'
                  } dark-transition`}>
                    {row.belowThreshold}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${
                    row.status === 'Active tender lot' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' :
                    row.status === 'Complete tender lot' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700' :
                    row.status === 'Cancelled tender lot' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
                  } dark-transition`}>
                    {row.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-slate-300 font-mono group-hover:text-gray-900 dark:group-hover:text-slate-100 transition-colors dark-transition">
                  {row.procuringEntity}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-gray-400 dark:text-slate-500 mb-4 dark-transition">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 dark:text-slate-300 mb-2 dark-transition">
                  {language === 'ru' ? 'Ничего не найдено' : 'No results found'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 dark-transition">
                  {language === 'ru' ? 'Попробуйте изменить фильтры или поисковой запрос' : 'Try adjusting your filters or search query'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex-shrink-0 mt-6 flex justify-between items-center bg-white dark:bg-slate-800 px-6 py-4 border border-gray-200 dark:border-slate-600 rounded-xl shadow-sm dark:shadow-slate-900/20 dark-transition">
        <div className="text-sm text-gray-700 dark:text-slate-300 font-medium dark-transition">
          {filteredData.length > 0 ? (
            language === 'ru' 
              ? `Показано ${startItem}-${endItem} из ${filteredData.length} результатов`
              : `Showing ${startItem}-${endItem} of ${filteredData.length} results`
          ) : (
            language === 'ru' ? 'Ничего не найдено' : 'No results found'
          )}
        </div>
        
        {filteredData.length > 0 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 dark-transition ${
                currentPage === 1
                  ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 shadow-sm hover:shadow dark:shadow-slate-900/20'
              }`}
            >
              {language === 'ua' ? 'Попередня' : 'Previous'}
            </button>
            
            {/* Page Numbers */}
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 dark-transition ${
                      currentPage === pageNum
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md dark:shadow-slate-900/20'
                        : 'bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 shadow-sm hover:shadow dark:shadow-slate-900/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 dark-transition ${
                currentPage === totalPages
                  ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 shadow-sm hover:shadow dark:shadow-slate-900/20'
              }`}
            >
              {language === 'ua' ? 'Наступна' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

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
            title="Fullscreen view"
          >
            <Maximize2 className="w-4 h-4 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
          <button
            className="p-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-150 dark-transition"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-slate-300 dark-transition" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-full flex flex-col">
          {/* Language Toggle */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-1 mb-4 dark-transition">
            <div className="flex gap-2">
              <button 
                onClick={() => setLanguage('ru')}
                className={`flex-1 py-0.5 px-3 rounded font-semibold text-sm transition-all duration-150 dark-transition ${
                  language === 'ru' 
                    ? 'bg-green-500 text-white shadow-md transform scale-105' 
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                }`}
              >
                RU
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`flex-1 py-0.5 px-3 rounded font-semibold text-sm transition-all duration-150 dark-transition ${
                  language === 'en' 
                    ? 'bg-gray-700 dark:bg-slate-600 text-white shadow-md transform scale-105' 
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t.instruction}
                className="w-full px-3 py-0.5 border border-gray-300 dark:border-slate-600 rounded-xs outline-none text-sm transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 bg-blue-50 dark:bg-slate-700/50 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 dark-transition"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark-transition" />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder={t.askQuestion}
                className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-xs outline-none text-sm transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 bg-blue-50 dark:bg-slate-700/50 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 dark-transition"
              />
              <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark-transition" />
            </div>
            
            <div className="border-t border-gray-200 dark:border-slate-600 pt-3 dark-transition">
              <div className="relative mb-3 group" onMouseEnter={handleLotMouseEnter} onMouseLeave={handleLotMouseLeave}>
                {/* Hover Actions for Lot Field */}
                <div className={`absolute top-1 right-12 flex items-center gap-1 transition-all duration-200 z-20 ${
                  isLotHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                  <button
                    onClick={toggleFullscreen}
                    className="p-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-150 dark-transition"
                    title="View lot database"
                  >
                    <Maximize2 className="w-3 h-3 text-gray-600 dark:text-slate-300 dark-transition" />
                  </button>
                  <button
                    className="p-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-150 dark-transition"
                    title="Lot options"
                  >
                    <MoreHorizontal className="w-3 h-3 text-gray-600 dark:text-slate-300 dark-transition" />
                  </button>
                </div>
                
                <input 
                  type="text" 
                  placeholder={t.lot}
                  className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-xs outline-none text-sm transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 dark-transition"
                />
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 dark-transition" />
              </div>
              
              <div className="relative">
                <select className="w-full px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-xs outline-none text-gray-600 dark:text-slate-300 text-sm transition-all duration-200 hover:border-gray-400 dark:hover:border-slate-500 appearance-none bg-white dark:bg-slate-800 dark-transition">
                  <option>{t.cpvClass}</option>
                  <option>09000000-3 Нафтопродукти</option>
                  <option>14000000-8 Конструкції</option>
                  <option>15000000-8 Продукти харчування</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none dark-transition" />
              </div>
            </div>
          </div>

          {/* Go to App Button */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-600 dark-transition">
            <div className="relative">
              <button 
                onClick={toggleAppDropdown}
                className="w-full text-left px-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 flex justify-between items-center group transition-all duration-200 text-sm bg-white dark:bg-slate-800 dark-transition"
              >
                <span className="text-gray-600 dark:text-slate-300 font-medium dark-transition">
                  {selectedApp ? appOptions.find(opt => opt.value === selectedApp)?.label : t.goToApp}
                </span>
                <ChevronDown className={`text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-all duration-200 w-4 h-4 dark-transition ${isAppDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAppDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl dark:shadow-slate-900/50 z-50 max-h-48 overflow-y-auto dark-transition">
                  {appOptions.slice(0, 5).map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedApp(option.value);
                          setIsAppDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-all duration-150 border-b border-gray-100 dark:border-slate-700 last:border-b-0 group text-xs dark-transition"
                      >
                        <IconComponent className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex-shrink-0 dark-transition" />
                        <span className="text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100 font-medium truncate dark-transition">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Fullscreen Modal */}
      <FullscreenModal 
        isOpen={isFullscreen}
        onClose={toggleFullscreen}
        title={language === 'ua' ? 'База даних лотів' : 'Lot Database'}
      >
        {renderFullscreenContent()}
      </FullscreenModal>
    </>
  );
};

export default Sidebar;