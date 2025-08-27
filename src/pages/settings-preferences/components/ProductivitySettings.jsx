import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductivitySettings = ({ settings, onSettingChange }) => {
  const [customTemplate, setCustomTemplate] = useState('');

  const notificationOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'important', label: 'Important Only' },
    { value: 'none', label: 'None' }
  ];

  const reminderTimeOptions = [
    { value: '5', label: '5 minutes before' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '1440', label: '1 day before' }
  ];

  const defaultPriorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const taskTemplates = [
    {
      id: 'meeting',
      name: 'Meeting Task',
      description: 'Prepare for meetings with agenda and notes',
      icon: 'Users',
      template: 'Meeting: [Topic]\n\nAgenda:\n- \n- \n- \n\nNotes:\n'
    },
    {
      id: 'project',
      name: 'Project Task',
      description: 'Structured project work with milestones',
      icon: 'FolderOpen',
      template: 'Project: [Name]\n\nObjective:\n\nMilestones:\n- [ ] \n- [ ] \n- [ ] \n\nDeadline:'
    },
    {
      id: 'personal',
      name: 'Personal Task',
      description: 'Simple personal reminders and todos',
      icon: 'User',
      template: 'Personal: [Task]\n\nDetails:\n\nPriority: Medium'
    },
    {
      id: 'shopping',
      name: 'Shopping List',
      description: 'Organized shopping with categories',
      icon: 'ShoppingCart',
      template: 'Shopping List\n\nGroceries:\n- [ ] \n- [ ] \n\nHousehold:\n- [ ] \n- [ ] '
    }
  ];

  const handleTemplateSelect = (templateId) => {
    const template = taskTemplates?.find(t => t?.id === templateId);
    onSettingChange('defaultTemplate', template?.template || '');
  };

  const handleCustomTemplateAdd = () => {
    if (customTemplate?.trim()) {
      onSettingChange('customTemplates', [...(settings?.customTemplates || []), {
        id: Date.now()?.toString(),
        name: 'Custom Template',
        template: customTemplate?.trim()
      }]);
      setCustomTemplate('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
            <Icon name="Bell" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Notification Level"
            options={notificationOptions}
            value={settings?.notifications}
            onChange={(value) => onSettingChange('notifications', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Desktop notifications"
              description="Show browser notifications"
              checked={settings?.desktopNotifications}
              onChange={(e) => onSettingChange('desktopNotifications', e?.target?.checked)}
            />
            
            <Checkbox
              label="Sound alerts"
              description="Play sound for notifications"
              checked={settings?.soundAlerts}
              onChange={(e) => onSettingChange('soundAlerts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Email reminders"
              description="Send email for overdue tasks"
              checked={settings?.emailReminders}
              onChange={(e) => onSettingChange('emailReminders', e?.target?.checked)}
            />
            
            <Checkbox
              label="Daily summary"
              description="Receive daily task summary"
              checked={settings?.dailySummary}
              onChange={(e) => onSettingChange('dailySummary', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Reminders */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary glass-light flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Reminders</h3>
            <p className="text-sm text-muted-foreground">Configure reminder timing and behavior</p>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Default Reminder Time"
            description="When to remind you about upcoming tasks"
            options={reminderTimeOptions}
            value={settings?.defaultReminderTime}
            onChange={(value) => onSettingChange('defaultReminderTime', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Smart reminders"
              description="AI-powered reminder timing"
              checked={settings?.smartReminders}
              onChange={(e) => onSettingChange('smartReminders', e?.target?.checked)}
            />
            
            <Checkbox
              label="Recurring reminders"
              description="Repeat reminders for overdue tasks"
              checked={settings?.recurringReminders}
              onChange={(e) => onSettingChange('recurringReminders', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Task Defaults */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent glass-light flex items-center justify-center">
            <Icon name="CheckSquare" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Task Defaults</h3>
            <p className="text-sm text-muted-foreground">Set default values for new tasks</p>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Default Priority"
            description="Priority level for new tasks"
            options={defaultPriorityOptions}
            value={settings?.defaultPriority}
            onChange={(value) => onSettingChange('defaultPriority', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Auto-assign due dates"
              description="Automatically set due dates based on priority"
              checked={settings?.autoAssignDueDates}
              onChange={(e) => onSettingChange('autoAssignDueDates', e?.target?.checked)}
            />
            
            <Checkbox
              label="Enable task categories"
              description="Show category selection for new tasks"
              checked={settings?.enableCategories}
              onChange={(e) => onSettingChange('enableCategories', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Task Templates */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-error glass-light flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Task Templates</h3>
            <p className="text-sm text-muted-foreground">Pre-defined templates for common tasks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskTemplates?.map((template) => (
              <button
                key={template?.id}
                onClick={() => handleTemplateSelect(template?.id)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200 hover-lift press-scale
                  ${settings?.selectedTemplate === template?.id 
                    ? 'border-primary bg-primary/10' :'border-border/30 glass-light hover:border-primary/50'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Icon name={template?.icon} size={16} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm">{template?.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template?.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Template */}
          <div className="border-t border-border/30 pt-4">
            <h4 className="font-medium text-foreground mb-3">Create Custom Template</h4>
            <div className="space-y-3">
              <Input
                label="Template Content"
                type="text"
                placeholder="Enter your custom template..."
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e?.target?.value)}
                description="Use [placeholders] for dynamic content"
              />
              <Button
                variant="outline"
                onClick={handleCustomTemplateAdd}
                disabled={!customTemplate?.trim()}
                iconName="Plus"
                iconPosition="left"
              >
                Add Template
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success to-accent glass-light flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">Enable productivity shortcuts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Quick add with Enter"
            description="Press Enter to quickly add tasks"
            checked={settings?.quickAddEnter}
            onChange={(e) => onSettingChange('quickAddEnter', e?.target?.checked)}
          />
          
          <Checkbox
            label="Bulk operations"
            description="Enable multi-select for bulk actions"
            checked={settings?.bulkOperations}
            onChange={(e) => onSettingChange('bulkOperations', e?.target?.checked)}
          />
          
          <Checkbox
            label="Drag & drop reorder"
            description="Reorder tasks by dragging"
            checked={settings?.dragDropReorder}
            onChange={(e) => onSettingChange('dragDropReorder', e?.target?.checked)}
          />
          
          <Checkbox
            label="Auto-complete suggestions"
            description="Show suggestions while typing"
            checked={settings?.autoComplete}
            onChange={(e) => onSettingChange('autoComplete', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductivitySettings;