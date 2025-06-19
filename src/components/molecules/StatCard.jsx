import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary',
  loading = false,
  className = '' 
}) => {
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10'
  };

  if (loading) {
    return (
      <Card className={`${className}`} hoverable={false}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
            <div className="w-8 h-4 bg-surface-200 rounded"></div>
          </div>
          <div className="w-16 h-8 bg-surface-200 rounded mb-2"></div>
          <div className="w-24 h-4 bg-surface-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-gray-500'
          }`}>
            {trend === 'up' && <ApperIcon name="TrendingUp" size={16} className="mr-1" />}
            {trend === 'down' && <ApperIcon name="TrendingDown" size={16} className="mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-600">
          {title}
        </div>
      </motion.div>
    </Card>
  );
};

export default StatCard;