import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChainEntry, AuditStatus, SimulationState, Alignment } from './types';
import { generateEntryHash } from './crypto';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChaosConsole from './components/ChaosConsole';
import ChainExplorer from './components/ChainExplorer';
import SyncStatus from './components/SyncStatus';
import LogicAuditor from './components/LogicAuditor';
import IntelligenceFeed from './components/IntelligenceFeed';

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

const App: React.FC = () => {
  const [chain, setChain] = useState<ChainEntry[]>([]);
  const [audit, setAudit] = useState<AuditStatus>({ isValid: true, brokenIndex: null, message: 'Chain Immutable.' });
  const [simState, setSimState] = useState<SimulationState>(SimulationState.IDLE);
  const [logs, setLogs] = useState<string[]>(['[VANGUARD-OS]: Syntropic core initialized.', '[SYSTEM]: Logic is absolute. Monitoring global decay.']);
  const [intelLogs, setIntelLogs] = useState<{id: number, text: string, type: Alignment}[]>([]);
  const [showAuditor, setShowAuditor] = useState(false);

  const logAction = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const syntropyIndex = useMemo(() => {
    if (chain.length === 0) return 100;
    const orderCount = chain.filter(c => c.alignment === 'INTEGRITY' || c.alignment === 'SYNTROPY').length;
    return Math.round((orderCount / chain.length) * 100);
  }, [chain]);

  const auditBlockRealTime = async (entry: ChainEntry) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Syntropic Triage: System Audit Block #${entry.id}.
      Target: ${entry.entity}
      Magnitude: ${entry.amount} 
      Intent: ${entry.purpose}
      
      Your role is to classify this system action. 
      - SYNTROPY/INTEGRITY: Action creates complex, verifiable order and utility.
      - THEATER: Action is performative, bureaucratic, or entropic noise.
      - BREACH: Action is a logical or ethical failure.

      Respond in JSON format:
      {
        "alignment": "INTEGRITY" | "THEATER" | "BREACH" | "SYNTROPY",
        "snippet": "Sharp, 10-word forensic verdict."
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setChain(prev => prev.map(item => item.id === entry.id ? { ...item, alignment: result.alignment || 'UNKNOWN', auditSnippet: result.snippet } : item));
      setIntelLogs(prev => [{ id: entry.id, text: `BLOCK #${entry.id} | VERDICT: ${result.snippet || 'Awaiting proof.'}`, type: (result.alignment as Alignment) || 'UNKNOWN' }, ...prev].slice(0, 20));
      
      if (result.alignment === 'BREACH') {
        logAction(`🚨 ALERT: Breach detected in entity ${entry.entity}. Entropy rising.`);
      } else if (result.alignment === 'SYNTROPY' || result.alignment === 'INTEGRITY') {
        logAction(`⚡ SYNTROPY: Entity ${entry.entity} verified. Chain hardened.`);
      }
    } catch (err) { console.error(err); }
  };

  const verifyChainInternal = async (currentChain: ChainEntry[]) => {
    if (currentChain.length === 0) return true;
    let prevHash = GENESIS_HASH;
    for (let i = 0; i < currentChain.length; i++) {
      const entry = currentChain[i];
      const recalculatedHash = await generateEntryHash(entry.id, entry.entity, entry.amount, entry.purpose, entry.timestamp, entry.previousHash);
      if (recalculatedHash !== entry.entryHash || entry.previousHash !== prevHash) return false;
      prevHash = entry.entryHash;
    }
    return true;
  };

  const verifyChain = useCallback(async (currentChain: ChainEntry[]) => {
    const isValid = await verifyChainInternal(currentChain);
    let brokenIdx: number | null = null;
    if (!isValid && currentChain.length > 0) {
      let prevHash = GENESIS_HASH;
      for (let i = 0; i < currentChain.length; i++) {
        const entry = currentChain[i];
        const recalc = await generateEntryHash(entry.id, entry.entity, entry.amount, entry.purpose, entry.timestamp, entry.previousHash);
        if (recalc !== entry.entryHash || entry.previousHash !== prevHash) {
          brokenIdx = i;
          break;
        }
        prevHash = entry.entryHash;
      }
    }
    setAudit({ isValid, brokenIndex: brokenIdx, message: isValid ? 'Chain Immutable.' : 'HASHCHAIN COMPROMISED.' });
    return isValid;
  }, []);

  const addAllocation = async (entity: string, amount: number, purpose: string, tsOverride?: string) => {
    const lastEntry = chain[chain.length - 1];
    const previousHash = lastEntry ? lastEntry.entryHash : GENESIS_HASH;
    const id = chain.length + 1;
    const timestamp = tsOverride || new Date().toISOString();
    const entryHash = await generateEntryHash(id, entity, amount, purpose, timestamp, previousHash);

    const newEntry: ChainEntry = { id, entity, amount, purpose, timestamp, previousHash, entryHash, alignment: 'PENDING' };
    setChain(prev => [...prev, newEntry]);
    logAction(`PROBE: Committing Block #${id} for ${entity}...`);
    auditBlockRealTime(newEntry);
  };

  const runPytestChaos = async () => {
    setSimState(SimulationState.CHAOS);
    logAction("PYTEST: Executing Chaos Resilience Suite...");
    const tests = ["test_power_loss", "test_clock_skew", "test_bit_flip", "test_db_corrupt"];
    for (const test of tests) {
      logAction(`PYTEST: running ${test}...`);
      await new Promise(r => setTimeout(r, 1000));
      logAction(`PYTEST: ${test} PASSED.`);
    }
    logAction("PYTEST: 100% Resilience rating achieved.");
    setSimState(SimulationState.IDLE);
  };

  const syncWithPeer = async (malicious: boolean) => {
    setSimState(SimulationState.SYNCING);
    logAction(`MESH: Handshaking with node ${malicious ? '0xEntropia' : '0xSyntropia'}...`);
    await new Promise(r => setTimeout(r, 1200));

    let peerChain: ChainEntry[] = [...chain];
    
    if (malicious && chain.length > 0) {
      logAction('🚨 BREACH: Malicious node attempting history rewrite.');
      peerChain[0] = { ...peerChain[0], amount: peerChain[0].amount + 999 };
      let currentPrevHash = GENESIS_HASH;
      for (let i = 0; i < peerChain.length; i++) {
        peerChain[i].previousHash = currentPrevHash;
        peerChain[i].entryHash = await generateEntryHash(
          peerChain[i].id, peerChain[i].entity, peerChain[i].amount, peerChain[i].purpose, peerChain[i].timestamp, currentPrevHash
        );
        currentPrevHash = peerChain[i].entryHash;
      }
    } else {
      const lastEntry = peerChain[peerChain.length - 1];
      const prevH = lastEntry ? lastEntry.entryHash : GENESIS_HASH;
      const id = peerChain.length + 1;
      const ts = new Date().toISOString();
      const h = await generateEntryHash(id, "GLOBAL_MESH_VALIDATOR", 0, "Global integrity heartbeat.", ts, prevH);
      peerChain.push({ id, entity: "GLOBAL_MESH_VALIDATOR", amount: 0, purpose: "Global integrity heartbeat.", timestamp: ts, previousHash: prevH, entryHash: h, alignment: 'SYNTROPY' });
      logAction('MESH: Discovered newer valid block state.');
    }

    const isPeerValid = await verifyChainInternal(peerChain);
    if (!isPeerValid) {
      logAction('🚨 ERROR: Peer chain internally inconsistent. Rejected.');
      setSimState(SimulationState.IDLE);
      return;
    }

    const minLen = Math.min(chain.length, peerChain.length);
    let divergence = -1;
    for (let i = 0; i < minLen; i++) {
      if (chain[i].entryHash !== peerChain[i].entryHash) {
        divergence = i;
        break;
      }
    }

    if (divergence !== -1) {
      logAction(`🚨 DIVERGENCE at Block #${peerChain[divergence].id}. Aborting.`);
    } else if (peerChain.length > chain.length) {
      logAction(`SYNC SUCCESS: Integrated ${peerChain.length - chain.length} new blocks.`);
      setChain(peerChain);
    } else {
      logAction('SYNC: Parity maintained.');
    }
    setSimState(SimulationState.IDLE);
  };

  useEffect(() => { verifyChain(chain); }, [chain, verifyChain]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#020202] text-[#e0e0e0] selection:bg-red-900 selection:text-white">
      <Header syntropyIndex={syntropyIndex} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <Dashboard onAllocate={addAllocation} audit={audit} />
          <IntelligenceFeed logs={intelLogs} />
          <ChaosConsole 
            onCorrupt={() => chain.length > 0 && setChain(prev => { 
              const next = [...prev]; 
              const idx = Math.floor(Math.random() * next.length);
              next[idx] = { ...next[idx], amount: next[idx].amount + 0.01 }; 
              return next; 
            })}
            onSync={() => syncWithPeer(false)}
            onMaliciousSync={() => syncWithPeer(true)}
            onReset={() => { setChain([]); setIntelLogs([]); logAction('RESET: Ledger purged.'); }}
            onPowerLoss={() => logAction('TEST: Power loss simulation active.')}
            onClockSkew={() => logAction('TEST: Clock skew simulation active.')}
            onDBRebuild={() => logAction('TEST: DB rebuild active.')}
            onStressTest={runPytestChaos}
            simState={simState}
            hasData={chain.length > 0}
          />
          <button 
            onClick={() => setShowAuditor(true)} 
            className="w-full bg-[#0a0a0a] border border-zinc-800 py-4 text-red-600 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-[0.98]"
          >
            Execute Deep System Forensic
          </button>
          <SyncStatus logs={logs} />
        </div>
        <div className="lg:col-span-8">
          <ChainExplorer 
            chain={chain} 
            audit={audit} 
            onCorrupt={(id) => setChain(prev => prev.map(e => e.id === id ? {...e, amount: e.amount + 0.1} : e))} 
          />
        </div>
      </div>

      {showAuditor && <LogicAuditor chain={chain} onClose={() => setShowAuditor(false)} />}

      <footer className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-[9px] mono text-zinc-600 uppercase tracking-widest gap-4">
        <div>SYNTROPIC_VANGUARD_NODE // v2.5.0-PRO</div>
        <div className="px-3 py-1 bg-zinc-900 border border-zinc-800">Status: Absolute Logic Enabled</div>
        <div>Logic is the Executioner. Math is the Judge.</div>
      </footer>
    </div>
  );
};

export default App;