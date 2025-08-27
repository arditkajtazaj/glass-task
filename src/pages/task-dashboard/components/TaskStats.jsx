import React from 'react';
import Icon from '../../../components/AppIcon';

const TaskStats = ({ stats }) => {
  const completionRate = stats?.total > 0 ? Math.round((stats?.completed / stats?.total) * 100) : 0;
  
  const getMotivationalMessage = () => {
    if (completionRate >= 90) return "Outstanding work! 🎉";
    if (completionRate >= 70) return "Great progress! 💪";
    if (completionRate >= 50) return "Keep it up! 📈";
    if (completionRate >= 25) return "You're getting there! 🚀";
    return "Let's get started! ✨";
  };

  const getProgressColor = () => {
    if (completionRate >= 80) return 'text-success';
    if (completionRate >= 60) return 'text-primary';
    if (completionRate >= 40) return 'text-warning';
    return 'text-error';
  };

  const statsCards = [
    {
      label: 'Total Tasks',
      value: stats?.total,
      icon: 'CheckSquare',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Completed',
      value: stats?.completed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'In Progress',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Overdue',
      value: stats?.overdue,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Progress Overview Card */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Today's Progress</h2>
          <div className={`text-2xl font-bold ${getProgressColor()}`}>
            {completionRate}%
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-muted/30 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              completionRate >= 80 ? 'bg-success' :
              completionRate >= 60 ? 'bg-primary' :
              completionRate >= 40 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${completionRate}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          {getMotivationalMessage()}
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards?.map((stat, index) => (
          <div 
            key={stat?.label}
            className={`glass rounded-xl p-4 hover-lift transition-all duration-200 stagger-fade-in ${stat?.bgColor}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
              <div className={`text-2xl font-bold ${stat?.color}`}>
                {stat?.value}
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {stat?.label}
            </p>
          </div>
        ))}
      </div>
      {/* Weekly Streak */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Flame" size={20} className="text-warning" />
            <span>Weekly Streak</span>
          </h3>
          <div className="text-lg font-bold text-warning">
            {stats?.weeklyStreak || 0} days
          </div>
        </div>
        
        {/* Streak Visualization */}
        <div className="flex items-center justify-between">
          {Array.from({ length: 7 }, (_, i) => {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const isActive = i < (stats?.weeklyStreak || 0);
            const isToday = i === new Date()?.getDay();
            
            return (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-warning text-warning-foreground' 
                    : 'bg-muted/30 text-muted-foreground'
                  }
                  ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                `}>
                  {isActive ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {dayNames?.[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskStats;