import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 
    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200
    ${error ? 'border-error focus:ring-error focus:border-error' : ''}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center space-x-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default Input;