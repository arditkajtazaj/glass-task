import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import TabNavigation from '../../components/ui/TabNavigation';
import MetricsCard from './components/MetricsCard';
import TimePeriodSelector from './components/TimePeriodSelector';
import ProductivityChart from './components/ProductivityChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import StreakCounter from './components/StreakCounter';
import GoalProgress from './components/GoalProgress';
import PeakHoursChart from './components/PeakHoursChart';
import AchievementBadges from './components/AchievementBadges';

import Button from '../../components/ui/Button';

const TaskAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [metricsData, setMetricsData] = useState([]);
  const [productivityData, setProductivityData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  // ...existing code...
  useEffect(() => {
    setSelectedPeriod('weekly');
    setCurrentLanguage('en');
    // Reset all analytics data to zero/empty
    setMetricsData([]);
    setProductivityData({ daily: [], weekly: [], monthly: [] });
    setCategoryData([]);
    setPeakHoursData([]);
    setStreakData({ currentStreak: 0, longestStreak: 0, history: [], goals: [] });
    setAchievementsData([]);
  }, []);

  const breadcrumbs = [
    { label: 'Dashboard', onClick: () => window.history.back() },
    { label: 'Analytics' }
  ];

  const handleExportData = () => {
    // Mock export functionality
    console.log('Exporting analytics data...');
  };

  const handleShareProgress = () => {
    // Mock share functionality
    console.log('Sharing progress...');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <button
        type="button"
        className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium"
        onClick={() => navigate(-1)}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10H5m0 0l5-5m-5 5l5 5"/></svg>
        Back
      </button>
      <Helmet>
        <title>Task Analytics - GlassTask</title>
        <meta name="description" content="Comprehensive task analytics and productivity insights with beautiful glassmorphism design" />
      </Helmet>
      <GlobalHeader 
        showBreadcrumbs={true}
        breadcrumbs={breadcrumbs}
      />
      <TabNavigation />
      <main className="pt-32 md:pt-24 pb-20 md:pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-8" style={{ background: 'transparent' }}>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Task Analytics</h1>
              <p className="text-muted-foreground">Track your productivity and achieve your goals</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <TimePeriodSelector 
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
              <Button
                variant="outline"
                iconName="Share"
                iconPosition="left"
                onClick={handleShareProgress}
                className="hidden md:flex"
              >
                Share
              </Button>
              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportData}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
            <div className="lg:col-span-2">
              <ProductivityChart 
                data={productivityData?.[selectedPeriod]}
                selectedPeriod={selectedPeriod}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
            <CategoryBreakdown data={categoryData} />
            <PeakHoursChart data={peakHoursData} />
          </div>
          {/* Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
            <StreakCounter 
              currentStreak={streakData?.currentStreak || 0}
              longestStreak={streakData?.longestStreak || 0}
              streakData={streakData?.history || []}
            />
            {/* <GoalProgress goals={streakData?.goals || []} /> */}
          </div>
          {/* Achievements Section */}
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
            <AchievementBadges achievements={achievementsData} />
          </div>
          {/* Mobile Action Buttons */}
          <div className="md:hidden fixed bottom-20 right-4 space-y-3" style={{ background: 'var(--glass-bg)', borderRadius: '50%', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <Button
              variant="default"
              iconName="Share"
              size="icon"
              onClick={handleShareProgress}
              className="w-12 h-12 rounded-full"
              style={{ color: 'var(--color-foreground)' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskAnalytics;