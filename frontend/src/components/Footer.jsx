import React from 'react';
import { 
  Bus, ShieldCheck, Mail, Phone, MapPin, 
  Terminal, Sparkles, MessageSquare, Layers, Laptop 
} from 'lucide-react';

const Footer = ({ onOpenContact }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs mt-auto selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Value Banner */}
      <div className="border-b border-slate-900/80 bg-slate-900/30 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Official Transit Guarantee</h4>
              <p className="text-[11px] text-slate-500">100% Confirmed seats with real-time conductor sync.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">24/7 Highway Passenger Care</h4>
              <p className="text-[11px] text-slate-500">Emergency support & route guidance across Sri Lanka.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Instant Dynamic Pricing</h4>
              <p className="text-[11px] text-slate-500">Accurate stage-wise fare deduction for intermediate towns.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl font-black shadow-lg shadow-emerald-500/20">
              <Bus className="w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-tight text-white">
              Transit<span className="text-emerald-400">Go</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Sri Lanka’s next-generation smart highway transit network enabling real-time reservations, dynamic stage fares, and live GPS telemetry.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Transit Fleet Active
            </span>
          </div>
        </div>

        {/* Quick Corridors */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Top Express Corridors</h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="hover:text-emerald-400 cursor-pointer transition">Colombo ⇄ Kandy Express</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Colombo ⇄ Matara Highway (E01)</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Colombo ⇄ Jaffna Royal Sleeper</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Colombo ⇄ Ella Scenic Luxury</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Katunayake Airport Shuttle (E03)</li>
          </ul>
        </div>

        {/* Passenger Support */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Passenger Care</h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>
              <button onClick={onOpenContact} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact & Help Desk</span>
              </button>
            </li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Check Ticket Status</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Expressway Highway Patrol (1969)</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Cancellation & Refund Policy</li>
            <li className="hover:text-emerald-400 cursor-pointer transition">Terms of Carriage & Luggage</li>
          </ul>
        </div>

        {/* Headquarters */}
        <div className="space-y-2.5">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Headquarters</h4>
          <div className="space-y-2.5 text-[11px] text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Thenula Enterprises, BOI road, Mawathagama</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>support@transitgo.lk</span>
              <span>|</span>
              <span>thenula2002@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>+94 (76) 820 2700</span>
            </div>
          </div>
        </div>

      </div>

      {/* Professional Developer Signature Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="text-[11px] text-slate-500 font-medium">
            © {new Date().getFullYear()} <span className="text-slate-400 font-semibold">TransitGo Technologies</span>. All rights reserved.
          </div>

          {/* Premium Engineered Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-colors px-4 py-2 rounded-2xl shadow-xl backdrop-blur-sm">
            
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-slate-400">Designed & Developed by</span>
            </div>

            <div className="flex items-center gap-2 pl-2.5 border-l border-slate-800">
              <span className="font-bold text-xs text-white tracking-wide">
                Thenula Rathnayake
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[11px]">
                <span>Software Engineer</span>
                <span className="text-emerald-600">•</span>
                <span>Full-Stack Developer</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;