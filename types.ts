export interface Allocation {
  id: number;
  entity: string;
  amount: number;
  purpose: string;
  timestamp: string;
}

export type Alignment = 'INTEGRITY' | 'THEATER' | 'BREACH' | 'UNKNOWN' | 'PENDING' | 'SYNTROPY';

export interface ChainEntry extends Allocation {
  previousHash: string;
  entryHash: string;
  alignment?: Alignment;
  auditSnippet?: string;
}

export interface AuditStatus {
  isValid: boolean;
  brokenIndex: number | null;
  message: string;
}

export enum SimulationState {
  IDLE = 'IDLE',
  SYNCING = 'SYNCING',
  CORRUPTING = 'CORRUPTING',
  VERIFYING = 'VERIFYING',
  CHAOS = 'CHAOS'
}

export interface Peer {
  id: string;
  name: string;
  chainLength: number;
  lastHash: string;
}
