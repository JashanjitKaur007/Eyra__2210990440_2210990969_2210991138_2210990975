
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Leaf } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    if (!result.success) setError(result.message);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] relative overflow-hidden flex items-center justify-center px-6">

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-emerald-200/40 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-teal-200/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">

        {/* NAV */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-900">eyra</span>
          </div>

          {/* FIXED CTA */}
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full border border-emerald-500 text-emerald-600 font-medium text-sm hover:bg-emerald-50 transition"
          >
            Create account
          </Link>
        </div>

        {/* MAIN */}
        <div className="grid md:grid-cols-[1.1fr_1.3fr] gap-20 items-center">

          {/* LEFT */}
          <div>

            <h1 className="text-[clamp(2.8rem,5vw,4.5rem)] leading-[1.05] font-semibold tracking-tight 
            bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 
            bg-clip-text text-transparent">
              come back<br />to yourself.
            </h1>

            <p className="mt-6 text-slate-600 max-w-md text-[15px] leading-relaxed">
              a quiet space to reflect, breathe, and be heard — gently and without pressure.
            </p>

          </div>

          {/* RIGHT (ENHANCED FORM AREA) */}
          <div className="relative">

            {/* subtle structure */}
<div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)]" /><div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg" />
{/* <div className="absolute inset-0 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)]" /> */}
            <div className="relative p-10">

              <h2 className="text-2xl font-semibold text-slate-900 mb-8">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome back
                </span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                {/* EMAIL */}
                <div className="group">
                  <label className="text-sm text-slate-600 mb-2 block">
                    EMAIL
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-emerald-500 transition" />

                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-7 pb-2 pt-1 bg-transparent border-b border-slate-300 text-sm outline-none
                      focus:border-emerald-500 transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="group">
                  <label className="text-sm text-slate-600 mb-2 block">
                    PASSWORD
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-emerald-500 transition" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-7 pr-7 pb-2 pt-1 bg-transparent border-b border-slate-300 text-sm outline-none
                      focus:border-emerald-500 transition"
                      placeholder="••••••••"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3.5 rounded-full text-sm font-medium
                  bg-black text-white
                  hover:bg-gray-900
                  transition-all active:scale-[0.98] shadow-lg shadow-black/20"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    'Continue'
                  )}
                </button>

              </form>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;