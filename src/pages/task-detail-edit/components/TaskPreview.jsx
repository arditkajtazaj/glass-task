import React from 'react';
import Icon from '../../../components/AppIcon';

const TaskPreview = ({ task = null, className = "" }) => {
  if (!task || !task?.title) {
    return (
      <div className={`glass rounded-xl p-6 border border-border/30 ${className}`}>
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <div className="w-16 h-16 rounded-full glass-light flex items-center justify-center">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">Task Preview</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Start typing to see a preview of your task
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
      medium: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30',
      high: 'text-orange-400 bg-orange-400/20 border-orange-400/30',
      urgent: 'text-red-400 bg-red-400/20 border-red-400/30'
    };
    return colors?.[priority] || colors?.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      work: 'Briefcase',
      personal: 'User',
      health: 'Heart',
      learning: 'BookOpen',
      shopping: 'ShoppingCart',
      travel: 'Plane'
    };
    return icons?.[category] || 'Tag';
  };

  const formatDate = (dateStr, timeStr) => {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    
    let dateLabel = date?.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    if (date?.toDateString() === today?.toDateString()) {
      dateLabel = 'Today';
    } else if (date?.toDateString() === tomorrow?.toDateString()) {
      dateLabel = 'Tomorrow';
    }
    
    if (timeStr) {
      const time = new Date(`2000-01-01T${timeStr}`);
      const timeLabel = time?.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      return `${dateLabel} at ${timeLabel}`;
    }
    
    return dateLabel;
  };

  const isOverdue = () => {
    if (!task?.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    return dueDate < today && !task?.isCompleted;
  };

  return (
    <div className={`glass rounded-xl p-6 border border-border/30 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground mb-2 leading-tight">
            {task?.title}
          </h2>
          {task?.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {task?.description}
            </p>
          )}
        </div>
        
        {task?.isCompleted && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-success text-sm font-medium">Done</span>
          </div>
        )}
      </div>
      {/* Metadata */}
      <div className="space-y-4">
        {/* Priority and Category */}
        <div className="flex flex-wrap gap-3">
          {/* Priority */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${getPriorityColor(task?.priority)}`}>
            <Icon name="Flag" size={14} />
            <span className="text-sm font-medium capitalize">{task?.priority}</span>
          </div>
          
          {/* Category */}
          {task?.category && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full glass-light border border-border/30">
              <Icon name={getCategoryIcon(task?.category)} size={14} className="text-muted-foreground" />
              <span className="text-sm text-foreground capitalize">{task?.category}</span>
            </div>
          )}
        </div>

        {/* Due Date */}
        {task?.dueDate && (
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg glass-light border ${
            isOverdue() ? 'border-error/30 bg-error/10' : 'border-border/30'
          }`}>
            <Icon 
              name="Calendar" 
              size={16} 
              className={isOverdue() ? 'text-error' : 'text-muted-foreground'} 
            />
            <span className={`text-sm ${isOverdue() ? 'text-error font-medium' : 'text-foreground'}`}>
              Due: {formatDate(task?.dueDate, task?.dueTime)}
            </span>
            {isOverdue() && (
              <span className="text-xs text-error bg-error/20 px-2 py-0.5 rounded-full">
                Overdue
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {task?.tags && task?.tags?.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {task?.tags?.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full glass-light border border-border/30 text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recurring Info */}
        {task?.isRecurring && (
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg glass-light border border-border/30">
            <Icon name="Repeat" size={16} className="text-accent" />
            <span className="text-sm text-foreground">
              Repeats {task?.recurringType}
            </span>
          </div>
        )}

        {/* Notes */}
        {task?.notes && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Notes:</span>
            <div className="p-3 rounded-lg glass-light border border-border/30">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {task?.notes}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="pt-4 border-t border-border/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Created: {new Date(task.createdAt || Date.now())?.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          {task?.updatedAt && task?.updatedAt !== task?.createdAt && (
            <span>
              Updated: {new Date(task.updatedAt)?.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPreview;