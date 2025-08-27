import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import ModalOverlay from '../../components/ui/ModalOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';

// Import all setting components
import AppearanceSettings from './components/AppearanceSettings';
import ProductivitySettings from './components/ProductivitySettings';
import DataManagement from './components/DataManagement';
import AccountSettings from './components/AccountSettings';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import HelpSupport from './components/HelpSupport';

const SettingsPreferences = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const { theme, colorScheme, glassIntensity, updateTheme, updateColorScheme, updateGlassIntensity } = useTheme();

  const [settings, setSettings] = useState({
    // Appearance settings
    theme: theme,
    colorScheme: colorScheme,
    glassIntensity: glassIntensity,
    reduceMotion: false,
    highContrast: false,
    visualEffects: true,
    
    // Productivity settings
    notifications: 'all',
    desktopNotifications: true,
    soundAlerts: true,
    emailReminders: false,
    dailySummary: true,
    defaultReminderTime: '15',
    smartReminders: true,
    recurringReminders: false,
    defaultPriority: 'medium',
    autoAssignDueDates: false,
    enableCategories: true,
    selectedTemplate: 'personal',
    customTemplates: [],
    quickAddEnter: true,
    bulkOperations: true,
    dragDropReorder: true,
    autoComplete: true,
    
    // Data management settings
    autoBackup: true,
    cloudSync: false,
    backupRetention: 30,
    
    // Account settings
    analytics: true,
    crashReports: true,
    marketing: false,
    dataSharing: false,
    
    // Keyboard shortcuts
    shortcuts: {
      quickAdd: 'Ctrl+N',
      search: 'Ctrl+F',
      settings: 'Ctrl+,',
      help: 'F1',
      dashboard: 'Ctrl+1',
      analytics: 'Ctrl+2',
      filter: 'Ctrl+3',
      nextTab: 'Ctrl+Tab',
      completeTask: 'Space',
      editTask: 'Enter',
      deleteTask: 'Delete',
      duplicateTask: 'Ctrl+D',
      selectAll: 'Ctrl+A',
      moveUp: 'ArrowUp',
      moveDown: 'ArrowDown',
      bulkActions: 'Ctrl+B'
    },
    globalShortcuts: false,
    shortcutHints: true,
    vimNavigation: false,
    preventBrowserShortcuts: true
  });

  const settingSections = [
    {
      id: 'appearance',
      name: 'Appearance',
      icon: 'Palette',
      description: 'Theme, colors, and visual effects',
      component: AppearanceSettings
    },
    {
      id: 'productivity',
      name: 'Productivity',
      icon: 'Zap',
      description: 'Notifications, reminders, and templates',
      component: ProductivitySettings
    },
    {
      id: 'data',
      name: 'Data Management',
      icon: 'Database',
      description: 'Export, import, and backup options',
      component: DataManagement
    },
    {
      id: 'account',
      name: 'Account',
      icon: 'User',
      description: 'Profile, security, and privacy',
      component: AccountSettings
    },
    {
      id: 'shortcuts',
      name: 'Keyboard Shortcuts',
      icon: 'Keyboard',
      description: 'Customize keyboard navigation',
      component: KeyboardShortcuts
    },
    {
      id: 'help',
      name: 'Help & Support',
      icon: 'HelpCircle',
      description: 'Documentation and contact support',
      component: HelpSupport
    }
  ];

  // Update settings effect to sync with theme hook
  useEffect(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      theme: theme,
      colorScheme: colorScheme,
      glassIntensity: glassIntensity
    }));
  }, [theme, colorScheme, glassIntensity]);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('glasstask-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('glasstask-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (key, value) => {
    // Handle theme-related settings with theme hook
    if (key === 'theme') {
      updateTheme(value);
      return;
    }
    if (key === 'colorScheme') {
      updateColorScheme(value);
      return;
    }
    if (key === 'glassIntensity') {
      updateGlassIntensity(value);
      return;
    }
    
    setSettings(prevSettings => {
      // Handle nested settings (e.g., 'shortcuts.quickAdd')
      if (key?.includes('.')) {
        const [parentKey, childKey] = key?.split('.');
        return {
          ...prevSettings,
          [parentKey]: {
            ...prevSettings?.[parentKey],
            [childKey]: value
          }
        };
      }
      
      return {
        ...prevSettings,
        [key]: value
      };
    });
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const breadcrumbs = [
    { label: 'Settings', onClick: () => setActiveSection('appearance') },
    { label: settingSections?.find(s => s?.id === activeSection)?.name || 'Settings' }
  ];

  const ActiveComponent = settingSections?.find(s => s?.id === activeSection)?.component || AppearanceSettings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Global Header */}
      <GlobalHeader
        showBreadcrumbs={true}
        breadcrumbs={breadcrumbs}
        onModalOpen={handleModalOpen}
      />
      {/* Tab Navigation */}
      <TabNavigation />
      {/* Main Content */}
      <main className="pt-32 md:pt-28 pb-20 md:pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden xl:block w-80 2xl:w-96 flex-shrink-0">
            <div className="glass rounded-xl p-6 sticky top-32">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
                  <Icon name="Settings" size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Settings</h1>
                  <p className="text-sm text-muted-foreground">Customize your experience</p>
                </div>
              </div>

              <nav className="space-y-2">
                {settingSections?.map((section) => (
                  <button
                    key={section?.id}
                    onClick={() => setActiveSection(section?.id)}
                    className={`
                      w-full flex items-start space-x-3 p-4 rounded-lg text-left transition-all duration-200 hover-lift press-scale
                      ${activeSection === section?.id 
                        ? 'bg-primary/20 border-2 border-primary/30 text-primary' :'glass-light hover:bg-muted/20 text-foreground hover:text-primary border-2 border-transparent'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200
                      ${activeSection === section?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gradient-to-br from-accent to-secondary text-primary-foreground'
                      }
                    `}>
                      <Icon name={section?.icon} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{section?.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {section?.description}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleModalOpen('export-settings')}
                    iconName="Download"
                    iconPosition="left"
                    fullWidth
                  >
                    Export Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Reset all settings to default values?')) {
                        setSettings({
                          theme: 'dark',
                          colorScheme: 'indigo',
                          glassIntensity: 60,
                          notifications: 'all',
                          shortcuts: {}
                        });
                      }
                    }}
                    iconName="RotateCcw"
                    iconPosition="left"
                    fullWidth
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Section Selector */}
          <div className="xl:hidden mb-6">
            <div className="glass rounded-xl p-4">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e?.target?.value)}
                className="w-full bg-transparent text-foreground font-medium focus:outline-none"
              >
                {settingSections?.map((section) => (
                  <option key={section?.id} value={section?.id} className="bg-background">
                    {section?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-6">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
                    <Icon 
                      name={settingSections?.find(s => s?.id === activeSection)?.icon || 'Settings'} 
                      size={20} 
                      className="text-primary-foreground" 
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {settingSections?.find(s => s?.id === activeSection)?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {settingSections?.find(s => s?.id === activeSection)?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Content */}
            <ActiveComponent
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </div>
        </div>
      </main>
      {/* Modal for additional actions */}
      <ModalOverlay
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalType === 'export-settings' ? 'Export Settings' : 'Settings'}
        size="default"
      >
        {modalType === 'export-settings' && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Export your current settings configuration to backup or share with other devices.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <pre className="text-sm text-foreground font-mono overflow-auto max-h-40">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={() => {
                  const dataStr = JSON.stringify(settings, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `glasstask-settings-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
                  link?.click();
                  URL.revokeObjectURL(url);
                  handleModalClose();
                }}
                iconName="Download"
                iconPosition="left"
              >
                Download JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(settings, null, 2));
                  alert('Settings copied to clipboard!');
                }}
                iconName="Copy"
                iconPosition="left"
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </ModalOverlay>
    </div>
  );
};

export default SettingsPreferences;