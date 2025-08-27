import React from 'react';
import Icon from '../../../components/AppIcon';


const TaskResultCard = ({ 
  task, 
  onTaskClick, 
  onToggleComplete, 
  onToggleSelect,
  isSelected = false,
  showSelection = false 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 bg-green-500/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return 'Briefcase';
      case 'personal': return 'User';
      case 'shopping': return 'ShoppingCart';
      case 'health': return 'Heart';
      case 'finance': return 'DollarSign';
      case 'learning': return 'BookOpen';
      default: return 'Tag';
    }
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    const now = new Date();
    const dueDate = new Date(date);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-400', urgent: true };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-400', urgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-400', urgent: false };
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: 'text-blue-400', urgent: false };
    return { text: dueDate?.toLocaleDateString(), color: 'text-muted-foreground', urgent: false };
  };

  const dueDateInfo = formatDueDate(task?.dueDate);

  return (
    <div 
      className={`glass rounded-xl border transition-all duration-200 hover-lift press-scale cursor-pointer ${
        isSelected 
          ? 'border-primary bg-primary/5' :'border-border/30 hover:border-border/50'
      } ${task?.completed ? 'opacity-60' : ''}`}
      onClick={() => onTaskClick(task)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            {showSelection && (
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onToggleSelect(task?.id);
                }}
                className="mt-1 flex items-center justify-center w-5 h-5 rounded border-2 border-border/50 hover:border-primary transition-colors duration-200"
              >
                {isSelected && (
                  <Icon name="Check" size={12} className="text-primary" />
                )}
              </button>
            )}
            
            <button
              onClick={(e) => {
                e?.stopPropagation();
                onToggleComplete(task?.id);
              }}
              className={`mt-1 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                task?.completed
                  ? 'bg-success border-success text-success-foreground'
                  : 'border-border/50 hover:border-success hover:bg-success/10'
              }`}
            >
              {task?.completed && <Icon name="Check" size={12} />}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-foreground mb-1 ${task?.completed ? 'line-through' : ''}`}>
                {task?.title}
              </h3>
              {task?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task?.description}
                </p>
              )}
            </div>
          </div>

          {/* Priority Badge */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
            {task?.priority}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            {/* Category */}
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name={getCategoryIcon(task?.category)} size={14} />
              <span className="capitalize">{task?.category}</span>
            </div>

            {/* Tags */}
            {task?.tags && task?.tags?.length > 0 && (
              <div className="flex items-center space-x-1">
                {task?.tags?.slice(0, 2)?.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-muted/20 text-muted-foreground rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {task?.tags?.length > 2 && (
                  <span className="text-muted-foreground">+{task?.tags?.length - 2}</span>
                )}
              </div>
            )}
          </div>

          {/* Due Date */}
          {dueDateInfo && (
            <div className={`flex items-center space-x-1 ${dueDateInfo?.color}`}>
              <Icon 
                name={dueDateInfo?.urgent ? "AlertCircle" : "Calendar"} 
                size={14} 
              />
              <span>{dueDateInfo?.text}</span>
            </div>
          )}
        </div>

        {/* Subtasks Progress */}
        {task?.subtasks && task?.subtasks?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Subtasks</span>
              <span>{task?.subtasks?.filter(st => st?.completed)?.length}/{task?.subtasks?.length}</span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(task?.subtasks?.filter(st => st?.completed)?.length / task?.subtasks?.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Attachments */}
        {task?.attachments && task?.attachments?.length > 0 && (
          <div className="mt-3 flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Paperclip" size={14} />
            <span>{task?.attachments?.length} attachment{task?.attachments?.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskResultCard;