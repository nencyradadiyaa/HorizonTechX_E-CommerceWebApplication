import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cpu, Mail, Lock, AlertCircle, Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { login, user, loading, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
    // Clear errors when navigating away
    return () => setError(null);
  }, [user, navigate, from, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Handled by context state, but captured in local context if needed
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/10 blur-[100px] rounded-full -z-10 animate-glow"></div>

      <div className="w-full max-w-md glass-panel rounded-3xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-brand-600 to-violet-600 rounded-2xl mx-auto shadow-md">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Sign in to your HorizonTechX account</p>
        </div>

        {/* Display Errors */}
        {(localError || error) && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3.5 text-xs flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="developer@horizontechx.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition-all"
              />
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none transition-all"
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn py-3 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          New to HorizonTechX?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium hover:underline transition-all">
            Create an account
          </Link>
        </p>

        {/* Quick Credentials Info Box for Testing */}
        <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl space-y-1.5 text-[11px] text-slate-400">
          <p className="font-bold text-slate-300">Quick Test Credentials:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-semibold text-brand-300">User Account:</p>
              <p>Email: <span className="text-slate-300 font-mono">user@horizontechx.com</span></p>
              <p>Pass: <span className="text-slate-300 font-mono">userpassword123</span></p>
            </div>
            <div>
              <p className="font-semibold text-brand-300">Admin Account:</p>
              <p>Email: <span className="text-slate-300 font-mono">admin@horizontechx.com</span></p>
              <p>Pass: <span className="text-slate-300 font-mono">adminpassword123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
