// src/app/store/index.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const calculateActiveFiltersCount = (state) => {
  return [
    state.selectedMonth,
    state.procurementType,
    state.procurementStatus,
    state.selectedRegion,
    state.valueRange.min || state.valueRange.max
  ].filter(Boolean).length;
};

const useStore = create(
  devtools(
    (set, get) => ({
      // KPI Selection
      selectedKPI: 'numberOfLots',
      setSelectedKPI: (kpi) => set({ selectedKPI: kpi }, false, 'setSelectedKPI'),

      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }, false, 'setLanguage'),

      // Basic Filters
      selectedYear: '2025',
      selectedMonth: null,
      setSelectedYear: (year) => {
        const newState = { selectedYear: year };
        const currentState = get();
        newState.activeFiltersCount = calculateActiveFiltersCount({ ...currentState, ...newState });
        set(newState, false, 'setSelectedYear');
      },
      setSelectedMonth: (month) => {
        const newState = { selectedMonth: month };
        const currentState = get();
        newState.activeFiltersCount = calculateActiveFiltersCount({ ...currentState, ...newState });
        set(newState, false, 'setSelectedMonth');
      },

      // Advanced Filters
      procurementType: null,
      procurementStatus: null,
      selectedRegion: null,
      valueRange: { min: null, max: null },
      setProcurementType: (type) => {
        const newState = { procurementType: type };
        const currentState = get();
        newState.activeFiltersCount = calculateActiveFiltersCount({ ...currentState, ...newState });
        set(newState, false, 'setProcurementType');
      },
      setProcurementStatus: (status) => {
        const newState = { procurementStatus: status };
        const currentState = get();
        newState.activeFiltersCount = calculateActiveFiltersCount({ ...currentState, ...newState });
        set(newState, false, 'setProcurementStatus');
      },
      setSelectedRegion: (region) => {
        const newState = { selectedRegion: region };
        const currentState = get();
        newState.activeFiltersCount = calculateActiveFiltersCount({ ...currentState, ...newState });
        set(newState, false, 'setSelectedRegion');
      },
      setValueRange: (range) => {
        const newState = { valueRange: range };
        const currentState = get();
        newState.activeFiltersCount = calculateActiveFiltersCount({ ...currentState, ...newState });
        set(newState, false, 'setValueRange');
      },

      // Filter state management
      activeFiltersCount: 0,

      // Reset all filters
      resetFilters: () => {
        set({
          selectedYear: '2025',
          selectedMonth: null,
          procurementType: null,
          procurementStatus: null,
          selectedRegion: null,
          valueRange: { min: null, max: null },
          activeFiltersCount: 0
        }, false, 'resetFilters');
      },

      
      // Dark mode methods
      toggleDarkMode: () => {
        const newDarkMode = !get().isDarkMode;
        set({ isDarkMode: newDarkMode });
        
        // Apply dark mode class to document
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      setDarkMode: (isDark) => {
        set({ isDarkMode: isDark });
        
        // Apply dark mode class to document
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Initialize dark mode on store creation
      initializeDarkMode: () => {
        const { isDarkMode } = get();
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },

      // Data loading states
      isLoading: false,
      error: null,
      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),
    }),

    
    {
      name: 'procurement-store',
      partialize: (state) => ({ 
        language: state.language,
        selectedYear: state.selectedYear,
        selectedMonth: state.selectedMonth,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

// Individual selectors to prevent object creation and re-renders
export const useSelectedYear = () => useStore(state => state.selectedYear);
export const useSelectedMonth = () => useStore(state => state.selectedMonth);
export const useProcurementType = () => useStore(state => state.procurementType);
export const useProcurementStatus = () => useStore(state => state.procurementStatus);
export const useSelectedRegion = () => useStore(state => state.selectedRegion);
export const useActiveFiltersCount = () => useStore(state => state.activeFiltersCount);
export const useLanguage = () => useStore(state => state.language);
export const useValueRange = () => useStore(state => state.valueRange);

// Individual action selectors
export const useSetSelectedYear = () => useStore(state => state.setSelectedYear);
export const useSetSelectedMonth = () => useStore(state => state.setSelectedMonth);
export const useSetProcurementType = () => useStore(state => state.setProcurementType);
export const useSetProcurementStatus = () => useStore(state => state.setProcurementStatus);
export const useSetSelectedRegion = () => useStore(state => state.setSelectedRegion);
export const useSetValueRange = () => useStore(state => state.setValueRange);
export const useResetFilters = () => useStore(state => state.resetFilters);

export default useStore;




























// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// const useStore = create(
//   persist(
//     (set, get) => ({
//       language: 'en',
//       selectedYear: 2024,
//       selectedMonth: null,
//       isDarkMode: false,
      
//       // Language methods
//       setLanguage: (language) => set({ language }),
      
//       // Date methods
//       setSelectedYear: (year) => set({ selectedYear: year }),
//       setSelectedMonth: (month) => set({ selectedMonth: month }),
      
//       // Dark mode methods
//       toggleDarkMode: () => {
//         const newDarkMode = !get().isDarkMode;
//         set({ isDarkMode: newDarkMode });
        
//         // Apply dark mode class to document
//         if (newDarkMode) {
//           document.documentElement.classList.add('dark');
//         } else {
//           document.documentElement.classList.remove('dark');
//         }
//       },
      
//       setDarkMode: (isDark) => {
//         set({ isDarkMode: isDark });
        
//         // Apply dark mode class to document
//         if (isDark) {
//           document.documentElement.classList.add('dark');
//         } else {
//           document.documentElement.classList.remove('dark');
//         }
//       },
      
//       // Initialize dark mode on store creation
//       initializeDarkMode: () => {
//         const { isDarkMode } = get();
//         if (isDarkMode) {
//           document.documentElement.classList.add('dark');
//         }
//       },
      
//       // ...existing code...
//     }),
//     {
//       name: 'dashboard-storage',
//       partialize: (state) => ({ 
//         language: state.language,
//         selectedYear: state.selectedYear,
//         selectedMonth: state.selectedMonth,
//         isDarkMode: state.isDarkMode,
//       }),
//     }
//   )
// );

// export default useStore;