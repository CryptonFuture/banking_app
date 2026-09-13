
import React, { useEffect, useState } from 'react';
import { getAccounts, transfer } from '../api';

import {
  ArrowLeftRight,
  Wallet,
  CreditCard,
  CircleDollarSign,
  FileText,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Building2,
} from 'lucide-react';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);

  const [form, setForm] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAccounts()
      .then((res) => {
        const active = res.data.filter(
          (a) => a.status === 'Active'
        );

        setAccounts(active);

        if (active.length > 0) {
          setForm((f) => ({
            ...f,
            fromAccountId: active[0]._id,
          }));
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.error ||
            'Failed to load accounts'
        );
      });
  }, []);

  const selectedAccount = accounts.find(
    (account) => account._id === form.fromAccountId
  );

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await transfer({
        fromAccountId: form.fromAccountId,
        toAccountNumber: form.toAccountNumber.trim(),
        amount: Number(form.amount),
        description: form.description || undefined,
      });

      setSuccess(
        `Transfer successful! New balance: PKR ${res.data.fromBalance.toLocaleString()}`
      );

      setForm((f) => ({
        ...f,
        toAccountNumber: '',
        amount: '',
        description: '',
      }));

      const accRes = await getAccounts();

      setAccounts(
        accRes.data.filter(
          (a) => a.status === 'Active'
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Transfer failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeftRight
                size={16}
                className="text-primary-600"
              />

              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                Payments
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Transfer Money
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Send money securely to another bank account.
            </p>
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">

            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ShieldCheck
                size={17}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                Secure Transfer
              </p>

              <p className="text-[10px] text-slate-400">
                Encrypted banking
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* ===================================================
              TRANSFER FORM
          ==================================================== */}
          <div className="lg:col-span-3">

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

              {/* Form Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-700 px-6 py-6 text-white">

                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute -right-4 -bottom-20 w-40 h-40 rounded-full bg-white/5" />

                <div className="relative flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <Send size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Send Money
                    </h2>

                    <p className="text-xs text-primary-100 mt-1">
                      Fast, simple and secure transfers
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200">

                    <AlertCircle
                      size={18}
                      className="text-red-600 mt-0.5 shrink-0"
                    />

                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">

                    <CheckCircle2
                      size={18}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />

                    <div>
                      <p className="text-sm font-semibold text-emerald-700">
                        Transfer Completed
                      </p>

                      <p className="text-xs text-emerald-600 mt-0.5">
                        {success}
                      </p>
                    </div>
                  </div>
                )}

                {/* From Account */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    From Account
                  </label>

                  <div className="relative">
                    <CreditCard
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <select
                      required
                      value={form.fromAccountId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fromAccountId: e.target.value,
                        })
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
                        text-slate-800
                        outline-none
                        appearance-none
                        transition
                        focus:bg-white
                        focus:border-primary-500
                        focus:ring-4
                        focus:ring-primary-500/10
                      "
                    >
                      {accounts.map((a) => (
                        <option
                          key={a._id}
                          value={a._id}
                        >
                          {a.accountNumber} ({a.type}) – PKR{' '}
                          {a.balance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Account Balance */}
                {selectedAccount && (
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                          <Wallet
                            size={18}
                            className="text-primary-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Available Balance
                          </p>

                          <p className="text-lg font-bold text-slate-900">
                            {formatMoney(
                              selectedAccount.balance
                            )}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        Active
                      </span>
                    </div>
                  </div>
                )}

                {/* To Account */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    To Account Number
                  </label>

                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      required
                      value={form.toAccountNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          toAccountNumber:
                            e.target.value,
                        })
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
                        font-mono
                        text-slate-900
                        placeholder:text-slate-400
                        outline-none
                        transition
                        focus:bg-white
                        focus:border-primary-500
                        focus:ring-4
                        focus:ring-primary-500/10
                      "
                      placeholder="e.g. SAV100001"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Transfer Amount
                  </label>

                  <div className="relative">
                    <CircleDollarSign
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="1"
                      required
                      value={form.amount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          amount: e.target.value,
                        })
                      }
                      className="
                        w-full
                        h-12
                        pl-11
                        pr-16
                        bg-slate-50
                        border border-slate-200
                        rounded-xl
                        text-sm
                        font-semibold
                        text-slate-900
                        placeholder:text-slate-400
                        outline-none
                        transition
                        focus:bg-white
                        focus:border-primary-500
                        focus:ring-4
                        focus:ring-primary-500/10
                      "
                      placeholder="Enter amount"
                    />

                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                      PKR
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                    <span className="font-normal text-slate-400 ml-1">
                      (optional)
                    </span>
                  </label>

                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />

                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description:
                            e.target.value,
                        })
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
                        placeholder:text-slate-400
                        outline-none
                        transition
                        focus:bg-white
                        focus:border-primary-500
                        focus:ring-4
                        focus:ring-primary-500/10
                      "
                      placeholder="Payment note"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    loading || accounts.length === 0
                  }
                  className="
                    group
                    w-full
                    h-12
                    rounded-xl
                    bg-gradient-to-r
                    from-primary-600
                    to-primary-700
                    hover:from-primary-700
                    hover:to-primary-800
                    text-white
                    font-semibold
                    text-sm
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-lg
                    shadow-primary-600/20
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-all
                  "
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      Transfer Now
                      <ArrowLeftRight
                        size={18}
                        className="group-hover:translate-x-0.5 transition"
                      />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400">
                  Please verify the recipient account and
                  amount before transferring.
                </p>
              </form>
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          ==================================================== */}
          <div className="lg:col-span-2 space-y-5">

            {/* Transfer Preview */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <ArrowLeftRight
                    size={19}
                    className="text-primary-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Transfer Summary
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Review your transfer details
                  </p>
                </div>
              </div>

              {/* From */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">

                <span className="text-xs text-slate-400">
                  From
                </span>

                <span className="text-sm font-semibold text-slate-700 font-mono">
                  {selectedAccount?.accountNumber ||
                    '—'}
                </span>
              </div>

              {/* To */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">

                <span className="text-xs text-slate-400">
                  To
                </span>

                <span className="text-sm font-semibold text-slate-700 font-mono">
                  {form.toAccountNumber || '—'}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between py-3">

                <span className="text-xs text-slate-400">
                  Amount
                </span>

                <span className="text-lg font-bold text-slate-900">
                  {form.amount
                    ? formatMoney(form.amount)
                    : 'PKR 0'}
                </span>
              </div>
            </div>

            {/* Security Card */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white">

              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-primary-600/20" />

              <div className="relative">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <ShieldCheck size={21} />
                </div>

                <h3 className="font-bold text-lg">
                  Secure & Protected
                </h3>

                <p className="text-xs text-slate-400 leading-5 mt-2">
                  Your transfer information is protected
                  using secure banking infrastructure.
                </p>

                <div className="flex items-center gap-2 mt-5 text-xs text-emerald-400">
                  <CheckCircle2 size={15} />
                  Encrypted transaction
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
                  <CheckCircle2 size={15} />
                  Secure account verification
                </div>

              </div>
            </div>

            {/* Help Card */}
            <div className="bg-primary-50 border border-primary-100 rounded-3xl p-5">

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Wallet
                    size={17}
                    className="text-primary-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Before you transfer
                  </p>

                  <p className="text-xs text-slate-500 leading-5 mt-1">
                    Make sure the recipient account number
                    and transfer amount are correct.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Security */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-7">
          <ShieldCheck
            size={14}
            className="text-emerald-500"
          />
          Secure banking • Encrypted transactions
        </div>
      </div>
    </div>
  );
}

