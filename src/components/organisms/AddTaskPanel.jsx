import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskForm from '@/components/molecules/TaskForm';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const AddTaskPanel = ({ 
  isOpen, 
  onClose, 
  onTaskCreated, 
  editingTask = null,
  selectedCategoryId = null 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickMode, setQuickMode] = useState(true);
  const [quickTitle, setQuickTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (editingTask) {
        setQuickMode(false);
      }
    }
  }, [isOpen, editingTask]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      toast.error('Failed to load categories');
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    
    if (!quickTitle.trim()) return;

    setLoading(true);
    try {
      const defaultCategory = selectedCategoryId || 
        (categories.length > 0 ? categories[0].Id.toString() : null);
      
      if (!defaultCategory) {
        toast.error('Please create a category first');
        return;
      }

      const taskData = {
        title: quickTitle.trim(),
        priority: 'medium',
        dueDate: null,
        categoryId: defaultCategory,
        completed: false,
      };

      const newTask = await taskService.create(taskData);
      setQuickTitle('');
      onTaskCreated?.(newTask);
      toast.success('Task added successfully!');
      
      // Stay open in quick mode for rapid task entry
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleFullFormSubmit = async (taskData) => {
    setLoading(true);
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        onTaskCreated?.(updatedTask);
        toast.success('Task updated successfully!');
      } else {
        const newTask = await taskService.create({
          ...taskData,
          completed: false,
        });
        onTaskCreated?.(newTask);
        toast.success('Task created successfully!');
      }
      onClose();
    } catch (err) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-lifted max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingTask 
                  ? 'Update your task details' 
                  : 'What would you like to accomplish?'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {!editingTask && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuickMode(!quickMode)}
                  icon={quickMode ? "Settings" : "Zap"}
                >
                  {quickMode ? 'Full Form' : 'Quick Add'}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {quickMode && !editingTask ? (
              <form onSubmit={handleQuickAdd} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Plus" className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="What do you need to do?"
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      disabled={loading}
                      autoFocus
                      className="text-lg"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">
                    Press Enter to add quickly, or use Full Form for more options
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={!quickTitle.trim()}
                      icon="Plus"
                    >
                      Add Task
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <TaskForm
                task={editingTask}
                categories={categories}
                onSubmit={handleFullFormSubmit}
                onCancel={onClose}
                isLoading={loading}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTaskPanel;