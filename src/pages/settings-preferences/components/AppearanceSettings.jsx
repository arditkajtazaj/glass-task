import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import { Checkbox } from '../../../components/ui/Checkbox';

const AppearanceSettings = ({ settings, onSettingChange }) => {
  const [previewTheme, setPreviewTheme] = useState(settings?.theme);

  const themeOptions = [
    {
      id: 'light',
      name: 'Light Mode',
      description: 'Clean and bright interface',
      icon: 'Sun',
      gradient: 'from-slate-100 to-slate-200'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes',
      icon: 'Moon',
      gradient: 'from-slate-800 to-slate-900'
    },
    {
      id: 'auto',
      name: 'System',
      description: 'Follows device preference',
      icon: 'Monitor',
      gradient: 'from-slate-400 to-slate-600'
    }
  ];

  const colorSchemes = [
    { id: 'indigo', name: 'Indigo', color: '#6366F1' },
    { id: 'violet', name: 'Violet', color: '#8B5CF6' },
    { id: 'cyan', name: 'Cyan', color: '#06B6D4' },
    { id: 'emerald', name: 'Emerald', color: '#10B981' },
    { id: 'amber', name: 'Amber', color: '#F59E0B' },
    { id: 'rose', name: 'Rose', color: '#F43F5E' }
  ];

  const handleThemeChange = (themeId) => {
    setPreviewTheme(themeId);
    onSettingChange('theme', themeId);
  };

  const handleColorSchemeChange = (colorId) => {
    onSettingChange('colorScheme', colorId);
  };

  const handleGlassIntensityChange = (intensity) => {
    onSettingChange('glassIntensity', intensity);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
            <Icon name="Palette" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Theme</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred appearance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions?.map((theme) => (
            <button
              key={theme?.id}
              onClick={() => handleThemeChange(theme?.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 hover-lift press-scale
                ${settings?.theme === theme?.id 
                  ? 'border-primary bg-primary/10' :'border-border/30 glass-light hover:border-primary/50'
                }
              `}
            >
              <div className={`w-full h-16 rounded-md bg-gradient-to-br ${theme?.gradient} mb-3 flex items-center justify-center`}>
                <Icon name={theme?.icon} size={24} className="text-white" />
              </div>
              <h4 className="font-medium text-foreground text-sm">{theme?.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{theme?.description}</p>
              {settings?.theme === theme?.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Color Scheme */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary glass-light flex items-center justify-center">
            <Icon name="Droplet" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Color Scheme</h3>
            <p className="text-sm text-muted-foreground">Customize your accent colors</p>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {colorSchemes?.map((color) => (
            <button
              key={color?.id}
              onClick={() => handleColorSchemeChange(color?.id)}
              className={`
                relative aspect-square rounded-lg border-2 transition-all duration-200 hover-lift press-scale
                ${settings?.colorScheme === color?.id 
                  ? 'border-white shadow-lg scale-110' 
                  : 'border-border/30 hover:border-white/50'
                }
              `}
              style={{ backgroundColor: color?.color }}
              title={color?.name}
            >
              {settings?.colorScheme === color?.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="Check" size={16} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Glass Effect Intensity */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent glass-light flex items-center justify-center">
            <Icon name="Layers" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Glass Effect</h3>
            <p className="text-sm text-muted-foreground">Adjust blur and transparency intensity</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Intensity Level</span>
            <span className="text-sm text-muted-foreground">{settings?.glassIntensity}%</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={settings?.glassIntensity}
              onChange={(e) => handleGlassIntensityChange(parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Subtle</span>
              <span>Moderate</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[20, 60, 100]?.map((intensity) => (
              <div
                key={intensity}
                className={`
                  h-16 rounded-lg border border-border/30 flex items-center justify-center text-xs font-medium
                  ${intensity === settings?.glassIntensity ? 'ring-2 ring-primary' : ''}
                `}
                style={{
                  background: `rgba(30, 41, 59, ${intensity / 100 * 0.8})`,
                  backdropFilter: `blur(${intensity / 5}px)`,
                  WebkitBackdropFilter: `blur(${intensity / 5}px)`
                }}
              >
                {intensity}%
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Advanced Options */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-error glass-light flex items-center justify-center">
            <Icon name="Settings2" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Advanced</h3>
            <p className="text-sm text-muted-foreground">Fine-tune visual preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Reduce motion effects"
            description="Minimize animations for better performance"
            checked={settings?.reduceMotion}
            onChange={(e) => onSettingChange('reduceMotion', e?.target?.checked)}
          />
          
          <Checkbox
            label="High contrast mode"
            description="Increase contrast for better visibility"
            checked={settings?.highContrast}
            onChange={(e) => onSettingChange('highContrast', e?.target?.checked)}
          />
          
          <Checkbox
            label="Show visual effects"
            description="Enable particle effects and celebrations"
            checked={settings?.visualEffects}
            onChange={(e) => onSettingChange('visualEffects', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;