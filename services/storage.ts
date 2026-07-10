import AsyncStorage from '@react-native-async-storage/async-storage';
import { TriageRecord } from './types';

// Swap this file for SQLite/WatermelonDB/MMKV later without touching the
// store or UI — that's the point of keeping persistence behind a small
// function-based interface instead of leaking storage calls everywhere.

const KEY = 'triage_records_v1';

export async function getAllRecords(): Promise<TriageRecord[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as TriageRecord[]) : [];
}

export async function saveRecord(record: TriageRecord): Promise<void> {
  const records = await getAllRecords();
  records.unshift(record);
  await AsyncStorage.setItem(KEY, JSON.stringify(records));
}

export async function markSynced(id: string): Promise<void> {
  const records = await getAllRecords();
  const updated = records.map(r => (r.id === id ? { ...r, synced: true } : r));
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function getPending(): Promise<TriageRecord[]> {
  const records = await getAllRecords();
  return records.filter(r => !r.synced);
}
