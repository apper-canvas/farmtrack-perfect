import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format, isToday } from 'date-fns';
import DashboardStats from '@/components/organisms/DashboardStats';
import TaskList from '@/components/organisms/TaskList';
import WeatherWidget from '@/components/organisms/WeatherWidget';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { farmService, cropService, taskService } from '@/services';

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [farmsData, cropsData, tasksData, transactionsData] = await Promise.all([
          farmService.getAll(),
          cropService.getAll(),
          taskService.getAll(),
          transactionService.getAll()
        ]);
        
        setFarms(farmsData);
        setCrops(cropsData);
        setTasks(tasksData);
        setTransactions(transactionsData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
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
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyBalance = monthlyIncome - monthlyExpenses;

  // Recent transactions (last 5)
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's an overview of your farm operations.
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats
        totalFarms={totalFarms}
        activeCrops={activeCrops}
        pendingTasks={pendingTasks}
        monthlyBalance={monthlyBalance}
        className="mb-8"
      />

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

          {/* Recent Transactions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/finance')}
              >
                View All
              </Button>
            </div>
            
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.Id} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(transaction.date), 'MMM dd')} • {transaction.category}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-success' : 'text-error'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No recent transactions</p>
              </div>
            )}
          </Card>

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
                Log New Crop
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon="DollarSign"
                onClick={() => navigate('/finance')}
                className="w-full justify-start"
              >
                Add Transaction
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;