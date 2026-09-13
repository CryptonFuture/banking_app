import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  History,
  Shield,
  LogOut,
  Menu,
  X,
  UserCircle,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/accounts',
      label: 'Accounts',
      icon: Wallet,
    },
    {
      to: '/transfer',
      label: 'Transfer',
      icon: ArrowLeftRight,
    },
    {
      to: '/transactions',
      label: 'History',
      icon: History,
    },
  ];

  if (isAdmin) {
    links.push({
      to: '/admin',
      label: 'Admin',
      icon: Shield,
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (to) => {
    if (to === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(to);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= DESKTOP NAVBAR ================= */}
        <div className="h-[68px] flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition">
                <Building2 size={21} />
              </div>

              <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="hidden sm:block">
              <div className="font-bold text-slate-900 leading-none">
                SecureBank
              </div>

              <div className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide">
                DIGITAL BANKING
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);

              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-primary-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon
                    size={16}
                    className={
                      active
                        ? 'text-primary-600'
                        : 'text-slate-400'
                    }
                  />

                  {label}

                  {label === 'Admin' && isAdmin && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Security Badge */}
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

              <span className="text-[11px] font-semibold text-emerald-700">
                Secure
              </span>
            </div>

            {/* User */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">

              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <UserCircle
                  size={21}
                  className="text-slate-500"
                />
              </div>

              <div className="hidden lg:block max-w-[130px]">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {user?.name || 'User'}
                </p>

                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    <Shield size={10} />
                    Administrator
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    Customer
                  </span>
                )}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center justify-center gap-2 h-9 px-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
              title="Logout"
            >
              <LogOut size={16} />

              <span className="hidden lg:inline text-xs font-semibold">
                Logout
              </span>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileOpen && (
          <div className="md:hidden pb-4">

            <div className="border border-slate-200 bg-slate-50 rounded-2xl p-2">

              {links.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);

                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                      active
                        ? 'bg-white text-primary-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          active
                            ? 'bg-primary-50'
                            : 'bg-slate-100'
                        }`}
                      >
                        <Icon
                          size={17}
                          className={
                            active
                              ? 'text-primary-600'
                              : 'text-slate-500'
                          }
                        />
                      </div>

                      {label}
                    </div>

                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                    )}
                  </Link>
                );
              })}

              {/* Mobile User */}
              <div className="mt-2 pt-2 border-t border-slate-200">

                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    <UserCircle
                      size={20}
                      className="text-slate-500"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {user?.name || 'User'}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      {isAdmin
                        ? 'Administrator'
                        : 'Customer Account'}
                    </p>
                  </div>
                </div>

                {/* Mobile Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <LogOut size={16} />
                  </div>

                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}