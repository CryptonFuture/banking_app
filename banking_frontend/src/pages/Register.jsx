import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  User,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      icon: User,
      required: true,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@example.com',
      icon: Mail,
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Minimum 6 characters',
      icon: LockKeyhole,
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: '+92 300 1234567',
      icon: Phone,
      required: false,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter your address',
      icon: MapPin,
      required: false,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center px-4 py-8">

      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl shadow-black/30 overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-slate-900 via-slate-900 to-primary-950 p-10 xl:p-12 text-white flex-col justify-between overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-500/10 border border-white/5" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 border border-white/5" />

          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Building2 size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  SecureBank
                </h2>

                <p className="text-[11px] text-slate-400">
                  Secure digital banking
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1.5 text-xs font-semibold text-primary-300 mb-5">
                <ShieldCheck size={14} />
                Secure Banking
              </div>

              <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
                Your money.
                <br />
                Your future.
                <br />
                <span className="text-primary-400">
                  Securely managed.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                Create your SecureBank account and get access to
                secure payments, account management and modern
                digital banking services.
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ShieldCheck size={17} className="text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Secure & Protected
                  </p>
                  <p className="text-xs text-slate-500">
                    Your account is protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <LockKeyhole size={17} className="text-primary-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Private Banking
                  </p>
                  <p className="text-xs text-slate-500">
                    Secure access to your finances.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 mt-10">
            <span>© {new Date().getFullYear()} SecureBank</span>
            <span>Trusted Digital Banking</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="p-6 sm:p-8 lg:p-10 xl:p-12 bg-white">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Building2 size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                SecureBank
              </h2>

              <p className="text-xs text-slate-400">
                Secure digital banking
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-700 mb-4">
              <User size={13} />
              New Customer
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Create your account
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Join SecureBank and start managing your finances securely.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold">!</span>
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Registration failed
                </p>

                <p className="text-xs mt-0.5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {fields.map((field) => {
              const Icon = field.icon;
              const isPassword = field.name === 'password';

              return (
                <div key={field.name}>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {field.label}

                    {field.required && (
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    )}
                  </label>

                  <div className="relative">

                    <Icon
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <input
                      type={
                        isPassword
                          ? showPassword
                            ? 'text'
                            : 'password'
                          : field.type
                      }
                      required={field.required}
                      value={form[field.name]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [field.name]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      minLength={
                        isPassword ? 6 : undefined
                      }
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-10 pr-11 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                    />

                    {isPassword && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    )}

                  </div>

                  {isPassword && (
                    <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
                      Password must contain at least 6 characters.
                    </p>
                  )}
                </div>
              );
            })}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-primary-600/20 hover:from-primary-700 hover:to-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-5"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="relative flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">
              Already registered?
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Sign In to SecureBank
            <ArrowRight size={16} />
          </Link>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck
              size={14}
              className="text-emerald-500"
            />
            Your information is securely protected.
          </div>

        </div>
      </div>
    </div>
  );
}