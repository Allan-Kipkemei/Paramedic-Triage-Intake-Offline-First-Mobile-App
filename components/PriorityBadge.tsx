import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriorityLevel } from '../services/types';

const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  1: '#B00020', // critical — deep red
  2: '#E65100', // severe — deep orange
  3: '#F9A825', // moderate — amber
  4: '#2E7D32', // low — green
  5: '#616161', // minimal — grey
};

const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  1: 'P1 · CRITICAL',
  2: 'P2 · SEVERE',
  3: 'P3 · MODERATE',
  4: 'P4 · LOW',
  5: 'P5 · MINIMAL',
};

export function PriorityBadge({ level }: { level: PriorityLevel }) {
  return (
    <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[level] }]}>
      <Text style={styles.text}>{PRIORITY_LABELS[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
