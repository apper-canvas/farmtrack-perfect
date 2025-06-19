import mockTransactions from '@/services/mockData/transactions.json';

// Transaction service for managing financial transactions
class TransactionService {
  constructor() {
    this.transactions = [...mockTransactions];
    this.nextId = Math.max(...this.transactions.map(t => t.Id), 0) + 1;
  }

  // Get all transactions
  async getAll() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: [...this.transactions]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get transaction by ID
  async getById(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid transaction ID');
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
      const transaction = this.transactions.find(t => t.Id === id);
      
      if (!transaction) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      return {
        success: true,
        data: { ...transaction }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create new transaction
  async create(transactionData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newTransaction = {
        Id: this.nextId++,
        type: transactionData.type,
        category: transactionData.category,
        amount: parseFloat(transactionData.amount),
        description: transactionData.description,
        date: transactionData.date || new Date().toISOString().split('T')[0],
        farmId: transactionData.farmId || null
      };
      
      this.transactions.push(newTransaction);
      
      return {
        success: true,
        data: { ...newTransaction }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update transaction
  async update(id, updates) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid transaction ID');
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const index = this.transactions.findIndex(t => t.Id === id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }

      // Prevent Id field updates
      const { Id, ...allowedUpdates } = updates;
      
      this.transactions[index] = {
        ...this.transactions[index],
        ...allowedUpdates,
        amount: allowedUpdates.amount ? parseFloat(allowedUpdates.amount) : this.transactions[index].amount
      };

      return {
        success: true,
        data: { ...this.transactions[index] }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete transaction
  async delete(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid transaction ID');
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = this.transactions.findIndex(t => t.Id === id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }

      const deleted = this.transactions.splice(index, 1)[0];
      
      return {
        success: true,
        data: { ...deleted }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get transactions by filter
  async getByFilter(filters = {}) {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      let filtered = [...this.transactions];
      
      if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
      }
      
      if (filters.category) {
        filtered = filtered.filter(t => t.category === filters.category);
      }
      
      if (filters.farmId) {
        filtered = filtered.filter(t => t.farmId === filters.farmId);
      }
      
      if (filters.dateFrom) {
        filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
      }
      
      if (filters.dateTo) {
        filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo));
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.description.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
        );
      }

      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get summary statistics
  async getSummary(filters = {}) {
    try {
      const response = await this.getByFilter(filters);
      if (!response.success) return response;
      
      const transactions = response.data;
      
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        success: true,
        data: {
          totalIncome: income,
          totalExpenses: expenses,
          netBalance: income - expenses,
          transactionCount: transactions.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const transactionService = new TransactionService();
export default transactionService;