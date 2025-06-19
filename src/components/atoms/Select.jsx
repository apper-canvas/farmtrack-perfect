import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setIsFocused(false);
  };

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
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            w-full h-12 px-3 py-2 border rounded-lg transition-all duration-200 text-left
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : 'border-surface-300 focus:border-primary focus:ring-primary'
            }
            ${disabled ? 'bg-surface-100 cursor-not-allowed' : 'bg-white hover:border-primary'}
            focus:outline-none focus:ring-2 focus:ring-offset-0
          `}
          {...props}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ApperIcon 
              name="ChevronDown" 
              size={20} 
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-3 py-2 text-left hover:bg-surface-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

export default Select;