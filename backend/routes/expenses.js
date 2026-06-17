const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// 📥 GET: Fetch all expenses from the database
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📤 POST: Add a brand new expense
router.post('/', async (req, res) => {
  try {
    const { text, amount, type, category } = req.body;
    const newExpense = new Expense({ text, amount, type, category });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🗑️ DELETE: Remove an expense by its ID
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    await expense.deleteOne();
    res.status(200).json({ success: true, msg: 'Expense removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;