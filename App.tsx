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
            <Text style={styles.header}>Paramedic Triage Intake</Text>
            {pendingCount > 0 && (
              <Text style={styles.pendingBanner}>
                {pendingCount} record{pendingCount > 1 ? 's' : ''} queued for sync
              </Text>
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  fill: { flex: 1 },
  header: { fontSize: 20, fontWeight: '800', paddingHorizontal: 16, paddingTop: 12 },
  pendingBanner: {
    marginHorizontal: 16,
    marginTop: 6,
    color: '#B00020',
    fontWeight: '600',
    fontSize: 13,
  },
});
