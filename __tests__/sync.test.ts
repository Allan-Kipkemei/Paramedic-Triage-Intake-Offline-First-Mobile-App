import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../services/storage';
import { trySync } from '../services/sync';
import * as api from '../services/api';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({ isConnected: true }),
  addEventListener: jest.fn(() => () => {}),
}));

jest.mock('../services/api');

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

test('trySync marks a record synced when the API call succeeds', async () => {
  (api.postTriageRecord as jest.Mock).mockResolvedValue({ ok: true });
  await storage.saveRecord({
    id: 'a', patientName: 'X', condition: 'Y', priority: 3,
    status: 'Pending', createdAt: new Date().toISOString(), synced: false,
  });

  await trySync();

  const all = await storage.getAllRecords();
  expect(all[0].synced).toBe(true);
});

test('trySync leaves a record pending when the API call fails', async () => {
  (api.postTriageRecord as jest.Mock).mockRejectedValue(new Error('offline'));
  await storage.saveRecord({
    id: 'b', patientName: 'X', condition: 'Y', priority: 3,
    status: 'Pending', createdAt: new Date().toISOString(), synced: false,
  });

  await trySync();

  const all = await storage.getAllRecords();
  expect(all[0].synced).toBe(false);
});
