// // src/widgets/MenuModal/MenuModal.jsx
// import React, { memo } from 'react';
// import { 
//   Home, 
//   Download, 
//   Code, 
//   Tablet, 
//   HelpCircle 
// } from 'lucide-react';
// import { cn } from '../../shared/lib/utils';
// import Modal from '../../shared/ui/Modal';


// const menuItems = [
//   {
//     id: 'overview',
//     icon: Home,
//     label: 'App overview',
//     description: 'View application summary'
//   },
//   {
//     id: 'download-pdf',
//     icon: Download,
//     label: 'Download sheet as PDF',
//     description: 'Export current view to PDF'
//   },
//   {
//     id: 'embed',
//     icon: Code,
//     label: 'Embed sheet',
//     description: 'Get embed code for integration'
//   },
//   {
//     id: 'touch-mode',
//     icon: Tablet,
//     label: 'Touch screen mode',
//     description: 'Optimize for touch devices',
//     hasToggle: true
//   },
//   {
//     id: 'help',
//     icon: HelpCircle,
//     label: 'Help',
//     description: 'Get assistance and documentation'
//   }
// ];

// const MenuModal = memo(({ isOpen, onClose, onItemClick }) => {
//   const handleItemClick = (itemId) => {
//     onItemClick(itemId);
//     if (itemId !== 'download-pdf') {
//       onClose();
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       size="sm"
//       className="overflow-visible"
//       showCloseButton={false}
//     >
//       <div className="py-2">
//         {menuItems.map((item, index) => (
//           <div key={item.id}>
//             <button
//               onClick={() => handleItemClick(item.id)}
//               className={cn(
//                 "w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left",
//                 "focus:outline-none focus:bg-gray-50"
//               )}
//             >
//               <div className="flex-shrink-0">
//                 <item.icon className="w-5 h-5 text-gray-600" />
//               </div>
//               <div className="flex-1">
//                 <div className="text-sm font-medium text-gray-900">
//                   {item.label}
//                 </div>
//                 {item.description && (
//                   <div className="text-xs text-gray-500 mt-0.5">
//                     {item.description}
//                   </div>
//                 )}
//               </div>
//               {item.hasToggle && (
//                 <div className="flex-shrink-0">
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" />
//                     <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               )}
//             </button>
//             {index < menuItems.length - 1 && (
//               <div className="mx-4 border-t border-gray-100" />
//             )}
//           </div>
//         ))}
//       </div>
//     </Modal>
//   );
// });

// MenuModal.displayName = 'MenuModal';

// export default MenuModal;







































// src/widgets/MenuModal/MenuModal.jsx
// import React, { memo, useEffect, useRef } from 'react';
// import { 
//   Home, 
//   Download, 
//   Code, 
//   Tablet, 
//   HelpCircle 
// } from 'lucide-react';
// import useStore from '../../app/store';
// import { useTranslation } from '../../shared/lib/i18n/translations';
// import { cn } from '../../shared/lib/utils';

// const MenuModal = memo(({ isOpen, onClose, onItemClick, anchorRef }) => {
//   const menuRef = useRef(null);
//   const { language } = useStore();
//   const t = useTranslation(language);

//   // Create menu items with translations
//   const menuItems = [
//     {
//       id: 'overview',
//       icon: Home,
//       label: t.menuModal.appOverview,
//       description: t.menuModal.appOverviewDescription
//     },
//     {
//       id: 'download-pdf',
//       icon: Download,
//       label: t.menuModal.downloadPDF,
//       description: t.menuModal.downloadPDFDescription
//     },
//     {
//       id: 'embed',
//       icon: Code,
//       label: t.menuModal.embedSheet,
//       description: t.menuModal.embedSheetDescription
//     },
//     {
//       id: 'touch-mode',
//       icon: Tablet,
//       label: t.menuModal.touchScreenMode,
//       description: t.menuModal.touchScreenModeDescription,
//       hasToggle: true
//     },
//     {
//       id: 'help',
//       icon: HelpCircle,
//       label: t.menuModal.help,
//       description: t.menuModal.helpDescription
//     }
//   ];

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         menuRef.current && 
//         !menuRef.current.contains(event.target) &&
//         anchorRef?.current &&
//         !anchorRef.current.contains(event.target)
//       ) {
//         onClose();
//       }
//     };

//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.addEventListener('keydown', handleEscape);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, [isOpen, onClose, anchorRef]);

//   if (!isOpen) return null;

//   const handleItemClick = (itemId) => {
//     onItemClick(itemId);
//     if (itemId !== 'download-pdf') {
//       onClose();
//     }
//   };

//   return (
//     <>
//       {/* Invisible overlay for click outside detection */}
//       <div className="fixed inset-0 z-40" aria-hidden="true" />
      
//       {/* Dropdown Menu */}
//       <div
//         ref={menuRef}
//         className={cn(
//           "absolute left-0 top-12 z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-200",
//           "animate-slideDown origin-top-left"
//         )}
//         style={{ marginLeft: '16px' }}
//       >
//         <div className="py-2">
//           {menuItems.map((item, index) => (
//             <div key={item.id}>
//               <button
//                 onClick={() => handleItemClick(item.id)}
//                 className={cn(
//                   "w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left",
//                   "focus:outline-none focus:bg-gray-50"
//                 )}
//               >
//                 <div className="flex-shrink-0">
//                   <item.icon className="w-5 h-5 text-gray-600" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="text-sm font-medium text-gray-900">
//                     {item.label}
//                   </div>
//                   {item.description && (
//                     <div className="text-xs text-gray-500 mt-0.5">
//                       {item.description}
//                     </div>
//                   )}
//                 </div>
//                 {item.hasToggle && (
//                   <div className="flex-shrink-0">
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" />
//                       <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 )}
//               </button>
//               {index < menuItems.length - 1 && (
//                 <div className="mx-4 border-t border-gray-100" />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// });

// MenuModal.displayName = 'MenuModal';

// export default MenuModal;




































import React, { useEffect } from 'react';
import { Download, Eye, Share2, Smartphone, HelpCircle, X } from 'lucide-react';


const MenuModal = ({ isOpen, onClose, onItemClick, anchorRef }) => {
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (anchorRef?.current && !anchorRef.current.contains(event.target) && 
          !event.target.closest('.menu-modal')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const menuItems = [
    { id: 'download-pdf', icon: Download, label: 'Download as PDF', shortcut: 'Ctrl+P' },
    { id: 'overview', icon: Eye, label: 'App overview' },
    { id: 'embed', icon: Share2, label: 'Embed' },
    { id: 'touch-mode', icon: Smartphone, label: 'Touch mode' },
    { id: 'help', icon: HelpCircle, label: 'Help', shortcut: 'F1' },
  ];

  return (
    <div className="menu-modal absolute top-12 left-4 z-50 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg dark:shadow-slate-900/50 py-2 dark-transition">
      {menuItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => {
            onItemClick(item.id);
            onClose();
          }}
          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 dark-transition group"
        >
          <item.icon className="w-4 h-4 text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-200 dark-transition" />
          <span className="flex-1 text-sm">{item.label}</span>
          {item.shortcut && (
            <span className="text-xs text-gray-400 dark:text-slate-500 dark-transition">{item.shortcut}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default MenuModal;