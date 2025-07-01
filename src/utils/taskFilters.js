import { filterTasksByDate } from '@/utils/dateUtils';
import { filterTasksByPriority } from '@/utils/priorityUtils';

export const applyTaskFilters = (tasks, filters) => {
  let filteredTasks = [...tasks];

  // Filter by search term
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchLower)
    );
  }

  // Filter by category
  if (filters.categoryId) {
    filteredTasks = filteredTasks.filter(task => 
      task.categoryId === filters.categoryId
    );
  }

  // Filter by priority
  if (filters.priority && filters.priority !== 'all') {
    filteredTasks = filterTasksByPriority(filteredTasks, filters.priority);
  }

  // Filter by completion status
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (filters.status === 'pending') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }
  }

  // Filter by due date
  if (filters.dueDate && filters.dueDate !== 'all') {
    filteredTasks = filterTasksByDate(filteredTasks, filters.dueDate);
  }

  return filteredTasks;
};

export const getFilterStats = (tasks, filters) => {
  const filteredTasks = applyTaskFilters(tasks, filters);
  
  return {
    total: filteredTasks.length,
    completed: filteredTasks.filter(task => task.completed).length,
    pending: filteredTasks.filter(task => !task.completed).length,
    overdue: filteredTasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length,
  };
};

export const getQuickFilters = () => {
  return [
    { key: 'all', label: 'All Tasks', icon: 'List' },
    { key: 'pending', label: 'Pending', icon: 'Clock' },
    { key: 'completed', label: 'Completed', icon: 'CheckCircle2' },
    { key: 'overdue', label: 'Overdue', icon: 'AlertTriangle' },
    { key: 'today', label: 'Due Today', icon: 'Calendar' },
    { key: 'thisWeek', label: 'This Week', icon: 'CalendarDays' },
  ];
};