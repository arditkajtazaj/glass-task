import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Icon from '../../../components/AppIcon';

const DashboardCharts = ({ tasks }) => {
  // Generate productivity data for the last 7 days
  const productivityData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date?.setDate(date?.getDate() - (6 - i));
      return {
        day: date?.toLocaleDateString('en', { weekday: 'short' }),
        date: date?.toISOString()?.split('T')?.[0],
        completed: Math.floor(Math.random() * 8) + 1,
        created: Math.floor(Math.random() * 10) + 3
      };
    });
    return last7Days;
  }, []);

  // Category breakdown data
  const categoryData = useMemo(() => {
    const categories = {};
    tasks?.forEach(task => {
      const category = task?.category || 'uncategorized';
      categories[category] = (categories?.[category] || 0) + 1;
    });
    
    const colors = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'];
    return Object.entries(categories)?.map(([name, value], index) => ({
      name: name?.charAt(0)?.toUpperCase() + name?.slice(1),
      value,
      color: colors?.[index % colors?.length]
    }));
  }, [tasks]);

  // Priority distribution data
  const priorityData = useMemo(() => {
    const priorities = { high: 0, medium: 0, low: 0 };
    tasks?.forEach(task => {
      const priority = task?.priority || 'medium';
      priorities[priority] = (priorities?.[priority] || 0) + 1;
    });
    
    return [
      { name: 'High', value: priorities?.high, color: '#EF4444' },
      { name: 'Medium', value: priorities?.medium, color: '#F59E0B' },
      { name: 'Low', value: priorities?.low, color: '#10B981' }
    ];
  }, [tasks]);

  // Completion trend data
  const completionTrendData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date?.setDate(date?.getDate() - (29 - i));
      return {
        date: date?.getDate(),
        month: date?.toLocaleDateString('en', { month: 'short' }),
        completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
        totalTasks: Math.floor(Math.random() * 15) + 5
      };
    });
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass rounded-lg p-3 border-border/50">
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              <span style={{ color: entry?.color }}>{entry?.name}: </span>
              {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Productivity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Productivity Chart */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <span>Daily Productivity</span>
            </h3>
            <div className="text-sm text-muted-foreground">Last 7 days</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366F1"
                  fillOpacity={1}
                  fill="url(#completedGradient)"
                  name="Completed"
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#createdGradient)"
                  name="Created"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="PieChart" size={20} className="text-accent" />
              <span>Category Breakdown</span>
            </h3>
            <div className="text-sm text-muted-foreground">
              {tasks?.length || 0} total tasks
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            {categoryData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <Icon name="Database" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No task data available</p>
              </div>
            )}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {categoryData?.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry?.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {entry?.name} ({entry?.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Trend & Priority Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Activity" size={20} className="text-success" />
              <span>Completion Trend</span>
            </h3>
            <div className="text-sm text-muted-foreground">Last 30 days</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                  name="Completion Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
              <span>Priority Distribution</span>
            </h3>
            <div className="text-sm text-muted-foreground">Current tasks</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="var(--color-muted-foreground)" 
                  fontSize={12}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Tasks">
                  {priorityData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Performance Summary */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="BarChart3" size={20} className="text-secondary" />
            <span>Weekly Performance</span>
          </h3>
          <div className="text-sm text-muted-foreground">Tasks created vs completed</div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="created"
                fill="#8B5CF6"
                name="Tasks Created"
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar
                dataKey="completed"
                fill="#6366F1"
                name="Tasks Completed"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;