import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User, Leaf } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const passwordRequirements = [
    { regex: /.{8,}/ },
    { regex: /[A-Z]/ },
    { regex: /[a-z]/ },
    { regex: /\d/ }
  ];

  const getStrength = (p) =>
    passwordRequirements.filter(r => r.regex.test(p)).length;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (getStrength(formData.password) < 4) {
      return setError('Password too weak');
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    if (!result.success) setError(result.message);
    setLoading(false);
  };

  const strength = getStrength(formData.password);

  return (
    <div className="min-h-screen bg-[#f7faf8] flex items-center justify-center px-6 relative overflow-hidden">

      {/* soft background */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-emerald-200/40 blur-[140px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-teal-200/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-medium text-slate-900">eyra</span>
          </div>

          <Link to="/login" className="text-sm text-slate-500 hover:text-emerald-600">
            Sign in
          </Link>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-tight text-slate-900">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                begin your<br />journey.
              </span>
            </h1>

            <p className="mt-4 text-slate-500 max-w-sm">
              a calm, private space to reflect and be heard.
            </p>

          </div>

          {/* RIGHT — GLASS BOX */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">

            <form onSubmit={handleSubmit} className="space-y-8">

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* NAME */}
              <div className="group">
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-emerald-500" />
                  <input
                    name="name"
                    placeholder="Full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-7 pb-2 border-b border-slate-300 bg-transparent text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="group">
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-emerald-500" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-7 pb-2 border-b border-slate-300 bg-transparent text-sm outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="group">
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-emerald-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-7 pr-7 pb-2 border-b border-slate-300 bg-transparent text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* minimal strength */}
                {formData.password && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                )}
              </div>

              {/* CONFIRM */}
              <div className="group">
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-7 pb-2 border-b border-slate-300 bg-transparent text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                {formData.confirmPassword && (
                  <div className="mt-2 text-xs flex items-center gap-1">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600">Match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">Mismatch</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* PRIMARY BUTTON (BLACK) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 rounded-full text-sm font-medium
                bg-black text-white hover:bg-slate-900
                transition active:scale-[0.98]"
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;