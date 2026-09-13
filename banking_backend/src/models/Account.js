const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Savings', 'Current'],
    required: true,
    default: 'Savings'
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  status: {
    type: String,
    enum: ['Active', 'Frozen', 'Closed'],
    default: 'Active'
  },
  interestRate: {
    type: Number,
    default: 0 // annual % for savings
  },
  branch: {
    type: String,
    default: 'Main Branch'
  }
}, {
  timestamps: true
});

// Generate account number before validation
accountSchema.pre('validate', async function(next) {
  if (!this.accountNumber) {
    const count = await mongoose.model('Account').countDocuments();
    const prefix = this.type === 'Savings' ? 'SAV' : 'CUR';
    this.accountNumber = `${prefix}${String(100000 + count + 1)}`;
  }
  next();
});

module.exports = mongoose.model('Account', accountSchema);
