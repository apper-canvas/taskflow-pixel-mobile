import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import ApperIcon from '@/components/ApperIcon';
import categoryService from '@/services/api/categoryService';
import taskService from '@/services/api/taskService';

const CategorySidebar = ({ onCategoryChange }) => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const predefinedColors = [
    '#5B4FE9', '#7C71F5', '#FF6B6B', '#4ECDC4', '#FFD93D',
    '#4DABF7', '#9C88FF', '#FF8A65', '#81C784', '#FFB74D'
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      
      setCategories(categoriesData);
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTaskCount = (catId) => {
    return tasks.filter(task => task.categoryId === catId.toString()).length;
  };

  const getPendingTaskCount = (catId) => {
    return tasks.filter(task => 
      task.categoryId === catId.toString() && !task.completed
    ).length;
  };

  const getAllTasksCount = () => {
    return tasks.length;
  };

  const getAllPendingTasksCount = () => {
    return tasks.filter(task => !task.completed).length;
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) return;

    setIsCreating(true);
    try {
      const randomColor = predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
      const newCategory = await categoryService.create({
        name: newCategoryName.trim(),
        color: randomColor,
        order: categories.length
      });
      
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setShowAddForm(false);
      toast.success('Category created successfully');
    } catch (err) {
      toast.error('Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <Loading type="categories" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-white border-r border-gray-200 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-500">Stay organized</p>
          </div>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          icon="Plus"
          className="w-full"
          size="lg"
        >
          Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-100 overflow-hidden"
          >
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={isCreating}
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <Button
                  type="submit"
                  size="sm"
                  loading={isCreating}
                  disabled={!newCategoryName.trim()}
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategoryName('');
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-6">
        <nav className="space-y-2">
          {/* All Tasks */}
          <NavLink
            to="/"
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 category-item
              ${isActive && !categoryId
                ? 'active'
                : 'hover:bg-primary-50'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full"></div>
              <span className="font-medium text-gray-700">All Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              {getAllPendingTasksCount() > 0 && (
                <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {getAllPendingTasksCount()}
                </span>
              )}
              <span className="text-gray-400 text-sm">{getAllTasksCount()}</span>
            </div>
          </NavLink>

          {/* Category Links */}
          {categories.map((category) => {
            const taskCount = getTaskCount(category.Id);
            const pendingCount = getPendingTaskCount(category.Id);
            
            return (
              <NavLink
                key={category.Id}
                to={`/category/${category.Id}`}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 category-item
                  ${isActive
                    ? 'active'
                    : 'hover:bg-primary-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium text-gray-700 capitalize">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {pendingCount > 0 && (
                    <span 
                      className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {pendingCount}
                    </span>
                  )}
                  <span className="text-gray-400 text-sm">{taskCount}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadData}
              className="mt-2 text-red-600 hover:text-red-700"
            >
              Try again
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100">
        <div className="text-center text-sm text-gray-500">
          <p>Stay productive with TaskFlow</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySidebar;