import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const TaskForm = ({ 
  task = null, 
  categories = [], 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  useEffect(() => {
    if (task) {
setFormData({
        title: task.title || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        categoryId: task.categoryId || '',
        notes: task.notes || '',
      });
    } else if (categories.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: prev.categoryId || categories[0].Id.toString(),
      }));
    }
  }, [task, categories]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

const taskData = {
      ...formData,
      title: formData.title.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      categoryId: formData.categoryId,
      notes: formData.notes?.trim() || '',
    };

    onSubmit(taskData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        label="Task Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="What do you need to do?"
        error={errors.title}
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-error flex items-center space-x-1">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              <span>{errors.categoryId}</span>
            </p>
          )}
        </div>
      </div>

<Input
        label="Due Date (Optional)"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        disabled={isLoading}
        min={format(new Date(), 'yyyy-MM-dd')}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <button
            type="button"
            onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            disabled={isLoading}
          >
            {showMarkdownPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        
        {!showMarkdownPreview ? (
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add notes with markdown support...&#10;&#10;**Bold text**&#10;*Italic text*&#10;# Heading&#10;- List item"
            disabled={isLoading}
            rows={4}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-vertical"
          />
        ) : (
          <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg min-h-[100px] prose prose-sm max-w-none">
            {formData.notes ? (
              <ReactMarkdown>{formData.notes}</ReactMarkdown>
            ) : (
              <span className="text-gray-400 italic">No notes to preview</span>
            )}
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          Supports markdown: **bold**, *italic*, # headings, - lists, [links](url)
        </p>
      </div>
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          icon={task ? "Save" : "Plus"}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </motion.form>
  );
};

export default TaskForm;