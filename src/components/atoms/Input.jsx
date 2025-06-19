import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          initial={false}
          animate={{
            fontSize: isFocused || value ? '0.75rem' : '1rem',
            top: isFocused || value ? '0.5rem' : '1rem',
            color: error ? '#EF5350' : isFocused ? '#2D5016' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 z-10 bg-white px-1 pointer-events-none"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <ApperIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={!label ? placeholder : ''}
          disabled={disabled}
          className={`
            w-full h-12 px-3 py-2 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : 'pl-3'}
            ${type === 'password' ? 'pr-10' : 'pr-3'}
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : 'border-surface-300 focus:border-primary focus:ring-primary'
            }
            ${disabled ? 'bg-surface-100 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;