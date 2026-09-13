
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccounts, getTransactions } from '../api';
import { useAuth } from '../context/AuthContext';

import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  History,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  MoreHorizontal,
  CircleDollarSign,
  Activity,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAccounts(), getTransactions()])
      .then(([accRes, txnRes]) => {
        setAccounts(accRes.data);
        setTransactions(txnRes.data.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalBalance = accounts.reduce(
    (s, a) => s + (a.balance || 0),
    0
  );

  const formatMoney = (n) =>
    Number(n).toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    });

  const getTransactionIcon = (type) => {
    if (type === 'Deposit' || type === 'Interest') {
      return {
        icon: ArrowDownLeft,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600',
      };
    }

    if (type === 'Withdrawal') {
      return {
        icon: ArrowUpRight,
        bg: 'bg-red-50',
        color: 'text-red-600',
      };
    }

    return {
      icon: ArrowLeftRight,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    };
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-slate-200 border-t-primary-600 animate-spin" />
          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-primary-600" />

              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                Banking Dashboard
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back, {user?.name}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Here's an overview of your banking activity.
            </p>
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck
                size={16}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                Account Secure
              </p>

              <p className="text-[10px] text-slate-400">
                Protected & encrypted
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            TOP STATS
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">

          {/* Balance Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-700 p-6 sm:p-7 text-white shadow-xl shadow-primary-600/20">

            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -right-6 -bottom-24 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10">

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
                    <Wallet size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-primary-100">
                      Total Balance
                    </p>

                    <p className="text-xs text-primary-200 mt-0.5">
                      Across all accounts
                    </p>
                  </div>
                </div>

                <button className="p-2 rounded-lg hover:bg-white/10 transition">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                {formatMoney(totalBalance)}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-5">

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
                  <CreditCard size={14} />

                  <span className="text-xs text-primary-100">
                    {accounts.length} account
                    {accounts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-primary-100">
                  <TrendingUp size={14} />
                  Your finances at a glance
                </div>
              </div>
            </div>
          </div>

          {/* Account Count Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <CircleDollarSign
                  size={22}
                  className="text-blue-600"
                />
              </div>

              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Active
              </span>
            </div>

            <p className="text-sm text-slate-500">
              Total Accounts
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-1">
              {accounts.length}
            </p>

            <Link
              to="/accounts"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 mt-5 hover:text-primary-700"
            >
              Manage accounts
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}
        <div className="mb-8">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Frequently used banking services
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

            {[
              {
                to: '/accounts',
                label: 'My Accounts',
                icon: Wallet,
                bg: 'bg-blue-50',
                iconColor: 'text-blue-600',
              },
              {
                to: '/transfer',
                label: 'Transfer Money',
                icon: ArrowLeftRight,
                bg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
              },
              {
                to: '/transactions',
                label: 'Transaction History',
                icon: History,
                bg: 'bg-violet-50',
                iconColor: 'text-violet-600',
              },
              {
                to: '/accounts',
                label: 'Deposit / Withdraw',
                icon: ArrowUpRight,
                bg: 'bg-amber-50',
                iconColor: 'text-amber-600',
              },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="
                  group
                  bg-white
                  border border-slate-200
                  rounded-2xl
                  p-4
                  sm:p-5
                  hover:border-slate-300
                  hover:shadow-lg
                  hover:-translate-y-0.5
                  transition-all
                "
              >
                <div className="flex items-center justify-between">

                  <div
                    className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center`}
                  >
                    <action.icon
                      size={21}
                      className={action.iconColor}
                    />
                  </div>

                  <ChevronRight
                    size={17}
                    className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition"
                  />
                </div>

                <p className="text-sm font-semibold text-slate-800 mt-4">
                  {action.label}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Manage securely
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* =====================================================
            ACCOUNTS + TRANSACTIONS
        ====================================================== */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* =================================================
              ACCOUNTS
          ================================================== */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

            <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Your Accounts
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Your connected bank accounts
                </p>
              </div>

              <Link
                to="/accounts"
                className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            {accounts.length === 0 ? (
              <div className="p-10 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <Wallet
                    size={25}
                    className="text-slate-400"
                  />
                </div>

                <p className="font-semibold text-slate-700">
                  No accounts yet
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Contact admin to open an account.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {accounts.map((acc) => (
                  <div
                    key={acc._id}
                    className="px-5 sm:px-6 py-4 hover:bg-slate-50/80 transition"
                  >
                    <div className="flex items-center justify-between gap-4">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <CreditCard
                            size={18}
                            className="text-slate-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800">
                            {acc.type} Account
                          </p>

                          <p className="text-xs text-slate-400 font-mono mt-1 truncate">
                            {acc.accountNumber}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">

                        <p className="font-bold text-sm text-slate-800">
                          {formatMoney(acc.balance)}
                        </p>

                        <span
                          className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 ${
                            acc.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {acc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =================================================
              TRANSACTIONS
          ================================================== */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

            <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Transactions
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Your latest account activity
                </p>
              </div>

              <Link
                to="/transactions"
                className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            {transactions.length === 0 ? (
              <div className="p-10 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                  <History
                    size={25}
                    className="text-slate-400"
                  />
                </div>

                <p className="font-semibold text-slate-700">
                  No transactions yet
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Your recent activity will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {transactions.map((t) => {
                  const transactionStyle =
                    getTransactionIcon(t.type);

                  const TransactionIcon =
                    transactionStyle.icon;

                  const isCredit =
                    t.type === 'Deposit' ||
                    t.type === 'Interest';

                  return (
                    <div
                      key={t._id}
                      className="px-5 sm:px-6 py-4 hover:bg-slate-50/80 transition"
                    >
                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">

                          <div
                            className={`w-10 h-10 rounded-xl ${transactionStyle.bg} flex items-center justify-center shrink-0`}
                          >
                            <TransactionIcon
                              size={18}
                              className={transactionStyle.color}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-800">
                              {t.type}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(
                                t.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">

                          <p
                            className={`font-bold text-sm ${
                              isCredit
                                ? 'text-emerald-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {isCredit ? '+' : '-'}
                            {formatMoney(t.amount)}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-1">
                            Completed
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            SECURITY FOOTER
        ====================================================== */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          Your banking information is protected with secure encryption.
        </div>

      </div>
    </div>
  );
}

