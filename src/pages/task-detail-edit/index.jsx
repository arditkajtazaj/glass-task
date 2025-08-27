import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import ModalOverlay from '../../components/ui/ModalOverlay';
import TaskForm from './components/TaskForm';
import TaskPreview from './components/TaskPreview';
import CompletionCelebration from './components/CompletionCelebration';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import Icon from '../../components/AppIcon';

const TaskDetailEdit = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams?.get('id');
  
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewTask, setPreviewTask] = useState(null);

  // Mock task data
  const mockTasks = [
    {
      id: 1,
      title: "Complete quarterly report",
      description: "Finalize Q3 performance metrics and prepare presentation for stakeholders meeting next week.",
      dueDate: "2025-08-15",
      dueTime: "14:30",
      priority: "high",
      category: "work",
      tags: ["deadline", "presentation", "quarterly"],
      isRecurring: false,
      recurringType: "monthly",
      notes: "Include comparison with Q2 data and highlight key achievements. Don\'t forget to add the new client acquisition metrics.",
      isCompleted: false,
      createdAt: "2025-08-01T10:00:00.000Z",
      updatedAt: "2025-08-05T15:30:00.000Z"
    },
    {
      id: 2,
      title: "Morning workout routine",
      description: "30-minute cardio session followed by strength training focusing on upper body.",
      dueDate: "2025-08-09",
      dueTime: "07:00",
      priority: "medium",
      category: "health",
      tags: ["fitness", "routine", "morning"],
      isRecurring: true,
      recurringType: "daily",
      notes: "Remember to warm up properly and stay hydrated throughout the session.",
      isCompleted: false,
      createdAt: "2025-07-20T08:00:00.000Z",
      updatedAt: "2025-08-08T06:45:00.000Z"
    }
  ];

  // Breadcrumbs configuration
  const breadcrumbs = [
    {
      label: 'Dashboard',
      onClick: () => navigate('/task-dashboard')
    },
    {
      label: taskId ? 'Edit Task' : 'New Task'
    }
  ];

  // Load task data
  useEffect(() => {
    if (taskId) {
      const task = mockTasks?.find(t => t?.id === parseInt(taskId));
      setCurrentTask(task || null);
      setPreviewTask(task || null);
    } else {
      // New task
      const newTask = {
        id: null,
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        category: '',
        tags: [],
        isRecurring: false,
        recurringType: 'daily',
        notes: '',
        isCompleted: false,
        createdAt: new Date()?.toISOString(),
        updatedAt: new Date()?.toISOString()
      };
      setCurrentTask(newTask);
      setPreviewTask(newTask);
    }
  }, [taskId]);

  const handleSave = async (taskData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if task was just completed
      const wasCompleted = currentTask?.isCompleted;
      const isNowCompleted = taskData?.isCompleted;
      
      setCurrentTask(taskData);
      setPreviewTask(taskData);
      
      // Show celebration if task was just completed
      if (!wasCompleted && isNowCompleted) {
        setShowCelebration(true);
      }
      
      // Navigate back to dashboard after save (except for completion)
      if (!isNowCompleted) {
        setTimeout(() => {
          navigate('/task-dashboard');
        }, 500);
      }
      
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/task-dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDuplicate = () => {
    if (!currentTask) return;
    
    const duplicatedTask = {
      ...currentTask,
      id: null,
      title: `${currentTask?.title} (Copy)`,
      isCompleted: false,
      createdAt: new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString(),
      completedAt: null
    };
    
    setCurrentTask(duplicatedTask);
    setPreviewTask(duplicatedTask);
  };

  const handleClose = () => {
    navigate('/task-dashboard');
  };

  const handleToggleComplete = () => {
    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        isCompleted: !currentTask?.isCompleted,
        completedAt: !currentTask?.isCompleted ? new Date()?.toISOString() : null
      };
      handleSave(updatedTask);
    }
  };

  const handleFormChange = (taskData) => {
    setPreviewTask(taskData);
  };

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader 
          showBreadcrumbs={true}
          breadcrumbs={breadcrumbs}
        />
        <TabNavigation />
        
        <div className="pt-32 md:pt-28 pb-20 md:pb-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Loading task...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      />
      
      {/* Tab Navigation */}
      <TabNavigation />

      {/* Main Content */}
      <main className="pt-32 md:pt-28 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Single Column Layout */}
          <div className="lg:hidden">
            <div className="glass rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                  {taskId ? 'Edit Task' : 'Create New Task'}
                </h1>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-10 h-10 rounded-lg glass-light hover-lift press-scale focus-ring transition-all duration-200"
                  aria-label="Close"
                >
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>
              
              <TaskForm
                task={currentTask}
                onSave={handleSave}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                isLoading={isLoading}
                onChange={handleFormChange}
              />
            </div>
          </div>

          {/* Desktop: Two Column Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Left Column - Form */}
            <div className="glass rounded-xl p-6 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                  {taskId ? 'Edit Task' : 'Create New Task'}
                </h1>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-10 h-10 rounded-lg glass-light hover-lift press-scale focus-ring transition-all duration-200"
                  aria-label="Close"
                >
                  <Icon name="X" size={20} className="text-muted-foreground" />
                </button>
              </div>
              
              <TaskForm
                task={currentTask}
                onSave={handleSave}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                isLoading={isLoading}
                onChange={handleFormChange}
              />
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Icon name="Eye" size={20} className="text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Preview</h2>
              </div>
              
              <TaskPreview task={previewTask} />
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ModalOverlay
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Are you sure?
              </h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 px-4 py-2 glass-light rounded-lg border border-border/30 text-foreground hover-lift press-scale transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-error text-error-foreground rounded-lg hover-lift press-scale transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </ModalOverlay>

      {/* Completion Celebration */}
      <CompletionCelebration
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
        taskTitle={currentTask?.title}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onSave={() => handleSave(currentTask)}
        onClose={handleClose}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
        onDuplicate={handleDuplicate}
        isEnabled={true}
      />
    </div>
  );
};

export default TaskDetailEdit;