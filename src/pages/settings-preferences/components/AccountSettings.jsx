import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountSettings = ({ settings, onSettingChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Use backend for real user data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    timezone: '',
    language: ''
  });

  useEffect(() => {
    // Fetch user profile from backend
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.name) setProfileData(data);
      });
  }, []);
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const accountStats = {
    tasksCompleted: 1247,
    streakDays: 23,
    joinDate: '2024-03-15',
    lastActive: '2025-01-08T21:45:00Z'
  };

  const privacySettings = [
    {
      id: 'analytics',
      title: 'Usage Analytics',
      description: 'Help improve the app by sharing anonymous usage data',
      enabled: settings?.analytics || true
    },
    {
      id: 'crashReports',
      title: 'Crash Reports',
      description: 'Automatically send crash reports to help fix bugs',
      enabled: settings?.crashReports || true
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      description: 'Receive updates about new features and improvements',
      enabled: settings?.marketing || false
    },
    {
      id: 'dataSharing',
      title: 'Data Sharing',
      description: 'Share aggregated data for research purposes',
      enabled: settings?.dataSharing || false
    }
  ];

  const handleProfileSave = async () => {
    // Save profile to backend
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        setIsEditing(false);
      }
    } catch (err) {
      // handle error
    }
  };

  const handlePasswordChange = () => {
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordData?.newPassword?.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    // Change password logic would go here
    console.log('Password changed');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handlePrivacyChange = (settingId, enabled) => {
    onSettingChange(settingId, enabled);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastActive = (dateString) => {
    const now = new Date();
    const lastActive = new Date(dateString);
    const diffInMinutes = Math.floor((now - lastActive) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
            <p className="text-sm text-muted-foreground">Manage your personal information</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden glass-light">
                <img
                  src={profileData?.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-primary glass-light flex items-center justify-center hover-lift press-scale cursor-pointer">
                <Icon name="Camera" size={16} className="text-primary-foreground" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileData?.name}
                    onChange={(e) => setProfileData({...profileData, name: e?.target?.value})}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData?.email}
                    onChange={(e) => setProfileData({...profileData, email: e?.target?.value})}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{profileData?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-foreground font-medium">{profileData?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="default"
                  onClick={handleProfileSave}
                  iconName="Check"
                  iconPosition="left"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  iconName="X"
                  iconPosition="left"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Account Statistics */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary glass-light flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Account Statistics</h3>
            <p className="text-sm text-muted-foreground">Your productivity insights</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-light rounded-lg p-4 text-center">
            <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
            <div className="text-lg font-semibold text-foreground">{accountStats?.tasksCompleted}</div>
            <div className="text-xs text-muted-foreground">Tasks Completed</div>
          </div>
          <div className="glass-light rounded-lg p-4 text-center">
            <Icon name="Flame" size={24} className="text-warning mx-auto mb-2" />
            <div className="text-lg font-semibold text-foreground">{accountStats?.streakDays}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="glass-light rounded-lg p-4 text-center">
            <Icon name="Calendar" size={24} className="text-primary mx-auto mb-2" />
            <div className="text-sm font-semibold text-foreground">{formatDate(accountStats?.joinDate)}</div>
            <div className="text-xs text-muted-foreground">Member Since</div>
          </div>
          <div className="glass-light rounded-lg p-4 text-center">
            <Icon name="Clock" size={24} className="text-accent mx-auto mb-2" />
            <div className="text-sm font-semibold text-foreground">{formatLastActive(accountStats?.lastActive)}</div>
            <div className="text-xs text-muted-foreground">Last Active</div>
          </div>
        </div>
      </div>
      {/* Security Settings */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent glass-light flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">Manage your account security</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Current Password"
              type={showPassword?.current ? "text" : "password"}
              value={passwordData?.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e?.target?.value})}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type={showPassword?.new ? "text" : "password"}
              value={passwordData?.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e?.target?.value})}
              placeholder="Enter new password"
              description="Must be at least 8 characters long"
            />
            <Input
              label="Confirm New Password"
              type={showPassword?.confirm ? "text" : "password"}
              value={passwordData?.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e?.target?.value})}
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Checkbox
              label="Show passwords"
              checked={showPassword?.current && showPassword?.new && showPassword?.confirm}
              onChange={(e) => setShowPassword({
                current: e?.target?.checked,
                new: e?.target?.checked,
                confirm: e?.target?.checked
              })}
            />
          </div>

          <Button
            variant="default"
            onClick={handlePasswordChange}
            disabled={!passwordData?.currentPassword || !passwordData?.newPassword || !passwordData?.confirmPassword}
            iconName="Lock"
            iconPosition="left"
          >
            Change Password
          </Button>
        </div>
      </div>
      {/* Privacy Settings */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-error glass-light flex items-center justify-center">
            <Icon name="Eye" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Privacy Settings</h3>
            <p className="text-sm text-muted-foreground">Control your data and privacy preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {privacySettings?.map((setting) => (
            <div key={setting?.id} className="flex items-start space-x-3 p-4 glass-light rounded-lg">
              <Checkbox
                checked={setting?.enabled}
                onChange={(e) => handlePrivacyChange(setting?.id, e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{setting?.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{setting?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Account Actions */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-error to-warning glass-light flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Account Actions</h3>
            <p className="text-sm text-muted-foreground">Manage your account status</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-error font-medium mb-1">Danger Zone</p>
                <p className="text-muted-foreground text-sm mb-3">
                  These actions are permanent and cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    iconName="Download"
                    iconPosition="left"
                    size="sm"
                  >
                    Export Account Data
                  </Button>
                  <Button
                    variant="destructive"
                    iconName="Trash2"
                    iconPosition="left"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        console.log('Account deletion requested');
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;