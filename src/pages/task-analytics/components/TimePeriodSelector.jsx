import React from 'react';

const TimePeriodSelector = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="glass rounded-lg p-1 inline-flex">
      {periods?.map((period) => (
        <button
          key={period?.value}
          onClick={() => onPeriodChange(period?.value)}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 press-scale
            ${selectedPeriod === period?.value
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }
          `}
        >
          {period?.label}
        </button>
      ))}
    </div>
  );
};

export default TimePeriodSelector;