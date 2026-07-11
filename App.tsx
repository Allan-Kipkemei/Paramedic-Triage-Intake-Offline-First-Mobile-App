import React, { useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { TriageForm } from './components/TriageForm';
import { RecordList } from './components/RecordList';
import { useTriageStore } from './store/useTriageStore';
import { initSyncListeners } from './services/sync';

export default function App() {
  const loadFromDisk = useTriageStore(state => state.loadFromDisk);
  const pendingCount = useTriageStore(state => state.pendingCount);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    loadFromDisk();
    const cleanup = initSyncListeners(loadFromDisk);
    return cleanup;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableWithoutFeedback
        testID="dismiss-keyboard-overlay"
        onPress={dismissKeyboard}
        accessible={false}
      >
        <View style={styles.fill}>
          {/* KeyboardAvoidingView + the ScrollView inside TriageForm/RecordList's
              parent keep inputs from being hidden behind the keyboard on real
              devices — critical for "fast thumb-input under pressure". */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            <View style={styles.headerPanel}>
              <Text style={styles.kicker}>Offline field capture</Text>
              <Text style={styles.header}>Paramedic Triage Intake</Text>
              <Text style={styles.subheader}>Save now. Sync automatically when signal returns.</Text>
            </View>
            {pendingCount > 0 && (
              <View style={styles.pendingBanner}>
                <Text style={styles.pendingText}>
                  {pendingCount} record{pendingCount > 1 ? 's' : ''} queued for sync
                </Text>
              </View>
            )}
            <TriageForm />
            <RecordList />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF3F6' },
  fill: { flex: 1 },
  headerPanel: {
    backgroundColor: '#0F3443',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  kicker: {
    color: '#9ED8C5',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  subheader: {
    color: '#DDECEF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  pendingBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pendingText: {
    color: '#92400E',
    fontWeight: '800',
    fontSize: 13,
  },
});
