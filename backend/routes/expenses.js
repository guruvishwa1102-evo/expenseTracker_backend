const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense'); // Ensure this path is correct for your project
const authMiddleware = require('../middleware/auth'); // 👇 YOU MUST HAVE THIS IMPORT!

// 1. Fetch ONLY the logged-in user's expenses
router.get('/', authMiddleware, async (req, res) => {
  try {
    // The authMiddleware gives us req.user.id
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// 2. Save new expense WITH the user's ID attached
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text, amount, type, category } = req.body;
    
    const newExpense = new Expense({
      text,
      amount,
      type,
      category,
      user: req.user.id // 🚨 Tag this expense with the user's ID
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3. Delete an expense (Also protected by authMiddleware!)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Find the expense AND make sure it belongs to the user requesting the delete
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;