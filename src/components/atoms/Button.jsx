import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? (
          <ApperIcon name="Loader2" size={16} className="animate-spin" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <ApperIcon name={icon} size={16} />
            )}
            {children && <span>{children}</span>}
            {icon && iconPosition === 'right' && (
              <ApperIcon name={icon} size={16} />
            )}
          </>
        )}
      </div>
    </motion.button>
  );
};

export default Button;