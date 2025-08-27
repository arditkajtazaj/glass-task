import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask, 
  onReorderTasks,
  filters,
  searchQuery = '',
  isLoading = false 
}) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Filter and sort tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(task => 
        task?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        task?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        task?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply priority filter
    if (filters?.priority !== 'all') {
      filtered = filtered?.filter(task => task?.priority === filters?.priority);
    }

    // Apply category filter
    if (filters?.category !== 'all') {
      filtered = filtered?.filter(task => task?.category === filters?.category);
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      if (filters?.status === 'completed') {
        filtered = filtered?.filter(task => task?.completed);
      } else if (filters?.status === 'pending') {
        filtered = filtered?.filter(task => !task?.completed);
      } else if (filters?.status === 'overdue') {
        const today = new Date();
        filtered = filtered?.filter(task => 
          !task?.completed && 
          task?.dueDate && 
          new Date(task.dueDate) < today
        );
      }
    }

    // Apply quick filters
    if (filters?.showOverdue) {
      const today = new Date();
      filtered = filtered?.filter(task => 
        !task?.completed && 
        task?.dueDate && 
        new Date(task.dueDate) < today
      );
    }

    if (filters?.showToday) {
      const today = new Date()?.toDateString();
      filtered = filtered?.filter(task => 
        task?.dueDate && 
        new Date(task.dueDate)?.toDateString() === today
      );
    }

    // Sort tasks
    filtered?.sort((a, b) => {
      const { sortBy, sortOrder } = filters;
      let comparison = 0;

      switch (sortBy) {
        case 'dueDate':
          const aDate = a?.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
          const bDate = b?.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
          comparison = aDate - bDate;
          break;
        case 'priority':
          const priorityOrder = { high: 4, medium: 3, normal: 2, low: 1 };
          comparison = (priorityOrder?.[b?.priority] || 0) - (priorityOrder?.[a?.priority] || 0);
          break;
        case 'created':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'alphabetical':
          comparison = a?.title?.localeCompare(b?.title);
          break;
        case 'category':
          comparison = (a?.category || '')?.localeCompare(b?.category || '');
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredTasks(filtered);
  }, [tasks, filters, searchQuery]);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e?.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    
    if (!draggedTask) return;

    const dragIndex = filteredTasks?.findIndex(task => task?.id === draggedTask?.id);
    if (dragIndex === dropIndex) return;

    const newTasks = [...filteredTasks];
    const [removed] = newTasks?.splice(dragIndex, 1);
    newTasks?.splice(dropIndex, 0, removed);

    onReorderTasks(newTasks);
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const getEmptyStateMessage = () => {
    if (searchQuery?.trim()) {
      return {
        icon: 'Search',
        title: 'No tasks found',
        description: `No tasks match "${searchQuery}". Try adjusting your search terms.`
      };
    }

    if (filters?.status === 'completed') {
      return {
        icon: 'CheckCircle',
        title: 'No completed tasks',
        description: 'Complete some tasks to see them here.'
      };
    }

    if (filters?.status === 'overdue') {
      return {
        icon: 'AlertTriangle',
        title: 'No overdue tasks',
        description: 'Great! You\'re staying on top of your deadlines.'
      };
    }

    if (filters?.showToday) {
      return {
        icon: 'Calendar',
        title: 'No tasks for today',
        description: 'Enjoy your free day or add some tasks to stay productive.'
      };
    }

    return {
      icon: 'CheckSquare',
      title: 'No tasks yet',
      description: 'Create your first task to get started with your productivity journey.'
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="glass rounded-xl p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-muted/30 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted/30 rounded w-3/4" />
                <div className="h-3 bg-muted/30 rounded w-1/2" />
                <div className="flex space-x-4">
                  <div className="h-3 bg-muted/30 rounded w-20" />
                  <div className="h-3 bg-muted/30 rounded w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredTasks?.length === 0) {
    const emptyState = getEmptyStateMessage();
    
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
          <Icon name={emptyState?.icon} size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {emptyState?.title}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {emptyState?.description}
        </p>
        {!searchQuery?.trim() && filters?.status === 'all' && (
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Create Your First Task
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Task Count Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="List" size={16} />
          <span>
            {filteredTasks?.length} task{filteredTasks?.length !== 1 ? 's' : ''}
            {searchQuery?.trim() && ` matching "${searchQuery}"`}
          </span>
        </div>
        
        {filteredTasks?.length > 1 && (
          <div className="text-xs text-muted-foreground">
            Drag to reorder
          </div>
        )}
      </div>
      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks?.map((task, index) => (
          <div
            key={task?.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              transition-all duration-200
              ${dragOverIndex === index ? 'transform translate-y-1' : ''}
            `}
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              isDragging={draggedTask?.id === task?.id}
            />
          </div>
        ))}
      </div>
      {/* Load More Button (for future pagination) */}
      {filteredTasks?.length >= 20 && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            iconName="ChevronDown"
            iconPosition="right"
          >
            Load More Tasks
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskList;