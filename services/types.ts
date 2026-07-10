export type PriorityLevel = 1 | 2 | 3 | 4 | 5;
export type TriageStatus = 'Pending' | 'In-Transit';

export interface TriageRecord {
  id: string;
  patientName: string;
  condition: string;
  priority: PriorityLevel;
  status: TriageStatus;
  createdAt: string;
  synced: boolean;
}
