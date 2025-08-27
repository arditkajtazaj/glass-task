import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';

const ModalOverlay = ({ 
  isOpen = false, 
  onClose = () => {}, 
  title = "", 
  children, 
  size = "default", // "sm", "default", "lg", "xl", "full"
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = ""
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size configurations
  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4"
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event?.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;
      // Focus the modal
      setTimeout(() => {
        modalRef?.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousFocusRef?.current) {
      previousFocusRef?.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && event?.target === event?.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-1000 flex items-center justify-center p-4 modal-backdrop animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Mobile: Full screen on small devices */}
      <div className="md:hidden fixed inset-0 flex flex-col">
        <div 
          ref={modalRef}
          className={`flex-1 bg-white dark:bg-background rounded-t-2xl mt-16 animate-slide-in-up focus:outline-none ${className}`}
          tabIndex={-1}
        >
          {/* Mobile Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border/30 bg-white dark:bg-background">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-foreground dark:text-foreground">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-glass-light hover-lift press-scale focus-ring transition-all duration-200"
                  aria-label="Close modal"
                >
                  <Icon name="X" size={20} className="text-muted-foreground dark:text-muted-foreground" />
                </button>
              )}
            </div>
          )}
          
          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-background">
            <div className="p-6 text-foreground dark:text-foreground">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Centered modal */}
      <div className="hidden md:block w-full">
        <div 
          ref={modalRef}
          className={`
            relative w-full ${sizeClasses?.[size]} mx-auto bg-white dark:bg-background rounded-xl animate-scale-in focus:outline-none
            ${size === 'full' ? 'h-[90vh]' : 'max-h-[90vh]'} ${className}
          `}
          tabIndex={-1}
        >
          {/* Desktop Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border/30 bg-white dark:bg-background">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-foreground dark:text-foreground">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-glass-light hover-lift press-scale focus-ring transition-all duration-200"
                  aria-label="Close modal"
                >
                  <Icon name="X" size={20} className="text-muted-foreground dark:text-muted-foreground" />
                </button>
              )}
            </div>
          )}
          
          {/* Desktop Content */}
          <div className={`overflow-y-auto custom-scrollbar bg-white dark:bg-background ${size === 'full' ? 'h-full' : 'max-h-[calc(90vh-80px)]'}`}>
            <div className="p-6 text-foreground dark:text-foreground">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalOverlay;