import React, { useState } from 'react';
import { 
  X, Mail, Lock, User as UserIcon, Phone, LogIn, 
  UserPlus, Sparkles, CheckCircle2, AlertCircle, ArrowRight 
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ onClose, onSuccess }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState('LOGIN'); // LOGIN or REGISTER
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        const res = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password
        });
        login(res.data.user, res.data.token);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const res = await axios.post('http://localhost:8080/api/auth/register', {
          fullName,
          email,
          phone,
          password
        });
        login(res.data.user, res.data.token);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  // Google Single Sign-On Simulation / Integration
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      // In production with Google Client ID, this triggers window.google.accounts.id
      // Here simulated seamless enterprise Google Auth
      const demoGoogleEmail = prompt('Enter your Google Account email for instant SSO test:', 'passenger@gmail.com');
      if (!demoGoogleEmail) {
        setLoading(false);
        return;
      }

      const res = await axios.post('http://localhost:8080/api/auth/google', {
        email: demoGoogleEmail,
        name: demoGoogleEmail.split('@')[0].toUpperCase(),
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
      });

      login(res.data.user, res.data.token);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              {mode === 'LOGIN' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {mode === 'LOGIN' ? 'Welcome Back to TransitGo' : 'Create Passenger Account'}
              </h3>
              <p className="text-[10px] text-slate-400">Manage bookings, saved seats & fast checkouts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[10px] text-slate-500 font-mono">OR EMAIL</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {mode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Passenger Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mobile Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="077 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'LOGIN' ? (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            {mode === 'LOGIN' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('REGISTER'); setError(''); }}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Sign Up Free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('LOGIN'); setError(''); }}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthModal;