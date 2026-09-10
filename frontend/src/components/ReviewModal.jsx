import React, { useState } from 'react';
import { X, Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { addBusReviewAPI } from '../services/api';

const ReviewModal = ({ bus, onClose, onReviewSubmitted }) => {
  const [passengerName, setPassengerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addBusReviewAPI({
        busId: bus.id,
        passengerName: passengerName.trim() || 'Verified Passenger',
        rating,
        comment
      });
      setSubmitted(true);
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Rate Your Journey</h3>
              <p className="text-[10px] text-slate-400">{bus.busName} ({bus.busNumber})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Thank You for Your Feedback!</h4>
            <p className="text-xs text-slate-400">Your review helps improve Sri Lanka's highway transit quality.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            <div className="text-center space-y-1">
              <span className="text-slate-400 text-[11px] block">Select Rating Score</span>
              <div className="flex justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 transition transform hover:scale-125 focus:outline-none"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Your Name / Alias</label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun P."
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Feedback / Experience</label>
              <textarea
                required
                rows={3}
                placeholder="Punctuality, seat comfort, AC cooling, driver behavior..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Post Passenger Review'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ReviewModal;