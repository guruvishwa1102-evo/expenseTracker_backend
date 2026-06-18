import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, Wallet, LogOut, User, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Tracker() {
  // 📊 Core State
  const [transactions, setTransactions] = useState([]);

  // 📝 Form States
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  
  // 🌟 Profile Drawer States (Using Lazy Initialization for Performance)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [currentUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
const [savedAccounts] = useState(() => {
    const storedAccounts = localStorage.getItem('savedAccounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  });

  const navigate = useNavigate();

  // 🌐 FETCH DATA ON LOAD
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('https://expensetracker-api-nezd.onrender.com/api/expenses', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
      .then(res => res.json())
      .then(data => {
        // 🛡️ THE SHIELD: Prevent React from crashing if data is weird
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Backend refused to send data:", data);
          setTransactions([]); 
        }
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setTransactions([]);
      });
  }, []);

  // 🧮 Calculations (With Safety Nets)
  const income = (transactions || [])
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = (transactions || [])
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = income - expenses;

  // 🚪 CLEAN LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    navigate('/', { replace: true }); 
  };

  // 🔄 SWITCH ACCOUNT FUNCTION
  const handleSwitchAccount = (accountToken, accountUser) => {
    // Swap the active credentials
    localStorage.setItem('token', accountToken);
    localStorage.setItem('user', JSON.stringify(accountUser));
    
    // Close drawer and force a page reload to fetch the new data securely
    setIsProfileOpen(false);
    window.location.reload(); 
  };

  // ➕ ADD TRANSACTION TO MONGODB
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    if (!text || !amount) {
      alert("Please enter both a description and an amount!");
      return;
    }

    const newTransaction = {
      text,
      amount: parseFloat(amount),
      type,
      category
    };

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://expensetracker-api-nezd.onrender.com/api/expenses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newTransaction)
      });
      
      const savedData = await response.json();
      
      if (!response.ok) {
        console.error("Backend Error:", savedData);
        alert("Database Error: " + (savedData.error || "Unknown error"));
        return; 
      }
      
      setTransactions([savedData, ...transactions]);
      setText('');
      setAmount('');
    } catch (err) {
      console.error("Network Error:", err);
      alert("Could not connect to the server!");
    }
  };

  // ❌ DELETE TRANSACTION FROM MONGODB
  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token'); 
      
      await fetch(`https://expensetracker-api-nezd.onrender.com/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans overflow-x-hidden relative">
      
      {/* 🚀 OFF-CANVAS PROFILE DRAWER */}
      {/* Dark Background Overlay */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity cursor-pointer"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* The Sliding Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-slate-800 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Accounts</h2>
            <button onClick={() => setIsProfileOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700 transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>

          {/* Current Active Profile */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Profile</p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-xl uppercase">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-emerald-400 truncate">{currentUser?.name || 'User'}</h3>
                <p className="text-xs text-slate-400 truncate">{currentUser?.email || 'email@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Saved Profiles List */}
          <div className="flex-1 overflow-y-auto pr-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Saved Accounts</p>
            
            {savedAccounts.length === 0 ? (
              <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700 border-dashed text-sm text-slate-500">
                No other accounts saved.<br/>Log in to another account to save it here.
              </div>
            ) : (
              <div className="space-y-3">
                {savedAccounts.map((account, index) => (
                  // Don't show the currently active account in the "Saved" list
                  account.user.email !== currentUser?.email && (
                    <div 
                      key={index}
                      onClick={() => handleSwitchAccount(account.token, account.user)}
                      className="group bg-slate-900/50 border border-slate-700 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:bg-slate-700/50 hover:border-slate-500 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-white font-bold uppercase">
                          {account.user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-semibold text-slate-200 group-hover:text-white truncate">{account.user.name}</h4>
                          <p className="text-xs text-slate-400 truncate">{account.user.email}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-500 group-hover:text-white flex-shrink-0" />
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="mt-6 space-y-3 pt-4 border-t border-slate-700">
            <button 
              onClick={() => navigate('/', { replace: true })}
              className="w-full py-3 bg-indigo-600/20 text-indigo-400 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors flex justify-center items-center gap-2 cursor-pointer"
            >
              <PlusCircle size={18} /> Add Existing Account
            </button>
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-rose-500/10 text-rose-400 font-semibold rounded-xl hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
            >
              Log Out Current Profile
            </button>
          </div>
        </div>
      </div>


      {/* 🚀 MAIN TRACKER DASHBOARD */}
      <div className="max-w-6xl mx-auto">
        
        {/* 🌟 Header */}
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-900">
              <Wallet size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Smart Expense Tracker</h1>
              <p className="text-sm text-slate-400">Monitor your income, expenses, and visual analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 👤 Profile Button */}
            <button 
              onClick={() => setIsProfileOpen(true)} 
              className="flex items-center gap-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-bold py-2 px-4 rounded-xl transition-all duration-150 border border-slate-700 shadow-lg cursor-pointer"
            >
              <User size={18} />
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser?.name || 'Profile'}</span>
            </button>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white font-bold py-2 px-4 rounded-xl transition-all duration-150 border border-rose-500/20 shadow-lg cursor-pointer"
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* 💳 Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Total Balance</span>
              <DollarSign className="text-emerald-400" size={20} />
            </div>
            <h2 className={`text-3xl font-black ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </h2>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Total Income</span>
              <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-400">
                <TrendingUp size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-emerald-400">${income.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-400">Total Expenses</span>
              <div className="bg-rose-500/10 p-1.5 rounded-lg text-rose-400">
                <TrendingDown size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-rose-400">${expenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          </div>
        </div>

        {/* 🛠️ Main Content: Form & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-emerald-400" /> Add Transaction
            </h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <input 
                  type="text" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g., Groceries, Salary, Gas" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Food">Food</option>
                    <option value="Salary">Salary</option>
                    <option value="Housing">Housing</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-150 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                Add Transaction
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4">Transaction History</h3>
            
            {transactions.length === 0 ? (
              <p className="text-slate-500 text-center py-12">No transactions recorded yet.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {transactions.map((transaction) => (
                  <div 
                    key={transaction._id} 
                    className="group bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 flex justify-between items-center hover:border-slate-600/60 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-10 rounded-full ${transaction.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <div>
                        <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{transaction.text}</p>
                        <span className="text-xs bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-md text-slate-400 font-medium mt-1 inline-block">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </span>
                      <button 
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                        title="Delete Transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}