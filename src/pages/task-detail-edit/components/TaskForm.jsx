import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TaskForm = ({ 
  task = null, 
  onSave = () => {}, 
  onDelete = () => {}, 
  onDuplicate = () => {},
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
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
    isCompleted: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Priority options with gradient indicators
  const priorityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Can be done later' },
    { value: 'medium', label: 'Medium Priority', description: 'Normal importance' },
    { value: 'high', label: 'High Priority', description: 'Important task' },
    { value: 'urgent', label: 'Urgent', description: 'Needs immediate attention' }
  ];

  // Category options
  const categoryOptions = [
    { value: 'work', label: 'Work', description: 'Professional tasks' },
    { value: 'personal', label: 'Personal', description: 'Personal activities' },
    { value: 'health', label: 'Health & Fitness', description: 'Health related tasks' },
    { value: 'learning', label: 'Learning', description: 'Educational activities' },
    { value: 'shopping', label: 'Shopping', description: 'Purchase items' },
    { value: 'travel', label: 'Travel', description: 'Travel planning' }
  ];

  // Recurring type options
  const recurringOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day' },
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'monthly', label: 'Monthly', description: 'Every month' },
    { value: 'yearly', label: 'Yearly', description: 'Every year' }
  ];

  // Available tags
  const availableTags = [
    'urgent', 'meeting', 'deadline', 'review', 'planning', 'research', 
    'creative', 'admin', 'follow-up', 'presentation', 'documentation', 'bug-fix'
  ];

  // Initialize form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        dueDate: task?.dueDate || '',
        dueTime: task?.dueTime || '',
        priority: task?.priority || 'medium',
        category: task?.category || '',
        tags: task?.tags || [],
        isRecurring: task?.isRecurring || false,
        recurringType: task?.recurringType || 'daily',
        notes: task?.notes || '',
        isCompleted: task?.isCompleted || false
      });
    }
  }, [task]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData?.title?.trim()) {
        setAutoSaveStatus('saving');
        setTimeout(() => {
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus(''), 2000);
        }, 500);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev?.tags?.includes(tag) 
        ? prev?.tags?.filter(t => t !== tag)
        : [...prev?.tags, tag]
    }));
  };

  const handleSave = () => {
    if (!formData?.title?.trim()) return;
    
    const taskData = {
      ...formData,
      id: task?.id || Date.now(),
      updatedAt: new Date()?.toISOString(),
      createdAt: task?.createdAt || new Date()?.toISOString()
    };
    
    onSave(taskData);
  };

  const handleComplete = () => {
    const updatedTask = {
      ...formData,
      isCompleted: !formData?.isCompleted,
      completedAt: !formData?.isCompleted ? new Date()?.toISOString() : null
    };
    setFormData(updatedTask);
    onSave(updatedTask);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-blue-400',
      medium: 'text-yellow-400', 
      high: 'text-orange-400',
      urgent: 'text-red-400'
    };
    return colors?.[priority] || colors?.medium;
  };

  return (
    <div className="space-y-6">
      {/* Auto-save Status */}
      {autoSaveStatus && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground animate-fade-in">
          {autoSaveStatus === 'saving' && (
            <>
              <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <Icon name="Check" size={14} className="text-success" />
              <span className="text-success">Auto-saved</span>
            </>
          )}
        </div>
      )}
      {/* Task Title */}
      <div className="space-y-4">
        <Input
          label="Task Title"
          type="text"
          placeholder="What needs to be done?"
          value={formData?.title}
          onChange={(e) => handleInputChange('title', e?.target?.value)}
          required
          className="text-lg"
        />

        {/* Task Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            placeholder="Add more details about this task..."
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            rows={3}
            className="w-full px-4 py-3 glass rounded-lg border border-border/30 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>
      </div>
      {/* Due Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          value={formData?.dueDate}
          onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
        />
        <Input
          label="Due Time"
          type="time"
          value={formData?.dueTime}
          onChange={(e) => handleInputChange('dueTime', e?.target?.value)}
        />
      </div>
      {/* Priority and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          options={priorityOptions}
          value={formData?.priority}
          onChange={(value) => handleInputChange('priority', value)}
        />
        <Select
          label="Category"
          options={categoryOptions}
          value={formData?.category}
          onChange={(value) => handleInputChange('category', value)}
          placeholder="Select category"
        />
      </div>
      {/* Tags */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags?.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1.5 text-sm rounded-full glass-light border transition-all duration-200 hover-lift press-scale ${
                formData?.tags?.includes(tag)
                  ? 'border-primary bg-primary/20 text-primary' :'border-border/30 text-muted-foreground hover:text-foreground'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <Icon 
          name={showAdvanced ? "ChevronUp" : "ChevronDown"} 
          size={16} 
        />
        <span>Advanced Options</span>
      </button>
      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 animate-fade-in">
          {/* Recurring Task */}
          <div className="space-y-3">
            <Checkbox
              label="Recurring Task"
              description="This task repeats automatically"
              checked={formData?.isRecurring}
              onChange={(e) => handleInputChange('isRecurring', e?.target?.checked)}
            />
            
            {formData?.isRecurring && (
              <Select
                label="Repeat Frequency"
                options={recurringOptions}
                value={formData?.recurringType}
                onChange={(value) => handleInputChange('recurringType', value)}
                className="ml-6"
              />
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Notes
            </label>
            <textarea
              placeholder="Additional notes or context..."
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              rows={4}
              className="w-full px-4 py-3 glass rounded-lg border border-border/30 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/30">
        {/* Primary Actions */}
        <div className="flex flex-1 gap-3">
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            disabled={!formData?.title?.trim()}
            className="flex-1"
          >
            Save Task
          </Button>
          
          <Button
            variant={formData?.isCompleted ? "success" : "outline"}
            onClick={handleComplete}
            iconName={formData?.isCompleted ? "CheckCircle" : "Circle"}
            iconPosition="left"
            className="flex-1"
          >
            {formData?.isCompleted ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onDuplicate}
            iconName="Copy"
            size="default"
            disabled={!task}
          >
            Duplicate
          </Button>
          
          {task && (
            <Button
              variant="destructive"
              onClick={onDelete}
              iconName="Trash2"
              size="default"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      {/* Task Status Indicator */}
      {formData?.isCompleted && (
        <div className="flex items-center justify-center space-x-2 p-4 glass rounded-lg border border-success/30 bg-success/10 animate-fade-in">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <span className="text-success font-medium">Task Completed!</span>
        </div>
      )}
    </div>
  );
};

export default TaskForm;