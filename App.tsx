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
  Pressable,
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
              <View style={styles.headerTopRow}>
                <View style={styles.headerCopy}>
                  <Text style={styles.kicker}>Offline field capture</Text>
                  <Text style={styles.header}>Paramedic Triage Intake</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open user profile"
                  testID="profile-avatar"
                  style={({ pressed }) => [styles.avatarButton, pressed && styles.avatarButtonPressed]}
                >
                  <Text style={styles.avatarInitials}>PM</Text>
                </Pressable>
              </View>
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
          <View style={styles.bottomNav}>
            <Pressable style={[styles.navItem, styles.navItemActive]}>
              <Text style={[styles.navIcon, styles.navIconActive]}>+</Text>
              <Text style={[styles.navLabel, styles.navLabelActive]}>Intake</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Text style={styles.navIcon}>#</Text>
              <Text style={styles.navLabel}>Queue</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Text style={styles.navIcon}>@</Text>
              <Text style={styles.navLabel}>Profile</Text>
            </Pressable>
          </View>
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
    paddingBottom: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
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
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#E7F6F1',
    borderColor: '#9ED8C5',
    borderRadius: 24,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarButtonPressed: {
    opacity: 0.75,
  },
  avatarInitials: {
    color: '#0F3443',
    fontSize: 15,
    fontWeight: '900',
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
  bottomNav: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D8E1E6',
    borderRadius: 16,
    borderWidth: 1,
    bottom: 12,
    elevation: 8,
    flexDirection: 'row',
    gap: 8,
    left: 16,
    padding: 8,
    position: 'absolute',
    right: 16,
    shadowColor: '#0B2230',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
    paddingVertical: 7,
  },
  navItemActive: {
    backgroundColor: '#0F3443',
  },
  navIcon: {
    color: '#667985',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  navIconActive: {
    color: '#FFFFFF',
  },
  navLabel: {
    color: '#667985',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
});
