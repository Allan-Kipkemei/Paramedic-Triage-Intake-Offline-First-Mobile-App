import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTriageStore } from '../store/useTriageStore';
import { PriorityBadge } from './PriorityBadge';

export function RecordList() {
  const records = useTriageStore(state => state.records);

  return (
    <FlatList
      style={styles.list}
      data={records}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 40 }}
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
  list: { marginTop: 8, paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: { fontWeight: '700', fontSize: 15 },
  condition: { color: '#666', fontSize: 13 },
  syncTag: { fontSize: 11, fontWeight: '700', marginLeft: 8 },
  synced: { color: '#2E7D32' },
  pending: { color: '#B00020' },
  empty: { textAlign: 'center', color: '#999', marginTop: 30 },
});
