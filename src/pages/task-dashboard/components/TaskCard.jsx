import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd,
  isDragging = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error bg-error/10';
      case 'medium': return 'border-l-warning bg-warning/10';
      case 'low': return 'border-l-success bg-success/10';
      default: return 'border-l-accent bg-accent/10';
    }
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    const today = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `${diffDays} days left`;
    
    return dueDate?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSwipeAction = (action) => {
    if (action === 'complete') {
      onToggleComplete(task?.id);
    } else if (action === 'delete') {
      onDelete(task?.id);
    }
  };

  return (
    <div
      className={`
        group relative glass rounded-xl border-l-4 ${getPriorityColor(task?.priority)}
        hover-lift press-scale transition-all duration-300 ease-out
        ${task?.completed ? 'opacity-60' : 'opacity-100'}
        ${isDragging ? 'rotate-2 scale-105 shadow-2xl' : ''}
        cursor-grab active:cursor-grabbing
      `}
      draggable
      onDragStart={() => onDragStart?.(task)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mobile Swipe Indicators */}
      <div className="md:hidden absolute inset-y-0 left-0 w-16 bg-success/20 rounded-l-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Icon name="Check" size={20} className="text-success" />
      </div>
      <div className="md:hidden absolute inset-y-0 right-0 w-16 bg-error/20 rounded-r-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Icon name="Trash2" size={20} className="text-error" />
      </div>
      <div className="relative p-4 md:p-5">
        <div className="flex items-start space-x-4">
          {/* Completion Checkbox */}
          <button
            onClick={() => onToggleComplete(task?.id)}
            className={`
              flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-200 ease-out
              ${task?.completed 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/10'
              }
              focus-ring press-scale
            `}
            aria-label={task?.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task?.completed && (
              <Icon name="Check" size={16} className="text-primary-foreground" />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 
                className={`
                  text-base font-medium transition-all duration-200
                  ${task?.completed 
                    ? 'text-muted-foreground line-through' 
                    : 'text-foreground group-hover:text-primary'
                  }
                `}
                onClick={() => onEdit(task)}
              >
                {task?.title}
              </h3>
              
              {/* Priority Indicator */}
              <div className={`
                flex-shrink-0 w-3 h-3 rounded-full ml-3
                ${task?.priority === 'high' ? 'bg-error' : ''}
                ${task?.priority === 'medium' ? 'bg-warning' : ''}
                ${task?.priority === 'low' ? 'bg-success' : ''}
                ${task?.priority === 'normal' ? 'bg-accent' : ''}
              `} />
            </div>

            {/* Task Description */}
            {task?.description && (
              <p className={`
                text-sm mb-3 transition-colors duration-200
                ${task?.completed ? 'text-muted-foreground' : 'text-muted-foreground'}
              `}>
                {task?.description?.length > 100 
                  ? `${task?.description?.substring(0, 100)}...` 
                  : task?.description
                }
              </p>
            )}

            {/* Task Meta Information */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {/* Due Date */}
                {task?.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span className={`
                      ${new Date(task.dueDate) < new Date() && !task?.completed 
                        ? 'text-error font-medium' :''
                      }
                    `}>
                      {formatDueDate(task?.dueDate)}
                    </span>
                  </div>
                )}

                {/* Category */}
                {task?.category && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Tag" size={14} />
                    <span>{task?.category}</span>
                  </div>
                )}

                {/* Attachments */}
                {task?.attachments && task?.attachments?.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Paperclip" size={14} />
                    <span>{task?.attachments?.length}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons - Desktop Only */}
              <div className={`
                hidden md:flex items-center space-x-2 transition-all duration-200
                ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
              `}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  className="w-8 h-8"
                  iconName="Edit2"
                  iconSize={14}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task?.id)}
                  className="w-8 h-8 text-error hover:text-error"
                  iconName="Trash2"
                  iconSize={14}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar for Subtasks */}
        {task?.subtasks && task?.subtasks?.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Subtasks</span>
              <span>
                {task?.subtasks?.filter(sub => sub?.completed)?.length} / {task?.subtasks?.length}
              </span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ 
                  width: `${(task?.subtasks?.filter(sub => sub?.completed)?.length / task?.subtasks?.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Drag Handle */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Icon name="GripVertical" size={16} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default TaskCard;