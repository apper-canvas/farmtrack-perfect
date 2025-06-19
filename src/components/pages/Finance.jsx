import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { transactionService, farmService } from '@/services';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import FormField from '@/components/molecules/FormField';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
  
  // Form and UI states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    farmId: ''
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    farmId: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const categories = {
    income: [
      { value: 'crop_sale', label: 'Crop Sales' },
      { value: 'livestock', label: 'Livestock Sales' },
      { value: 'government_subsidy', label: 'Government Subsidy' },
      { value: 'rental_income', label: 'Rental Income' },
      { value: 'other_income', label: 'Other Income' }
    ],
    expense: [
      { value: 'seeds', label: 'Seeds' },
      { value: 'fertilizer', label: 'Fertilizer' },
      { value: 'equipment', label: 'Equipment' },
      { value: 'fuel', label: 'Fuel' },
      { value: 'labor', label: 'Labor' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'insurance', label: 'Insurance' },
      { value: 'utilities', label: 'Utilities' },
      { value: 'other_expense', label: 'Other Expenses' }
    ]
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      loadSummary();
    }
  }, [transactions, filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [transactionsResponse, farmsResponse] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      
      if (!transactionsResponse.success) {
        throw new Error(transactionsResponse.error || 'Failed to load transactions');
      }
      if (!farmsResponse.success) {
        throw new Error(farmsResponse.error || 'Failed to load farms');
      }
      
      setTransactions(transactionsResponse.data || []);
      setFarms(farmsResponse.data || []);
    } catch (err) {
      console.error('Error loading finance data:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await transactionService.getSummary(filters);
      if (response.success) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.category || !formData.amount || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        farmId: formData.farmId ? parseInt(formData.farmId) : null
      };

      let response;
      if (editingTransaction) {
        response = await transactionService.update(editingTransaction.Id, transactionData);
        if (response.success) {
          setTransactions(prev => prev.map(t => 
            t.Id === editingTransaction.Id ? response.data : t
          ));
          toast.success('Transaction updated successfully');
        }
      } else {
        response = await transactionService.create(transactionData);
        if (response.success) {
          setTransactions(prev => [response.data, ...prev]);
          toast.success('Transaction added successfully');
        }
      }
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      resetForm();
    } catch (err) {
      console.error('Error saving transaction:', err);
      toast.error(err.message || 'Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
      farmId: transaction.farmId?.toString() || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (transaction) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await transactionService.delete(transaction.Id);
      if (response.success) {
        setTransactions(prev => prev.filter(t => t.Id !== transaction.Id));
        toast.success('Transaction deleted successfully');
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error(err.message || 'Failed to delete transaction');
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      farmId: ''
    });
    setEditingTransaction(null);
    setShowAddForm(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.farmId && transaction.farmId !== parseInt(filters.farmId)) return false;
    if (filters.dateFrom && new Date(transaction.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(transaction.date) > new Date(filters.dateTo)) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return transaction.description.toLowerCase().includes(searchLower) ||
             transaction.category.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getCategoryLabel = (type, category) => {
    const categoryList = categories[type] || [];
    const found = categoryList.find(c => c.value === category);
    return found ? found.label : category;
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : 'No Farm';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-96"></div>
        </div>
        <SkeletonLoader count={6} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Financial Management
            </h1>
            <p className="text-gray-600">
              Track your farm's income and expenses
            </p>
          </div>
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => setShowAddForm(true)}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-success/10 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-success">${summary.totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-error/10 rounded-lg">
              <ApperIcon name="TrendingDown" className="w-6 h-6 text-error" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-error">${summary.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${summary.netBalance >= 0 ? 'bg-success/10' : 'bg-error/10'}`}>
              <ApperIcon name="DollarSign" className={`w-6 h-6 ${summary.netBalance >= 0 ? 'text-success' : 'text-error'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-success' : 'text-error'}`}>
                ${summary.netBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ApperIcon name="Receipt" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            placeholder="All Types"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            placeholder="All Categories"
          >
            <option value="">All Categories</option>
            {filters.type && categories[filters.type]?.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
            {!filters.type && [
              ...categories.income.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>),
              ...categories.expense.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)
            ]}
          </Select>
          
          <Select
            value={filters.farmId}
            onChange={(e) => handleFilterChange('farmId', e.target.value)}
            placeholder="All Farms"
          >
            <option value="">All Farms</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id}>{farm.name}</option>
            ))}
          </Select>
          
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            placeholder="From Date"
          />
          
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            placeholder="To Date"
          />
          
          <SearchBar
            value={filters.search}
            onChange={(value) => handleFilterChange('search', value)}
            placeholder="Search transactions..."
          />
        </div>
        
        {(filters.type || filters.category || filters.farmId || filters.dateFrom || filters.dateTo || filters.search) && (
          <div className="mt-4 pt-4 border-t border-surface-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ type: '', category: '', farmId: '', search: '', dateFrom: '', dateTo: '' })}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Transaction List */}
      <Card>
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Farm</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((transaction) => (
                    <motion.tr
                      key={transaction.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-surface-100 hover:bg-surface-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={transaction.type === 'income' ? 'success' : 'error'}>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {getCategoryLabel(transaction.type, transaction.category)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {getFarmName(transaction.farmId)}
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium text-right ${
                        transaction.type === 'income' ? 'text-success' : 'text-error'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Edit"
                            onClick={() => handleEdit(transaction)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="Trash2"
                            onClick={() => handleDelete(transaction)}
                            className="text-error hover:text-error hover:bg-error/10"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="Receipt"
            title="No transactions found"
            description="Start by adding your first transaction"
            action={
              <Button
                variant="primary"
                icon="Plus"
                onClick={() => setShowAddForm(true)}
              >
                Add Transaction
              </Button>
            }
          />
        )}
      </Card>

      {/* Add/Edit Transaction Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={resetForm}
                  />
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <FormField
                    type="select"
                    label="Type"
                    value={formData.type}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, type: e.target.value, category: '' }));
                    }}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </FormField>

                  {formData.type && (
                    <FormField
                      type="select"
                      label="Category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories[formData.type]?.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </FormField>
                  )}

                  <FormField
                    type="number"
                    label="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />

                  <FormField
                    type="text"
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description"
                    required
                  />

                  <FormField
                    type="date"
                    label="Date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />

                  <FormField
                    type="select"
                    label="Farm (Optional)"
                    value={formData.farmId}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmId: e.target.value }))}
                  >
                    <option value="">Select Farm</option>
                    {farms.map(farm => (
                      <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                    ))}
                  </FormField>

                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      {editingTransaction ? 'Update' : 'Add'} Transaction
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Finance;