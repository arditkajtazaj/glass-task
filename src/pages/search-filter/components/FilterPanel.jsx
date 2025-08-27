import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  resultCount = 0,
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    dateRange: true,
    priority: true,
    category: true,
    status: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleDateRangeChange = (range) => {
    onFiltersChange({
      ...filters,
      dateRange: range
    });
  };

  const handlePriorityChange = (priority) => {
    const newPriorities = filters?.priorities?.includes(priority)
      ? filters?.priorities?.filter(p => p !== priority)
      : [...filters?.priorities, priority];
    
    onFiltersChange({
      ...filters,
      priorities: newPriorities
    });
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters?.categories?.includes(category)
      ? filters?.categories?.filter(c => c !== category)
      : [...filters?.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleStatusChange = (status) => {
    onFiltersChange({
      ...filters,
      status: filters?.status === status ? 'all' : status
    });
  };

  const dateRangeOptions = [
    { value: 'today', label: 'Today', icon: 'Calendar' },
    { value: 'tomorrow', label: 'Tomorrow', icon: 'CalendarDays' },
    { value: 'thisWeek', label: 'This Week', icon: 'CalendarRange' },
    { value: 'nextWeek', label: 'Next Week', icon: 'CalendarRange' },
    { value: 'overdue', label: 'Overdue', icon: 'AlertTriangle' },
    { value: 'noDate', label: 'No Due Date', icon: 'CalendarX' }
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent', color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { value: 'high', label: 'High', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { value: 'low', label: 'Low', color: 'text-green-400', bgColor: 'bg-green-500/10' }
  ];

  const categoryOptions = [
    { value: 'work', label: 'Work', icon: 'Briefcase', count: 12 },
    { value: 'personal', label: 'Personal', icon: 'User', count: 8 },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingCart', count: 5 },
    { value: 'health', label: 'Health', icon: 'Heart', count: 3 },
    { value: 'finance', label: 'Finance', icon: 'DollarSign', count: 4 },
    { value: 'learning', label: 'Learning', icon: 'BookOpen', count: 6 }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { value: 'inProgress', label: 'In Progress', icon: 'Play' }
  ];

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-foreground)' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 transition-colors duration-200"
        style={{ background: 'transparent', color: 'var(--color-foreground)' }}
      >
        <h3 className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{title}</h3>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="transition-transform duration-200"
          style={{ color: 'var(--color-muted-foreground)' }}
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-foreground)' }}>
          {children}
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="fixed top-32 left-4 z-40 flex items-center justify-center w-12 h-12 rounded-xl hover-lift press-scale transition-all duration-200"
        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--color-foreground)' }}
        aria-label="Expand filters"
      >
        <Icon name="SlidersHorizontal" size={20} style={{ color: 'var(--color-primary)' }} />
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-foreground)' }}>Filters</h2>
        <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)', opacity: 0.1 }}>
          {resultCount} results
        </span>
      </div>
        <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          iconName="X"
          iconSize={16}
          style={{ color: 'var(--color-foreground)' }}
        >
          Clear All
        </Button>
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-8 h-8 rounded-lg md:hidden"
          style={{ background: 'var(--glass-bg)', color: 'var(--color-foreground)' }}
          aria-label="Collapse filters"
        >
          <Icon name="X" size={16} style={{ color: 'var(--color-muted-foreground)' }} />
        </button>
        </div>
      </div>
      {/* Date Range Filter */}
      <FilterSection
        title="Due Date"
        isExpanded={expandedSections?.dateRange}
        onToggle={() => toggleSection('dateRange')}
      >
        <div className="grid grid-cols-2 gap-2 mt-3">
          {dateRangeOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => handleDateRangeChange(option?.value)}
              className="flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200"
              style={{
                border: filters?.dateRange === option?.value ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: filters?.dateRange === option?.value ? 'var(--color-primary)' : 'var(--glass-bg)',
                color: filters?.dateRange === option?.value ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                opacity: filters?.dateRange === option?.value ? 0.1 : 1
              }}
            >
              <Icon name={option?.icon} size={16} style={{ color: filters?.dateRange === option?.value ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }} />
              <span className="text-sm font-medium">{option?.label}</span>
            </button>
          ))}
        </div>
      </FilterSection>
      {/* Priority Filter */}
      <FilterSection
        title="Priority"
        isExpanded={expandedSections?.priority}
        onToggle={() => toggleSection('priority')}
      >
        <div className="space-y-2 mt-3">
          {priorityOptions?.map((option) => (
            <label
              key={option?.value}
              className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors duration-200"
              style={{ background: 'var(--glass-bg)' }}
            >
              <Checkbox
                checked={filters?.priorities?.includes(option?.value)}
                onChange={() => handlePriorityChange(option?.value)}
              />
              <div className="w-3 h-3 rounded-full" style={{ background: option?.bgColor?.includes('bg-') ? undefined : 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                <div className="w-full h-full rounded-full" style={{ background: option?.color?.includes('text-') ? undefined : 'var(--color-primary)' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{option?.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      {/* Category Filter */}
      <FilterSection
        title="Categories"
        isExpanded={expandedSections?.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2 mt-3">
          {categoryOptions?.map((option) => (
            <label
              key={option?.value}
              className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200"
              style={{ background: 'var(--glass-bg)' }}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={filters?.categories?.includes(option?.value)}
                  onChange={() => handleCategoryChange(option?.value)}
                />
                <Icon name={option?.icon} size={16} style={{ color: 'var(--color-muted-foreground)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{option?.label}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{option?.count}</span>
            </label>
          ))}
        </div>
      </FilterSection>
      {/* Status Filter */}
      <FilterSection
        title="Status"
        isExpanded={expandedSections?.status}
        onToggle={() => toggleSection('status')}
      >
        <div className="space-y-2 mt-3">
          {statusOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => handleStatusChange(option?.value)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200"
              style={{
                background: filters?.status === option?.value ? 'var(--color-primary)' : 'var(--glass-bg)',
                color: filters?.status === option?.value ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                border: filters?.status === option?.value ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                opacity: filters?.status === option?.value ? 0.1 : 1
              }}
            >
              <Icon name={option?.icon} size={16} style={{ color: filters?.status === option?.value ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }} />
              <span className="text-sm font-medium">{option?.label}</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterPanel;