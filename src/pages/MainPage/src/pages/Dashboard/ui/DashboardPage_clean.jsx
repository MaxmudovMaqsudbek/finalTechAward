// src/pages/Dashboard/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { MoreHorizontal, HelpCircle, Search, X, Eye, EyeOff, Filter } from 'lucide-react';
import useStore from '../../../app/store';
import { useTranslation } from '../../../shared/lib/i18n/translations';
import KPICards from '../../../widgets/KPICards/ui/KPICards';
import Header from '../../../widgets/Header/ui/Header';
import { fetchKPIData } from '../../../shared/api/mockData';
import Filters from '../../../widgets/Filters/ui/Filters';
import Sidebar from '../../../widgets/Sidebar/Sidebar';
import DataVisualization from '../../../widgets/DataVisualization/ui/DataVisualization';
import { SearchModal } from '../../../shared/ui';

const DashboardPage = () => {
  const { language, selectedYear, selectedMonth } = useStore();
  const _t = useTranslation(language);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [hasHiddenSelections, setHasHiddenSelections] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchKPIData({ 
          year: selectedYear, 
          month: selectedMonth 
        });
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedYear, selectedMonth]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    
    // Open modal when user starts typing (2+ characters)
    if (query.length >= 2) {
      setShowSearchModal(true);
    } else if (query.length === 0) {
      setShowSearchModal(false);
    }
    
    console.log('Searching for:', query);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput && searchQuery) {
      // If hiding search input and there's a query, clear it
      clearSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setShowSearchModal(false);
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
  };

  const toggleHiddenSelections = () => {
    setHasHiddenSelections(!hasHiddenSelections);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      
      {/* Search and Hidden Selections Bar */}
      <div className="h-10 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {/* Search icon in dotted rectangle */}
            <button
              onClick={toggleSearchInput}
              className="flex items-center justify-center w-8 h-6 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors cursor-pointer"
              style={{
                border: '1px dashed #9ca3af',
                borderStyle: 'dashed'
              }}
            >
              <Search className="w-3 h-3 text-gray-500" />
            </button>
            {showSearchInput && (
              <>
                <input
                  type="text"
                  placeholder="Search dashboard data..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`border-none outline-none bg-transparent text-gray-700 placeholder-gray-500 w-64 transition-colors ${
                    isSearching ? 'text-blue-700' : ''
                  }`}
                  style={{
                    borderBottom: searchQuery.length >= 2 ? '1px solid #3b82f6' : '1px dashed #d1d5db',
                    paddingBottom: '2px'
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Center - Hidden selections status */}
        <div className="flex items-center gap-2">
          {hasHiddenSelections && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Hidden selections applied</span>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleHiddenSelections}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 px-2 py-1 hover:bg-gray-100 rounded"
          >
            {hasHiddenSelections ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Show hidden</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Hide selections</span>
              </>
            )}
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div id="dashboard-content" className="px-6 py-4">
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-orange-400 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {language === 'ru' ? 'Показатели' : 'KPIs'} (2024-2025)
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <HelpCircle className="w-5 h-5 text-gray-500" />
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
              <span>Про лист</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <KPICards kpiData={data.kpiData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <DataVisualization barDataByKPI={data.barDataByKPI} />
            <Filters/>
          </div>
          <div className="col-span-3">
            <Sidebar/>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={closeSearchModal}
        searchQuery={searchQuery}
        data={data}
        language={language}
      />
    </div>
  );
};

export default DashboardPage;
