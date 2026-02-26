
import React from 'react';
import { Track, PlayerState } from '../types';

interface PlayerProps {
  track: Track | null;
  state: PlayerState;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onRateChange: (rate: number) => void;
  onToggleFavorite: () => void;
  onToggleLoop: () => void;
  onAddTimestamp: () => void;
  hasError?: boolean;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

const Player: React.FC<PlayerProps> = ({ 
  track, state, onPlayPause, onSeek, onSkip, onToggleFavorite, onToggleLoop, onAddTimestamp, hasError 
}) => {
  if (!track) return null;

  return (
    <div className={`w-full flex flex-col py-4 px-5 md:px-10 transition-all duration-500 ${hasError ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="w-full flex items-center gap-3 mb-3">
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 tabular-nums w-8 text-right">
          {formatTime(state.currentTime)}
        </span>
        <div className="flex-1 relative h-6 flex items-center touch-none group">
          <input 
            type="range" min={0} max={track.duration || 100} value={state.currentTime} 
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            style={{ direction: 'rtl' }}
            disabled={hasError || state.isLoading}
          />
          <div className="w-full h-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-full relative overflow-hidden">
            <div 
              className={`absolute right-0 top-0 h-full bg-[#4da8ab] rounded-full transition-all duration-200 ${state.isLoading ? 'animate-pulse' : ''}`} 
              style={{ width: `${(state.currentTime / (track.duration || 1)) * 100}%` }} 
            />
          </div>
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white dark:bg-slate-100 border-2 border-[#4da8ab] rounded-full shadow-md pointer-events-none transition-all group-hover:scale-125"
            style={{ right: `calc(${(state.currentTime / (track.duration || 1)) * 100}% - 7px)` }}
          />
        </div>
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 tabular-nums w-8 text-left">
          {formatTime(track.duration)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 md:gap-2 flex-1 justify-start">
          <button onClick={onToggleFavorite} className={`p-2 transition-all active:scale-90 ${track.isFavorite ? 'text-rose-500' : 'text-slate-300 dark:text-slate-600 hover:text-rose-400'}`}>
            <svg className="w-5 h-5 md:w-6 md:h-6" fill={track.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>

          <button onClick={onToggleLoop} className={`p-2 transition-all active:scale-90 ${state.isLooping ? 'text-[#4da8ab]' : 'text-slate-300 dark:text-slate-600 hover:text-[#4da8ab]/50'}`} title="تكرار النشيد">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-8">
          <button onClick={() => onSkip(10)} className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-2 active:scale-90 transition-all" disabled={hasError || state.isLoading}>
            <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" /><text x="12" y="15.5" fontSize="6" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none">10</text></svg>
          </button>

          <button onClick={onPlayPause} className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[24px] flex items-center justify-center shadow-xl md:shadow-2xl active:scale-95 transition-all ${hasError ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600' : 'bg-[#4da8ab] text-white'}`} disabled={hasError}>
            {state.isLoading ? <div className="w-5 h-5 md:w-6 md:h-6 border-2 md:border-3 border-white/30 border-t-white rounded-full animate-spin" /> : state.isPlaying ? <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-6 h-6 md:w-8 md:h-8 translate-x-[-1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
          </button>

          <button onClick={() => onSkip(-10)} className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-2 active:scale-90 transition-all" disabled={hasError || state.isLoading}>
            <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" /><text x="12" y="15.5" fontSize="6" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none">10</text></svg>
          </button>
        </div>

        <div className="flex items-center justify-end flex-1">
          <button onClick={onAddTimestamp} className="p-2.5 md:p-3 text-[#4da8ab] bg-[#4da8ab]/5 dark:bg-[#4da8ab]/10 hover:bg-[#4da8ab]/10 dark:hover:bg-[#4da8ab]/20 rounded-xl md:rounded-2xl active:scale-90 transition-all" disabled={hasError || state.isLoading}>
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
