// // src/widgets/Header/Header.jsx
// import React from 'react';
// import { Menu, ChevronDown, Grid3X3, Bookmark, Search } from 'lucide-react';
// import useStore from '../../../app/store';
// import { useTranslation } from '../../../shared/lib/i1import React, { useState, useCallback } from 'react';
import { Menu, ChevronDown } from 'lucide-react';


// const Header = () => {
//   const { language } = useStore();
//   const t = useTranslation(language);

//   return (
//     <header className="bg-white border-b">
//       <div className="flex items-center h-12">
//         {/* Logo */}
//         <div className="px-4 flex items-center">
//           <span className="text-green-600 font-bold text-xl">Qlik</span>
//           <Menu className="ml-3 w-4 h-4 text-gray-600" />
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex flex-1">
//           <div className="px-6 py-3 border-r cursor-pointer hover:bg-gray-50 bg-gray-50 border-b-2 border-green-600">
//             <div className="text-sm font-medium">Analyze</div>
//             <div className="text-xs text-gray-600">Sheet</div>
//           </div>
//           <div className="px-6 py-3 border-r cursor-pointer hover:bg-gray-50">
//             <div className="text-sm font-medium">Narrate</div>
//             <div className="text-xs text-gray-600">Storytelling</div>
//           </div>
//         </div>

//         {/* Dropdown */}
//         <div className="px-4 flex-1">
//           <div className="flex items-center justify-between">
//             <select className="text-sm bg-transparent outline-none cursor-pointer">
//               <option>12. Етап закупівель (2024-2025) - Purchasing stage (2024...</option>
//             </select>
//             <ChevronDown className="w-4 h-4 text-gray-600" />
//           </div>
//         </div>

//         {/* Right Actions */}
//         <div className="flex items-center px-4 gap-4">
//           <Search className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
//           <Grid3X3 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Bookmark className="w-4 h-4" />
//             <span>{t.bookmarks}</span>
//             <ChevronDown className="w-3 h-3" />
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Grid3X3 className="w-4 h-4" />
//             <span>{t.sheets}</span>
//             <ChevronDown className="w-3 h-3" />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



























// src/widgets/Header/Header.jsx
// import React, { useState, useCallback } from 'react';
// import { Menu, ChevronDown, Grid3X3, Bookmark, Search } from 'lucide-react';
// import useStore from '../../../app/store';
// import { useTranslation } from '../../../shared/lib/i18n/translations';
// import { exportToPDF } from '../../../shared/lib/pdfExport';
// import MenuModal from '../../MenuModal/MenuModal';
// import PDFSettingsModal from '../../PDFSettingsModal/PDFSettingsModal';


// const Header = () => {
//   const { language } = useStore();
//   const t = useTranslation(language);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

//   const handleMenuClick = useCallback(() => {
//     setIsMenuOpen(true);
//   }, []);

//   const handleMenuItemClick = useCallback((itemId) => {
//     switch (itemId) {
//       case 'download-pdf':
//         setIsPDFModalOpen(true);
//         break;
//       case 'overview':
//         console.log('Opening app overview...');
//         break;
//       case 'embed':
//         console.log('Opening embed options...');
//         break;
//       case 'touch-mode':
//         console.log('Toggling touch mode...');
//         break;
//       case 'help':
//         console.log('Opening help...');
//         break;
//       default:
//         break;
//     }
//   }, []);

//   const handlePDFExport = useCallback(async (settings) => {
//     try {
//       await exportToPDF('dashboard-content', settings);
//     } catch (error) {
//       console.error('PDF export failed:', error);
//       // You could show an error toast here
//     }
//   }, []);

//   return (
//     <>
//       <header className="bg-white border-b">
//         <div className="flex items-center h-12">
//           {/* Logo */}
//           <div className="px-4 flex items-center">
//             <span className="text-green-600 font-bold text-xl">Qlik</span>
//             <button 
//               onClick={handleMenuClick}
//               className="ml-3 p-1 hover:bg-gray-100 rounded transition-colors"
//               aria-label="Open menu"
//             >
//               <Menu className="w-4 h-4 text-gray-600" />
//             </button>
//           </div>

