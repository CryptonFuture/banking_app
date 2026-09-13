const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal', 'Transfer', 'Interest'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  // For display convenience
  fromAccountNumber: String,
  toAccountNumber: String,
  description: {
    type: String,
    default: ''
  },
  balanceAfter: {
    type: Number // balance of the primary account after this txn
  },
  status: {
    type: String,
    enum: ['Completed', 'Failed', 'Pending'],
    default: 'Completed'
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const count = await mongoose.model('Transaction').countDocuments();
    this.transactionId = `TXN${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
