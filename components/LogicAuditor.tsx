
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChainEntry } from '../types';

interface LogicAuditorProps {
  chain: ChainEntry[];
  onClose: () => void;
}

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

const LogicAuditor: React.FC<LogicAuditorProps> = ({ chain, onClose }) => {
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  const performAudit = async () => {
    if (chain.length === 0) {
      setAuditResult("CRITICAL: NO CHAIN DATA DETECTED.");
      return;
    }

    setLoading(true);
    setSources([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a Global Strategic Forensic Auditor.
      Analyze the integrity of the following system events by cross-referencing them with real-world ground truth via Google Search.
      
      Tasks:
      1. Search for recent news, public records, SEC/NGO filings, or leak data regarding these entities: ${chain.map(c => c.entity).join(', ')}.
      2. Verify if their stated "Intent" aligns with real-world trajectory.
      3. Identify "Theater" (performative action with no impact) and "Breaches" (corruption, fraud, or systemic risk).
      4. Search for recent scandals or internal failures associated with these entities.
      
      Chain Data:
      ${JSON.stringify(chain.map(c => ({ block: c.id, target: c.entity, magnitude: c.amount, intent: c.purpose })), null, 2)}
      
      Format your response with sharp Markdown:
      # GLOBAL SYSTEM INTEGRITY REPORT
      ## REAL-WORLD ENTITY VERIFICATION
      ## LOGIC CONTRADICTIONS & THEATER
      ## CRITICAL VULNERABILITIES FOUND
      ## STRATEGIC VERDICT: [HARDENED | COMPROMISED]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 15000 }
        }
      });

      setAuditResult(response.text || "AUDIT ERROR: NO INTELLIGENCE RETURNED.");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setSources(chunks);

    } catch (err) {
      console.error(err);
      setAuditResult("SYSTEM FAILURE: UNABLE TO ACCESS GLOBAL SEARCH MESH. OFFLINE PROTOCOLS ONLY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="max-w-4xl w-full bg-zinc-950 border-2 border-red-600 h-[85vh] flex flex-col shadow-[0_0_80px_rgba(220,38,38,0.25)]">
        <div className="bg-red-600 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-black animate-ping"></div>
            <h2 className="text-black font-black uppercase text-xs tracking-[0.3em]">Universal Logic Auditor // MESH_SCAN_v5</h2>
          </div>
          <button onClick={onClose} className="text-black font-black text-2xl hover:scale-125 transition-transform">&times;</button>
        </div>
        
        <div className="p-10 flex-1 overflow-y-auto mono text-xs leading-relaxed scrollbar-thin scrollbar-thumb-red-600">
          {!auditResult && !loading && (
            <div className="h-full flex flex-col items-center justify-center space-y-8 text-center">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-zinc-900 rounded-full"></div>
                <div className="absolute inset-0 w-24 h-24 border-t-4 border-red-600 rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <p className="text-zinc-300 font-black uppercase tracking-widest text-lg">System Integrity Deep Probe</p>
                <p className="text-zinc-600 uppercase tracking-tighter text-[10px] max-w-sm mx-auto">
                  Exposing systemic theater and hidden failures by cross-referencing ledger data with global real-time intelligence.
                </p>
              </div>
              <button 
                onClick={performAudit}
                className="bg-white text-black px-12 py-4 font-black uppercase text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-2xl"
              >
                Scan Global Systems
              </button>
            </div>
          )}

          {loading && (
            <div className="space-y-6">
              <div className="flex gap-2 items-center">
                <div className="h-4 bg-zinc-900 w-12"></div>
                <div className="h-4 bg-zinc-900 flex-1"></div>
                <span className="text-red-500 animate-pulse text-[10px] font-bold">PROBING GLOBAL MESH...</span>
              </div>
              <div className="h-4 bg-zinc-900 w-3/4"></div>
              <div className="h-4 bg-zinc-900 w-full"></div>
              <div className="h-4 bg-zinc-900 w-5/6"></div>
              <div className="pt-10">
                <p className="text-red-600 font-black uppercase animate-pulse text-base tracking-widest">Verifying Real-World Solvency...</p>
                <p className="text-zinc-600 text-[10px] uppercase mt-2">Correlating ground truth for entity validation.</p>
              </div>
            </div>
          )}

          {auditResult && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="prose prose-invert max-w-none text-zinc-300 border-l-2 border-zinc-800 pl-6 leading-relaxed">
                <div className="whitespace-pre-wrap">{auditResult}</div>
              </div>

              {sources.length > 0 && (
                <div className="mt-12 pt-8 border-t border-zinc-900">
                  <h3 className="text-red-600 font-black uppercase text-[10px] tracking-widest mb-4">Verification Sources (Grounding Mesh)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sources.map((chunk, i) => chunk.web && (
                      <a 
                        key={i} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-zinc-900/50 border border-zinc-800 p-3 hover:border-red-600 hover:bg-zinc-900 transition-all flex flex-col group"
                      >
                        <span className="text-white font-bold text-[10px] uppercase truncate group-hover:text-red-500 transition-colors">
                          {chunk.web.title || "External Forensic Source"}
                        </span>
                        <span className="text-[9px] text-zinc-600 truncate mono mt-1">
                          {chunk.web.uri}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {auditResult && (
          <div className="p-6 border-t border-zinc-900 flex justify-between items-center bg-zinc-950/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]"></div>
              <span className="text-[9px] text-zinc-600 mono uppercase font-bold tracking-tighter">Grounding Active: GLOBAL_MESH</span>
            </div>
             <button 
              onClick={performAudit}
              className="text-[10px] font-black text-red-600 uppercase hover:underline tracking-widest px-4 py-2 border border-zinc-900 hover:border-red-600 transition-all"
            >
              Update Logic Scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogicAuditor;
