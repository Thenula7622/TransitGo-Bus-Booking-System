import React, { useState, useEffect } from 'react';

const LiveDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs font-mono text-emerald-400 backdrop-blur-sm">
      <span className="flex items-center gap-1 text-slate-300">
        📅 <span>{formattedDate}</span>
      </span>
      <span className="text-slate-500">|</span>
      <span className="flex items-center gap-1 font-semibold text-emerald-400">
        🕒 <span>{formattedTime}</span>
      </span>
    </div>
  );
};

export default LiveDateTime;