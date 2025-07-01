import { format, isToday, isTomorrow, isPast, isThisWeek, startOfWeek, endOfWeek } from 'date-fns';

export const formatTaskDate = (date) => {
  if (!date) return null;
  
  const taskDate = new Date(date);
  
  if (isToday(taskDate)) return 'Today';
  if (isTomorrow(taskDate)) return 'Tomorrow';
  if (isPast(taskDate)) return `${format(taskDate, 'MMM d')} (Overdue)`;
  
  return format(taskDate, 'MMM d, yyyy');
};

export const getDateStatus = (date) => {
  if (!date) return null;
  
  const taskDate = new Date(date);
  
  if (isPast(taskDate) && !isToday(taskDate)) return 'overdue';
  if (isToday(taskDate)) return 'today';
  if (isTomorrow(taskDate)) return 'tomorrow';
  if (isThisWeek(taskDate)) return 'thisWeek';
  
  return 'upcoming';
};

export const filterTasksByDate = (tasks, filter) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  return tasks.filter(task => {
    if (!task.dueDate && filter === 'noDueDate') return true;
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    switch (filter) {
      case 'today':
        return dueDateOnly.getTime() === today.getTime();
      case 'tomorrow':
        return dueDateOnly.getTime() === tomorrow.getTime();
      case 'thisWeek':
        return dueDate >= weekStart && dueDate <= weekEnd;
      case 'overdue':
        return dueDateOnly < today && !task.completed;
      default:
        return true;
    }
  });
};

export const sortTasksByDate = (tasks) => {
  return [...tasks].sort((a, b) => {
    // Tasks without due dates go to the end
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    // Sort by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
};