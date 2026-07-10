import { TriageRecord } from './types';

// Simulates POST /api/v1/triage as suggested by the brief:
// 2s artificial delay + a random failure toggle so the sync queue's
// retry behaviour is actually exercised, not just the happy path.

const ARTIFICIAL_DELAY_MS = 2000;
const RANDOM_FAILURE_RATE = 0.3; // 30% of "online" attempts still fail

export async function postTriageRecord(record: TriageRecord): Promise<{ ok: boolean }> {
  await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY_MS));

  if (Math.random() < RANDOM_FAILURE_RATE) {
    throw new Error('Simulated network failure');
  }

  console.log('[mock-server] received triage record', record.id, record.patientName);
  return { ok: true };
}
