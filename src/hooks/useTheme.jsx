import { useState, useEffect, createContext, useContext } from 'react';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [colorScheme, setColorScheme] = useState('indigo');
  const [glassIntensity, setGlassIntensity] = useState(60);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('glasstask-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setTheme(parsedSettings?.theme || 'dark');
        setColorScheme(parsedSettings?.colorScheme || 'indigo');
        setGlassIntensity(parsedSettings?.glassIntensity || 60);
      } catch (error) {
        console.error('Error loading theme settings:', error);
      }
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList?.remove('light', 'dark', 'auto');
    
    // Determine effective theme
    let effectiveTheme = theme;
    if (theme === 'auto') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
    }
    
    // Add theme class
    root.classList?.add(effectiveTheme);
    
    // Apply color scheme
    root.setAttribute('data-color-scheme', colorScheme);
    
    // Apply glass intensity
    root.style?.setProperty('--glass-intensity', glassIntensity);
    
    // Update CSS variables based on theme
    if (effectiveTheme === 'light') {
      // Light theme variables
      root.style?.setProperty('--color-background', '#FFFFFF');
      root.style?.setProperty('--color-foreground', '#0F172A');
      root.style?.setProperty('--color-border', 'rgba(0, 0, 0, 0.1)');
      root.style?.setProperty('--color-input', '#F8FAFC');
      root.style?.setProperty('--color-card', '#F8FAFC');
      root.style?.setProperty('--color-card-foreground', '#0F172A');
      root.style?.setProperty('--color-popover', '#FFFFFF');
      root.style?.setProperty('--color-popover-foreground', '#0F172A');
      root.style?.setProperty('--color-muted', '#F1F5F9');
      root.style?.setProperty('--color-muted-foreground', '#64748B');
      root.style?.setProperty('--glass-bg', `rgba(248, 250, 252, ${glassIntensity / 100 * 0.8})`);
      root.style?.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)');
      root.style?.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.15)');
    } else {
      // Dark theme variables
      root.style?.setProperty('--color-background', '#0F172A');
      root.style?.setProperty('--color-foreground', '#F8FAFC');
      root.style?.setProperty('--color-border', 'rgba(255, 255, 255, 0.1)');
      root.style?.setProperty('--color-input', '#1E293B');
      root.style?.setProperty('--color-card', '#1E293B');
      root.style?.setProperty('--color-card-foreground', '#F8FAFC');
      root.style?.setProperty('--color-popover', '#1E293B');
      root.style?.setProperty('--color-popover-foreground', '#F8FAFC');
      root.style?.setProperty('--color-muted', '#334155');
      root.style?.setProperty('--color-muted-foreground', '#94A3B8');
      root.style?.setProperty('--glass-bg', `rgba(30, 41, 59, ${glassIntensity / 100 * 0.8})`);
      root.style?.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style?.setProperty('--glass-shadow', '0 8px 32px rgba(0, 0, 0, 0.37)');
    }
    
    // Apply color scheme variables
    const colorSchemeMap = {
      indigo: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#06B6D4' },
      violet: { primary: '#8B5CF6', secondary: '#A855F7', accent: '#06B6D4' },
      cyan: { primary: '#06B6D4', secondary: '#0891B2', accent: '#6366F1' },
      emerald: { primary: '#10B981', secondary: '#059669', accent: '#8B5CF6' },
      amber: { primary: '#F59E0B', secondary: '#D97706', accent: '#10B981' },
      rose: { primary: '#F43F5E', secondary: '#E11D48', accent: '#06B6D4' }
    };
    
    const colors = colorSchemeMap?.[colorScheme] || colorSchemeMap?.indigo;
    root.style?.setProperty('--color-primary', colors?.primary);
    root.style?.setProperty('--color-secondary', colors?.secondary);
    root.style?.setProperty('--color-accent', colors?.accent);
    
  }, [theme, colorScheme, glassIntensity]);

  // Listen for system theme changes when auto is selected
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Trigger re-render to apply new theme
        setTheme('auto');
      };
      
      mediaQuery?.addEventListener('change', handleChange);
      return () => mediaQuery?.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    // Update localStorage
    const settings = JSON.parse(localStorage.getItem('glasstask-settings') || '{}');
    settings.theme = newTheme;
    localStorage.setItem('glasstask-settings', JSON.stringify(settings));
  };

  const updateColorScheme = (newColorScheme) => {
    setColorScheme(newColorScheme);
    // Update localStorage
    const settings = JSON.parse(localStorage.getItem('glasstask-settings') || '{}');
    settings.colorScheme = newColorScheme;
    localStorage.setItem('glasstask-settings', JSON.stringify(settings));
  };

  const updateGlassIntensity = (newIntensity) => {
    setGlassIntensity(newIntensity);
    // Update localStorage
    const settings = JSON.parse(localStorage.getItem('glasstask-settings') || '{}');
    settings.glassIntensity = newIntensity;
    localStorage.setItem('glasstask-settings', JSON.stringify(settings));
  };

  const value = {
    theme,
    colorScheme,
    glassIntensity,
    updateTheme,
    updateColorScheme,
    updateGlassIntensity
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;