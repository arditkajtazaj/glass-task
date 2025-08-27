import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/task-dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and quick actions'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/task-analytics',
      icon: 'BarChart3',
      description: 'Performance insights'
    },
    {
      id: 'search',
      label: 'Search',
      path: '/search-filter',
      icon: 'Search',
      description: 'Find and filter tasks'
    },
    {
      id: 'create',
      label: 'Create',
      path: '/task-detail-edit',
      icon: 'Plus',
      description: 'Add new tasks'
    },
    {
      id: 'finance',
      label: 'Budget Tracker',
      path: '/finance-tracker',
      icon: 'DollarSign',
      description: 'Track your budget and expenses'
    }
  ];

  const activeTabId = tabs?.find(tab => location?.pathname?.startsWith(tab?.path))?.id || 'dashboard';

  const handleTabClick = (tab) => {
    navigate(tab?.path);
  };

  return (
    <>
      {/* Mobile Tab Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="glass border-t border-border/30">
          <div className="grid grid-cols-5 px-2 py-2">
            {tabs?.map((tab) => {
              const isActive = activeTabId === tab?.id;
              return (
                <button
                  key={tab?.id}
                  onClick={() => handleTabClick(tab)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/10'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={20} className="mb-1" />
                  <span className="text-xs font-medium truncate max-w-full">
                    {tab?.label}
                  </span>
                  {isActive && (
                    <div className="absolute -top-px left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Tab Navigation */}
      <nav className="hidden lg:block fixed top-16 xl:top-18 left-0 right-0 z-40">
        <div className="glass border-b border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 xl:space-x-2 py-3">
              {tabs?.map((tab) => {
                const isActive = activeTabId === tab?.id;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabClick(tab)}
                    className={`
                      group relative flex items-center space-x-2 xl:space-x-3 px-4 xl:px-6 py-2 xl:py-3 rounded-lg transition-all duration-200 hover-lift press-scale
                      ${isActive 
                        ? 'text-primary bg-primary/10 shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                      }
                    `}
                  >
                    <Icon 
                      name={tab?.icon} 
                      size={18} 
                      className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} 
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm xl:text-base font-medium">
                        {tab?.label}
                      </span>
                      <span className="text-xs text-muted-foreground opacity-75 hidden xl:block">
                        {tab?.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default TabNavigation;