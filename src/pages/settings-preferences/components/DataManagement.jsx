import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataManagement = ({ settings, onSettingChange }) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const storageData = {
    totalStorage: 50, // MB
    usedStorage: 12.5, // MB
    tasksCount: 247,
    attachmentsCount: 18,
    backupsCount: 5
  };

  const storagePercentage = (storageData?.usedStorage / storageData?.totalStorage) * 100;

  const exportFormats = [
    { id: 'json', name: 'JSON', description: 'Complete data with metadata', icon: 'FileCode' },
    { id: 'csv', name: 'CSV', description: 'Spreadsheet compatible format', icon: 'FileSpreadsheet' },
    { id: 'txt', name: 'Text', description: 'Simple text format', icon: 'FileText' },
    { id: 'pdf', name: 'PDF', description: 'Printable document', icon: 'FileImage' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock export data
    const exportData = {
      tasks: [
        {
          id: 1,
          title: "Complete project proposal",
          description: "Finalize the Q4 project proposal with budget estimates",
          priority: "high",
          status: "in-progress",
          dueDate: "2025-01-15",
          category: "work",
          createdAt: "2025-01-08T10:00:00Z"
        },
        {
          id: 2,
          title: "Review team performance",
          description: "Conduct quarterly performance reviews for team members",
          priority: "medium",
          status: "pending",
          dueDate: "2025-01-20",
          category: "management",
          createdAt: "2025-01-08T11:30:00Z"
        }
      ],
      settings: settings,
      exportDate: new Date()?.toISOString(),
      version: "2.1.0"
    };

    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `glasstask-export-${new Date()?.toISOString()?.split('T')?.[0]}.${exportFormat}`;
    link?.click();
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const handleImport = async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsImporting(false);
    
    // Reset file input
    event.target.value = '';
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear data logic would go here
      console.log('Data cleared');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
            <Icon name="HardDrive" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Storage Usage</h3>
            <p className="text-sm text-muted-foreground">Monitor your data usage and storage</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Storage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground font-medium">Used Storage</span>
              <span className="text-muted-foreground">
                {storageData?.usedStorage} MB of {storageData?.totalStorage} MB
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {storagePercentage?.toFixed(1)}% used
            </div>
          </div>

          {/* Storage Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-light rounded-lg p-4 text-center">
              <Icon name="CheckSquare" size={24} className="text-primary mx-auto mb-2" />
              <div className="text-lg font-semibold text-foreground">{storageData?.tasksCount}</div>
              <div className="text-xs text-muted-foreground">Tasks</div>
            </div>
            <div className="glass-light rounded-lg p-4 text-center">
              <Icon name="Paperclip" size={24} className="text-accent mx-auto mb-2" />
              <div className="text-lg font-semibold text-foreground">{storageData?.attachmentsCount}</div>
              <div className="text-xs text-muted-foreground">Attachments</div>
            </div>
            <div className="glass-light rounded-lg p-4 text-center">
              <Icon name="Archive" size={24} className="text-secondary mx-auto mb-2" />
              <div className="text-lg font-semibold text-foreground">{storageData?.backupsCount}</div>
              <div className="text-xs text-muted-foreground">Backups</div>
            </div>
          </div>
        </div>
      </div>
      {/* Export Data */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary glass-light flex items-center justify-center">
            <Icon name="Download" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Export Data</h3>
            <p className="text-sm text-muted-foreground">Download your tasks and settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {exportFormats?.map((format) => (
              <button
                key={format?.id}
                onClick={() => setExportFormat(format?.id)}
                className={`
                  p-3 rounded-lg border-2 text-center transition-all duration-200 hover-lift press-scale
                  ${exportFormat === format?.id 
                    ? 'border-primary bg-primary/10' :'border-border/30 glass-light hover:border-primary/50'
                  }
                `}
              >
                <Icon name={format?.icon} size={20} className="mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium text-foreground">{format?.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{format?.description}</div>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={handleExport}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
              className="flex-1"
            >
              {isExporting ? 'Exporting...' : `Export as ${exportFormat?.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </div>
      {/* Import Data */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent glass-light flex items-center justify-center">
            <Icon name="Upload" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Import Data</h3>
            <p className="text-sm text-muted-foreground">Restore tasks from backup file</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center glass-light">
            <Icon name="FileUp" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground font-medium mb-2">
              Choose a backup file to import
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports JSON, CSV, and TXT formats
            </p>
            <input
              type="file"
              accept=".json,.csv,.txt"
              onChange={handleImport}
              className="hidden"
              id="import-file"
              disabled={isImporting}
            />
            <label htmlFor="import-file">
              <Button
                variant="outline"
                loading={isImporting}
                iconName="Upload"
                iconPosition="left"
                asChild
              >
                <span className="cursor-pointer">
                  {isImporting ? 'Importing...' : 'Select File'}
                </span>
              </Button>
            </label>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium mb-1">Import Warning</p>
                <p className="text-muted-foreground">
                  Importing data will merge with existing tasks. Duplicate tasks may be created.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Backup Settings */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-error glass-light flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Backup Settings</h3>
            <p className="text-sm text-muted-foreground">Configure automatic backups</p>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Automatic backups"
            description="Create daily backups of your data"
            checked={settings?.autoBackup}
            onChange={(e) => onSettingChange('autoBackup', e?.target?.checked)}
          />
          
          <Checkbox
            label="Cloud sync"
            description="Sync data across devices (coming soon)"
            checked={settings?.cloudSync}
            disabled
            onChange={(e) => onSettingChange('cloudSync', e?.target?.checked)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Backup retention (days)"
              type="number"
              min="1"
              max="365"
              value={settings?.backupRetention || 30}
              onChange={(e) => onSettingChange('backupRetention', parseInt(e?.target?.value))}
              description="How long to keep backup files"
            />
          </div>
        </div>
      </div>
      {/* Data Management Actions */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-error to-warning glass-light flex items-center justify-center">
            <Icon name="Trash2" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
            <p className="text-sm text-muted-foreground">Manage your stored data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-error font-medium mb-1">Danger Zone</p>
                <p className="text-muted-foreground text-sm mb-3">
                  These actions cannot be undone. Please proceed with caution.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  iconName="Trash2"
                  iconPosition="left"
                  size="sm"
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;