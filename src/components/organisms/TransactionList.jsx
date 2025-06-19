import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const TransactionList = ({ 
  transactions = [], 
  farms = [],
  onEdit,
  onDelete,
  showFilters = true,
  className = '' 
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'General';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      seeds: 'Wheat',
      fertilizer: 'Beaker',
      equipment: 'Wrench',
      labor: 'Users',
      utilities: 'Zap',
      sales: 'DollarSign',
      other: 'Package'
    };
    return iconMap[category] || 'Package';
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense';
    return transaction.category === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortBy === 'farmId') {
      aValue = getFarmName(a.farmId);
      bValue = getFarmName(b.farmId);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const TransactionCard = ({ transaction, index }) => {
    const isIncome = transaction.type === 'income';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                ${isIncome ? 'bg-success/10' : 'bg-error/10'}`}>
                <ApperIcon 
                  name={getCategoryIcon(transaction.category)} 
                  size={24} 
                  className={isIncome ? 'text-success' : 'text-error'}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {transaction.description}
                  </h4>
                  <Badge 
                    variant={isIncome ? 'success' : 'error'} 
                    size="sm"
                  >
                    {transaction.type}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ApperIcon name="MapPin" size={14} className="mr-1" />
                    {getFarmName(transaction.farmId)}
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" size={14} className="mr-1" />
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Tag" size={14} className="mr-1" />
                    {transaction.category}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`text-lg font-bold ${isIncome ? 'text-success' : 'text-error'}`}>
                {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  icon="Edit"
                  onClick={() => onEdit(transaction)}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon="Trash2"
                  onClick={() => onDelete(transaction)}
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={className}>
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'income', label: 'Income' },
              { key: 'expense', label: 'Expenses' },
              { key: 'seeds', label: 'Seeds' },
              { key: 'equipment', label: 'Equipment' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                  ${filter === key 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortBy(field);
              setSortDirection(direction);
            }}
            className="px-3 py-1 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
            <option value="farmId-asc">Farm A-Z</option>
          </select>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {sortedTransactions.map((transaction, index) => (
            <TransactionCard key={transaction.Id} transaction={transaction} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionList;