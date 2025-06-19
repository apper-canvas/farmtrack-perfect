import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const TaskList = ({ 
  tasks = [], 
  farms = [],
  crops = [],
  onToggleComplete,
  onEdit,
  onDelete,
  showFilters = true,
  className = '' 
}) => {
  const [filter, setFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'General';
  };

  const getCropName = (cropId) => {
    if (!cropId) return null;
    const crop = crops.find(c => c.Id === cropId);
    return crop ? crop.name : 'Unknown Crop';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getDateLabel = (date) => {
    const taskDate = new Date(date);
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    if (isPast(taskDate)) return 'Overdue';
    return format(taskDate, 'MMM dd');
  };

  const getDateColor = (date) => {
    const taskDate = new Date(date);
    if (isPast(taskDate)) return 'text-error';
    if (isToday(taskDate)) return 'text-warning';
    return 'text-gray-600';
  };

  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.status === 'completed') return false;
    
    switch (filter) {
      case 'today':
        return isToday(new Date(task.dueDate));
      case 'overdue':
        return isPast(new Date(task.dueDate)) && task.status !== 'completed';
      case 'urgent':
        return task.priority === 'urgent';
      case 'all':
      default:
        return true;
    }
  });

  const TaskCard = ({ task, index }) => {
    const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'completed';
    const isCompleted = task.status === 'completed';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className={`${isOverdue ? 'border-error' : ''} ${isCompleted ? 'opacity-75' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => onToggleComplete(task)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                  ${isCompleted 
                    ? 'bg-success border-success text-white' 
                    : 'border-gray-300 hover:border-primary'
                  }`}
              >
                {isCompleted && <ApperIcon name="Check" size={12} />}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="MapPin" size={14} className="mr-1" />
                    {getFarmName(task.farmId)}
                  </div>
                  {task.cropId && (
                    <div className="flex items-center text-sm text-gray-500">
                      <ApperIcon name="Wheat" size={14} className="mr-1" />
                      {getCropName(task.cropId)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getPriorityColor(task.priority)} size="sm">
                {task.priority}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                icon="Edit"
                onClick={() => onEdit(task)}
              />
              <Button
                size="sm"
                variant="ghost"
                icon="Trash2"
                onClick={() => onDelete(task)}
                className="text-error hover:text-error"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${getDateColor(task.dueDate)}`}>
              <ApperIcon name="Clock" size={14} className="inline mr-1" />
              {getDateLabel(task.dueDate)}
            </div>
            {isOverdue && (
              <Badge variant="error" size="sm" icon="AlertTriangle">
                Overdue
              </Badge>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={className}>
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'today', label: 'Today' },
              { key: 'overdue', label: 'Overdue' },
              { key: 'urgent', label: 'Urgent' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${filter === key 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${showCompleted 
                ? 'bg-success/10 text-success' 
                : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
              }`}
          >
            <ApperIcon name={showCompleted ? 'EyeOff' : 'Eye'} size={14} />
            <span>{showCompleted ? 'Hide' : 'Show'} Completed</span>
          </button>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <TaskCard key={task.Id} task={task} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;