//         {/* Navigation Tabs */}
//         <div className="flex flex-1">
//           <div className="px-6 py-3 border-r cursor-pointer hover:bg-gray-50 bg-gray-50 border-b-2 border-green-600">
//             <div className="text-sm font-medium">Analyze</div>
//             <div className="text-xs text-gray-600">Sheet</div>
//           </div>
//           <div className="px-6 py-3 border-r cursor-pointer hover:bg-gray-50">
//             <div className="text-sm font-medium">Narrate</div>
//             <div className="text-xs text-gray-600">Storytelling</div>
//           </div>
//         </div>

//         {/* Dropdown */}
//         <div className="px-4 flex-1">
//           <div className="flex items-center justify-between">
//             <select className="text-sm bg-transparent outline-none cursor-pointer">
//               <option>12. Етап закупівель (2024-2025) - Purchasing stage (2024...</option>
//             </select>
//             <ChevronDown className="w-4 h-4 text-gray-600" />
//           </div>
//         </div>

//         {/* Right Actions */}
//         <div className="flex items-center px-4 gap-4">
//           <Search className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
//           <Grid3X3 className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800" />
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Bookmark className="w-4 h-4" />
//             <span>{t.bookmarks}</span>
//             <ChevronDown className="w-3 h-3" />
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Grid3X3 className="w-4 h-4" />
//             <span>{t.sheets}</span>
//             <ChevronDown className="w-3 h-3" />
//           </div>
//         </div>
//       </div>
//     </header>

//       {/* Modals */}
//       <MenuModal 
//         isOpen={isMenuOpen}
//         onClose={() => setIsMenuOpen(false)}
//         onItemClick={handleMenuItemClick}
//       />
      
//       <PDFSettingsModal
//         isOpen={isPDFModalOpen}
//         onClose={() => setIsPDFModalOpen(false)}
//         onExport={handlePDFExport}
//       />
//     </>
//   );
// };

// export default Header;






































// src/widgets/Header/Header.jsx
import React, { useState, useCallback, useRef } from 'react';
import { Menu, ChevronDown, Grid3X3, Bookmark, Search } from 'lucide-react';
import useStore from '../../../app/store';
import MenuModal from '../../MenuModal/MenuModal';
import PDFSettingsModal from '../../PDFSettingsModal/PDFSettingsModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const handleMenuClick = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMenuItemClick = useCallback((itemId) => {
    switch (itemId) {
      case 'download-pdf':
        setIsPDFModalOpen(true);
        break;
      case 'overview':
        console.log('Opening app overview...');
        break;
      case 'embed':
        console.log('Opening embed options...');
        break;
      case 'touch-mode':
        console.log('Toggling touch mode...');
        break;
      case 'help':
        console.log('Opening help...');
        break;
      default:
        break;
    }
  }, []);

  return (
    <>
      <header className="bg-white border-b relative">
        <div className="flex items-center h-12">
          {/* Logo and Menu */}
          <div className="px-4 flex items-center">
            {/* <span className="text-green-600 font-bold text-xl">Qlik</span> */}
            <button 
              ref={menuButtonRef}
              onClick={handleMenuClick}
              className="ml-3 p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-1">
            <div className="px-6 py-3 border-r cursor-pointer hover:bg-gray-50 bg-gray-50 border-b-2 border-green-600">
              <div className="text-sm font-medium">Analyze</div>
              <div className="text-xs text-gray-600">Sheet</div>
            </div>
            <div className="px-6 py-3 border-r cursor-pointer hover:bg-gray-50">
              <div className="text-sm font-medium">Narrate</div>
              <div className="text-xs text-gray-600">Storytelling</div>
            </div>
          </div>

          {/* Dropdown */}
          {/* <div className="px-4 flex-1">
            <div className="flex items-center justify-between">
              <select className="text-sm bg-transparent outline-none cursor-pointer">
                <option>12. Етап закупівель (2024-2025) - Purchasing stage (2024...</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div> */}
        </div>

        {/* Menu Dropdown */}
        <MenuModal 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onItemClick={handleMenuItemClick}
          anchorRef={menuButtonRef}
        />
      </header>

      {/* PDF Settings Modal (centered) */}
      <PDFSettingsModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
      />
    </>
  );
};

export default Header;