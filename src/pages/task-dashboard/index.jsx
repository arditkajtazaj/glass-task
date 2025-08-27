import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';

import TaskStats from './components/TaskStats';
import QuickAddTask from './components/QuickAddTask';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import DashboardCharts from './components/DashboardCharts';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const TaskDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    priority: 'all',
    category: 'all',
    status: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
    showOverdue: false,
    showToday: false
  });

  // Load tasks from localStorage or backend
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      let loadedTasks = [];
      try {
        // Try to load from localStorage first
        const localTasks = localStorage.getItem('tasks');
        if (localTasks) {
          loadedTasks = JSON.parse(localTasks);
        } else {
          // If not found, try to fetch from backend
          const token = localStorage.getItem('token');
          if (token) {
            const res = await fetch('/api/tasks', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              loadedTasks = Array.isArray(data.tasks) ? data.tasks : [];
            }
          }
        }
      } catch (err) {
        // Defensive: fallback to empty array
        loadedTasks = [];
      }
      setTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  // Calculate task statistics
  const taskStats = {
    total: tasks?.length,
    completed: tasks?.filter(task => task?.completed)?.length,
    pending: tasks?.filter(task => !task?.completed)?.length,
    overdue: tasks?.filter(task => {
      const today = new Date();
      return !task?.completed && task?.dueDate && new Date(task.dueDate) < today;
    })?.length,
    weeklyStreak: 5 // Mock streak data
  };

  // Task counts for filters
  const taskCounts = {
    total: tasks?.length,
    completed: tasks?.filter(task => task?.completed)?.length,
    pending: tasks?.filter(task => !task?.completed)?.length,
    overdue: tasks?.filter(task => {
      const today = new Date();
      return !task?.completed && task?.dueDate && new Date(task.dueDate) < today;
    })?.length
  };

  // Breadcrumbs configuration
  const breadcrumbs = [
    { label: 'Dashboard', onClick: () => navigate('/task-dashboard') },
    { label: 'Tasks', onClick: null }
  ];

  // Event handlers
  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
    // Show success celebration
    setTimeout(() => {
      document.querySelector('.glass')?.classList?.add('celebrate');
    }, 100);
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prevTasks =>
      prevTasks?.map(task =>
        task?.id === taskId ? { ...task, completed: !task?.completed } : task
      )
    );
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    navigate('/task-detail-edit', { state: { task } });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks?.filter(task => task?.id !== taskId));
  };

  const handleReorderTasks = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleModalOpen = (type) => {
    if (type === 'task-detail') {
      setIsQuickAddExpanded(true);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 'n':
            e?.preventDefault();
            setIsQuickAddExpanded(true);
            break;
          case 'f':
            e?.preventDefault();
            setIsFiltersOpen(true);
            break;
          case '/':
            e?.preventDefault();
            document.querySelector('input[type="search"]')?.focus();
            break;
        }
      }
      
      if (e?.key === 'Escape') {
        setIsQuickAddExpanded(false);
        setIsFiltersOpen(false);
        setIsTaskModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <button
        type="button"
        className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium"
        onClick={() => navigate(-1)}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10H5m0 0l5-5m-5 5l5 5"/></svg>
        Back
      </button>
      {/* Global Header */}
      <GlobalHeader
        showBreadcrumbs={true}
        breadcrumbs={breadcrumbs}
        onModalOpen={handleModalOpen}
        user={null} // Pass null or user object here
      />
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Main Content */}
      <main className="pt-32 md:pt-28 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <TaskFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              taskCounts={taskCounts}
              isOpen={isFiltersOpen}
              onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Task Statistics */}
              <TaskStats stats={taskStats} />

              {/* Charts Toggle */}
              <div className="mb-6">
                <Button
                  variant={showCharts ? "default" : "outline"}
                  onClick={() => setShowCharts(!showCharts)}
                  iconName={showCharts ? "BarChart3" : "TrendingUp"}
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  {showCharts ? 'Hide Charts' : 'Show Analytics Charts'}
                </Button>
              </div>

              {/* Dashboard Charts */}
              {showCharts && (
                <div className="mb-8">
                  <DashboardCharts tasks={tasks} />
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search tasks, descriptions, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="pl-12 w-full"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icon name="Search" size={20} className="text-muted-foreground" />
                  </div>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8"
                      iconName="X"
                      iconSize={16}
                    />
                  )}
                </div>
              </div>

              {/* Mobile Filters Button */}
              <div className="lg:hidden mb-6">
                <TaskFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  taskCounts={taskCounts}
                  isOpen={isFiltersOpen}
                  onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
                />
              </div>

              {/* Quick Add Task */}
              <QuickAddTask
                onAddTask={handleAddTask}
                isExpanded={isQuickAddExpanded}
                onToggleExpanded={() => setIsQuickAddExpanded(!isQuickAddExpanded)}
              />

              {/* Task List */}
              {Array.isArray(tasks) && tasks.length > 0 ? (
                <TaskList
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onReorderTasks={handleReorderTasks}
                  filters={filters}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                />
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-16">
                  <Icon name="Inbox" size={48} className="text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No tasks found</h2>
                  <p className="text-muted-foreground mb-4">Start by adding your first task!</p>
                  <Button variant="default" onClick={() => setIsQuickAddExpanded(true)}>
                    Add Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 hidden lg:block">
        <div className="glass rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-xs">Ctrl+N</kbd>
            <span>New task</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-xs">Ctrl+F</kbd>
            <span>Filters</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-xs">Ctrl+/</kbd>
            <span>Search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;