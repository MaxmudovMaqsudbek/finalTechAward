// src/widgets/Filters/Filters.jsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, Filter, RotateCcw, Search, X, Clock } from 'lucide-react';
import {
  useSelectedYear,
  useSelectedMonth,
  useProcurementType,
  useProcurementStatus,
  useSelectedRegion,
  useActiveFiltersCount,
  useLanguage,
  useSetSelectedYear,
  useSetSelectedMonth,
  useSetProcurementType,
  useSetProcurementStatus,
  useSetSelectedRegion,
  useResetFilters
} from '../../../app/store';
import { useTranslation } from '../../../shared/lib/i18n/translations';
import { formatDate } from '../../../shared/lib/utils';
import useStore from '../../../app/store';

const AdvancedDropdown = React.memo(({ label, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isDarkMode } = useStore();
  const dropdownRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  }, [onChange]);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const displayValue = useMemo(() => {
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  }, [value, options, placeholder]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-3 max-[530px]:px-2 py-1.5 max-[530px]:py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded hover:border-gray-300 dark:hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-150 min-w-[100px] max-[530px]:min-w-0 text-xs max-[530px]:text-[10px] dark-transition"
      >
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-xs max-[530px]:text-[9px] text-gray-500 dark:text-slate-400 font-medium truncate dark-transition w-full">{label}</span>
          <span className="text-xs max-[530px]:text-[10px] font-semibold text-gray-800 dark:text-slate-200 truncate dark-transition w-full">
            {displayValue}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 max-[530px]:w-2.5 max-[530px]:h-2.5 text-gray-500 dark:text-slate-400 transition-transform duration-150 flex-shrink-0 ml-1 dark-transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded shadow-lg dark:shadow-slate-900/50 z-50 max-h-60 max-[530px]:max-h-48 overflow-hidden dark-transition">
          {options.length > 5 && (
            <div className="p-2 max-[530px]:p-1.5 border-b border-gray-100 dark:border-slate-700 dark-transition">
              <div className="relative">
                <Search className="absolute left-2 max-[530px]:left-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 max-[530px]:w-2.5 max-[530px]:h-2.5 text-gray-400 dark:text-slate-500 dark-transition" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 max-[530px]:pl-6 pr-3 max-[530px]:pr-2 py-1.5 max-[530px]:py-1 border border-gray-200 dark:border-slate-600 rounded text-xs max-[530px]:text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 dark-transition"
                />
              </div>
            </div>
          )}
          <div className="max-h-48 max-[530px]:max-h-36 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-3 max-[530px]:px-2 py-2 max-[530px]:py-1.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-100 text-xs max-[530px]:text-[10px] dark-transition ${
                  value === option.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                <span className="truncate block">{option.label}</span>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 max-[530px]:px-2 py-4 max-[530px]:py-3 text-center text-gray-500 dark:text-slate-400 text-xs max-[530px]:text-[10px] dark-transition">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value &&
         prevProps.label === nextProps.label &&
         prevProps.placeholder === nextProps.placeholder &&
         JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options);
});

const MonthButton = React.memo(({ month, index, isSelected, onClick, isCurrentMonth }) => {
  const { isDarkMode } = useStore();
  const handleClick = useCallback(() => onClick(index), [onClick, index]);
  
  return (
    <button
      onClick={handleClick}
      className={`
        relative px-2 max-[530px]:px-1 py-1 max-[530px]:py-0.5 text-xs max-[530px]:text-[10px] font-medium rounded transition-all duration-150 dark-transition
        ${isSelected 
          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm dark:shadow-slate-900/20' 
          : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100'
        }
        ${isCurrentMonth && !isSelected ? 'ring-1 ring-blue-200 dark:ring-blue-400' : ''}
        max-[530px]:min-h-[24px] max-[530px]:flex max-[530px]:items-center max-[530px]:justify-center
      `}
    >
      <span className="max-[530px]:truncate max-[530px]:max-w-full">
        {month}
      </span>
      {isCurrentMonth && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 max-[530px]:w-1.5 max-[530px]:h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span>
      )}
    </button>
  );
}, (prevProps, nextProps) => {
  return prevProps.isSelected === nextProps.isSelected && 
         prevProps.isCurrentMonth === nextProps.isCurrentMonth &&
         prevProps.month === nextProps.month;
});

