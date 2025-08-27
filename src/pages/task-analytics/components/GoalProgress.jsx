import React from 'react';
import Icon from '../../../components/AppIcon';

const GoalProgress = ({ goals }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 75) return 'bg-primary';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const getProgressIcon = (percentage) => {
    if (percentage >= 100) return 'Trophy';
    if (percentage >= 75) return 'Target';
    return 'Clock';
  };

  return (
    <div className="glass rounded-xl p-6 stagger-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Goal Progress</h3>
        <Icon name="Target" size={24} className="text-accent" />
      </div>
      <div className="space-y-4">
        {goals?.map((goal, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getProgressIcon(goal?.percentage)} 
                  size={20} 
                  className={goal?.percentage >= 100 ? 'text-success' : 'text-muted-foreground'} 
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{goal?.title}</div>
                  <div className="text-xs text-muted-foreground">{goal?.current} / {goal?.target} tasks</div>
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">{goal?.percentage}%</div>
            </div>
            
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(goal?.percentage)}`}
                style={{ width: `${Math.min(goal?.percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalProgress;