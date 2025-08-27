import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadges = ({ achievements }) => {
  const getBadgeColor = (type) => {
    const colors = {
      gold: 'from-warning to-yellow-400',
      silver: 'from-slate-400 to-slate-300',
      bronze: 'from-orange-400 to-orange-300',
      diamond: 'from-cyan-400 to-blue-400'
    };
    return colors?.[type] || colors?.bronze;
  };

  const getBadgeIcon = (category) => {
    const icons = {
      streak: 'Flame',
      completion: 'CheckCircle',
      productivity: 'TrendingUp',
      consistency: 'Calendar',
      milestone: 'Trophy'
    };
    return icons?.[category] || 'Award';
  };

  return (
    <div className="glass rounded-xl p-6 stagger-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
        <Icon name="Award" size={24} className="text-warning" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements?.map((achievement, index) => (
          <div 
            key={index} 
            className={`
              relative p-4 rounded-lg glass-light hover-lift transition-all duration-300 cursor-pointer
              ${achievement?.unlocked ? 'opacity-100' : 'opacity-50'}
            `}
          >
            <div className={`
              flex items-center justify-center w-12 h-12 rounded-lg mb-3 mx-auto
              bg-gradient-to-br ${getBadgeColor(achievement?.type)}
            `}>
              <Icon 
                name={getBadgeIcon(achievement?.category)} 
                size={24} 
                className="text-white" 
              />
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium text-foreground mb-1">
                {achievement?.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {achievement?.description}
              </div>
            </div>
            
            {achievement?.unlocked && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={12} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;