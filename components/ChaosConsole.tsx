import React from 'react';
import { SimulationState } from '../types';

interface ChaosConsoleProps {
  onCorrupt: () => void;
  onSync: () => void;
  onMaliciousSync: () => void;
  onReset: () => void;
  onPowerLoss: () => void;
  onClockSkew: () => void;
  onDBRebuild: () => void;
  onStressTest: () => void;
  simState: SimulationState;
  hasData: boolean;
}

const ChaosConsole: React.FC<ChaosConsoleProps> = ({ 
  onCorrupt, 
  onSync, 
  onMaliciousSync,
  onReset, 
  onPowerLoss, 
  onClockSkew,
  onDBRebuild,
  onStressTest, 
  simState, 
  hasData 
}) => {
  const isBusy = simState !== SimulationState.IDLE;

  return (
    <div className="bg-[#0a0a0a] p-6 border border-zinc-900 relative">
      <div className="absolute top-0 right-0 px-2 py-0.5 bg-red-600 text-black text-[7px] font-black uppercase tracking-widest">
        Chaos_v3.2
      </div>
      <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-4 border-b border-zinc-900 pb-2">Resilience Testing</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onStressTest}
          disabled={isBusy}
          className="col-span-2 bg-white text-black py-2.5 text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all disabled:opacity-20"
        >
          Automated Chaos Suite
        </button>

        <button
          onClick={onPowerLoss}
          disabled={isBusy}
          className="bg-zinc-900 text-zinc-400 border border-zinc-800 py-2 text-[8px] mono font-bold uppercase hover:text-white hover:border-zinc-500 transition-all disabled:opacity-20"
        >
          Power_Loss
        </button>

        <button
          onClick={onClockSkew}
          disabled={isBusy}
          className="bg-zinc-900 text-zinc-400 border border-zinc-800 py-2 text-[8px] mono font-bold uppercase hover:text-white hover:border-zinc-500 transition-all disabled:opacity-20"
        >
          Clock_Skew
        </button>

        <button
          onClick={onSync}
          disabled={isBusy}
          className="bg-zinc-900 text-zinc-400 border border-zinc-800 py-2 text-[8px] mono font-bold uppercase hover:text-white hover:border-zinc-500 transition-all disabled:opacity-20"
        >
          Mesh_Handshake
        </button>

        <button
          onClick={onMaliciousSync}
          disabled={!hasData || isBusy}
          className="bg-zinc-900 text-red-400 border border-red-900/30 py-2 text-[8px] mono font-bold uppercase hover:bg-red-900/10 transition-all disabled:opacity-20"
        >
          History_Attack
        </button>

        <button
          onClick={onCorrupt}
          disabled={!hasData || isBusy}
          className="col-span-2 bg-zinc-950 border border-zinc-900 text-red-600 py-2 text-[8px] font-black uppercase hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 mt-1"
        >
          Inject Entropy (Bit-Flip)
        </button>

        <button
          onClick={onReset}
          className="col-span-2 text-zinc-700 hover:text-zinc-400 py-2 text-[8px] mono font-bold uppercase transition-all"
        >
          [ Hard Memory Wipe ]
        </button>
      </div>

      <div className="mt-4 flex justify-between items-center text-[8px] mono uppercase font-black tracking-tighter">
        <span className="text-zinc-800">Uptime: Absolute</span>
        <span className={`${isBusy ? 'text-red-600 animate-pulse' : 'text-zinc-600'}`}>{simState}</span>
      </div>
    </div>
  );
};

export default ChaosConsole;