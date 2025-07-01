import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ 
  onAddTask, 
  onSearch, 
  onFilterChange, 
  filters = {},
  categories = [],
  currentCategory = null 
}) => {
  const { categoryId } = useParams();

  const getHeaderTitle = () => {
    if (categoryId && currentCategory) {
      return currentCategory.name;
    }
    return 'All Tasks';
  };

  const getHeaderSubtitle = () => {
    if (categoryId && currentCategory) {
      return `Tasks in ${currentCategory.name} category`;
    }
    return 'Manage all your tasks in one place';
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200"
    >
      <div className="px-8 py-6">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 capitalize">
              {getHeaderTitle()}
            </h1>
            <p className="text-gray-600 mt-1">
              {getHeaderSubtitle()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={onAddTask}
              icon="Plus"
              size="lg"
              className="shadow-soft hover:shadow-hover"
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          onSearch={onSearch}
          onFilterChange={onFilterChange}
          filters={filters}
        />
      </div>
    </motion.div>
  );
};

export default Header;