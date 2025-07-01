import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'tasks' }) => {
  if (type === 'tasks') {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-soft"
          >
            <div className="flex items-center space-x-4">
              <div className="w-5 h-5 bg-gray-200 rounded shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer" style={{ width: `${60 + Math.random() * 30}%` }}></div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-5 bg-gray-200 rounded-full shimmer"></div>
                  <div className="w-20 h-5 bg-gray-200 rounded shimmer"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg shimmer"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'categories') {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg"
          >
            <div className="w-3 h-3 bg-gray-200 rounded-full shimmer"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded shimmer"></div>
            <div className="w-6 h-4 bg-gray-200 rounded shimmer"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full"
      />
    </div>
  );
};

export default Loading;