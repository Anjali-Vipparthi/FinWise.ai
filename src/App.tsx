import React, { useState, useRef, useEffect } from 'react';
import { 
  Wallet, 
  PieChart, 
  TrendingUp, 
  DollarSign,
  CreditCard,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Send,
  X,
  Trash2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
};

const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Income',
  'Other'
];

function App() {
  const [balance, setBalance] = useState(428050.75);
  const [expenses, setExpenses] = useState(98234.50);
  const [savings, setSavings] = useState(65890.25);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', name: 'Grocery Shopping', amount: -5250.00, category: 'Food', date: '2024-03-10' },
    { id: '2', name: 'Salary Deposit', amount: 85000.00, category: 'Income', date: '2024-03-08' },
    { id: '3', name: 'Netflix Subscription', amount: -649.00, category: 'Entertainment', date: '2024-03-07' },
    { id: '4', name: 'Petrol', amount: -2800.00, category: 'Transport', date: '2024-03-06' },
    { id: '5', name: 'Electricity Bill', amount: -3500.00, category: 'Bills', date: '2024-03-05' },
    { id: '6', name: 'Health Insurance', amount: -2100.00, category: 'Health', date: '2024-03-04' },
    { id: '7', name: 'Online Course', amount: -1999.00, category: 'Education', date: '2024-03-03' },
    { id: '8', name: 'Shopping Mall', amount: -4500.00, category: 'Shopping', date: '2024-03-02' }
  ]);
  const [newTransaction, setNewTransaction] = useState({
    name: '',
    amount: '',
    category: 'Other'
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsTransactionModalOpen(false);
        setIsClearModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount) return;

    const amount = parseFloat(newTransaction.amount);
    const transaction: Transaction = {
      id: Date.now().toString(),
      name: newTransaction.name,
      amount: newTransaction.category === 'Income' ? Math.abs(amount) : -Math.abs(amount),
      category: newTransaction.category,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([transaction, ...transactions]);
    updateBalances(transaction);
    setNewTransaction({ name: '', amount: '', category: 'Other' });
    setIsTransactionModalOpen(false);
  };

  const updateBalances = (transaction: Transaction) => {
    if (transaction.category === 'Income') {
      setBalance(prev => prev + transaction.amount);
      setSavings(prev => prev + (transaction.amount * 0.2)); // Automatically save 20% of income
    } else {
      setBalance(prev => prev + transaction.amount);
      setExpenses(prev => prev - transaction.amount);
    }
  };

  const handleClearAll = () => {
    setBalance(0);
    setExpenses(0);
    setSavings(0);
    setTransactions([]);
    setIsClearModalOpen(false);
  };

  const getCategoryTotals = () => {
    const totals: { [key: string]: number } = {};
    categories.forEach(category => {
      totals[category] = transactions
        .filter(t => t.category === category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    });
    return totals;
  };

  const getTopExpenseCategory = () => {
    const totals = getCategoryTotals();
    delete totals['Income'];
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)[0];
  };

  const getSavingsRate = () => {
    const totalIncome = transactions
      .filter(t => t.category === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    return totalIncome ? (savings / totalIncome) * 100 : 0;
  };

  const getMonthlySpending = () => {
    const currentMonth = new Date().getMonth();
    return transactions
      .filter(t => {
        const transactionMonth = new Date(t.date).getMonth();
        return transactionMonth === currentMonth && t.amount < 0;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  if (isViewAllOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-4">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => setIsViewAllOpen(false)}
            className="mb-6 inline-flex items-center text-pink-600 hover:text-pink-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Transactions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryTransactions = transactions.filter(t => t.category === category);
                if (categoryTransactions.length === 0) return null;
                
                return (
                  <div key={category} className="bg-pink-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                    <div className="space-y-3">
                      {categoryTransactions.map(transaction => (
                        <div key={transaction.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{transaction.name}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                          <p className={`font-medium ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-pink-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">FinWise.ai</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsClearModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </button>
              <button 
                onClick={() => setIsTransactionModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Balance</h3>
              </div>
              <span className="flex items-center text-sm text-pink-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +2.5%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{balance.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <CreditCard className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Expenses</h3>
              </div>
              <span className="flex items-center text-sm text-pink-600">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                -4.2%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{expenses.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Target className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Savings</h3>
              </div>
              <span className="flex items-center text-sm text-pink-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +8.1%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{savings.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              <button 
                onClick={() => setIsViewAllOpen(true)}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-pink-100'
                    }`}>
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-pink-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-pink-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Panel */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Insights</h2>
            <div className="space-y-6">
              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <PieChart className="h-5 w-5 text-pink-600" />
                  <h3 className="font-medium text-gray-900">Spending Analysis</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Your highest expense category is{' '}
                    <span className="font-medium text-pink-600">
                      {getTopExpenseCategory()[0]}
                    </span>{' '}
                    at ₹{getTopExpenseCategory()[1].toLocaleString('en-IN')}.
                  </p>
                  <p className="text-sm text-gray-600">
                    Monthly spending: ₹{getMonthlySpending().toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="h-5 w-5 text-pink-600" />
                  <h3 className="font-medium text-gray-900">Savings Goal</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Current savings rate: {getSavingsRate().toFixed(1)}% of income
                  </p>
                  <p className="text-sm text-gray-600">
                    At this rate, you'll reach ₹7,50,000 in savings by December 2024.
                  </p>
                  <p className="text-sm text-gray-600">
                    Tip: Increase your savings rate to 30% to reach your goal faster.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-pink-600" />
                  <h3 className="font-medium text-gray-900">Investment Opportunities</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Recommended portfolio allocation:
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>50% in Low-risk Mutual Funds</li>
                    <li>30% in Fixed Deposits</li>
                    <li>20% in Blue-chip Stocks</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Expected annual returns: 12-15%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Transaction</h2>
              <button 
                onClick={() => setIsTransactionModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="name"
                  value={newTransaction.name}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter transaction description"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddTransaction}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <Send className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Clear All Data</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to clear all financial data? This action cannot be undone.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;