import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
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
          rotate: [0, -10, 10, -10, 0],
          transition: { 
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3
          }
        }}
        className="mb-4"
      >
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;