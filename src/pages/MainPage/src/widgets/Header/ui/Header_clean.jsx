// src/widgets/Header/Header.jsx
import React, { useState, useCallback, useRef } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
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
