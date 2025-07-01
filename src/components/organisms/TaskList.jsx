import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskItem from '@/components/organisms/TaskItem';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import taskService from '@/services/api/taskService';
import categoryService from '@/services/api/categoryService';

const TaskList = ({ 
  categoryId = null, 
  searchTerm = '', 
  filters = {},
  onTaskSelect,
  refreshTrigger = 0 
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await taskService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? { ...task, completed } : task
      ));
    } catch (err) {
      toast.error('Failed to update task');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (targetTask) => {
    if (!draggedTask || draggedTask.Id === targetTask.Id) return;

    try {
      // Simple reordering logic - swap order values
      const draggedOrder = draggedTask.order;
      const targetOrder = targetTask.order;

      await Promise.all([
        taskService.update(draggedTask.Id, { order: targetOrder }),
        taskService.update(targetTask.Id, { order: draggedOrder })
      ]);

      // Update local state
      setTasks(prev => prev.map(task => {
        if (task.Id === draggedTask.Id) return { ...task, order: targetOrder };
        if (task.Id === targetTask.Id) return { ...task, order: draggedOrder };
        return task;
      }));

      toast.success('Task order updated');
    } catch (err) {
      toast.error('Failed to reorder tasks');
    }
  };

  // Filter tasks based on criteria
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Filter by category
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === categoryId);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower)
      );
    }

    // Filter by priority
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'completed') {
        filtered = filtered.filter(task => task.completed);
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(task => !task.completed);
      }
    }

    // Filter by due date
    if (filters.dueDate && filters.dueDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      filtered = filtered.filter(task => {
        if (!task.dueDate && filters.dueDate === 'noDueDate') return true;
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        switch (filters.dueDate) {
          case 'today':
            return dueDateOnly.getTime() === today.getTime();
          case 'tomorrow':
            return dueDateOnly.getTime() === tomorrow.getTime();
          case 'thisWeek':
            return dueDateOnly >= today && dueDateOnly <= nextWeek;
          case 'overdue':
            return dueDateOnly < today && !task.completed;
          default:
            return true;
        }
      });
    }

    // Sort by order, then by creation date
    return filtered.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadData}
        title="Failed to load tasks"
      />
    );
  }

  if (filteredTasks.length === 0) {
    const hasFilters = categoryId || searchTerm || 
      Object.values(filters).some(value => value !== 'all');
      
    if (hasFilters) {
      return (
        <Empty
          title="No matching tasks"
          message="Try adjusting your search or filters to find what you're looking for."
          icon="Search"
          actionText="Clear filters"
          onAction={() => window.location.href = '/'}
        />
      );
    }

    return (
      <Empty
        title="No tasks yet"
        message="Create your first task to get started with TaskFlow. Stay organized and boost your productivity!"
        icon="CheckSquare"
        actionText="Add your first task"
        onAction={() => onTaskSelect?.()}
      />
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task) => {
          const taskCategory = categories.find(cat => cat.Id.toString() === task.categoryId);
          
          return (
            <motion.div
              key={task.Id}
              layout
              draggable
              onDragStart={() => handleDragStart(task)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(task)}
              className="group"
            >
              <TaskItem
                task={task}
                category={taskCategory}
                onToggleComplete={handleToggleComplete}
                onEdit={onTaskSelect}
                onDelete={handleDeleteTask}
                isDragging={draggedTask?.Id === task.Id}
                dragHandleProps={{
                  onMouseDown: () => handleDragStart(task),
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;