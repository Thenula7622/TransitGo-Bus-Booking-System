import React, { useState } from 'react';
import { 
  X, Mail, Phone, MapPin, Send, MessageCircle, 
  CheckCircle2, Clock, ShieldCheck, Headphones 
} from 'lucide-react';

const ContactModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  const openWhatsAppSupport = () => {
    const text = `Hello TransitGo Support! I have an inquiry regarding bus reservations.`;
    window.open(`https://wa.me/94771234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Passenger Help Desk & Contact Center</h3>
              <p className="text-[10px] text-slate-400">24/7 Hotline, WhatsApp & Instant Message Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-white">
          
          {/* Quick Contact Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              onClick={openWhatsAppSupport}
              className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl hover:bg-emerald-950/60 cursor-pointer transition flex items-center gap-3"
            >
              <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">WhatsApp Direct Chat</h4>
                <p className="text-[10px] text-emerald-400 font-mono">+94 (77) 123-4567</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Highway Emergency</h4>
                <p className="text-[10px] text-blue-400 font-mono">1969 / +94 11 234 5678</p>
              </div>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">Message Dispatched!</h4>
              <p className="text-slate-400 text-xs">Our passenger support team will get back to your email within 15 minutes.</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-300">Send an Online Inquiry</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Subject / Booking Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Inquiry regarding Bus NA-4589 or BK-9A82B3"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your inquiry or feedback here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default ContactModal;