const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { protect, adminOnly } = require('../middleware/auth');

// Helper: check account ownership or admin
const canAccessAccount = (account, user) => {
  if (user.role === 'admin') return true;
  return account.user.toString() === user._id.toString();
};

// Deposit
router.post('/deposit', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { accountId, amount, description } = req.body;
    const amt = Number(amount);

    if (!accountId || !amt || amt <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Valid accountId and positive amount required' });
    }

    const account = await Account.findById(accountId).session(session);
    if (!account) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Account not found' });
    }
    if (!canAccessAccount(account, req.user)) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (account.status !== 'Active') {
      await session.abortTransaction();
      return res.status(400).json({ error: `Account is ${account.status}` });
    }

    account.balance += amt;
    await account.save({ session });

    const [txn] = await Transaction.create([{
      type: 'Deposit',
      amount: amt,
      toAccount: account._id,
      toAccountNumber: account.accountNumber,
      description: description || 'Cash deposit',
      balanceAfter: account.balance,
      performedBy: req.user._id,
      status: 'Completed'
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ transaction: txn, newBalance: account.balance });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Withdraw
router.post('/withdraw', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { accountId, amount, description } = req.body;
    const amt = Number(amount);

    if (!accountId || !amt || amt <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Valid accountId and positive amount required' });
    }

    const account = await Account.findById(accountId).session(session);
    if (!account) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Account not found' });
    }
    if (!canAccessAccount(account, req.user)) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (account.status !== 'Active') {
      await session.abortTransaction();
      return res.status(400).json({ error: `Account is ${account.status}` });
    }
    if (account.balance < amt) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    account.balance -= amt;
    await account.save({ session });

    const [txn] = await Transaction.create([{
      type: 'Withdrawal',
      amount: amt,
      fromAccount: account._id,
      fromAccountNumber: account.accountNumber,
      description: description || 'Cash withdrawal',
      balanceAfter: account.balance,
      performedBy: req.user._id,
      status: 'Completed'
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ transaction: txn, newBalance: account.balance });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Transfer
router.post('/transfer', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;
    const amt = Number(amount);

    if (!fromAccountId || !toAccountNumber || !amt || amt <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'fromAccountId, toAccountNumber and positive amount required' });
    }

    const fromAccount = await Account.findById(fromAccountId).session(session);
    if (!fromAccount) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Source account not found' });
    }
    if (!canAccessAccount(fromAccount, req.user)) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'Not authorized for source account' });
    }
    if (fromAccount.status !== 'Active') {
      await session.abortTransaction();
      return res.status(400).json({ error: `Source account is ${fromAccount.status}` });
    }
    if (fromAccount.balance < amt) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const toAccount = await Account.findOne({ accountNumber: toAccountNumber }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Destination account not found' });
    }
    if (toAccount.status !== 'Active') {
      await session.abortTransaction();
      return res.status(400).json({ error: `Destination account is ${toAccount.status}` });
    }
    if (fromAccount._id.toString() === toAccount._id.toString()) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cannot transfer to the same account' });
    }

    fromAccount.balance -= amt;
    toAccount.balance += amt;
    await fromAccount.save({ session });
    await toAccount.save({ session });

    const [txn] = await Transaction.create([{
      type: 'Transfer',
      amount: amt,
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      fromAccountNumber: fromAccount.accountNumber,
      toAccountNumber: toAccount.accountNumber,
      description: description || `Transfer to ${toAccount.accountNumber}`,
      balanceAfter: fromAccount.balance,
      performedBy: req.user._id,
      status: 'Completed'
    }], { session });

    await session.commitTransaction();
    res.status(201).json({
      transaction: txn,
      fromBalance: fromAccount.balance,
      toBalance: toAccount.balance
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Get my transactions (or all for admin)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      // Find user's accounts first
      const accounts = await Account.find({ user: req.user._id }).select('_id');
      const accountIds = accounts.map(a => a._id);
      query.$or = [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } }
      ];
    }

    const transactions = await Transaction.find(query)
      .populate('fromAccount', 'accountNumber type')
      .populate('toAccount', 'accountNumber type')
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transactions for a specific account
router.get('/account/:accountId', protect, async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    if (!canAccessAccount(account, req.user)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
