import React, { useState } from 'react';
import { Shield, Lock, X, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';

const AdminAuthModal = ({ onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    // Default system Admin PINs: 1234 or admin
    if (pin === '1234' || pin === 'admin' || pin === 'admin123') {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError('Invalid Admin Security Key / PIN (Default Demo PIN: 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Admin Security Access</h3>
              <p className="text-[10px] text-slate-400">Operations & Fleet Control</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleVerify} className="p-6 space-y-4">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mx-auto border border-purple-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Enter Administrator PIN</h4>
            <p className="text-[11px] text-slate-400">Enter master passcode to unlock fleet management</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter PIN (Demo: 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-purple-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 block text-center mt-1">Default PIN: <strong className="text-purple-400 font-mono">1234</strong></span>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
          >
            <span>Unlock Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminAuthModal;