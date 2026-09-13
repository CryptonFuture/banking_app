require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/banking';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Transaction.deleteMany({});
    await Account.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@bank.com',
      password: 'admin123',
      role: 'admin',
      phone: '03001234567'
    });
    console.log('Admin created:', admin.email);

    // Customers
    const ali = await User.create({
      name: 'Ali Khan',
      email: 'ali@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '03009876543',
      address: 'Lahore, Pakistan'
    });

    const sara = await User.create({
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '03111234567',
      address: 'Karachi, Pakistan'
    });

    console.log('Customers created');

    // Accounts
    const aliSavings = await Account.create({
      user: ali._id,
      type: 'Savings',
      balance: 150000,
      interestRate: 5.5,
      branch: 'Lahore Main'
    });

    const aliCurrent = await Account.create({
      user: ali._id,
      type: 'Current',
      balance: 85000,
      interestRate: 0,
      branch: 'Lahore Main'
    });

    const saraSavings = await Account.create({
      user: sara._id,
      type: 'Savings',
      balance: 220000,
      interestRate: 5.0,
      branch: 'Karachi Branch'
    });

    console.log('Accounts created');
    console.log('  Ali Savings :', aliSavings.accountNumber, 'Balance:', aliSavings.balance);
    console.log('  Ali Current :', aliCurrent.accountNumber, 'Balance:', aliCurrent.balance);
    console.log('  Sara Savings:', saraSavings.accountNumber, 'Balance:', saraSavings.balance);

    // Sample transactions
    await Transaction.create({
      type: 'Deposit',
      amount: 50000,
      toAccount: aliSavings._id,
      toAccountNumber: aliSavings.accountNumber,
      description: 'Initial deposit',
      balanceAfter: 150000,
      performedBy: ali._id,
      status: 'Completed'
    });

    await Transaction.create({
      type: 'Transfer',
      amount: 15000,
      fromAccount: aliCurrent._id,
      toAccount: saraSavings._id,
      fromAccountNumber: aliCurrent.accountNumber,
      toAccountNumber: saraSavings.accountNumber,
      description: 'Payment to Sara',
      balanceAfter: 70000,
      performedBy: ali._id,
      status: 'Completed'
    });

    // Adjust balances to match the transfer we just recorded for demo consistency
    // (In real seed we already set final balances above)

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('  Admin    → admin@bank.com / admin123');
    console.log('  Customer → ali@example.com / customer123');
    console.log('  Customer → sara@example.com / customer123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
