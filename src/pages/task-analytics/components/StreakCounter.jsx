import React from 'react';
import Icon from '../../../components/AppIcon';

const StreakCounter = ({ currentStreak, longestStreak, streakData }) => {
  const getStreakColor = (day) => {
    if (day?.completed) return 'bg-success';
    if (day?.isToday) return 'bg-primary';
    return 'bg-muted/30';
  };

  return (
    <div className="glass rounded-xl p-6 stagger-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Streak Counter</h3>
        <Icon name="Flame" size={24} className="text-warning" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">{currentStreak}</div>
          <div className="text-sm text-muted-foreground">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary mb-1">{longestStreak}</div>
          <div className="text-sm text-muted-foreground">Longest Streak</div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-sm font-medium text-foreground">Last 7 Days</div>
        <div className="flex justify-between">
          {streakData?.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="text-xs text-muted-foreground">{day?.day}</div>
              <div className={`w-8 h-8 rounded-lg ${getStreakColor(day)} flex items-center justify-center transition-all duration-200`}>
                {day?.completed && (
                  <Icon name="Check" size={16} className="text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;