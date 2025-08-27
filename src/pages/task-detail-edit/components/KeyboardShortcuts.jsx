import React, { useEffect } from 'react';

const KeyboardShortcuts = ({ 
  onSave = () => {}, 
  onClose = () => {}, 
  onDelete = () => {},
  onToggleComplete = () => {},
  onDuplicate = () => {},
  isEnabled = true 
}) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement?.tagName === 'INPUT' || 
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.contentEditable === 'true'
      );

      // Cmd/Ctrl + S - Save
      if ((event?.metaKey || event?.ctrlKey) && event?.key === 's') {
        event?.preventDefault();
        onSave();
        return;
      }

      // Escape - Close
      if (event?.key === 'Escape') {
        event?.preventDefault();
        onClose();
        return;
      }

      // Don't trigger other shortcuts while typing
      if (isTyping) return;

      // Cmd/Ctrl + Enter - Toggle Complete
      if ((event?.metaKey || event?.ctrlKey) && event?.key === 'Enter') {
        event?.preventDefault();
        onToggleComplete();
        return;
      }

      // Cmd/Ctrl + D - Duplicate
      if ((event?.metaKey || event?.ctrlKey) && event?.key === 'd') {
        event?.preventDefault();
        onDuplicate();
        return;
      }

      // Cmd/Ctrl + Backspace - Delete
      if ((event?.metaKey || event?.ctrlKey) && event?.key === 'Backspace') {
        event?.preventDefault();
        onDelete();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, onSave, onClose, onDelete, onToggleComplete, onDuplicate]);

  return null; // This component doesn't render anything
};

export default KeyboardShortcuts;