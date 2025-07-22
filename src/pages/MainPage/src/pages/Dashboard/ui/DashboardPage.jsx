// // src/pages/Dashboard/DashboardPage.jsx
// import React, { useState, useEffect } from 'react';
// import { HelpCircle, Search, X, Filter, Grid3X3, Bookmark, ChevronDown } from 'lucide-react';
// import useStore from '../../../app/store';
// import { useTranslation } from '../../../shared/lib/i18n/translations';
// import KPICards from '../../../widgets/KPICards/ui/KPICards';
// import Header from '../../../widgets/Header/ui/Header';
// import { fetchKPIData } from '../../../shared/api/mockData';
// import Filters from '../../../widgets/Filters/ui/Filters';
// import Sidebar from '../../../widgets/Sidebar/Sidebar';
// import DataVisualization from '../../../widgets/DataVisualization/ui/DataVisualization';
// import { SearchModal } from '../../../shared/ui';

// const DashboardPage = () => {
//   const { language, selectedYear, selectedMonth } = useStore();
//   const t = useTranslation(language);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [showSearchInput, setShowSearchInput] = useState(false);
//   const [showSearchModal, setShowSearchModal] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const result = await fetchKPIData({ 
//           year: selectedYear, 
//           month: selectedMonth 
//         });
//         setData(result);
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [selectedYear, selectedMonth]);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setIsSearching(query.length > 0);
    
//     // Open modal when user starts typing (2+ characters)
//     if (query.length >= 2) {
//       setShowSearchModal(true);
//     } else if (query.length === 0) {
//       setShowSearchModal(false);
//     }
    
//     console.log('Searching for:', query);
//   };

//   const toggleSearchInput = () => {
//     setShowSearchInput(!showSearchInput);
//     if (showSearchInput && searchQuery) {
//       // If hiding search input and there's a query, clear it
//       clearSearch();
//     }
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//     setIsSearching(false);
//     setShowSearchModal(false);
//   };

//   const closeSearchModal = () => {
//     setShowSearchModal(false);
//   };

//   if (loading || !data) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen ">
//       <Header/>
      
//       {/* Search and Hidden Selections Bar */}
//       <div className="h-10 bg-gray-50 border-b border-gray-200 px-6 flex items-center justify-between">
//         {/* Left side - Search */}
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             {/* Search icon in dotted rectangle */}
//             <button
//               onClick={toggleSearchInput}
//               className="flex items-center justify-center w-8 h-6 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors cursor-pointer"
//               style={{
//                 border: '1px dashed #9ca3af',
//                 borderStyle: 'dashed'
//               }}
//             >
//               <Search className="w-3 h-3 text-gray-500" />
//             </button>
//             {showSearchInput && (
//               <>
//                 <input
//                   type="text"
//                   placeholder="Search dashboard data..."
//                   value={searchQuery}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   className={`border-none outline-none bg-transparent text-gray-700 placeholder-gray-500 w-64 transition-colors ${
//                     isSearching ? 'text-blue-700' : ''
//                   }`}
//                   style={{
//                     borderBottom: searchQuery.length >= 2 ? '1px solid #3b82f6' : '1px dashed #d1d5db',
//                     paddingBottom: '2px'
//                   }}
//                   autoFocus
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={clearSearch}
//                     className="p-1 hover:bg-gray-100 rounded"
//                   >
//                     <X className="w-3 h-3 text-gray-400" />
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Center - Status (can be used for other status indicators later) */}
//         <div className="flex items-center gap-2">
//           {/* Future status indicators can go here */}
//         </div>

//         {/* Right side - Actions */}
//         <div className="flex items-center gap-4">
//           <Search className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
//           <Grid3X3 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
//           <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800">
//             <Bookmark className="w-4 h-4" />
//             <span>{t.bookmarks || 'Bookmarks'}</span>
//             <ChevronDown className="w-3 h-3" />
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800">
//             <Grid3X3 className="w-4 h-4" />
//             <span>{t.sheets || 'Sheets'}</span>
//             <ChevronDown className="w-3 h-3" />
//           </div>
//         </div>
//       </div>
      
//       <div id="dashboard-content" className="px-6 py-2">
//         {/* Title Bar */}
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-4">
//             <div className="w-6 h-6 bg-white rounded-lg shadow flex items-center justify-center">
//               <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-orange-400 rounded-full"></div>
//             </div>
//                         <h1 className="text-2xl font-semibold text-gray-800">
//               {language === 'ru' ? 'Показатели' : 'KPIs'} (2024-2025)
//             </h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="p-1 hover:bg-gray-100 rounded">
//               <HelpCircle className="w-5 h-5 text-gray-500" />
//             </button>
//             <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
//               <span>Про лист</span>
//             </button>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="mb-6">
//           <KPICards kpiData={data.kpiData} />
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-12 gap-6">
//           <div className="col-span-9">
//             <DataVisualization barDataByKPI={data.barDataByKPI} kpiData={data.kpiData} />
            
//           </div>
//           <div className="col-span-3">
//             <Sidebar/>
//           </div>
//         </div>
//         <Filters/>
//       </div>

//       {/* Search Modal */}
//       <SearchModal
//         isOpen={showSearchModal}
//         onClose={closeSearchModal}
//         searchQuery={searchQuery}
//         data={data}
//         language={language}
//       />
//     </div>
//   );
// };

// export default DashboardPage;











































// src/pages/Dashboard/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { HelpCircle, Search, X, Filter, Grid3X3, Bookmark, ChevronDown, Moon, Sun } from 'lucide-react';
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
  const { language, selectedYear, selectedMonth, isDarkMode, toggleDarkMode, initializeDarkMode } = useStore();
  const t = useTranslation(language);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Initialize dark mode on component mount
  useEffect(() => {
    initializeDarkMode();
  }, [initializeDarkMode]);

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

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center dark-transition">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 dark-transition">
      <Header/>
      
      {/* Search and Hidden Selections Bar */}
      <div className="h-10 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 flex items-center justify-between dark-transition">
        {/* Left side - Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 relative">
            {/* Search icon in dotted rectangle */}
            <button
              onClick={toggleSearchInput}
              className="flex items-center justify-center w-8 h-6 bg-gray-50 dark:bg-slate-700 rounded-sm hover:bg-gray-100 dark:hover:bg-slate-600 dark-transition cursor-pointer"
              style={{
                border: `1px dashed ${isDarkMode ? '#64748b' : '#9ca3af'}`,
                borderStyle: 'dashed'
              }}
            >
              <Search className="w-3 h-3 text-gray-500 dark:text-slate-400" />
            </button>
            {showSearchInput && (
              <>
                <input
                  type="text"
                  placeholder="Search dashboard data..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`absolute  border-none outline-none bg-transparent text-gray-700  dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-400 w-64 dark-transition ${
                    isSearching ? 'text-white dark:text-blue-300' : ''
                  }`}
                  style={{
                    borderBottom: searchQuery.length >= 2 
                      ? `1px solid ${isDarkMode ? '#60a5fa' : '#3b82f6'}` 
                      : `1px dashed ${isDarkMode ? '#475569' : '#d1d5db'}`,
                    paddingBottom: '2px'
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded dark-transition"
                  >
                    <X className="w-3 h-3 text-gray-400 dark:text-slate-500" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Center - Status (can be used for other status indicators later) */}
        <div className="flex items-center gap-2">
          {/* Future status indicators can go here */}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-600 rounded dark-transition"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:text-slate-800" />
            )}
          </button>
          <Search className="w-4 h-4 text-gray-600 dark:text-slate-300 cursor-pointer hover:text-gray-800 dark:hover:text-slate-100 dark-transition" />
          <Grid3X3 className="w-4 h-4 text-gray-600 dark:text-slate-300 cursor-pointer hover:text-gray-800 dark:hover:text-slate-100 dark-transition" />
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 cursor-pointer hover:text-gray-800 dark:hover:text-slate-100 dark-transition">
            <Bookmark className="w-4 h-4" />
            <span>{t.bookmarks || 'Bookmarks'}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="max-sm:hidden flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 cursor-pointer hover:text-gray-800 dark:hover:text-slate-100 dark-transition">
            <Grid3X3 className="w-4 h-4" />
            <span>{t.sheets || 'Sheets'}</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>
      
      <div id="dashboard-content" className="px-6 py-2 bg-white dark:bg-slate-900 dark-transition">
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-2 max-sm:hidden">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-slate-700/50 flex items-center justify-center border dark:border-slate-700 dark-transition">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-orange-400 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 dark-transition">
              {language === 'ru' ? 'Показатели' : 'KPIs'} (2024-2025)
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded dark-transition">
              <HelpCircle className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
            <button className="text-sm text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 flex items-center gap-1 dark-transition">
              <span>Про лист</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-6">
          <KPICards kpiData={data.kpiData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 sm:gap-2">
          <div className="lg:col-span-9 md:col-span-7  max-md:col-span-12">
            <DataVisualization barDataByKPI={data.barDataByKPI} kpiData={data.kpiData} />
          </div>
          <div className="lg:col-span-3 md:col-span-5 max-md:col-span-12">
            <Sidebar/>
          </div>
        </div>
        <Filters/>
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
