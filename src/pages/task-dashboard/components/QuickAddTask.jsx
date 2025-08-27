import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickAddTask = ({ onAddTask, isExpanded, onToggleExpanded }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Can be done later' },
    { value: 'normal', label: 'Normal Priority', description: 'Standard task' },
    { value: 'medium', label: 'Medium Priority', description: 'Important task' },
    { value: 'high', label: 'High Priority', description: 'Urgent task' }
  ];

  const categoryOptions = [
    { value: 'work', label: 'Work', description: 'Professional tasks' },
    { value: 'personal', label: 'Personal', description: 'Personal activities' },
    { value: 'shopping', label: 'Shopping', description: 'Items to buy' },
    { value: 'health', label: 'Health', description: 'Health & fitness' },
    { value: 'learning', label: 'Learning', description: 'Educational content' },
    { value: 'finance', label: 'Finance', description: 'Money matters' }
  ];

  // AI-like suggestions based on input
  const [suggestions, setSuggestions] = useState([]);
  const commonTasks = [
    "Review quarterly reports",
    "Schedule team meeting",
    "Update project documentation",
    "Call client about proposal",
    "Prepare presentation slides",
    "Buy groceries for the week",
    "Exercise for 30 minutes",
    "Read industry articles",
    "Plan weekend activities",
    "Organize workspace"
  ];

  useEffect(() => {
    if (taskTitle?.length > 2) {
      const filtered = commonTasks?.filter(task => 
        task?.toLowerCase()?.includes(taskTitle?.toLowerCase())
      )?.slice(0, 3);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [taskTitle]);

  useEffect(() => {
    if (isExpanded && inputRef?.current) {
      inputRef?.current?.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!taskTitle?.trim()) return;

    setIsLoading(true);
    
    const newTask = {
      id: Date.now()?.toString(),
      title: taskTitle?.trim(),
      description: taskDescription?.trim(),
      priority,
      category: category || 'personal',
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date()?.toISOString(),
      subtasks: [],
      attachments: []
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onAddTask(newTask);
    
    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setPriority('normal');
    setCategory('');
    setDueDate('');
    setSuggestions([]);
    setIsLoading(false);
    
    // Keep expanded for continuous adding
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setTaskTitle(suggestion);
    setSuggestions([]);
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') {
      onToggleExpanded();
    }
  };

  if (!isExpanded) {
    return (
      <div className="relative">
        {/* Floating Action Button */}
        <Button
          onClick={onToggleExpanded}
          className="fixed bottom-20 md:bottom-8 right-6 z-50 w-14 h-14 rounded-full shadow-2xl"
          variant="default"
          size="icon"
          iconName="Plus"
          iconSize={24}
        />
        
        {/* Quick Add Bar - Desktop */}
        <div className="hidden md:block glass rounded-xl p-4 mb-6">
          <button
            onClick={onToggleExpanded}
            className="w-full flex items-center space-x-3 text-left text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring rounded-lg p-3"
          >
            <Icon name="Plus" size={20} className="text-accent" />
            <span>Add a new task...</span>
            <div className="flex-1" />
            <kbd className="px-2 py-1 text-xs bg-muted/30 rounded">Ctrl+N</kbd>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 mb-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Plus" size={20} className="text-primary" />
          <span>Add New Task</span>
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleExpanded}
          iconName="X"
          iconSize={20}
          className="w-8 h-8"
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title with Suggestions */}
        <div className="relative">
          <Input
            ref={inputRef}
            label="Task Title"
            type="text"
            placeholder="What needs to be done?"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e?.target?.value)}
            onKeyDown={handleKeyDown}
            required
            className="mb-0"
          />
          
          {/* AI Suggestions */}
          {suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 glass rounded-lg border border-border/30 overflow-hidden">
              {suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-muted/20 transition-colors duration-200 text-sm text-foreground border-b border-border/20 last:border-b-0"
                >
                  <div className="flex items-center space-x-2">
                    <Icon name="Lightbulb" size={14} className="text-accent" />
                    <span>{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Task Description */}
        <Input
          label="Description (Optional)"
          type="text"
          placeholder="Add more details..."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e?.target?.value)}
        />

        {/* Priority and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
          />
          
          <Select
            label="Category"
            placeholder="Choose category"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            clearable
          />
        </div>

        {/* Due Date */}
        <Input
          label="Due Date (Optional)"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e?.target?.value)}
          min={new Date()?.toISOString()?.split('T')?.[0]}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onToggleExpanded}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            disabled={!taskTitle?.trim()}
            iconName="Plus"
            iconPosition="left"
          >
            Add Task
          </Button>
        </div>
      </form>
      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Keyboard shortcuts:</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-xs">Enter</kbd>
              <span>Save</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-xs">Esc</kbd>
              <span>Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddTask;