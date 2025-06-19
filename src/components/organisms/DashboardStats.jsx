import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';

const DashboardStats = ({ 
  totalFarms = 0,
  activeCrops = 0,
  pendingTasks = 0,
  loading = false,
  className = ''
}) => {
const stats = [
    {
      title: 'Total Farms',
      value: totalFarms,
      icon: 'MapPin',
      color: 'primary'
    },
    {
      title: 'Active Crops',
      value: activeCrops,
      icon: 'Wheat',
      color: 'secondary'
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: 'CheckSquare',
      color: 'warning',
      trend: pendingTasks > 5 ? 'up' : 'down',
      trendValue: pendingTasks > 5 ? 'High' : 'Normal'
    }
  ];

return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} loading={loading} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;