// // src/shared/ui/Modal.jsx
// import React, { useEffect, useRef, memo } from 'react';
// import { X } from 'lucide-react';
// import { cn } from '../lib/utils';


// const Modal = memo(({ 
//   isOpen, 
//   onClose, 
//   children, 
//   className, 
//   showCloseButton = true,
//   closeOnBackdrop = true,
//   size = 'md' 
// }) => {
//   const modalRef = useRef(null);

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, onClose]);

//   // Handle backdrop click
//   const handleBackdropClick = (e) => {
//     if (closeOnBackdrop && e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   const sizeClasses = {
//     sm: 'max-w-sm',
//     md: 'max-w-md',
//     lg: 'max-w-lg',
//     xl: 'max-w-xl',
//     full: 'max-w-full mx-4'
//   };

//   return (
//     <div 
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
//       onClick={handleBackdropClick}
//     >
//       <div 
//         ref={modalRef}
//         className={cn(
//           "relative bg-white rounded-lg shadow-xl w-full animate-slideIn",
//           sizeClasses[size],
//           className
//         )}
//       >
//         {showCloseButton && (
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
//             aria-label="Close modal"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         )}
//         {children}
//       </div>
//     </div>
//   );
// });

// Modal.displayName = 'Modal';

// export default Modal;




























// src/shared/ui/Modal.jsx
import React, { useEffect, useRef, memo } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
// import { cn } from '../lib/utils';

const Modal = memo(({ 
  isOpen, 
  onClose, 
  children, 
  className, 
  showCloseButton = true,
  closeOnBackdrop = true,
  size = 'md' 
}) => {
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div 
      className="fixed inset-0 z-5000 flex items-center justify-center bg-black/80 bg-opacity-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={cn(
          "relative bg-white rounded-lg shadow-xl w-full animate-slideIn",
          sizeClasses[size],
          className
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;