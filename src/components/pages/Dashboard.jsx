import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format, isToday } from "date-fns";
import DashboardStats from "@/components/organisms/DashboardStats";
import TaskList from "@/components/organisms/TaskList";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import { cropService, farmService, taskService } from "@/services";

const Dashboard = () => {
const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
try {
        console.log('Loading dashboard data...');
        const [farmsResponse, cropsResponse, tasksResponse] = await Promise.all([
          farmService.getAll(),
          cropService.getAll(),
          taskService.getAll()
        ]);
        
        console.log('Service responses:', {
          farms: farmsResponse,
          crops: cropsResponse,
          tasks: tasksResponse
        });
        
// Check if any service calls failed
        if (!farmsResponse.success) {
          throw new Error(farmsResponse.error || 'Failed to load farms data');
        }
        if (!cropsResponse.success) {
          throw new Error(cropsResponse.error || 'Failed to load crops data');
        }
        if (!tasksResponse.success) {
          throw new Error(tasksResponse.error || 'Failed to load tasks data');
        }
        
// Extract data arrays from service responses
        const farmsData = farmsResponse.data || [];
        const cropsData = cropsResponse.data || [];
        const tasksData = tasksResponse.data || [];
        
        // Validate that services returned arrays and handle potential errors
        if (!Array.isArray(farmsData)) {
          throw new Error('Invalid farms data format received');
        }
        if (!Array.isArray(cropsData)) {
          throw new Error('Invalid crops data format received');
        }
        if (!Array.isArray(tasksData)) {
          throw new Error('Invalid tasks data format received');
        }
        
console.log('Data loaded successfully:', {
          farms: farmsData.length,
          crops: cropsData.length,
          tasks: tasksData.length
        });
        
        setFarms(farmsData);
        setCrops(cropsData);
        setTasks(tasksData);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        const errorMessage = error.message || 'Failed to load dashboard data. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  const handleTaskToggle = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updatedTask = await taskService.update(task.Id, { status: newStatus });
      
      setTasks(tasks.map(t => t.Id === task.Id ? updatedTask : t));
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskEdit = (task) => {
    navigate('/tasks', { state: { editTask: task } });
  };

  const handleTaskDelete = async (task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.Id);
        setTasks(tasks.filter(t => t.Id !== task.Id));
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <SkeletonLoader count={4} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

// Calculate dashboard metrics
  const totalFarms = farms.length;
  const activeCrops = crops.filter(c => c.status !== 'harvested').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const todaysTasks = tasks.filter(t => isToday(new Date(t.dueDate)) && t.status === 'pending');

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening on your farm today.
        </p>
      </div>

{/* Dashboard Stats */}
      <div className="mb-8">
<DashboardStats
          totalFarms={totalFarms}
          activeCrops={activeCrops}
          pendingTasks={pendingTasks}
          monthlyBalance={0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Today's Tasks ({todaysTasks.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon="Plus"
                onClick={() => navigate('/tasks')}
              >
                Add Task
              </Button>
            </div>
            
            {todaysTasks.length > 0 ? (
              <TaskList
                tasks={todaysTasks}
                farms={farms}
                crops={crops}
                onToggleComplete={handleTaskToggle}
                onEdit={handleTaskEdit}
                onDelete={handleTaskDelete}
                showFilters={false}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks scheduled for today</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate('/tasks')}
                >
                  View All Tasks
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
{/* Weather Widget */}
          <WeatherWidget />

          {/* Quick Actions */}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                icon="MapPin"
                onClick={() => navigate('/farms')}
                className="w-full justify-start"
              >
                Add New Farm
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="Wheat"
                onClick={() => navigate('/crops')}
                className="w-full justify-start"
              >
Add New Crop
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;