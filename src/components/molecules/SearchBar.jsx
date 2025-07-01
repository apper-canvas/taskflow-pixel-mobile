import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ onSearch, onFilterChange, filters = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    priority: filters.priority || 'all',
    status: filters.status || 'all',
    dueDate: filters.dueDate || 'all',
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priority: 'all',
      status: 'all',
      dueDate: 'all',
    };
    setLocalFilters(clearedFilters);
    setSearchTerm('');
    onFilterChange?.(clearedFilters);
    onSearch?.('');
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== 'all') || searchTerm;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
            iconPosition="left"
          />
        </div>
        
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          icon="Filter"
          className={showFilters ? 'bg-primary-50 text-primary-600 border-primary-200' : ''}
        >
          Filters
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            icon="X"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          />
        )}
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={localFilters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <select
                value={localFilters.dueDate}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Any Time</option>
                <option value="today">Due Today</option>
                <option value="tomorrow">Due Tomorrow</option>
                <option value="thisWeek">This Week</option>
                <option value="overdue">Overdue</option>
                <option value="noDueDate">No Due Date</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span>Filters applied</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                icon="X"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;