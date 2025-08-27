import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import ModalOverlay from '../../components/ui/ModalOverlay';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import TaskResultCard from './components/TaskResultCard';
import SavedSearches from './components/SavedSearches';
import BulkActions from './components/BulkActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SearchFilterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    priorities: [],
    categories: [],
    status: 'all'
  });

  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showBulkSelection, setShowBulkSelection] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Recent searches and saved searches
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  // Task data
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Reset all search/filter state and fetch tasks from backend
    setSearchQuery('');
    setFilters({ dateRange: 'all', priorities: [], categories: [], status: 'all' });
    setSelectedTasks([]);
    setRecentSearches([]);
    setSavedSearches([]);
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setTasks(data || []));
  }, []);

  // Filter and search logic
  const filteredTasks = useMemo(() => {
    let results = [];

    // Apply search query
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      results = results?.filter(task =>
        task?.title?.toLowerCase()?.includes(query) ||
        task?.description?.toLowerCase()?.includes(query) ||
        task?.category?.toLowerCase()?.includes(query) ||
        task?.tags?.some(tag => tag?.toLowerCase()?.includes(query))
      );
    }

    // Apply filters
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow?.setDate(tomorrow?.getDate() + 1);
      const weekStart = new Date(today);
      weekStart?.setDate(today?.getDate() - today?.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd?.setDate(weekStart?.getDate() + 6);
      const nextWeekStart = new Date(weekEnd);
      nextWeekStart?.setDate(weekEnd?.getDate() + 1);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd?.setDate(nextWeekStart?.getDate() + 6);

      results = results?.filter(task => {
        if (!task?.dueDate && filters?.dateRange === 'noDate') return true;
        if (!task?.dueDate) return false;

        const dueDate = new Date(task.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        switch (filters?.dateRange) {
          case 'today':
            return dueDateOnly?.getTime() === today?.getTime();
          case 'tomorrow':
            return dueDateOnly?.getTime() === tomorrow?.getTime();
          case 'thisWeek':
            return dueDate >= weekStart && dueDate <= weekEnd;
          case 'nextWeek':
            return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
          case 'overdue':
            return dueDate < today;
          default:
            return true;
        }
      });
    }

    if (filters?.priorities?.length > 0) {
      results = results?.filter(task => filters?.priorities?.includes(task?.priority));
    }

    if (filters?.categories?.length > 0) {
      results = results?.filter(task => filters?.categories?.includes(task?.category));
    }

    if (filters?.status !== 'all') {
      switch (filters?.status) {
        case 'completed':
          results = results?.filter(task => task?.completed);
          break;
        case 'pending':
          results = results?.filter(task => !task?.completed);
          break;
        case 'inProgress':
          results = results?.filter(task => 
            !task?.completed && task?.subtasks && task?.subtasks?.some(st => st?.completed)
          );
          break;
      }
    }

    // Apply sorting
    results?.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a?.title?.toLowerCase();
          bValue = b?.title?.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder?.[a?.priority] || 0;
          bValue = priorityOrder?.[b?.priority] || 0;
          break;
        case 'category':
          aValue = a?.category?.toLowerCase();
          bValue = b?.category?.toLowerCase();
          break;
        case 'dueDate':
        default:
          aValue = a?.dueDate ? new Date(a.dueDate)?.getTime() : Infinity;
          bValue = b?.dueDate ? new Date(b.dueDate)?.getTime() : Infinity;
          break;
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });

    return results;
  }, [searchQuery, filters, sortBy, sortOrder]);

  // Handle search query change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    
    // Add to recent searches if it's a meaningful query
    if (query?.trim() && query?.length > 2 && !recentSearches?.includes(query)) {
      setRecentSearches(prev => [query, ...prev?.slice(0, 4)]);
    }
  };

  // Handle recent search click
  const handleRecentSearchClick = (search) => {
    setSearchQuery(search);
  };

  // Clear recent searches
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      dateRange: 'all',
      priorities: [],
      categories: [],
      status: 'all'
    });
    setSearchQuery('');
  };

  // Task actions
  const handleTaskClick = (task) => {
    navigate('/task-detail-edit', { state: { taskId: task?.id } });
  };

  const handleToggleComplete = (taskId) => {
    // In a real app, this would update the task in the backend
    console.log('Toggle complete for task:', taskId);
  };

  // Bulk selection
  const handleToggleSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev?.includes(taskId) 
        ? prev?.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkAction = (action, tasks = selectedTasks, data = {}) => {
    switch (action) {
      case 'selectAll':
        setSelectedTasks(filteredTasks?.map(task => task?.id));
        break;
      case 'complete':
        console.log('Bulk complete tasks:', tasks);
        setSelectedTasks([]);
        break;
      case 'delete':
        console.log('Bulk delete tasks:', tasks);
        setSelectedTasks([]);
        break;
      case 'changeCategory': console.log('Bulk change category:', tasks, data?.category);
        setSelectedTasks([]);
        break;
      case 'changePriority': console.log('Bulk change priority:', tasks, data?.priority);
        setSelectedTasks([]);
        break;
      case 'exportJSON':
        const jsonData = filteredTasks?.filter(task => tasks?.includes(task?.id));
        console.log('Export JSON:', jsonData);
        break;
      case 'exportCSV':
        console.log('Export CSV for tasks:', tasks);
        break;
      default:
        console.log('Bulk action:', action, tasks, data);
        setSelectedTasks([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
    setShowBulkSelection(false);
  };

  // Saved searches
  const handleSaveSearch = (searchData) => {
    setSavedSearches(prev => [searchData, ...prev]);
  };

  const handleLoadSearch = (search) => {
    setSearchQuery(search?.query);
    setFilters(search?.filters);
  };

  const handleDeleteSearch = (searchId) => {
    setSavedSearches(prev => prev?.filter(s => s?.id !== searchId));
  };

  // Sort options
  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
    { value: 'category', label: 'Category' }
  ];

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Dashboard', onClick: () => navigate('/task-dashboard') },
    { label: 'Search & Filter' }
  ];

  // Check if any filters are active
  const hasActiveFilters = 
    filters?.dateRange !== 'all' ||
    filters?.priorities?.length > 0 ||
    filters?.categories?.length > 0 ||
    filters?.status !== 'all' ||
    searchQuery?.trim() !== '';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      {/* Global Header */}
      <GlobalHeader 
        showBreadcrumbs={true}
        breadcrumbs={breadcrumbs}
        onModalOpen={(type) => {
          if (type === 'task-detail') {
            navigate('/task-detail-edit');
          }
        }}
      />
      {/* Tab Navigation */}
      <TabNavigation />
      {/* Main Content */}
      <main className="pt-32 md:pt-28 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ background: 'transparent' }}>
          {/* Back Button Above Main Heading */}
          <button
            type="button"
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium"
            onClick={() => window.history.back()}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10H5m0 0l5-5m-5 5l5 5"/></svg>
            Back
          </button>
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Search & Filter Tasks
                </h1>
                <p className="text-muted-foreground">
                  Find and organize your tasks with powerful search and filtering options
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkSelection(!showBulkSelection)}
                  iconName={showBulkSelection ? "X" : "CheckSquare"}
                  iconSize={16}
                >
                  {showBulkSelection ? 'Cancel' : 'Select'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  iconName="SlidersHorizontal"
                  iconSize={16}
                  className="lg:hidden"
                >
                  Filters
                </Button>
              </div>
            </div>
            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
              recentSearches={recentSearches}
              onRecentSearchClick={handleRecentSearchClick}
              onClearRecentSearches={handleClearRecentSearches}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-32 space-y-6" style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  resultCount={filteredTasks?.length}
                  isCollapsed={filtersCollapsed}
                  onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
                />
                
                <SavedSearches
                  savedSearches={savedSearches}
                  onLoadSearch={handleLoadSearch}
                  onSaveSearch={handleSaveSearch}
                  onDeleteSearch={handleDeleteSearch}
                  currentFilters={filters}
                  currentQuery={searchQuery}
                />
              </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-3" style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {filteredTasks?.length} Results
                  </h2>
                  
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      iconName="X"
                      iconSize={16}
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e?.target?.value)}
                    className="px-3 py-2 glass rounded-lg border border-border/30 bg-card/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {sortOptions?.map(option => (
                      <option key={option?.value} value={option?.value}>
                        {option?.label}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center justify-center w-10 h-10 glass rounded-lg border border-border/30 hover-lift press-scale transition-all duration-200"
                    aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    <Icon 
                      name={sortOrder === 'asc' ? "ArrowUp" : "ArrowDown"} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </button>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {searchQuery && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      <Icon name="Search" size={14} />
                      <span>"{searchQuery}"</span>
                      <button
                        onClick={handleClearSearch}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  )}
                  
                  {filters?.dateRange !== 'all' && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                      <Icon name="Calendar" size={14} />
                      <span>{filters?.dateRange?.replace(/([A-Z])/g, ' $1')?.toLowerCase()}</span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
                        className="hover:bg-accent/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  )}
                  
                  {filters?.priorities?.map(priority => (
                    <div key={priority} className="flex items-center space-x-2 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
                      <Icon name="Flag" size={14} />
                      <span>{priority}</span>
                      <button
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          priorities: prev?.priorities?.filter(p => p !== priority) 
                        }))}
                        className="hover:bg-warning/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {filters?.categories?.map(category => (
                    <div key={category} className="flex items-center space-x-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                      <Icon name="Tag" size={14} />
                      <span>{category}</span>
                      <button
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          categories: prev?.categories?.filter(c => c !== category) 
                        }))}
                        className="hover:bg-secondary/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Results Grid */}
              {filteredTasks?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTasks?.map((task) => (
                    <TaskResultCard
                      key={task?.id}
                      task={task}
                      onTaskClick={handleTaskClick}
                      onToggleComplete={handleToggleComplete}
                      onToggleSelect={handleToggleSelect}
                      isSelected={selectedTasks?.includes(task?.id)}
                      showSelection={showBulkSelection}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" style={{ background: 'var(--glass-bg)', borderRadius: '1rem', border: '1px solid var(--glass-border)', color: 'var(--color-foreground)' }}>
                  <Icon name="Search" size={48} style={{ color: 'var(--color-muted-foreground)', margin: '0 auto 1rem auto' }} />
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>No tasks found</h3>
                  <p className="mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
                    Try adjusting your search query or filters to find what you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    iconName="RotateCcw"
                    iconPosition="left"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile Filter Modal */}
      <ModalOverlay
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filters"
        size="full"
        className="lg:hidden"
      >
        <div className="space-y-6">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredTasks?.length}
            onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
          />
          
          <SavedSearches
            savedSearches={savedSearches}
            onLoadSearch={(search) => {
              handleLoadSearch(search);
              setShowFilters(false);
            }}
            onSaveSearch={handleSaveSearch}
            onDeleteSearch={handleDeleteSearch}
            currentFilters={filters}
            currentQuery={searchQuery}
          />
        </div>
      </ModalOverlay>
      {/* Bulk Actions */}
      <BulkActions
        selectedTasks={selectedTasks}
        onBulkAction={handleBulkAction}
        onClearSelection={handleClearSelection}
        totalTasks={filteredTasks?.length}
      />
    </div>
  );
};

export default SearchFilterPage;