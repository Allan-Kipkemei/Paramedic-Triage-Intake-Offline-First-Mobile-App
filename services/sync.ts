import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import * as storage from './storage';
import { postTriageRecord } from './api';

let isSyncing = false;

/**
 * Attempts to flush every pending (unsynced) record to the mock server.
 * Safe to call repeatedly — a lock (`isSyncing`) prevents overlapping
 * runs, e.g. if connectivity flickers or the user resubmits mid-sync.
 */
export async function trySync(onProgress?: () => void): Promise<void> {
  if (isSyncing) return;

  const net = await NetInfo.fetch();
  if (!net.isConnected) return;

  const pending = await storage.getPending();
  if (pending.length === 0) return;

  isSyncing = true;
  try {
    for (const record of pending) {
      try {
        await postTriageRecord(record);
        await storage.markSynced(record.id);
        onProgress?.();
      } catch {
        // Leave it pending — next trigger (reconnect, foreground, manual
        // retry) will pick it up again. We deliberately don't stop the
        // whole batch on one failure.
      }
    }
  } finally {
    isSyncing = false;
  }
}

/**
 * Wires up the two triggers that matter for a field app:
 * 1. Network coming back after being offline.
 * 2. App returning to the foreground (in case the OS killed the
 *    connectivity listener while backgrounded).
 * Call once, e.g. from App.tsx's useEffect, and keep the returned
 * cleanup for unmount.
 */
export function initSyncListeners(onProgress?: () => void): () => void {
  let wasOffline = false;

  const unsubscribeNet = NetInfo.addEventListener(state => {
    const isOnline = !!state.isConnected;
    if (isOnline && wasOffline) {
      trySync(onProgress);
    }
    wasOffline = !isOnline;
  });

  const handleAppState = (status: AppStateStatus) => {
    if (status === 'active') {
      trySync(onProgress);
    }
  };
  const appStateSub = AppState.addEventListener('change', handleAppState);

  return () => {
    unsubscribeNet();
    appStateSub.remove();
  };
}
