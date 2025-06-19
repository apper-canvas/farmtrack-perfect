import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import TransactionList from '@/components/organisms/TransactionList';
import StatCard from '@/components/molecules/StatCard';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { transactionService, farmService } from '@/services';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    farmId: '',
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setFarms(farmsData);
    } catch (err) {
      setError(err.message || 'Failed to load financial data');
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.farmId) errors.farmId = 'Farm selection is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const transactionData = {
        ...formData,
        farmId: parseInt(formData.farmId, 10),
        amount: parseFloat(formData.amount)
      };

      if (editingTransaction) {
        const updatedTransaction = await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(transactions.map(t => t.Id === editingTransaction.Id ? updatedTransaction : t));
        toast.success('Transaction updated successfully');
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions([...transactions, newTransaction]);
        toast.success('Transaction added successfully');
      }

      resetForm();
    } catch (err) {
      toast.error(editingTransaction ? 'Failed to update transaction' : 'Failed to add transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      farmId: transaction.farmId.toString(),
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: format(new Date(transaction.date), 'yyyy-MM-dd')
    });
    setShowAddForm(true);
  };

  const handleDelete = async (transaction) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(transaction.Id);
        setTransactions(transactions.filter(t => t.Id !== transaction.Id));
        toast.success('Transaction deleted successfully');
      } catch (err) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      farmId: '',
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setFormErrors({});
    setEditingTransaction(null);
    setShowAddForm(false);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const farmOptions = farms.map(farm => ({
    value: farm.Id.toString(),
    label: farm.name
  }));

  const expenseCategories = [
    { value: 'seeds', label: 'Seeds & Plants' },
    { value: 'fertilizer', label: 'Fertilizer & Soil' },
    { value: 'equipment', label: 'Equipment & Tools' },
    { value: 'labor', label: 'Labor' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'pesticides', label: 'Pesticides' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' }
  ];

  const incomeCategories = [
    { value: 'sales', label: 'Crop Sales' },
    { value: 'livestock', label: 'Livestock Sales' },
    { value: 'subsidies', label: 'Government Subsidies' },
    { value: 'grants', label: 'Grants' },
    { value: 'other', label: 'Other Income' }
  ];

  const categoryOptions = formData.type === 'expense' ? expenseCategories : incomeCategories;

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-32 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SkeletonLoader count={3} type="card" />
        </div>
        <SkeletonLoader count={5} type="list" />
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
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance</h1>
          <p className="text-gray-600">
            Track your farm income and expenses to monitor profitability
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowAddForm(true)}
          disabled={farms.length === 0}
        >
          Add Transaction
        </Button>
      </div>

      {farms.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="No farms available"
          description="You need to add a farm before you can track finances"
          actionLabel="Add Your First Farm"
          onAction={() => window.location.href = '/farms'}
        />
      ) : (
        <>
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Income"
              value={`$${totalIncome.toFixed(2)}`}
              icon="TrendingUp"
              color="success"
            />
            <StatCard
              title="Total Expenses"
              value={`$${totalExpenses.toFixed(2)}`}
              icon="TrendingDown"
              color="error"
            />
            <StatCard
              title="Net Profit"
              value={`$${netProfit.toFixed(2)}`}
              icon="DollarSign"
              color={netProfit >= 0 ? 'success' : 'error'}
              trend={netProfit >= 0 ? 'up' : 'down'}
              trendValue={netProfit >= 0 ? 'Profit' : 'Loss'}
            />
            <StatCard
              title="This Month"
              value={`$${monthlyIncome.toFixed(2)}`}
              icon="Calendar"
              color="info"
            />
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search transactions by description or category..."
              onSearch={setSearchTerm}
              className="max-w-md"
            />
          </div>

          {/* Add/Edit Form Modal */}
          <AnimatePresence>
            {showAddForm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={resetForm}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                        </h2>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon="X"
                          onClick={resetForm}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          type="select"
                          label="Farm"
                          value={formData.farmId}
                          onChange={(value) => handleFormChange('farmId', value)}
                          options={farmOptions}
                          error={formErrors.farmId}
                          required
                        />

                        <FormField
                          type="select"
                          label="Type"
                          value={formData.type}
                          onChange={(value) => {
                            handleFormChange('type', value);
                            handleFormChange('category', ''); // Reset category
                          }}
                          options={[
                            { value: 'income', label: 'Income' },
                            { value: 'expense', label: 'Expense' }
                          ]}
                          required
                        />

                        <FormField
                          type="number"
                          label="Amount"
                          value={formData.amount}
                          onChange={(value) => handleFormChange('amount', value)}
                          error={formErrors.amount}
                          required
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />

                        <FormField
                          type="select"
                          label="Category"
                          value={formData.category}
                          onChange={(value) => handleFormChange('category', value)}
                          options={categoryOptions}
                          error={formErrors.category}
                          required
                        />

                        <FormField
                          type="date"
                          label="Date"
                          value={formData.date}
                          onChange={(value) => handleFormChange('date', value)}
                          error={formErrors.date}
                          required
                        />

                        <div className="md:col-span-2">
                          <FormField
                            label="Description"
                            value={formData.description}
                            onChange={(value) => handleFormChange('description', value)}
                            error={formErrors.description}
                            required
                            placeholder="e.g., Tomato seed purchase, Equipment rental"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          className="flex-1"
                        >
                          {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Transactions List */}
          {transactions.length === 0 ? (
            <EmptyState
              icon="DollarSign"
              title="No transactions recorded yet"
              description="Start tracking your farm's financial activities"
              actionLabel="Add Your First Transaction"
              onAction={() => setShowAddForm(true)}
            />
          ) : (
            <TransactionList
              transactions={transactions}
              farms={farms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default Finance;