const Filters = React.memo(() => {
  // Use individual selectors to prevent unnecessary re-renders
  const selectedYear = useSelectedYear();
  const selectedMonth = useSelectedMonth();
  const procurementType = useProcurementType();
  const procurementStatus = useProcurementStatus();
  const selectedRegion = useSelectedRegion();
  const activeFiltersCount = useActiveFiltersCount();
  const language = useLanguage();
  const { isDarkMode } = useStore();
  
  // Individual action hooks
  const setSelectedYear = useSetSelectedYear();
  const setSelectedMonth = useSetSelectedMonth();
  const setProcurementType = useSetProcurementType();
  const setProcurementStatus = useSetProcurementStatus();
  const setSelectedRegion = useSetSelectedRegion();
  const resetFilters = useResetFilters();
  
  const t = useTranslation(language);
  const months = t.months;
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Performance optimization: memoize static options
  const yearOptions = useMemo(() => [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' }
  ], []);

  const procurementTypeOptions = useMemo(() => [
    { value: 'open', label: t.openTender },
    { value: 'limited', label: t.limitedTender },
    { value: 'negotiated', label: t.negotiatedProcedure }
  ], [t.openTender, t.limitedTender, t.negotiatedProcedure]);

  const statusOptions = useMemo(() => [
    { value: 'active', label: t.active },
    { value: 'completed', label: t.completed },
    { value: 'cancelled', label: t.cancelled }
  ], [t.active, t.completed, t.cancelled]);

  const regionOptions = useMemo(() => [
    { value: 'tashkent', label: t.tashkent },
    { value: 'samarkand', label: t.samarkand },
    { value: 'bukhara', label: t.bukhara },
    { value: 'fergana', label: t.fergana },
    { value: 'andijan', label: t.andijan },
    { value: 'namangan', label: t.namangan },
    { value: 'kashkadarya', label: t.kashkadarya },
    { value: 'surkhandarya', label: t.surkhandarya },
    { value: 'syrdarya', label: t.syrdarya },
    { value: 'jizzakh', label: t.jizzakh },
    { value: 'navoi', label: t.navoi },
    { value: 'khorezm', label: t.khorezm },
    { value: 'karakalpakstan', label: t.karakalpakstan }
  ], [t.tashkent, t.samarkand, t.bukhara, t.fergana, t.andijan, t.namangan,
      t.kashkadarya, t.surkhandarya, t.syrdarya, t.jizzakh, t.navoi, t.khorezm, t.karakalpakstan]);

  // Get current month for highlighting
  const currentMonth = useMemo(() => new Date().getMonth(), []);

  // Optimized handlers with minimal re-renders
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    setLastUpdate(new Date());
  }, [setSelectedYear]);

  const handleMonthToggle = useCallback((monthIndex) => {
    setSelectedMonth(monthIndex === selectedMonth ? null : monthIndex);
    setLastUpdate(new Date());
  }, [selectedMonth, setSelectedMonth]);

  const handleResetFilters = useCallback(() => {
    resetFilters();
    setLastUpdate(new Date());
    setShowAdvancedFilters(false);
  }, [resetFilters]);

  const handleProcurementTypeChange = useCallback((type) => {
    setProcurementType(type === procurementType ? null : type);
  }, [procurementType, setProcurementType]);

  const handleStatusChange = useCallback((status) => {
    setProcurementStatus(status === procurementStatus ? null : status);
  }, [procurementStatus, setProcurementStatus]);

  const handleRegionChange = useCallback((region) => {
    setSelectedRegion(region === selectedRegion ? null : region);
  }, [selectedRegion, setSelectedRegion]);

  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters(prev => !prev);
  }, []);

  // Auto-update timestamp every minute (optimized)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Memoized display values
  const selectedMonthDisplay = useMemo(() => 
    selectedMonth !== null ? months[selectedMonth] : null
  , [selectedMonth, months]);

  const activeFiltersDisplay = useMemo(() => 
    activeFiltersCount > 0 ? `${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''} applied` : null
  , [activeFiltersCount]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 overflow-hidden dark-transition">
      {/* Compact Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 px-3 max-[530px]:px-2 py-2 max-[530px]:py-1.5 border-b border-gray-200 dark:border-slate-700 dark-transition">
        <div className="flex items-center justify-between max-[530px]:flex-col max-[530px]:gap-2">
          <div className="flex items-center gap-2 max-[530px]:w-full max-[530px]:justify-center">
            <Calendar className="w-4 h-4 max-[530px]:w-3.5 max-[530px]:h-3.5 text-gray-600 dark:text-slate-300 dark-transition" />
            <div>
              <h3 className="text-sm max-[530px]:text-xs font-semibold text-gray-800 dark:text-slate-200 dark-transition">{t.dateOfAnnouncement}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2 max-[530px]:w-full max-[530px]:justify-center">
            <button
              onClick={toggleAdvancedFilters}
              className="flex items-center gap-1 px-2 max-[530px]:px-1.5 py-1 max-[530px]:py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-150 relative text-xs max-[530px]:text-[10px] dark-transition"
            >
              <Filter className="w-3 h-3 max-[530px]:w-2.5 max-[530px]:h-2.5 text-gray-600 dark:text-slate-300 dark-transition" />
              <span className="font-medium text-gray-700 dark:text-slate-300 dark-transition max-[530px]:hidden">Advanced</span>
              <span className="font-medium text-gray-700 dark:text-slate-300 dark-transition min-[531px]:hidden">Adv</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 dark:bg-blue-500 text-white text-xs max-[530px]:text-[9px] rounded-full w-4 h-4 max-[530px]:w-3 max-[530px]:h-3 flex items-center justify-center dark-transition">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 max-[530px]:w-2.5 max-[530px]:h-2.5 transition-transform duration-150 text-gray-600 dark:text-slate-300 dark-transition ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2 max-[530px]:px-1.5 py-1 max-[530px]:py-0.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-600 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-150 text-xs max-[530px]:text-[10px] dark-transition"
              title={t.resetFilters}
            >
              <RotateCcw className="w-3 h-3 max-[530px]:w-2.5 max-[530px]:h-2.5" />
              <span className="font-medium max-[530px]:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Main Filter Controls */}
      <div className="px-4 max-[530px]:px-2 py-2 max-[530px]:py-1.5 bg-white dark:bg-slate-900 dark-transition">
        <div className="flex items-center gap-3 max-[530px]:flex-col max-[530px]:gap-2">
          {/* Year Selector */}
          <div className="max-[530px]:w-full max-[530px]:order-1">
            <AdvancedDropdown
              label="Year"
              value={selectedYear}
              options={yearOptions}
              onChange={handleYearChange}
              placeholder="Select year"
            />
          </div>
          
          {/* Month Buttons */}
          <div className="flex-1 max-[530px]:w-full max-[530px]:order-3">
            <div className="grid grid-cols-6 gap-1 lg:grid-cols-12 max-[530px]:grid-cols-4 max-[530px]:gap-0.5">
              {months.map((month, idx) => (
                <MonthButton
                  key={idx}
                  month={month}
                  index={idx}
                  isSelected={selectedMonth === idx}
                  onClick={handleMonthToggle}
                  isCurrentMonth={idx === currentMonth}
                />
              ))}
            </div>
          </div>
          
          {/* Status Display */}
          <div className="text-right min-w-0 max-[530px]:w-full max-[530px]:text-center max-[530px]:order-2">
            <div className="text-xs max-[530px]:text-[10px] text-gray-500 dark:text-slate-400 truncate dark-transition">
              {selectedYear}{selectedMonthDisplay && ` - ${selectedMonthDisplay}`}
            </div>
            <div className="flex items-center gap-1 text-xs max-[530px]:text-[10px] justify-end max-[530px]:justify-center">
              <span className="w-1.5 h-1.5 max-[530px]:w-1 max-[530px]:h-1 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-700 dark:text-green-400 font-medium dark-transition">Live</span>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="mt-3 max-[530px]:mt-2 pt-3 max-[530px]:pt-2 border-t border-gray-200 dark:border-slate-700 dark-transition">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-[530px]:gap-1.5">
              <AdvancedDropdown
                label={t.procurementType}
                value={procurementType}
                options={procurementTypeOptions}
                onChange={handleProcurementTypeChange}
                placeholder={t.allTypes}
              />
              
              <AdvancedDropdown
                label={t.procurementStatus}
                value={procurementStatus}
                options={statusOptions}
                onChange={handleStatusChange}
                placeholder={t.allStatuses}
              />
              
              <AdvancedDropdown
                label={t.region}
                value={selectedRegion}
                options={regionOptions}
                onChange={handleRegionChange}
                placeholder={t.allRegions}
              />
            </div>
            
            {/* Active Filters Summary */}
            {activeFiltersDisplay && (
              <div className="mt-2 max-[530px]:mt-1.5 p-2 max-[530px]:p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-700 dark-transition">
                <div className="flex items-center justify-between max-[530px]:flex-col max-[530px]:gap-1 max-[530px]:items-start">
                  <div className="text-xs max-[530px]:text-[10px] font-medium text-blue-800 dark:text-blue-300 dark-transition">
                    {activeFiltersDisplay}
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs max-[530px]:text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors dark-transition max-[530px]:self-end"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Footer */}
      <div className="bg-gray-50 dark:bg-slate-800 px-4 max-[530px]:px-2 py-1.5 max-[530px]:py-1 border-t border-gray-200 dark:border-slate-700 dark-transition">
        <div className="flex items-center justify-between max-[530px]:flex-col max-[530px]:gap-1">
          <div className="flex items-center gap-1 text-xs max-[530px]:text-[10px] text-gray-600 dark:text-slate-300 dark-transition">
            <Clock className="w-3 h-3 max-[530px]:w-2.5 max-[530px]:h-2.5" />
            <span>{t.updateStart} {formatDate(lastUpdate)}</span>
          </div>
          
          <div className="text-xs max-[530px]:text-[10px] text-gray-500 dark:text-slate-400 dark-transition">
            Auto-refresh: 60s
          </div>
        </div>
      </div>
    </div>
  );
});

export default Filters;