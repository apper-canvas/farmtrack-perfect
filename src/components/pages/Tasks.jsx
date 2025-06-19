import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import TaskList from '@/components/organisms/TaskList';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { taskService, farmService, cropService } from '@/services';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    farmId: '',
    cropId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.farmId) errors.farmId = 'Farm selection is required';
    if (!formData.title.trim()) errors.title = 'Task title is required';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const taskData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        cropId: formData.cropId ? parseInt(formData.cropId, 10) : null
      };

      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData);
        setTasks(tasks.map(t => t.Id === editingTask.Id ? updatedTask : t));
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create(taskData);
        setTasks([...tasks, newTask]);
        toast.success('Task created successfully');
      }

      resetForm();
    } catch (err) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updatedTask = await taskService.update(task.Id, { status: newStatus });
      
      setTasks(tasks.map(t => t.Id === task.Id ? updatedTask : t));
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farmId: task.farmId.toString(),
      cropId: task.cropId ? task.cropId.toString() : '',
      title: task.title,
      description: task.description || '',
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
      priority: task.priority,
      status: task.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      try {
        await taskService.delete(task.Id);
        setTasks(tasks.filter(t => t.Id !== task.Id));
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: '',
      cropId: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'pending'
    });
    setFormErrors({});
    setEditingTask(null);
    setShowAddForm(false);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const farmOptions = farms.map(farm => ({
    value: farm.Id.toString(),
    label: farm.name
  }));

  const availableCrops = crops.filter(crop => 
    !formData.farmId || crop.farmId === parseInt(formData.farmId, 10)
  );

  const cropOptions = [
    { value: '', label: 'No specific crop' },
    ...availableCrops.map(crop => ({
      value: crop.Id.toString(),
      label: `${crop.name} (${crop.variety})`
    }))
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-64"></div>
        </div>
        <SkeletonLoader count={6} type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">
            Manage your farm tasks and track their completion
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddForm(true)}
          disabled={farms.length === 0}
        >
          Add Task
        </Button>
      </div>

      {farms.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No farms available"
          description="You need to add a farm before you can create tasks"
          actionLabel="Add Your First Farm"
          onAction={() => window.location.href = '/farms'}
        />
      ) : (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search tasks by title or description..."
              onSearch={setSearchTerm}
              className="max-w-md"
            />
          </div>

          {/* Add/Edit Form Modal */}
          <AnimatePresence>
            {showAddForm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={resetForm}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {editingTask ? 'Edit Task' : 'Add New Task'}
                        </h2>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon="X"
                          onClick={resetForm}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          type="select"
                          label="Farm"
                          value={formData.farmId}
                          onChange={(value) => {
                            handleFormChange('farmId', value);
                            handleFormChange('cropId', ''); // Reset crop selection
                          }}
                          options={farmOptions}
                          error={formErrors.farmId}
                          required
                        />

                        <FormField
                          type="select"
                          label="Crop (Optional)"
                          value={formData.cropId}
                          onChange={(value) => handleFormChange('cropId', value)}
                          options={cropOptions}
                          disabled={!formData.farmId}
                        />

                        <div className="md:col-span-2">
                          <FormField
                            label="Task Title"
                            value={formData.title}
                            onChange={(value) => handleFormChange('title', value)}
                            error={formErrors.title}
                            required
                            placeholder="e.g., Water tomato plants, Apply fertilizer"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <FormField
                            type="textarea"
                            label="Description"
                            value={formData.description}
                            onChange={(value) => handleFormChange('description', value)}
                            placeholder="Optional task details..."
                          />
                        </div>

                        <FormField
                          type="date"
                          label="Due Date"
                          value={formData.dueDate}
                          onChange={(value) => handleFormChange('dueDate', value)}
                          error={formErrors.dueDate}
                          required
                        />

                        <FormField
                          type="select"
                          label="Priority"
                          value={formData.priority}
                          onChange={(value) => handleFormChange('priority', value)}
                          options={priorityOptions}
                          required
                        />

                        {editingTask && (
                          <div className="md:col-span-2">
                            <FormField
                              type="select"
                              label="Status"
                              value={formData.status}
                              onChange={(value) => handleFormChange('status', value)}
                              options={statusOptions}
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          className="flex-1"
                        >
                          {editingTask ? 'Update Task' : 'Create Task'}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <EmptyState
              icon="CheckSquare"
              title="No tasks created yet"
              description="Create your first task to start managing your farm operations"
              actionLabel="Create Your First Task"
              onAction={() => setShowAddForm(true)}
            />
          ) : (
            <TaskList
              tasks={tasks}
              farms={farms}
              crops={crops}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default Tasks;