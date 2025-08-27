import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryBreakdown = ({ data }) => {
  const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass rounded-lg p-3 border border-border/50">
          <p className="text-sm font-medium text-foreground">
            {payload?.[0]?.name}: <span className="text-primary">{payload?.[0]?.value} tasks</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-xl p-6 stagger-fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-6">Category Breakdown</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6">
        {data?.map((item, index) => (
          <div key={item?.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
            ></div>
            <span className="text-sm text-muted-foreground">{item?.name}</span>
            <span className="text-sm font-medium text-foreground ml-auto">{item?.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;