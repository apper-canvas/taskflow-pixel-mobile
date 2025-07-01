import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    high: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200',
    medium: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200',
    low: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center font-medium rounded-full priority-badge transition-all duration-150
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </motion.span>
  );
};

export default Badge;