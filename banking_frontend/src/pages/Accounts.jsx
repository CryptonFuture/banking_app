
import React, { useEffect, useState } from 'react';
import { getAccounts, deposit, withdraw } from '../api';

import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
  Building2,
  ShieldCheck,
  CreditCard,
  Landmark,
  CircleDollarSign,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Percent,
} from 'lucide-react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);

    getAccounts()
      .then((res) => setAccounts(res.data))
      .catch((err) =>
        setError(
          err.response?.data?.error || 'Failed to load accounts'
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const formatMoney = (n) =>
    Number(n).toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    });

  const openModal = (type, account) => {
    setModal({ type, account });
    setAmount('');
    setDesc('');
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    if (submitting) return;

    setModal(null);
    setAmount('');
    setDesc('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const payload = {
        accountId: modal.account._id,
        amount: Number(amount),
        description: desc || undefined,
      };

      if (modal.type === 'deposit') {
        await deposit(payload);
        setSuccess('Deposit completed successfully!');
      } else {
        await withdraw(payload);
        setSuccess('Withdrawal completed successfully!');
      }

      setTimeout(() => {
        setModal(null);
        load();
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Transaction failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalBalance = accounts.reduce(
    (sum, account) => sum + (account.balance || 0),
    0
  );

  const activeAccounts = accounts.filter(
    (account) => account.status === 'Active'
  ).length;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500">
            Loading your accounts...
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard
                size={16}
                className="text-primary-600"
              />

              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                Banking
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Accounts
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your accounts, balances and transactions.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck
                size={17}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                Secure Banking
              </p>

              <p className="text-[10px] text-slate-400">
                Protected & encrypted
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && !modal && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
            <AlertCircle
              size={19}
              className="text-red-600 shrink-0"
            />

            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          {/* Total Balance */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 to-indigo-700 p-5 text-white shadow-lg shadow-primary-600/15">

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />

            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <CircleDollarSign size={20} />
                </div>

                <span className="text-[10px] uppercase tracking-wider text-primary-100">
                  Total
                </span>
              </div>

              <p className="text-xs text-primary-100">
                Total Balance
              </p>

              <p className="text-2xl font-bold mt-1">
                {formatMoney(totalBalance)}
              </p>
            </div>
          </div>

          {/* Accounts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Wallet
                  size={20}
                  className="text-blue-600"
                />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Accounts
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Total Accounts
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {accounts.length}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {activeAccounts} active account
              {activeAccounts !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck
                  size={20}
                  className="text-emerald-600"
                />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Security
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Account Status
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              <p className="text-lg font-bold text-slate-900">
                {activeAccounts > 0 ? 'Active' : 'No Active Accounts'}
              </p>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Your banking access is protected
            </p>
          </div>
        </div>

        {/* =====================================================
            ACCOUNTS SECTION
        ====================================================== */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Your Accounts
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Select an account to manage your balance.
          </p>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {accounts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
              <Landmark
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="font-bold text-slate-800">
              No accounts found
            </h3>

            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Please contact the bank administrator to open
              a new account.
            </p>
          </div>
        ) : (

          /* ===================================================
             ACCOUNT CARDS
          ==================================================== */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {accounts.map((acc) => {

              const isSavings = acc.type === 'Savings';
              const isActive = acc.status === 'Active';

              return (
                <div
                  key={acc._id}
                  className="
                    group
                    bg-white
                    border border-slate-200
                    rounded-3xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >

                  {/* Card Header */}
                  <div
                    className={`relative overflow-hidden px-5 py-5 text-white ${
                      isSavings
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                        : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                    }`}
                  >

                    <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />

                    <div className="relative">

                      <div className="flex items-center justify-between">

                        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                          {isSavings ? (
                            <Wallet size={20} />
                          ) : (
                            <Landmark size={20} />
                          )}
                        </div>

                        <span className="text-[10px] uppercase tracking-wider text-white/70">
                          Secure Account
                        </span>
                      </div>

                      <p className="font-bold text-lg mt-5">
                        {acc.type} Account
                      </p>

                      <p className="text-xs text-white/75 font-mono mt-1">
                        {acc.accountNumber}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">

                    <div className="mb-5">
                      <p className="text-xs text-slate-500">
                        Available Balance
                      </p>

                      <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                        {formatMoney(acc.balance)}
                      </p>
                    </div>

                    {/* Status / Interest */}
                    <div className="flex items-center justify-between mb-4">

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive
                              ? 'bg-emerald-500'
                              : 'bg-red-500'
                          }`}
                        />

                        {acc.status}
                      </span>

                      {acc.interestRate > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Percent size={12} />
                          {acc.interestRate}% p.a.
                        </span>
                      )}
                    </div>

                    {/* Branch */}
                    <div className="flex items-center justify-between py-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        Branch
                      </span>

                      <span className="text-xs font-medium text-slate-600">
                        {acc.branch}
                      </span>
                    </div>

                    {/* Actions */}
                    {isActive && (
                      <div className="grid grid-cols-2 gap-2 mt-2">

                        <button
                          onClick={() =>
                            openModal('deposit', acc)
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            h-10
                            rounded-xl
                            bg-emerald-50
                            text-emerald-700
                            text-sm
                            font-semibold
                            hover:bg-emerald-100
                            hover:shadow-sm
                            transition
                          "
                        >
                          <ArrowDownToLine size={16} />
                          Deposit
                        </button>

                        <button
                          onClick={() =>
                            openModal('withdraw', acc)
                          }
                          className="
                            flex
                            items-center
                            justify-center
                            gap-1.5
                            h-10
                            rounded-xl
                            bg-red-50
                            text-red-700
                            text-sm
                            font-semibold
                            hover:bg-red-100
                            hover:shadow-sm
                            transition
                          "
                        >
                          <ArrowUpFromLine size={16} />
                          Withdraw
                        </button>

                      </div>
                    )}

                    {!isActive && (
                      <div className="mt-4 flex items-center justify-center gap-2 h-10 rounded-xl bg-slate-50 text-slate-400 text-xs font-medium">
                        <AlertCircle size={14} />
                        Account currently unavailable
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Security Note */}
        {accounts.length > 0 && (
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck
              size={14}
              className="text-emerald-500"
            />
            All account activity is protected with secure encryption.
          </div>
        )}
      </div>

      {/* =======================================================
          PREMIUM TRANSACTION MODAL
      ======================================================== */}
      {modal && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >

          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div
              className={`relative overflow-hidden px-6 py-5 text-white ${
                modal.type === 'deposit'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  : 'bg-gradient-to-br from-red-600 to-rose-700'
              }`}
            >

              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />

              <div className="relative flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                    {modal.type === 'deposit' ? (
                      <ArrowDownToLine size={21} />
                    ) : (
                      <ArrowUpFromLine size={21} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg capitalize">
                      {modal.type}
                    </h3>

                    <p className="text-xs text-white/75 font-mono mt-0.5">
                      {modal.account.accountNumber}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Account Balance */}
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Current Balance
                  </span>

                  <Wallet
                    size={15}
                    className="text-slate-400"
                  />
                </div>

                <p className="text-lg font-bold text-slate-900 mt-1">
                  {formatMoney(modal.account.balance)}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle
                    size={17}
                    className="text-red-600 mt-0.5 shrink-0"
                  />

                  <p className="text-xs text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2
                    size={17}
                    className="text-emerald-600"
                  />

                  <p className="text-xs text-emerald-700 font-medium">
                    {success}
                  </p>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount (PKR)
                </label>

                <div className="relative">
                  <CircleDollarSign
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    className="
                      w-full
                      h-12
                      pl-11
                      pr-4
                      bg-slate-50
                      border border-slate-200
                      rounded-xl
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      focus:bg-white
                      focus:border-primary-500
                      focus:ring-4
                      focus:ring-primary-500/10
                    "
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                  <span className="text-slate-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>

                <input
                  type="text"
                  value={desc}
                  onChange={(e) =>
                    setDesc(e.target.value)
                  }
                  className="
                    w-full
                    h-12
                    px-4
                    bg-slate-50
                    border border-slate-200
                    rounded-xl
                    text-sm
                    text-slate-900
                    placeholder:text-slate-400
                    outline-none
                    transition
                    focus:bg-white
                    focus:border-primary-500
                    focus:ring-4
                    focus:ring-primary-500/10
                  "
                  placeholder="e.g. Salary deposit"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`
                  w-full
                  h-12
                  rounded-xl
                  text-white
                  font-semibold
                  text-sm
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-lg
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  transition
                  ${
                    modal.type === 'deposit'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/20'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/20'
                  }
                `}
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    {modal.type === 'deposit'
                      ? 'Confirm Deposit'
                      : 'Confirm Withdrawal'}

                    <ChevronRight size={17} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400">
                Please verify the amount before confirming.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

