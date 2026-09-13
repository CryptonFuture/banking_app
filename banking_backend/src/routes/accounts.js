const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Get my accounts (customer) or all (admin)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    const accounts = await Account.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single account
router.get('/:id', protect, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id).populate('user', 'name email phone');
    if (!account) return res.status(404).json({ error: 'Account not found' });

    // Customer can only view own account
    if (req.user.role !== 'admin' && account.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create account (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { userId, type, initialBalance, interestRate, branch } = req.body;
    if (!userId || !type) {
      return res.status(400).json({ error: 'userId and type are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const account = new Account({
      user: userId,
      type,
      balance: Number(initialBalance) || 0,
      interestRate: type === 'Savings' ? (Number(interestRate) || 4.5) : 0,
      branch: branch || 'Main Branch'
    });
    await account.save();

    const populated = await Account.findById(account._id).populate('user', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update status (Freeze / Unfreeze / Close) - admin
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Frozen', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all customers (admin) - helper for creating accounts
router.get('/admin/customers', protect, adminOnly, async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer', isActive: true })
      .select('name email phone createdAt')
      .sort({ name: 1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
