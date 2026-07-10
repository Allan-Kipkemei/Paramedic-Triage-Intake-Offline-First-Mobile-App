import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTriageStore } from '../store/useTriageStore';
import { PriorityLevel, TriageStatus } from '../services/types';
import { PriorityBadge } from './PriorityBadge';

const PRIORITIES: PriorityLevel[] = [1, 2, 3, 4, 5];
const STATUSES: TriageStatus[] = ['Pending', 'In-Transit'];

export function TriageForm() {
  const addRecord = useTriageStore(state => state.addRecord);

  const [patientName, setPatientName] = useState('');
  const [condition, setCondition] = useState('');
  const [priority, setPriority] = useState<PriorityLevel | null>(null);
  const [status, setStatus] = useState<TriageStatus>('Pending');
  const [submitting, setSubmitting] = useState(false);

  const isCritical = priority === 1 || priority === 2;

  const handleSubmit = async () => {
    if (!patientName.trim() || !condition.trim() || priority === null) {
      Alert.alert('Missing fields', 'Name, condition and priority are required.');
      return;
    }
    setSubmitting(true);
    try {
      await addRecord({ patientName: patientName.trim(), condition: condition.trim(), priority, status });
      setPatientName('');
      setCondition('');
      setPriority(null);
      setStatus('Pending');
      // No blocking network wait here — save is instant, sync happens
      // in the background regardless of connectivity.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.card, isCritical && styles.cardCritical]}>
      <Text style={styles.label}>Patient Name</Text>
      <TextInput
        style={styles.input}
        value={patientName}
        onChangeText={setPatientName}
        placeholder="e.g. John Mwangi"
        autoCapitalize="words"
      />

      <Text style={styles.label}>Condition Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={condition}
        onChangeText={setCondition}
        placeholder="e.g. Chest trauma, unresponsive"
        multiline
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.row}>
        {PRIORITIES.map(p => (
          <Pressable key={p} onPress={() => setPriority(p)} style={{ opacity: priority === p ? 1 : 0.45 }}>
            <PriorityBadge level={p} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Status</Text>
      <View style={styles.row}>
        {STATUSES.map(s => (
          <Pressable
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.statusChip, status === s && styles.statusChipActive]}
          >
            <Text style={[styles.statusText, status === s && styles.statusTextActive]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.submitButton, submitting && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitText}>{submitting ? 'Saving…' : 'Submit Triage Record'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  cardCritical: {
    borderColor: '#B00020',
  },
  label: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
  },
  statusChipActive: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  statusText: { color: '#333', fontWeight: '600' },
  statusTextActive: { color: '#fff' },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#1565C0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
