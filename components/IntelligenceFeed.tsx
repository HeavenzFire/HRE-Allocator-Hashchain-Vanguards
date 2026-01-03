import React from 'react';
import { Alignment } from '../types';

interface IntelligenceFeedProps {
  logs: {id: number, text: string, type: Alignment}[];
}

const IntelligenceFeed: React.FC<IntelligenceFeedProps> = ({ logs }) => {
  return (
    <div className="bg-[#050505] border border-zinc-900 p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 px-2 py-0.5 bg-zinc-900 text-zinc-500 text-[7px] font-black uppercase tracking-tighter border-l border-b border-zinc-800">
        Logic_Triage
      </div>
      <h3 className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] mb-4 border-b border-zinc-900 pb-1">Syntropic Audit Stream</h3>
      <div className="h-40 overflow-y-auto space-y-3 scrollbar-none pr-1">
        {logs.map((log, i) => (
          <div key={`${log.id}-${i}`} className="flex gap-3 items-start border-l border-zinc-800 pl-3 group animate-in fade-in slide-in-from-left-2 duration-300">
            <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 shadow-lg ${
              log.type === 'INTEGRITY' || log.type === 'SYNTROPY' ? 'bg-blue-500' :
              log.type === 'BREACH' ? 'bg-red-600 animate-pulse' :
              log.type === 'THEATER' ? 'bg-yellow-600' : 'bg-zinc-700'
            }`}></div>
            <p className={`text-[9px] mono leading-snug tracking-tighter font-bold uppercase ${
              log.type === 'BREACH' ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-200'
            }`}>
              {log.text}
            </p>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <div className="w-10 h-[1px] bg-zinc-700 mb-2"></div>
            <p className="text-[8px] mono text-zinc-500 uppercase tracking-[0.2em]">Awaiting Signals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligenceFeed;