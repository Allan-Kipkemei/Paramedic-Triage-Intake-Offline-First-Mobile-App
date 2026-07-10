import { create } from 'zustand';
import { TriageRecord } from '../services/types';
import * as storage from '../services/storage';
import { trySync } from '../services/sync';

interface TriageState {
  records: TriageRecord[];
  pendingCount: number;
  loadFromDisk: () => Promise<void>;
  addRecord: (record: Omit<TriageRecord, 'id' | 'createdAt' | 'synced'>) => Promise<void>;
  syncNow: () => Promise<void>;
}

// UI only ever talks to this store. It never touches AsyncStorage or the
// network directly — that separation is the whole point of the assessment.
export const useTriageStore = create<TriageState>((set, get) => ({
  records: [],
  pendingCount: 0,

  loadFromDisk: async () => {
    const records = await storage.getAllRecords();
    set({ records, pendingCount: records.filter(r => !r.synced).length });
  },

  addRecord: async (input) => {
    const record: TriageRecord = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      synced: false,
    };

    // 1. Persist locally FIRST. This is the "offline interception" step —
    //    submission always succeeds from the paramedic's point of view,
    //    regardless of connectivity.
    await storage.saveRecord(record);

    const records = await storage.getAllRecords();
    set({ records, pendingCount: records.filter(r => !r.synced).length });

    // 2. Opportunistically try to sync. If offline, this silently no-ops —
    //    the NetInfo listener in services/sync.ts will catch it later.
    trySync(get().loadFromDisk);
  },

  syncNow: async () => {
    await trySync(get().loadFromDisk);
  },
}));
