import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../services/storage';
import { TriageRecord } from '../services/types';

const sample: TriageRecord = {
  id: '1',
  patientName: 'Jane Doe',
  condition: 'Fractured femur',
  priority: 2,
  status: 'Pending',
  createdAt: new Date().toISOString(),
  synced: false,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

test('saveRecord persists a record retrievable via getAllRecords', async () => {
  await storage.saveRecord(sample);
  const all = await storage.getAllRecords();
  expect(all).toHaveLength(1);
  expect(all[0].patientName).toBe('Jane Doe');
});

test('markSynced flips the synced flag without losing other fields', async () => {
  await storage.saveRecord(sample);
  await storage.markSynced('1');
  const all = await storage.getAllRecords();
  expect(all[0].synced).toBe(true);
  expect(all[0].condition).toBe('Fractured femur');
});

test('getPending only returns unsynced records', async () => {
  await storage.saveRecord(sample);
  await storage.saveRecord({ ...sample, id: '2', synced: true });
  const pending = await storage.getPending();
  expect(pending).toHaveLength(1);
  expect(pending[0].id).toBe('1');
});
