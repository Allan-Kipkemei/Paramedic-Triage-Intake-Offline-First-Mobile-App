import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTriageStore } from '../store/useTriageStore';
import { PriorityBadge } from './PriorityBadge';

export function RecordList() {
  const records = useTriageStore(state => state.records) ?? [];

  return (
    <FlatList
      style={styles.list}
      data={records}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        records.length > 0 ? <Text style={styles.sectionTitle}>Recent records</Text> : null
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <PriorityBadge level={item.priority} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.name}>{item.patientName}</Text>
            <Text style={styles.condition} numberOfLines={1}>{item.condition}</Text>
          </View>
          <Text style={[styles.syncTag, item.synced ? styles.synced : styles.pending]}>
            {item.synced ? 'SYNCED' : 'QUEUED'}
          </Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No records yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 10, paddingHorizontal: 16 },
  listContent: { paddingBottom: 40 },
  sectionTitle: {
    color: '#31434D',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDE6EB',
  },
  name: { color: '#102A38', fontWeight: '800', fontSize: 15 },
  condition: { color: '#667985', fontSize: 13, marginTop: 2 },
  syncTag: { fontSize: 11, fontWeight: '900', marginLeft: 8 },
  synced: { color: '#2E7D32' },
  pending: { color: '#B00020' },
  empty: {
    textAlign: 'center',
    color: '#667985',
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE6EB',
    paddingVertical: 18,
    fontWeight: '700',
  },
});
