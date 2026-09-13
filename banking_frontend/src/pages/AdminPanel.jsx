import React, { useEffect, useState } from 'react';
import {
  getAccounts,
  getCustomers,
  createAccount,
  updateAccountStatus,
  getTransactions,
} from '../api';

import {
  Shield,
  Plus,
  RefreshCw,
  Users,
  WalletCards,
  ReceiptText,
  LockKeyhole,
  UserPlus,
  CheckCircle2,
  Snowflake,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Loader2,
  Mail,
  Phone,
  CalendarDays,
  MoreHorizontal,
} from 'lucide-react';

export default function AdminPanel() {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState('accounts');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    userId: '',
    type: 'Savings',
    initialBalance: '0',
    interestRate: '5',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const [accRes, custRes, txnRes] = await Promise.all([
        getAccounts(),
        getCustomers(),
        getTransactions(),
      ]);

      setAccounts(accRes.data);
      setCustomers(custRes.data);
      setTransactions(txnRes.data.slice(0, 20));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createAccount({
        userId: form.userId,
        type: form.type,
        initialBalance: Number(form.initialBalance),
        interestRate: Number(form.interestRate),
      });

      setSuccess('Account created successfully');
      setShowForm(false);

      setForm({
        userId: '',
        type: 'Savings',
        initialBalance: '0',
        interestRate: '5',
      });

      load();
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to create account'
      );
    }
  };

  const handleStatus = async (id, status) => {
    setError('');
    setSuccess('');

    try {
      await updateAccountStatus(id, status);
      setSuccess(`Account ${status}`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed');
    }
  };

  const formatMoney = (n) =>
    Number(n).toLocaleString('en-PK');

  const activeAccounts = accounts.filter(
    (a) => a.status === 'Active'
  ).length;

  const frozenAccounts = accounts.filter(
    (a) => a.status === 'Frozen'
  ).length;

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account.balance || 0),
    0
  );

  const getTransactionIcon = (type) => {
    if (type === 'Deposit' || type === 'Interest') {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <ArrowDownLeft
            size={17}
            className="text-emerald-600"
          />
        </div>
      );
    }

    if (type === 'Withdrawal') {
      return (
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
          <ArrowUpRight
            size={17}
            className="text-red-600"
          />
        </div>
      );
    }

    return (
      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
        <ArrowLeftRight
          size={17}
          className="text-blue-600"
        />
      </div>
    );
  };

  const getStatusStyle = (status) => {
    if (status === 'Active') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }

    if (status === 'Frozen') {
      return 'bg-amber-50 text-amber-700 border-amber-100';
    }

    return 'bg-red-50 text-red-700 border-red-100';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================= HEADER ================= */}
        <div className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Shield
                    size={24}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Administration
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Admin Panel
                  </h1>
                </div>
              </div>

              <p className="text-sm text-slate-500 ml-15">
                Manage accounts, customers and banking transactions.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                <LockKeyhole size={14} />
                Admin Secure Access
              </div>

              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={loading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ================= ALERTS ================= */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <XCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold text-sm">
                Something went wrong
              </p>

              <p className="text-sm mt-0.5">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold text-sm">
                Operation successful
              </p>

              <p className="text-sm mt-0.5">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ================= SUMMARY ================= */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* Accounts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Accounts
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {accounts.length}
                  </p>

                  <p className="text-xs text-emerald-600 mt-1">
                    {activeAccounts} active
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <WalletCards
                    size={20}
                    className="text-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Customers */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Customers
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {customers.length}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Registered users
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Users
                    size={20}
                    className="text-violet-600"
                  />
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Balance
                  </p>

                  <p className="text-xl font-bold text-slate-900 mt-1">
                    PKR {formatMoney(totalBalance)}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Across all accounts
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ReceiptText
                    size={20}
                    className="text-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Frozen */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Frozen Accounts
                  </p>

                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {frozenAccounts}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Require attention
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Snowflake
                    size={20}
                    className="text-amber-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TABS ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2">

            <div className="flex flex-1 gap-1 overflow-x-auto">
              {[
                {
                  id: 'accounts',
                  label: 'Accounts',
                  icon: WalletCards,
                },
                {
                  id: 'customers',
                  label: 'Customers',
                  icon: Users,
                },
                {
                  id: 'transactions',
                  label: 'Transactions',
                  icon: ReceiptText,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                      tab === item.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={16} />

                    {item.label}

                    <span
                      className={`text-[11px] rounded-full px-1.5 py-0.5 ${
                        tab === item.id
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.id === 'accounts'
                        ? accounts.length
                        : item.id === 'customers'
                        ? customers.length
                        : transactions.length}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={load}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <RefreshCw size={15} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl py-20 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Loader2
                size={26}
                className="text-primary-600 animate-spin"
              />
            </div>

            <h3 className="font-semibold text-slate-800">
              Loading admin data...
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Please wait while we fetch the latest information.
            </p>
          </div>
        ) : (
          <>
            {/* ================================================= */}
            {/* ACCOUNTS */}
            {/* ================================================= */}
            {tab === 'accounts' && (
              <div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      All Accounts
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                      Manage customer bank accounts and account status.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/20 hover:from-primary-700 hover:to-primary-800 transition"
                  >
                    <Plus size={17} />
                    New Account
                  </button>
                </div>

                {/* Create Account Form */}
                {showForm && (
                  <form
                    onSubmit={handleCreate}
                    className="bg-white border border-slate-200 rounded-3xl p-5 mb-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                        <UserPlus
                          size={19}
                          className="text-primary-600"
                        />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          Create New Account
                        </h3>

                        <p className="text-xs text-slate-400">
                          Assign a new bank account to a customer.
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Customer
                        </label>

                        <select
                          required
                          value={form.userId}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              userId: e.target.value,
                            })
                          }
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                        >
                          <option value="">
                            Select customer
                          </option>

                          {customers.map((c) => (
                            <option
                              key={c._id}
                              value={c._id}
                            >
                              {c.name} ({c.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Account Type
                        </label>

                        <select
                          value={form.type}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              type: e.target.value,
                            })
                          }
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                        >
                          <option value="Savings">
                            Savings
                          </option>

                          <option value="Current">
                            Current
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Initial Balance
                        </label>

                        <input
                          type="number"
                          placeholder="0"
                          value={form.initialBalance}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              initialBalance: e.target.value,
                            })
                          }
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full bg-slate-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-800 transition"
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Accounts Table */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

                  <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Account Directory
                        </h3>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {accounts.length} accounts registered
                        </p>
                      </div>

                      <WalletCards
                        size={20}
                        className="text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200">
                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Account
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Customer
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Type
                          </th>

                          <th className="text-right px-5 py-4 font-semibold text-slate-500">
                            Balance
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Status
                          </th>

                          <th className="text-right px-5 py-4 font-semibold text-slate-500">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {accounts.map((a) => (
                          <tr
                            key={a._id}
                            className="group hover:bg-slate-50/70 transition"
                          >
                            <td className="px-5 py-4">
                              <div className="inline-flex items-center gap-2 bg-slate-100 rounded-lg px-2.5 py-1.5">
                                <WalletCards
                                  size={14}
                                  className="text-slate-400"
                                />

                                <span className="font-mono text-xs font-medium text-slate-600">
                                  {a.accountNumber}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                                  <span className="text-xs font-bold text-primary-700">
                                    {(
                                      a.user?.name || 'U'
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>

                                <span className="font-semibold text-slate-700">
                                  {a.user?.name || '—'}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="text-xs font-semibold text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">
                                {a.type}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <span className="font-bold text-slate-800">
                                PKR {formatMoney(a.balance)}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 border text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyle(
                                  a.status
                                )}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {a.status}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">

                                {a.status === 'Active' && (
                                  <button
                                    onClick={() =>
                                      handleStatus(
                                        a._id,
                                        'Frozen'
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition"
                                  >
                                    <Snowflake size={13} />
                                    Freeze
                                  </button>
                                )}

                                {a.status === 'Frozen' && (
                                  <button
                                    onClick={() =>
                                      handleStatus(
                                        a._id,
                                        'Active'
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition"
                                  >
                                    <CheckCircle2 size={13} />
                                    Unfreeze
                                  </button>
                                )}

                                {a.status !== 'Closed' && (
                                  <button
                                    onClick={() =>
                                      handleStatus(
                                        a._id,
                                        'Closed'
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition"
                                  >
                                    <XCircle size={13} />
                                    Close
                                  </button>
                                )}

                                {a.status === 'Closed' && (
                                  <span className="text-xs text-slate-400">
                                    Closed
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* CUSTOMERS */}
            {/* ================================================= */}
            {tab === 'customers' && (
              <div>

                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Customer Directory
                  </h2>

                  <p className="text-sm text-slate-500 mt-0.5">
                    View registered customers and their contact information.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

                  <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          All Customers
                        </h3>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {customers.length} registered customers
                        </p>
                      </div>

                      <Users
                        size={20}
                        className="text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200">
                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Customer
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Email
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Phone
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Joined
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {customers.map((c) => (
                          <tr
                            key={c._id}
                            className="hover:bg-slate-50/70 transition"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center">
                                  <span className="text-sm font-bold text-violet-700">
                                    {c.name
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>

                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {c.name}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    Customer
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Mail
                                  size={15}
                                  className="text-slate-400"
                                />

                                {c.email}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Phone
                                  size={15}
                                  className="text-slate-400"
                                />

                                {c.phone || '—'}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2 text-slate-500">
                                <CalendarDays
                                  size={15}
                                  className="text-slate-400"
                                />

                                {new Date(
                                  c.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* TRANSACTIONS */}
            {/* ================================================= */}
            {tab === 'transactions' && (
              <div>

                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Transactions
                  </h2>

                  <p className="text-sm text-slate-500 mt-0.5">
                    Monitor the latest banking transactions across accounts.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

                  <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Transaction Activity
                        </h3>

                        <p className="text-xs text-slate-400 mt-0.5">
                          Showing latest {transactions.length} transactions
                        </p>
                      </div>

                      <ReceiptText
                        size={20}
                        className="text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">

                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200">
                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Date
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            Type
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            From / To
                          </th>

                          <th className="text-right px-5 py-4 font-semibold text-slate-500">
                            Amount
                          </th>

                          <th className="text-left px-5 py-4 font-semibold text-slate-500">
                            ID
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {transactions.map((t) => (
                          <tr
                            key={t._id}
                            className="hover:bg-slate-50/70 transition"
                          >
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <CalendarDays
                                  size={15}
                                  className="text-slate-400"
                                />

                                <div>
                                  <p className="text-xs font-medium text-slate-600">
                                    {new Date(
                                      t.createdAt
                                    ).toLocaleDateString(
                                      'en-PK',
                                      {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                      }
                                    )}
                                  </p>

                                  <p className="text-[11px] text-slate-400">
                                    {new Date(
                                      t.createdAt
                                    ).toLocaleTimeString(
                                      'en-PK',
                                      {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {getTransactionIcon(t.type)}

                                <span className="font-semibold text-slate-700">
                                  {t.type}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="text-xs font-mono">
                                <span className="text-slate-500">
                                  {t.fromAccountNumber || '—'}
                                </span>

                                <span className="mx-2 text-slate-300">
                                  →
                                </span>

                                <span className="text-slate-500">
                                  {t.toAccountNumber || '—'}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              <span
                                className={`font-bold ${
                                  t.type === 'Deposit' ||
                                  t.type === 'Interest'
                                    ? 'text-emerald-600'
                                    : 'text-slate-800'
                                }`}
                              >
                                {t.type === 'Deposit' ||
                                t.type === 'Interest'
                                  ? '+'
                                  : '-'}
                                PKR {formatMoney(t.amount)}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex bg-slate-100 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-500">
                                {t.transactionId}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ================= FOOTER ================= */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <LockKeyhole size={14} />
            SecureBank Administration Portal
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Protected Admin Access</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Secure Session</span>
          </div>
        </div>

      </div>
    </div>
  );
}