
import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import UserMenu from './UserMenu';



const GlobalHeader = ({ 
  showBreadcrumbs = false, 
  breadcrumbs = [],
  onModalOpen,
  user = null,
  onLogout = () => {}
}) => {
  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 safe-top">
        <div className="glass border-b border-border/30">
          <div className="px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
                  <Icon name="CheckSquare" size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">GlassTask</h1>
                  {showBreadcrumbs && breadcrumbs?.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                      {breadcrumbs?.map((crumb, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <Icon name="ChevronRight" size={12} />}
                          {crumb?.onClick ? (
                            <button 
                              onClick={crumb?.onClick}
                              className="hover:text-primary transition-colors duration-200"
                            >
                              {crumb?.label}
                            </button>
                          ) : (
                            <span className="text-foreground font-medium">{crumb?.label}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onModalOpen?.('notifications')}
                  className="relative w-9 h-9 sm:w-10 sm:h-10"
                  iconName="Bell"
                  iconSize={18}
                />
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
                  <UserMenu user={user} onLogout={onLogout} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 safe-top">
        <div className="glass border-b border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 xl:h-18">
              <div className="flex items-center space-x-4 xl:space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
                    <Icon name="CheckSquare" size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl xl:text-2xl font-bold text-foreground">GlassTask</h1>
                    <p className="text-sm text-muted-foreground hidden xl:block">Task Management Made Beautiful</p>
                  </div>
                </div>

                {/* Breadcrumbs */}
                {showBreadcrumbs && breadcrumbs?.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground ml-6 xl:ml-8">
                    {breadcrumbs?.map((crumb, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Icon name="ChevronRight" size={14} className="mx-1" />}
                        {crumb?.onClick ? (
                          <button 
                            onClick={crumb?.onClick}
                            className="hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-muted/20"
                          >
                            {crumb?.label}
                          </button>
                        ) : (
                          <span className="text-foreground font-medium px-2 py-1">{crumb?.label}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 xl:space-x-4">
                {/* Search */}
                <div className="hidden xl:block">
                  <Input
                    type="search"
                    placeholder="Quick search..."
                    className="w-64 2xl:w-80"
                  />
                </div>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onModalOpen?.('notifications')}
                  className="relative w-10 h-10 xl:w-11 xl:h-11"
                  iconName="Bell"
                  iconSize={20}
                />

                {/* User Menu */}
                <div className="w-10 h-10 xl:w-11 xl:h-11 flex items-center justify-center">
                  <UserMenu user={user} onLogout={onLogout} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default GlobalHeader;