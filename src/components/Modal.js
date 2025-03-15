import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-5'
  };

  // Get the correct size class or default to md
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ zIndex: 9999 }}>
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
           onClick={onClose}
           aria-hidden="true"></div>
      
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`bg-white rounded-lg shadow-xl transform transition-all w-full ${sizeClass} relative pointer-events-auto animate-modal-appear`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900" id="modal-headline">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Fechar</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;