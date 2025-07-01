import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      className={`
        ${sizes[size]} flex items-center justify-center rounded border-2 transition-all duration-200
        ${checked 
          ? 'bg-gradient-to-br from-success to-emerald-500 border-success text-white' 
          : 'bg-white border-gray-300 hover:border-primary-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <motion.div
        initial={false}
        animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
      >
        <ApperIcon name="Check" className={iconSizes[size]} />
      </motion.div>
    </motion.button>
  );
};

export default Checkbox;