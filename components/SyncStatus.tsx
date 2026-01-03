
import React from 'react';

interface SyncStatusProps {
  logs: string[];
}

const SyncStatus: React.FC<SyncStatusProps> = ({ logs }) => {
  return (
    <div className="bg-black border border-zinc-800 rounded-sm">
      <div className="bg-zinc-900 px-3 py-1 flex items-center justify-between border-b border-zinc-800">
        <span className="text-[10px] mono font-bold text-zinc-500 uppercase">System Console</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
        </div>
      </div>
      <div className="p-4 h-48 overflow-y-auto font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('🚨') ? 'text-red-500' : log.includes('SYNC') ? 'text-blue-400' : 'text-zinc-400'} mb-1`}>
            {log}
          </div>
        ))}
        {logs.length === 0 && <div className="text-zinc-600 italic">No activity recorded...</div>}
      </div>
    </div>
  );
};

export default SyncStatus;
