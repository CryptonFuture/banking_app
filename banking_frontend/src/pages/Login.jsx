import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Landmark,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">

      {/* Main Container */}
      <div className="w-full max-w-6xl min-h-[680px] bg-white rounded-[28px] shadow-2xl shadow-slate-300/40 overflow-hidden border border-slate-200 flex flex-col lg:flex-row">

        {/* =====================================================
            LEFT BRANDING PANEL
        ====================================================== */}
        <div className="relative lg:w-[46%] bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 overflow-hidden">

          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>

          <div className="relative z-10 h-full min-h-[520px] lg:min-h-[680px] p-7 sm:p-10 lg:p-12 flex flex-col">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-xl shadow-primary-950/50">
                  <Building2 size={24} className="text-white" />
                </div>

                <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">
                  Secure<span className="text-primary-400">Bank</span>
                </h1>

                <p className="text-[10px] text-slate-500 tracking-[0.18em] font-semibold">
                  DIGITAL BANKING
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-md mt-10 lg:mt-0">

              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-300">
                  Secure Banking Platform
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight tracking-tight">
                Banking made
                <span className="block text-primary-400">
                  simple & secure.
                </span>
              </h2>

              <p className="mt-5 text-sm sm:text-base text-slate-400 leading-7 max-w-sm">
                Manage your accounts, transfer funds, and track your financial
                activity through a secure digital banking experience.
              </p>

              {/* Features */}
              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={17} className="text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Bank-grade security
                    </p>
                    <p className="text-xs text-slate-500">
                      Your account stays protected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Smartphone size={17} className="text-primary-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Digital access
                    </p>
                    <p className="text-xs text-slate-500">
                      Access your banking anytime
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <CreditCard size={17} className="text-blue-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Easy transactions
                    </p>
                    <p className="text-xs text-slate-500">
                      Send and manage money effortlessly
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Security */}
            <div className="hidden sm:flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span className="text-xs text-slate-500">
                  Secure & encrypted
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Landmark size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500">
                  Trusted banking
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}
        <div className="lg:w-[54%] bg-white flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
                <ShieldCheck size={15} className="text-primary-600" />

                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700">
                  Secure Access
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Sign in to access your SecureBank dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">

                <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0" />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to sign in
                  </p>

                  <p className="text-xs text-red-600 mt-0.5 leading-5">
                    {error}
                  </p>
                </div>

              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>

                <div className="relative group">

                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="
                      w-full
                      h-12
                      pl-11
                      pr-4
                      bg-slate-50
                      border border-slate-200
                      rounded-xl
                      text-sm text-slate-900
                      placeholder:text-slate-400
                      outline-none
                      transition-all
                      focus:bg-white
                      focus:border-primary-500
                      focus:ring-4
                      focus:ring-primary-500/10
                      hover:border-slate-300
                    "
                  />

                </div>
              </div>

              {/* Password */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative group">

                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="
                      w-full
                      h-12
                      pl-11
                      pr-12
                      bg-slate-50
                      border border-slate-200
                      rounded-xl
                      text-sm text-slate-900
                      placeholder:text-slate-400
                      outline-none
                      transition-all
                      focus:bg-white
                      focus:border-primary-500
                      focus:ring-4
                      focus:ring-primary-500/10
                      hover:border-slate-300
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-3.5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      hover:text-slate-700
                      transition
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    id="remember"
                    type="checkbox"
                    className="
                      w-4
                      h-4
                      rounded
                      border-slate-300
                      text-primary-600
                      focus:ring-primary-500
                    "
                  />

                  <span className="text-sm text-slate-500">
                    Keep me signed in
                  </span>

                </label>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  Secure login
                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  w-full
                  h-12
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-primary-600
                  to-primary-700
                  text-white
                  font-semibold
                  text-sm
                  shadow-lg
                  shadow-primary-600/20
                  hover:from-primary-700
                  hover:to-primary-800
                  hover:shadow-primary-600/30
                  active:scale-[0.99]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  transition-all
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="relative my-7">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400">
                  New to SecureBank?
                </span>
              </div>

            </div>

            {/* Register */}
            <Link
              to="/register"
              className="
                flex
                items-center
                justify-center
                w-full
                h-11
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                font-semibold
                text-slate-700
                hover:bg-slate-50
                hover:border-slate-300
                hover:text-slate-900
                transition-all
              "
            >
              Create an account
            </Link>

            {/* Demo Credentials */}
            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">

              <div className="flex items-center gap-2 mb-3">

                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                  <ShieldCheck
                    size={15}
                    className="text-primary-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-700">
                    Demo Credentials
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Use these accounts for testing
                  </p>
                </div>

              </div>

              <div className="space-y-2">

                <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                      Admin
                    </p>

                    <p className="text-xs text-slate-600 mt-0.5">
                      admin@bank.com
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    admin123
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide font-bold text-slate-400">
                      Customer
                    </p>

                    <p className="text-xs text-slate-600 mt-0.5">
                      ali@example.com
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    customer123
                  </span>
                </div>

              </div>
            </div>

            {/* Mobile Footer */}
            <p className="text-center text-xs text-slate-400 mt-6">
              © {new Date().getFullYear()} SecureBank. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}