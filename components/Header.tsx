import React from 'react';

interface HeaderProps {
  syntropyIndex: number;
}

const Header: React.FC<HeaderProps> = ({ syntropyIndex }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-900 pb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30"></div>
      <div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
          SYNTROPIC<span className="text-red-600">.</span>OS
        </h1>
        <p className="mono text-zinc-600 text-[10px] mt-2 uppercase tracking-[0.4em] font-bold">
          High-Order System Integrity Engine
        </p>
      </div>
      
      <div className="flex items-center gap-8 w-full md:w-auto">
        <div className="flex-1 md:flex-none">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] mono text-zinc-500 uppercase font-black tracking-tighter">Order Magnitude</span>
            <span className="text-[10px] mono text-white font-black">{syntropyIndex}%</span>
          </div>
          <div className="h-1 w-full md:w-48 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className={`h-full transition-all duration-1000 ${syntropyIndex < 100 ? 'bg-red-600' : 'bg-green-600'}`}
              style={{ width: `${syntropyIndex}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-right hidden sm:block">
          <div className="text-[9px] text-zinc-500 mono uppercase font-black tracking-tighter mb-1">Mesh Connection</div>
          <div className="flex items-center gap-2 justify-end">
            <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
            <span className="mono text-white text-[10px] font-black uppercase tracking-tighter">Hardened_Search_Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;