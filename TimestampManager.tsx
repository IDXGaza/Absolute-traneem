
import React from 'react';
import { Timestamp } from '../types';

interface TimestampManagerProps {
  timestamps: Timestamp[];
  onRemove: (id: string) => void;
  onSeek: (time: number) => void;
  currentTime: number;
}

const toArabicIndic = (num: number) => {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => digits[parseInt(d)] || d).join('');
};

const TimestampManager: React.FC<TimestampManagerProps> = ({ 
  timestamps, onRemove, onSeek 
}) => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg md:text-xl">العلامات الزمنية</h3>
        <span className="text-[10px] font-black bg-[#4da8ab]/10 text-[#4da8ab] px-3 py-1 rounded-full uppercase tracking-widest">
           {toArabicIndic(timestamps.length)} علامات
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {timestamps.length === 0 ? (
          <div className="py-12 text-center bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-[24px]">
            <p className="text-slate-400 dark:text-slate-600 text-xs font-bold">لم تضف أي علامات بعد</p>
          </div>
        ) : (
          [...timestamps].sort((a, b) => a.time - b.time).map((ts, index) => (
            <div 
              key={ts.id} 
              className="flex items-center gap-4 p-4 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 rounded-[24px] border border-white dark:border-slate-800 transition-all shadow-sm hover:shadow-md group"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-300 dark:text-slate-600 font-black text-sm">
                {toArabicIndic(index + 1)}
              </div>

              <button 
                onClick={() => onSeek(ts.time)}
                className="text-lg md:text-xl font-black text-[#4da8ab] tabular-nums hover:scale-110 transition-transform px-2"
                style={{ direction: 'ltr' }}
              >
                {toArabicIndic(Math.floor(ts.time / 60)).padStart(2, '٠')}:
                {toArabicIndic(Math.floor(ts.time % 60)).padStart(2, '٠')}
              </button>

              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{ts.label}</p>
              </div>

              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onRemove(ts.id)}
                  className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimestampManager;
