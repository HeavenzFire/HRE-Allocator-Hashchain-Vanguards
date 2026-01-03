import React, { useState } from 'react';
import { ChainEntry, AuditStatus, Alignment } from '../types';

interface ChainExplorerProps {
  chain: ChainEntry[];
  audit: AuditStatus;
  onCorrupt: (id: number) => void;
}

const AlignmentBadge: React.FC<{ type?: Alignment }> = ({ type }) => {
  const styles = {
    INTEGRITY: 'bg-green-900/30 text-green-400 border-green-800',
    SYNTROPY: 'bg-blue-900/30 text-blue-400 border-blue-800',
    THEATER: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    BREACH: 'bg-red-900/30 text-red-400 border-red-800',
    PENDING: 'bg-zinc-900 text-zinc-500 border-zinc-800 animate-pulse',
    UNKNOWN: 'bg-zinc-900 text-zinc-600 border-zinc-800'
  };

  const labels = {
    INTEGRITY: 'INTEGRITY_VERIFIED',
    SYNTROPY: 'SYNTROPIC_ORDER',
    THEATER: 'SYSTEMIC_THEATER',
    BREACH: 'LOGIC_BREACH',
    PENDING: 'ANALYZING_CORE...',
    UNKNOWN: 'UNKNOWN'
  };

  const currentType = type || 'UNKNOWN';

  return (
    <div className={`text-[8px] font-black border px-2 py-0.5 uppercase tracking-[0.1em] ${styles[currentType]}`}>
      {labels[currentType]}
    </div>
  );
};

const ChainExplorer: React.FC<ChainExplorerProps> = ({ chain, audit, onCorrupt }) => {
  const [selectedReceipt, setSelectedReceipt] = useState<ChainEntry | null>(null);

  if (chain.length === 0) {
    return (
      <div className="h-[600px] border border-zinc-900 flex items-center justify-center flex-col space-y-4 bg-black/50">
        <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center animate-spin duration-[3000ms]">
          <div className="w-6 h-6 bg-red-600/20 border border-red-600"></div>
        </div>
        <p className="mono text-zinc-700 uppercase text-[9px] tracking-[0.3em] font-bold">Waiting for Initial Pulse...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">System Ledger</h2>
          <p className="mono text-[9px] text-zinc-600 uppercase mt-2 tracking-[0.2em]">Immutable Record of Syntropic Takeover</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="mono text-[9px] text-zinc-500 uppercase font-bold">Chain Height: {chain.length}</span>
          <div className={`h-[2px] w-24 mt-1 ${audit.isValid ? 'bg-green-600' : 'bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]'}`}></div>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[800px] pr-2 scrollbar-thin scrollbar-thumb-zinc-900">
        {[...chain].reverse().map((entry, idx) => {
          const actualIndex = chain.length - 1 - idx;
          const isBreachSource = audit.brokenIndex !== null && actualIndex === audit.brokenIndex;
          const isInvalid = audit.brokenIndex !== null && actualIndex >= audit.brokenIndex;
          
          return (
            <div 
              key={entry.id} 
              className={`border p-6 transition-all duration-500 relative group bg-black/40 ${
                isInvalid ? 'border-red-900' : 'border-zinc-900 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[9px] font-black px-2 py-0.5 uppercase ${isInvalid ? 'bg-red-600 text-white' : 'bg-white text-black'}`}>
                      Block_{entry.id}
                    </span>
                    <AlignmentBadge type={entry.alignment} />
                  </div>
                  <h3 className={`text-2xl font-black uppercase tracking-tight ${isInvalid ? 'text-red-500' : 'text-white'}`}>
                    {entry.entity}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-white mono">{entry.amount.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Units</span>
                  </div>
                  
                  {entry.auditSnippet && (
                    <div className="mt-4 border-l-2 border-zinc-800 pl-4 py-1">
                      <p className="text-[10px] mono text-zinc-400 italic font-bold">
                        &gt; {entry.auditSnippet}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="text-left md:text-right border-l md:border-l-0 md:border-r border-zinc-900 pl-4 md:pl-0 md:pr-4">
                  <div className="text-[8px] mono text-zinc-600 uppercase mb-2 font-black tracking-tighter">Chain Spine</div>
                  <div className={`text-[9px] mono leading-none font-bold ${isInvalid ? 'text-red-500' : 'text-zinc-700'}`}>
                    {entry.entryHash.substring(0, 16)}...
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center">
                <div className="text-[8px] mono text-zinc-700 uppercase font-black tracking-tighter">
                  Verified: {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onCorrupt(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] mono text-zinc-600 hover:text-red-600 uppercase font-black"
                  >
                    [Corrupt]
                  </button>
                  <button 
                    onClick={() => setSelectedReceipt(entry)}
                    className="text-[9px] mono bg-white text-black px-3 py-1 hover:bg-red-600 hover:text-white uppercase font-black transition-all"
                  >
                    Forensic Proof
                  </button>
                </div>
              </div>

              {isInvalid && (
                <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] pointer-events-none z-20 flex items-center justify-center">
                   <div className="rotate-[-5deg] border-2 border-red-600 px-6 py-2 text-red-600 font-black text-2xl uppercase opacity-90 shadow-[0_0_20px_rgba(220,38,38,0.5)] bg-black">
                     Logic Breach
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/98 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#111] border border-zinc-800 w-full max-w-lg p-10 relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-6 right-8 text-zinc-500 hover:text-white font-black text-3xl">&times;</button>
            <div className="mb-10 text-center">
              <div className="inline-block px-3 py-1 bg-red-600 text-black text-[9px] font-black uppercase tracking-widest mb-4">Integrity Certificate</div>
              <h2 className="text-4xl font-black uppercase text-white tracking-tighter leading-none">FORENSIC_PROOF</h2>
              <div className="h-px w-24 bg-zinc-800 mx-auto mt-6"></div>
            </div>
            
            <div className="space-y-6 mono text-[10px] text-zinc-400">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="font-black uppercase tracking-tighter">Block Index:</span>
                <span className="text-white">#{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="font-black uppercase tracking-tighter">System Entity:</span>
                <span className="text-white font-black">{selectedReceipt.entity}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="font-black uppercase tracking-tighter">Verified Units:</span>
                <span className="text-2xl text-white font-black leading-none">{selectedReceipt.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-black uppercase tracking-tighter block mb-2">Forensic Verdict:</span>
                <p className="bg-zinc-900 p-4 border border-zinc-800 text-zinc-300 font-bold uppercase italic">
                  " {selectedReceipt.auditSnippet || 'Audit in progress.'} "
                </p>
              </div>
              <div>
                <span className="font-black uppercase tracking-tighter block mb-2">Hash Anchor (SHA-256):</span>
                <p className="break-all bg-black p-4 text-[8px] text-red-600 font-black tracking-tight border border-zinc-900 leading-tight">
                  {selectedReceipt.entryHash}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.print()}
              className="w-full mt-10 border border-white text-white py-4 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all"
            >
              Print Forensic Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChainExplorer;