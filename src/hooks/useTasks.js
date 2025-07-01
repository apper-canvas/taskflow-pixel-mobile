import { useState, useEffect } from 'react';
import taskService from '@/services/api/taskService';

export const useTasks = (categoryId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = categoryId 
        ? await taskService.getByCategory(categoryId)
        : await taskService.getAll();
      
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [categoryId]);

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error('Failed to create task');
    }
  };

  const updateTask = async (id, updateData) => {
    try {
      const updatedTask = await taskService.update(id, updateData);
      setTasks(prev => prev.map(task => 
        task.Id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      throw new Error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== id));
    } catch (err) {
      throw new Error('Failed to delete task');
    }
  };

  const toggleTaskComplete = async (id) => {
    try {
      const updatedTask = await taskService.toggleComplete(id);
      setTasks(prev => prev.map(task => 
        task.Id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      throw new Error('Failed to toggle task completion');
    }
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  };
};