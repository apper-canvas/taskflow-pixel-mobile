export const priorityConfig = {
  high: {
    label: 'High Priority',
    color: '#FF6B6B',
    bgColor: '#FFF1F1',
    textColor: '#E01010',
    icon: 'AlertTriangle',
    weight: 3,
  },
  medium: {
    label: 'Medium Priority',
    color: '#FFD93D',
    bgColor: '#FFFDF0',
    textColor: '#B45309',
    icon: 'Minus',
    weight: 2,
  },
  low: {
    label: 'Low Priority',
    color: '#9CA3AF',
    bgColor: '#F9FAFB',
    textColor: '#6B7280',
    icon: 'ArrowDown',
    weight: 1,
  },
};

export const getPriorityConfig = (priority) => {
  return priorityConfig[priority] || priorityConfig.medium;
};

export const sortTasksByPriority = (tasks) => {
  return [...tasks].sort((a, b) => {
    const aPriority = getPriorityConfig(a.priority);
    const bPriority = getPriorityConfig(b.priority);
    return bPriority.weight - aPriority.weight;
  });
};

export const filterTasksByPriority = (tasks, priority) => {
  if (priority === 'all') return tasks;
  return tasks.filter(task => task.priority === priority);
};

export const getPriorityStats = (tasks) => {
  const stats = {
    high: 0,
    medium: 0,
    low: 0,
    total: tasks.length,
  };

  tasks.forEach(task => {
    if (task.priority in stats) {
      stats[task.priority]++;
    }
  });

  return stats;
};