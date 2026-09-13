import React, { useEffect, useState } from 'react';
import { getTransactions } from '../api';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  History,
  Search,
  CalendarDays,
  ReceiptText,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransactions()
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatMoney = (n) =>
    Number(n).toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    });

  const iconFor = (type) => {
    if (type === 'Deposit' || type === 'Interest') {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          <ArrowDownLeft size={17} className="text-emerald-600" />
        </div>
      );
    }

    if (type === 'Withdrawal') {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
          <ArrowUpRight size={17} className="text-red-600" />
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
        <ArrowLeftRight size={17} className="text-blue-600" />
      </div>
    );
  };

  const getTypeBadge = (type) => {
    if (type === 'Deposit' || type === 'Interest') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }

    if (type === 'Withdrawal') {
      return 'bg-red-50 text-red-700 border-red-100';
    }

    return 'bg-blue-50 text-blue-700 border-blue-100';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
                  <History size={22} className="text-white" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                    Banking Activity
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Transaction History
                  </h1>
                </div>
              </div>

              <p className="text-sm text-slate-500 ml-14">
                Review and monitor all your recent account transactions.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">
              <ShieldCheck size={15} />
              Secure Transactions
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && transactions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {transactions.length}
                  </p>
                </div>

                <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ReceiptText size={20} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Deposits
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">
                    {
                      transactions.filter(
                        (t) => t.type === 'Deposit' || t.type === 'Interest'
                      ).length
                    }
                  </p>
                </div>

                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ArrowDownLeft size={20} className="text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Withdrawals
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {
                      transactions.filter(
                        (t) => t.type === 'Withdrawal'
                      ).length
                    }
                  </p>
                </div>

                <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center">
                  <ArrowUpRight size={20} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  All Transactions
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Complete record of your banking activity
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
                <CalendarDays size={15} />
                Recent Activity
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
                <Loader2
                  size={24}
                  className="text-primary-600 animate-spin"
                />
              </div>

              <p className="font-semibold text-slate-700">
                Loading transactions...
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Please wait while we fetch your activity.
              </p>
            </div>
          ) : transactions.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <ReceiptText size={28} className="text-slate-400" />
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                No transactions found
              </h3>

              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Your transaction activity will appear here once you make a
                deposit, withdrawal, or transfer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                {/* Table Header */}
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="text-left px-5 py-4 font-semibold text-slate-500 whitespace-nowrap">
                      Date & Time
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-slate-500">
                      Transaction
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-slate-500">
                      Details
                    </th>

                    <th className="text-right px-5 py-4 font-semibold text-slate-500">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-slate-500">
                      Transaction ID
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">

                  {transactions.map((t) => (
                    <tr
                      key={t._id}
                      className="group hover:bg-slate-50/80 transition-colors"
                    >

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-white transition">
                            <CalendarDays
                              size={16}
                              className="text-slate-500"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-slate-700">
                              {new Date(t.createdAt).toLocaleDateString(
                                'en-PK',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </p>

                            <p className="text-xs text-slate-400 mt-0.5">
                              {new Date(t.createdAt).toLocaleTimeString(
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

                      {/* Type */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {iconFor(t.type)}

                          <div>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getTypeBadge(
                                t.type
                              )}`}
                            >
                              {t.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="px-5 py-4 min-w-[220px]">
                        <p className="font-medium text-slate-700">
                          {t.description || 'No description'}
                        </p>

                        {(t.fromAccountNumber || t.toAccountNumber) && (
                          <div className="text-xs text-slate-400 mt-1.5 space-y-0.5">

                            {t.fromAccountNumber && (
                              <div>
                                <span className="font-medium text-slate-500">
                                  From:
                                </span>{' '}
                                <span className="font-mono">
                                  {t.fromAccountNumber}
                                </span>
                              </div>
                            )}

                            {t.toAccountNumber && (
                              <div>
                                <span className="font-medium text-slate-500">
                                  To:
                                </span>{' '}
                                <span className="font-mono">
                                  {t.toAccountNumber}
                                </span>
                              </div>
                            )}

                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div
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
                          {formatMoney(t.amount)}
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1">
                          PKR
                        </p>
                      </td>

                      {/* Transaction ID */}
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1.5">
                          <span className="text-xs font-mono text-slate-500">
                            {t.transactionId}
                          </span>
                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck size={17} className="text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Your transactions are secure
              </p>
              <p className="text-xs text-slate-400">
                Protected banking activity and encrypted account data.
              </p>
            </div>
          </div>

          <span className="text-xs font-medium text-slate-400">
            SecureBank
          </span>
        </div>

      </div>
    </div>
  );
}