import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskItem = ({ 
  task, 
  category,
  onToggleComplete, 
  onEdit, 
  onDelete,
  isDragging = false,
  dragHandleProps = {} 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    
    try {
      await onToggleComplete(task.Id, !task.completed);
      
      if (!task.completed) {
        toast.success('Task completed! 🎉', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.Id);
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    return 'upcoming';
  };

  const dueDateFormatted = formatDueDate(task.dueDate);
  const dueDateStatus = getDueDateStatus(task.dueDate);
  const isOverdue = dueDateStatus === 'overdue' && !task.completed;

  const priorityConfig = {
    high: { variant: 'high', icon: 'AlertTriangle' },
    medium: { variant: 'medium', icon: 'Minus' },
    low: { variant: 'low', icon: 'ArrowDown' },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.02 : 1,
        rotate: isDragging ? 2 : 0
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-xl p-4 shadow-soft hover:shadow-hover card-hover transition-all duration-200
        ${task.completed ? 'opacity-75' : ''}
        ${isOverdue ? 'border-l-4 border-error' : ''}
        ${category ? `border-l-4 border-l-[${category.color}]` : ''}
        ${isCompleting ? 'task-completing' : ''}
        ${isDragging ? 'dragging' : ''}
      `}
    >
      <div className="flex items-start space-x-4">
        <div className="flex items-center space-x-3">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </div>
          
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            size="md"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`
              text-lg font-medium transition-all duration-200
              ${task.completed 
                ? 'line-through text-gray-500' 
                : 'text-gray-900'
              }
            `}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                icon="Edit2"
                onClick={() => onEdit(task)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-error"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-2">
            <Badge variant={priority.variant} size="sm">
              <ApperIcon name={priority.icon} className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>

            {category && (
              <Badge variant="default" size="sm" className="capitalize">
                {category.name}
              </Badge>
            )}

            {dueDateFormatted && (
              <div className={`
                flex items-center space-x-1 text-xs px-2 py-1 rounded-full
                ${dueDateStatus === 'overdue' && !task.completed
                  ? 'bg-red-100 text-red-700'
                  : dueDateStatus === 'today'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <ApperIcon 
                  name={isOverdue ? "AlertTriangle" : "Calendar"} 
                  className="w-3 h-3" 
                />
                <span>{dueDateFormatted}</span>
              </div>
            )}

            {task.completed && (
              <div className="flex items-center space-x-1 text-xs text-success">
                <ApperIcon name="CheckCircle2" className="w-3 h-3" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;