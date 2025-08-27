import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ 
  selectedTasks = [], 
  onBulkAction, 
  onClearSelection,
  totalTasks = 0 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkPriority, setBulkPriority] = useState('');

  const categoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'learning', label: 'Learning' }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleBulkAction = (action, data = {}) => {
    onBulkAction(action, selectedTasks, data);
    setShowActions(false);
    setBulkCategory('');
    setBulkPriority('');
  };

  const handleSelectAll = () => {
    onBulkAction('selectAll');
  };

  if (selectedTasks?.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 z-50">
        <div className="glass rounded-2xl border border-border/30 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={14} className="text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {selectedTasks?.length} of {totalTasks} selected
                </span>
              </div>
              
              {selectedTasks?.length < totalTasks && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  iconName="CheckSquare"
                  iconSize={16}
                >
                  Select All
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Quick Actions */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('complete')}
                iconName="CheckCircle"
                iconSize={16}
              >
                Complete
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                iconName="Trash2"
                iconSize={16}
              >
                Delete
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                iconName="MoreHorizontal"
                iconSize={16}
              >
                More
              </Button>

              <button
                onClick={onClearSelection}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted/20 transition-colors duration-200"
                aria-label="Clear selection"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Expanded Actions */}
          {showActions && (
            <div className="mt-4 pt-4 border-t border-border/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Change Category */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Change Category
                  </label>
                  <div className="flex space-x-2">
                    <Select
                      options={categoryOptions}
                      value={bulkCategory}
                      onChange={setBulkCategory}
                      placeholder="Select category"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('changeCategory', { category: bulkCategory })}
                      disabled={!bulkCategory}
                      iconName="Tag"
                      iconSize={16}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Change Priority */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Change Priority
                  </label>
                  <div className="flex space-x-2">
                    <Select
                      options={priorityOptions}
                      value={bulkPriority}
                      onChange={setBulkPriority}
                      placeholder="Select priority"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('changePriority', { priority: bulkPriority })}
                      disabled={!bulkPriority}
                      iconName="Flag"
                      iconSize={16}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Export Actions */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Export Selected
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('exportJSON')}
                      iconName="Download"
                      iconSize={16}
                      fullWidth
                    >
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction('exportCSV')}
                      iconName="FileText"
                      iconSize={16}
                      fullWidth
                    >
                      CSV
                    </Button>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction('duplicate')}
                  iconName="Copy"
                  iconSize={16}
                >
                  Duplicate
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction('archive')}
                  iconName="Archive"
                  iconSize={16}
                >
                  Archive
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction('addToProject')}
                  iconName="FolderPlus"
                  iconSize={16}
                >
                  Add to Project
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkAction('setReminder')}
                  iconName="Bell"
                  iconSize={16}
                >
                  Set Reminder
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Backdrop for mobile */}
      {showActions && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setShowActions(false)}
        />
      )}
    </>
  );
};

export default BulkActions;