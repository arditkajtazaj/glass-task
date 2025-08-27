import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskFilters = ({ 
  filters, 
  onFiltersChange, 
  taskCounts,
  isOpen, 
  onToggle 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health' },
    { value: 'learning', label: 'Learning' },
    { value: 'finance', label: 'Finance' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created', label: 'Date Created' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'category', label: 'Category' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      priority: 'all',
      category: 'all',
      status: 'all',
      sortBy: 'dueDate',
      sortOrder: 'asc',
      showOverdue: false,
      showToday: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters?.priority !== 'all') count++;
    if (localFilters?.category !== 'all') count++;
    if (localFilters?.status !== 'all') count++;
    if (localFilters?.showOverdue) count++;
    if (localFilters?.showToday) count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          iconName="RotateCcw"
          iconPosition="left"
          iconSize={16}
        >
          Reset
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Quick Filters</h4>
        <div className="space-y-2">
          <Checkbox
            label="Show overdue tasks only"
            checked={localFilters?.showOverdue}
            onChange={(e) => handleFilterChange('showOverdue', e?.target?.checked)}
          />
          <Checkbox
            label="Show today's tasks only"
            checked={localFilters?.showToday}
            onChange={(e) => handleFilterChange('showToday', e?.target?.checked)}
          />
        </div>
      </div>

      {/* Priority Filter */}
      <Select
        label="Priority Level"
        options={priorityOptions}
        value={localFilters?.priority}
        onChange={(value) => handleFilterChange('priority', value)}
      />

      {/* Category Filter */}
      <Select
        label="Category"
        options={categoryOptions}
        value={localFilters?.category}
        onChange={(value) => handleFilterChange('category', value)}
      />

      {/* Status Filter */}
      <Select
        label="Status"
        options={statusOptions}
        value={localFilters?.status}
        onChange={(value) => handleFilterChange('status', value)}
      />

      {/* Sort Options */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Sort By</h4>
        <Select
          options={sortOptions}
          value={localFilters?.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
        
        <div className="flex items-center space-x-2">
          <Button
            variant={localFilters?.sortOrder === 'asc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('sortOrder', 'asc')}
            iconName="ArrowUp"
            iconPosition="left"
            iconSize={16}
          >
            Ascending
          </Button>
          <Button
            variant={localFilters?.sortOrder === 'desc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('sortOrder', 'desc')}
            iconName="ArrowDown"
            iconPosition="left"
            iconSize={16}
          >
            Descending
          </Button>
        </div>
      </div>

      {/* Task Counts */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Task Overview</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-light rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{taskCounts?.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="glass-light rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-success">{taskCounts?.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="glass-light rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-warning">{taskCounts?.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="glass-light rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-error">{taskCounts?.overdue}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-32 glass rounded-xl p-6 h-fit max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Button
          onClick={onToggle}
          variant="outline"
          size="sm"
          iconName="Filter"
          iconPosition="left"
          iconSize={16}
          className="mb-4"
        >
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-1000 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 modal-backdrop"
            onClick={onToggle}
          />
          
          {/* Filter Panel */}
          <div className="relative ml-auto w-80 max-w-[85vw] glass h-full overflow-y-auto custom-scrollbar animate-slide-in-right">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  iconName="X"
                  iconSize={20}
                  className="w-8 h-8"
                />
              </div>
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskFilters;