// Transaction service for managing financial transactions
class TransactionService {
  constructor() {
    // Mock transaction data
    this.transactions = [
      {
        id: 1,
        type: 'income',
        category: 'crop_sale',
        amount: 2500.00,
        description: 'Wheat harvest sale',
        date: new Date('2024-01-15'),
        farmId: 1
      },
      {
        id: 2,
        type: 'expense',
        category: 'seeds',
        amount: 450.00,
        description: 'Corn seeds purchase',
        date: new Date('2024-01-10'),
        farmId: 1
      },
      {
        id: 3,
        type: 'income',
        category: 'crop_sale',
        amount: 1800.00,
        description: 'Vegetable harvest',
        date: new Date('2024-01-20'),
        farmId: 2
      },
      {
        id: 4,
        type: 'expense',
        category: 'fertilizer',
        amount: 320.00,
        description: 'Organic fertilizer',
        date: new Date('2024-01-12'),
        farmId: 1
      },
      {
        id: 5,
        type: 'expense',
        category: 'equipment',
        amount: 750.00,
        description: 'Irrigation system maintenance',
        date: new Date('2024-01-18'),
        farmId: 2
      }
    ];
  }

  // Get all transactions
  async getAll() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: this.transactions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get transactions by month and year
  async getByMonth(month, year) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const monthlyTransactions = this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && 
               transactionDate.getFullYear() === year;
      });

      return {
        success: true,
        data: monthlyTransactions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get recent transactions (last 5)
  async getRecent(limit = 5) {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const sortedTransactions = [...this.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);

      return {
        success: true,
        data: sortedTransactions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate monthly income
  calculateMonthlyIncome(transactions) {
    if (!Array.isArray(transactions)) return 0;
    
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + (t.amount || 0), 0);
  }

  // Calculate monthly expenses
  calculateMonthlyExpenses(transactions) {
    if (!Array.isArray(transactions)) return 0;
    
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + (t.amount || 0), 0);
  }

  // Add new transaction
  async add(transaction) {
    try {
      const newTransaction = {
        id: this.transactions.length + 1,
        ...transaction,
        date: new Date()
      };
      
      this.transactions.push(newTransaction);
      
      return {
        success: true,
        data: newTransaction
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
      const index = this.transactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }

      this.transactions[index] = {
        ...this.transactions[index],
        ...updates
      };

      return {
        success: true,
        data: this.transactions[index]
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
      const index = this.transactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Transaction not found');
      }

      const deleted = this.transactions.splice(index, 1)[0];
      
      return {
        success: true,
        data: deleted
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