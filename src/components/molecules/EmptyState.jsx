import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  icon = 'Package',
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          transition: { 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
        className="mb-6"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-400 mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onAction}
            variant="primary"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;