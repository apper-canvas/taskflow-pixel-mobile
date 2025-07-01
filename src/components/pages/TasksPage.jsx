import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import TaskList from '@/components/organisms/TaskList';
import AddTaskPanel from '@/components/organisms/AddTaskPanel';
import categoryService from '@/services/api/categoryService';

const TasksPage = () => {
  const { categoryId } = useParams();
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    dueDate: 'all',
  });
  const [categories, setCategories] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddPanel(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddPanel(true);
  };

  const handleClosePanel = () => {
    setShowAddPanel(false);
    setEditingTask(null);
  };

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    if (editingTask) {
      setShowAddPanel(false);
      setEditingTask(null);
    }
  };

  const currentCategory = categoryId 
    ? categories.find(cat => cat.Id.toString() === categoryId)
    : null;

  return (
    <div className="flex flex-col h-full">
      <Header
        onAddTask={handleAddTask}
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        filters={filters}
        categories={categories}
        currentCategory={currentCategory}
      />
      
      <div className="flex-1 overflow-y-auto p-8">
        <TaskList
          categoryId={categoryId}
          searchTerm={searchTerm}
          filters={filters}
          onTaskSelect={handleEditTask}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <AddTaskPanel
        isOpen={showAddPanel}
        onClose={handleClosePanel}
        onTaskCreated={handleTaskCreated}
        editingTask={editingTask}
        selectedCategoryId={categoryId}
      />
    </div>
  );
};

export default TasksPage;