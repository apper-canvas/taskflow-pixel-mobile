import React from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const PrioritySelector = ({ 
  value = 'medium', 
  onChange, 
  disabled = false,
  showLabel = true 
}) => {
  const priorities = [
    {
      value: 'high',
      label: 'High',
      icon: 'AlertTriangle',
      variant: 'high',
      color: 'text-red-600',
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: 'Minus',
      variant: 'medium',
      color: 'text-yellow-600',
    },
    {
      value: 'low',
      label: 'Low',
      icon: 'ArrowDown',
      variant: 'low',
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="space-y-2">
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700">
          Priority Level
        </label>
      )}
      
      <div className="flex items-center space-x-2">
        {priorities.map((priority) => {
          const isSelected = value === priority.value;
          
          return (
            <motion.button
              key={priority.value}
              type="button"
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
              onClick={() => !disabled && onChange?.(priority.value)}
              disabled={disabled}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-current bg-current bg-opacity-10' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${priority.color}
              `}
            >
              <ApperIcon name={priority.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{priority.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PrioritySelector;