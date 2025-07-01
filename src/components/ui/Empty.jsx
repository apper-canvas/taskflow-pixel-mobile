import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No tasks yet", 
  message = "Create your first task to get started with TaskFlow",
  icon = "CheckSquare",
  actionText = "Add your first task",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center mb-8 shadow-soft"
      >
        <ApperIcon name={icon} className="w-10 h-10 text-primary-500" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8 max-w-md leading-relaxed"
      >
        {message}
      </motion.p>
      
      {onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onAction}
          className="btn-hover bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 shadow-soft hover:shadow-hover text-lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>{actionText}</span>
        </motion.button>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center space-x-6 text-sm text-gray-400"
      >
        <div className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Quick add</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Due dates</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Flag" className="w-4 h-4" />
          <span>Priorities</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Empty;