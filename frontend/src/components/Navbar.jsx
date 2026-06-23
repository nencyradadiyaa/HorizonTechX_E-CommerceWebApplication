import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, Search, LogOut, Cpu, LayoutDashboard, Database } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?search=${keyword.trim()}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0 group">
            <div className="p-2 bg-gradient-to-tr from-brand-600 to-violet-600 rounded-xl group-hover:scale-105 transition-transform duration-300">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              HorizonTech<span className="text-brand-400">X</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-grow max-w-lg relative">
            <input
              type="text"
              placeholder="Search premium tech devices..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-brand-500 rounded-full py-2 pl-4 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-500 hover:text-brand-400 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Navigation Links & Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-slate-300 hover:text-brand-400 text-sm font-medium transition-colors">
              Products
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-slate-300 hover:text-brand-400 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-600 to-violet-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-slate-950 shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth menus */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Admin dashboard link */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-brand-900/40 text-brand-300 border border-brand-500/20 hover:bg-brand-900/60 hover:text-brand-200 transition-all text-xs font-medium"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link to="/orders" className="text-slate-300 hover:text-brand-400 text-sm font-medium transition-colors hidden sm:block">
                  Orders
                </Link>

                <div className="flex items-center space-x-2 text-slate-300 border-l border-slate-800 pl-4">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</span>
                  </div>
                  <button
                    onClick={logout}
                    title="Log out"
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="gradient-btn px-4 py-2 rounded-full text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search bar mobile */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search premium tech devices..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-brand-500 rounded-full py-2 pl-4 pr-10 text-sm text-slate-200 focus:outline-none transition-all"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-500 hover:text-brand-400 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
