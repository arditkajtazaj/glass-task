import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PeakHoursChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass rounded-lg p-3 border border-border/50">
          <p className="text-sm text-muted-foreground">{label}:00</p>
          <p className="text-sm font-medium text-foreground">
            Tasks: <span className="text-primary">{payload?.[0]?.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-xl p-6 stagger-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-6">Peak Productivity Hours</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="hour" 
              stroke="rgba(148, 163, 184, 0.8)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(148, 163, 184, 0.8)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="tasks" 
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PeakHoursChart;