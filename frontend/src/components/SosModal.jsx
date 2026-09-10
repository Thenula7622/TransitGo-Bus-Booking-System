import React from 'react';
import { X, ShieldAlert, PhoneCall, AlertTriangle, Radio, Navigation } from 'lucide-react';

const SosModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-rose-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-rose-950/40 p-4 border-b border-rose-500/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Emergency Highway Assistance</h3>
              <p className="text-[10px] text-rose-300">National 24/7 Rapid Response Services</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          
          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl flex items-start gap-2.5 text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>If you are in danger or experiencing an expressway accident, tap below to connect immediately.</span>
          </div>

          <div className="space-y-2.5">
            <a
              href="tel:1969"
              className="p-3.5 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-2xl flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Expressway Patrol (E01/E03/E04)</h4>
                  <p className="text-[10px] text-slate-400">Road development authority highway hotline</p>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-rose-400 group-hover:scale-110 transition">1969</span>
            </a>

            <a
              href="tel:1990"
              className="p-3.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">1990 Suwa Seriya Ambulance</h4>
                  <p className="text-[10px] text-slate-400">Free emergency medical pre-hospital service</p>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-emerald-400 group-hover:scale-110 transition">1990</span>
            </a>

            <a
              href="tel:119"
              className="p-3.5 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Police Emergency Response</h4>
                  <p className="text-[10px] text-slate-400">National police control hotline</p>
                </div>
              </div>
              <span className="text-sm font-extrabold font-mono text-blue-400 group-hover:scale-110 transition">119</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SosModal;