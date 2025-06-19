import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hoverable = true, 
  padding = 'normal',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const baseClasses = `bg-white rounded-lg shadow-sm border border-surface-200 ${paddingClasses[padding]} ${className}`;

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;