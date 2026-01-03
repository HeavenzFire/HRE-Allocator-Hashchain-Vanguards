import React, { useState } from 'react';
import { AuditStatus } from '../types';

interface DashboardProps {
  onAllocate: (entity: string, amount: number, purpose: string) => void;
  audit: AuditStatus;
}

const Dashboard: React.FC<DashboardProps> = ({ onAllocate, audit }) => {
  const [entity, setEntity] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entity || !amount || !purpose) return;
    onAllocate(entity, parseFloat(amount), purpose);
    setEntity('');
    setAmount('');
    setPurpose('');
  };

  return (
    <div className="bg-[#050505] border border-zinc-900 p-6 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-20"></div>
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-xs font-black uppercase text-white tracking-[0.2em]">Audit Probe</h2>
          <p className="text-[8px] text-zinc-600 mono uppercase">Injecting Logic Into Mesh</p>
        </div>
        <div className={`px-3 py-1 border font-black mono text-[9px] uppercase transition-all ${audit.isValid ? 'border-zinc-800 text-green-500 bg-green-950/10' : 'border-red-600 text-white bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]'}`}>
          {audit.isValid ? '● Integrity Secured' : '⚠️ Logic Breach'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[9px] mono text-zinc-500 uppercase font-black mb-1.5 tracking-widest">System / Entity</label>
          <input
            type="text"
            required
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            placeholder="Entity ID..."
            className="w-full bg-zinc-950 border border-zinc-900 p-3 text-white mono text-[10px] focus:border-red-600 outline-none transition-all placeholder:text-zinc-800"
          />
        </div>
        <div>
          <label className="block text-[9px] mono text-zinc-500 uppercase font-black mb-1.5 tracking-widest">Resource Magnitude</label>
          <input
            type="number"
            required
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Impact Units..."
            className="w-full bg-zinc-950 border border-zinc-900 p-3 text-white mono text-[10px] focus:border-red-600 outline-none transition-all placeholder:text-zinc-800"
          />
        </div>
        <div>
          <label className="block text-[9px] mono text-zinc-500 uppercase font-black mb-1.5 tracking-widest">Stated Intent</label>
          <textarea
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Objective analysis..."
            className="w-full bg-zinc-950 border border-zinc-900 p-3 text-white mono text-[10px] focus:border-red-600 outline-none transition-all h-20 resize-none placeholder:text-zinc-800"
          />
        </div>
        <button
          type="submit"
          disabled={!audit.isValid}
          className={`w-full font-black uppercase py-4 text-[10px] tracking-widest transition-all ${audit.isValid ? 'bg-white text-black hover:bg-red-600 hover:text-white' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}`}
        >
          {audit.isValid ? 'COMMIT TO SYNTROPIC CHAIN' : 'CHAIN_LOCKED'}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;