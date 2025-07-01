import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed btn-hover';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-soft hover:shadow-hover focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 shadow-soft hover:shadow-hover hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-gradient-to-r from-error to-accent-600 text-white shadow-soft hover:shadow-hover focus:ring-error',
    success: 'bg-gradient-to-r from-success to-emerald-500 text-white shadow-soft hover:shadow-hover focus:ring-success',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <ApperIcon
          name="Loader2"
          className={`${iconSizes[size]} animate-spin ${children ? 'mr-2' : ''}`}
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon
          name={icon}
          className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`}
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon
          name={icon}
          className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`}
        />
      )}
    </motion.button>
  );
};

export default Button;