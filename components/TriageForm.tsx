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
          <Pressable
            key={p}
            onPress={() => setPriority(p)}
            style={[styles.priorityButton, priority === p && styles.priorityButtonActive]}
          >
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#D8E1E6',
    shadowColor: '#0B2230',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardCritical: {
    borderColor: '#B00020',
    backgroundColor: '#FFF8F8',
  },
  label: { fontSize: 13, fontWeight: '800', marginTop: 12, marginBottom: 6, color: '#22313A' },
  input: {
    borderWidth: 1,
    borderColor: '#C8D3DA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F8FAFB',
    color: '#102A38',
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  priorityButton: {
    opacity: 0.55,
    borderRadius: 9,
  },
  priorityButtonActive: {
    opacity: 1,
    shadowColor: '#0B2230',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#AAB8C2',
    backgroundColor: '#F8FAFB',
  },
  statusChipActive: { backgroundColor: '#0F766E', borderColor: '#0F766E' },
  statusText: { color: '#31434D', fontWeight: '800' },
  statusTextActive: { color: '#fff' },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#0F3443',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
