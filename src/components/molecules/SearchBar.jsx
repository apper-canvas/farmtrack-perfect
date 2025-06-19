import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search...',
  onSearch,
  className = '',
  debounceMs = 300
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    if (onSearch) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full h-10 pl-10 pr-10 py-2 border rounded-lg transition-all duration-200
            ${isFocused 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'border-surface-300 hover:border-primary'
            }
            focus:outline-none bg-white
          `}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;