import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { Checkbox } from '../../../components/ui/Checkbox';

const KeyboardShortcuts = ({ settings, onSettingChange }) => {
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [newShortcut, setNewShortcut] = useState('');
  const [recordingKeys, setRecordingKeys] = useState(false);

  const shortcutCategories = [
    {
      id: 'general',
      name: 'General',
      icon: 'Keyboard',
      shortcuts: [
        { id: 'quick-add', name: 'Quick Add Task', default: 'Ctrl+N', current: settings?.shortcuts?.quickAdd || 'Ctrl+N', description: 'Open quick task creation dialog' },
        { id: 'search', name: 'Search Tasks', default: 'Ctrl+F', current: settings?.shortcuts?.search || 'Ctrl+F', description: 'Focus on search input' },
        { id: 'settings', name: 'Open Settings', default: 'Ctrl+,', current: settings?.shortcuts?.settings || 'Ctrl+,', description: 'Open settings panel' },
        { id: 'help', name: 'Show Help', default: 'F1', current: settings?.shortcuts?.help || 'F1', description: 'Display help documentation' }
      ]
    },
    {
      id: 'navigation',
      name: 'Navigation',
      icon: 'Navigation',
      shortcuts: [
        { id: 'dashboard', name: 'Go to Dashboard', default: 'Ctrl+1', current: settings?.shortcuts?.dashboard || 'Ctrl+1', description: 'Navigate to main dashboard' },
        { id: 'analytics', name: 'Go to Analytics', default: 'Ctrl+2', current: settings?.shortcuts?.analytics || 'Ctrl+2', description: 'Navigate to analytics page' },
        { id: 'filter', name: 'Go to Search/Filter', default: 'Ctrl+3', current: settings?.shortcuts?.filter || 'Ctrl+3', description: 'Navigate to search and filter page' },
        { id: 'next-tab', name: 'Next Tab', default: 'Ctrl+Tab', current: settings?.shortcuts?.nextTab || 'Ctrl+Tab', description: 'Switch to next tab' }
      ]
    },
    {
      id: 'tasks',
      name: 'Task Management',
      icon: 'CheckSquare',
      shortcuts: [
        { id: 'complete-task', name: 'Complete Selected Task', default: 'Space', current: settings?.shortcuts?.completeTask || 'Space', description: 'Mark selected task as complete' },
        { id: 'edit-task', name: 'Edit Selected Task', default: 'Enter', current: settings?.shortcuts?.editTask || 'Enter', description: 'Open task editor for selected task' },
        { id: 'delete-task', name: 'Delete Selected Task', default: 'Delete', current: settings?.shortcuts?.deleteTask || 'Delete', description: 'Delete the selected task' },
        { id: 'duplicate-task', name: 'Duplicate Task', default: 'Ctrl+D', current: settings?.shortcuts?.duplicateTask || 'Ctrl+D', description: 'Create a copy of selected task' }
      ]
    },
    {
      id: 'selection',
      name: 'Selection & Movement',
      icon: 'MousePointer',
      shortcuts: [
        { id: 'select-all', name: 'Select All Tasks', default: 'Ctrl+A', current: settings?.shortcuts?.selectAll || 'Ctrl+A', description: 'Select all visible tasks' },
        { id: 'move-up', name: 'Move Selection Up', default: 'ArrowUp', current: settings?.shortcuts?.moveUp || 'ArrowUp', description: 'Move selection to previous task' },
        { id: 'move-down', name: 'Move Selection Down', default: 'ArrowDown', current: settings?.shortcuts?.moveDown || 'ArrowDown', description: 'Move selection to next task' },
        { id: 'bulk-actions', name: 'Bulk Actions Menu', default: 'Ctrl+B', current: settings?.shortcuts?.bulkActions || 'Ctrl+B', description: 'Open bulk actions menu' }
      ]
    }
  ];

  const handleShortcutEdit = (categoryId, shortcutId) => {
    setEditingShortcut(`${categoryId}-${shortcutId}`);
    setNewShortcut('');
    setRecordingKeys(false);
  };

  const handleShortcutSave = (categoryId, shortcutId) => {
    if (newShortcut?.trim()) {
      const shortcutKey = shortcutCategories?.find(cat => cat?.id === categoryId)
        ?.shortcuts?.find(s => s?.id === shortcutId)?.id;
      
      if (shortcutKey) {
        onSettingChange(`shortcuts.${shortcutKey}`, newShortcut?.trim());
      }
    }
    setEditingShortcut(null);
    setNewShortcut('');
    setRecordingKeys(false);
  };

  const handleShortcutCancel = () => {
    setEditingShortcut(null);
    setNewShortcut('');
    setRecordingKeys(false);
  };

  const handleKeyRecord = (e) => {
    if (!recordingKeys) return;
    
    e?.preventDefault();
    e?.stopPropagation();
    
    const keys = [];
    if (e?.ctrlKey) keys?.push('Ctrl');
    if (e?.altKey) keys?.push('Alt');
    if (e?.shiftKey) keys?.push('Shift');
    if (e?.metaKey) keys?.push('Cmd');
    
    if (e?.key && !['Control', 'Alt', 'Shift', 'Meta']?.includes(e?.key)) {
      keys?.push(e?.key === ' ' ? 'Space' : e?.key);
    }
    
    if (keys?.length > 0) {
      setNewShortcut(keys?.join('+'));
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all keyboard shortcuts to their default values?')) {
      const defaultShortcuts = {};
      shortcutCategories?.forEach(category => {
        category?.shortcuts?.forEach(shortcut => {
          defaultShortcuts[shortcut.id] = shortcut?.default;
        });
      });
      onSettingChange('shortcuts', defaultShortcuts);
    }
  };

  const formatShortcut = (shortcut) => {
    return shortcut?.split('+')?.map(key => {
      const keyMap = {
        'Ctrl': '⌃',
        'Alt': '⌥',
        'Shift': '⇧',
        'Cmd': '⌘',
        'Space': '␣',
        'Enter': '↵',
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→'
      };
      return keyMap?.[key] || key;
    })?.join('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
              <Icon name="Keyboard" size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h3>
              <p className="text-sm text-muted-foreground">Customize shortcuts for faster navigation</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleResetToDefaults}
            iconName="RotateCcw"
            iconPosition="left"
            size="sm"
          >
            Reset to Defaults
          </Button>
        </div>

        <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-primary font-medium mb-1">How to customize shortcuts</p>
              <p className="text-muted-foreground">
                Click "Edit" next to any shortcut, then click "Record" and press your desired key combination.
                Use Ctrl, Alt, Shift, and Cmd as modifiers.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Shortcut Categories */}
      {shortcutCategories?.map((category) => (
        <div key={category?.id} className="glass rounded-xl p-6 hover-lift transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-secondary glass-light flex items-center justify-center">
              <Icon name={category?.icon} size={16} className="text-primary-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-foreground">{category?.name}</h4>
          </div>

          <div className="space-y-3">
            {category?.shortcuts?.map((shortcut) => {
              const isEditing = editingShortcut === `${category?.id}-${shortcut?.id}`;
              
              return (
                <div key={shortcut?.id} className="flex items-center justify-between p-4 glass-light rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h5 className="font-medium text-foreground">{shortcut?.name}</h5>
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <div
                            className={`
                              px-3 py-1 rounded-md border-2 border-dashed min-w-[80px] text-center text-sm font-mono
                              ${recordingKeys 
                                ? 'border-primary bg-primary/10 text-primary animate-pulse' :'border-border/50 bg-muted text-muted-foreground'
                              }
                            `}
                            onKeyDown={handleKeyRecord}
                            tabIndex={recordingKeys ? 0 : -1}
                          >
                            {newShortcut || (recordingKeys ? 'Press keys...' : 'Click Record')}
                          </div>
                          <Button
                            variant={recordingKeys ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setRecordingKeys(!recordingKeys)}
                            iconName={recordingKeys ? "Square" : "Circle"}
                          >
                            {recordingKeys ? 'Stop' : 'Record'}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono text-foreground border border-border/30">
                            {formatShortcut(shortcut?.current)}
                          </kbd>
                          {shortcut?.current !== shortcut?.default && (
                            <span className="text-xs text-primary">Modified</span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{shortcut?.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {isEditing ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleShortcutSave(category?.id, shortcut?.id)}
                          disabled={!newShortcut?.trim()}
                          iconName="Check"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShortcutCancel}
                          iconName="X"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShortcutEdit(category?.id, shortcut?.id)}
                        iconName="Edit"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* Advanced Options */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-error glass-light flex items-center justify-center">
            <Icon name="Settings2" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Advanced Options</h3>
            <p className="text-sm text-muted-foreground">Fine-tune keyboard behavior</p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Enable global shortcuts"
            description="Allow shortcuts to work when app is in background"
            checked={settings?.globalShortcuts}
            onChange={(e) => onSettingChange('globalShortcuts', e?.target?.checked)}
          />
          
          <Checkbox
            label="Show shortcut hints"
            description="Display keyboard shortcuts in tooltips and menus"
            checked={settings?.shortcutHints}
            onChange={(e) => onSettingChange('shortcutHints', e?.target?.checked)}
          />
          
          <Checkbox
            label="Vim-style navigation"
            description="Enable h/j/k/l keys for navigation (coming soon)"
            checked={settings?.vimNavigation}
            disabled
            onChange={(e) => onSettingChange('vimNavigation', e?.target?.checked)}
          />
          
          <Checkbox
            label="Prevent browser shortcuts"
            description="Override browser shortcuts when app is focused"
            checked={settings?.preventBrowserShortcuts}
            onChange={(e) => onSettingChange('preventBrowserShortcuts', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Quick Reference */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-accent glass-light flex items-center justify-center">
            <Icon name="BookOpen" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Quick Reference</h3>
            <p className="text-sm text-muted-foreground">Most commonly used shortcuts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Quick Add', shortcut: 'Ctrl+N' },
            { name: 'Search', shortcut: 'Ctrl+F' },
            { name: 'Complete Task', shortcut: 'Space' },
            { name: 'Edit Task', shortcut: 'Enter' },
            { name: 'Delete Task', shortcut: 'Delete' },
            { name: 'Select All', shortcut: 'Ctrl+A' }
          ]?.map((item) => (
            <div key={item?.name} className="flex items-center justify-between p-3 glass-light rounded-lg">
              <span className="text-sm font-medium text-foreground">{item?.name}</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono text-foreground border border-border/30">
                {formatShortcut(item?.shortcut)}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;