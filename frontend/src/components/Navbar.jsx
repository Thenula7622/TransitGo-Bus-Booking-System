import React, { useState } from 'react';
import { 
  Bus, Shield, QrCode, Ticket, Globe, 
  User, LogOut, LogIn, ChevronDown, Headphones, Layers, ShieldAlert 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import LiveDateTime from './LiveDateTime';

const Navbar = ({ 
  onOpenAdmin, 
  onOpenCheckTicket, 
  onOpenConductorScanner, 
  onOpenContact,
  onOpenFleetExplorer,
  onOpenSos
}) => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'si' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
      <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl font-black shadow-lg shadow-emerald-500/20">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Transit<span className="text-emerald-400">Go</span>
            </span>
          </div>

          {/* Action Buttons & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            
            <button
              onClick={onOpenFleetExplorer}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Routes</span>
            </button>

            <button
              onClick={onOpenSos}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition flex items-center gap-1"
              title="Highway Emergency SOS (1969)"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-bold">SOS</span>
            </button>

            <button
              onClick={onOpenContact}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('support')}</span>
            </button>

            <button
              onClick={onOpenCheckTicket}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t('check_ticket')}</span>
            </button>

            <button
              onClick={onOpenConductorScanner}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">{t('scanner')}</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">{t('admin')}</span>
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>

            {/* Live Date & Time Display */}
            <div className="hidden md:flex">
              <LiveDateTime />
            </div>

            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:bg-slate-800 transition flex items-center gap-1.5 font-bold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{i18n.language === 'en' ? 'සිංහල' : 'English'}</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold max-w-[100px] truncate">{currentUser.fullName || currentUser.email}</span>
                  <ChevronDown className="w-3 h-3 text-emerald-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="font-bold text-white truncate">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('sign_out')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('sign_in')}</span>
              </button>
            )}

          </div>

        </div>
      </nav>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;