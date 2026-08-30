import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../src/hooks/useSettings';
import { getApiKey } from '../src/storage/secure';
import { exportWorkoutHistory } from '../src/utils/export';
import { scheduleDailyReminderCheck } from '../src/utils/reminders';
import { colors, spacing, radii, typography } from '../src/theme/tokens';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    modelId,
    modelLabel,
    modelOptions,
    reminderEnabled,
    quietDaysThreshold,
    apiKeySet,
    updateModelId,
    updateReminderEnabled,
    updateApiKey,
  } = useSettings();

  const [editingKey, setEditingKey] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleEditKey = async () => {
    if (editingKey) {
      if (keyInput.trim()) {
        await updateApiKey(keyInput.trim());
        setKeyInput('');
      }
      setEditingKey(false);
    } else {
      const existing = await getApiKey();
      setKeyInput(existing ?? '');
      setEditingKey(true);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportWorkoutHistory();
    } catch (err) {
      Alert.alert(
        'Export failed',
        err instanceof Error ? err.message : 'Unknown error'
      );
    } finally {
      setExporting(false);
    }
  };

  const handleReminderToggle = async (value: boolean) => {
    await updateReminderEnabled(value);
    if (value) {
      await scheduleDailyReminderCheck();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>API KEY</Text>
        <View style={styles.field}>
          {editingKey ? (
            <TextInput
              style={styles.keyInput}
              value={keyInput}
              onChangeText={setKeyInput}
              secureTextEntry
              autoFocus
              placeholder="Enter API key"
              placeholderTextColor={colors.inputPlaceholder}
            />
          ) : (
            <Text style={styles.maskedKey}>
              {apiKeySet ? '••••••••••••••••••••' : 'Not set'}
            </Text>
          )}
          <Pressable onPress={handleEditKey}>
            <Text style={styles.editLink}>{editingKey ? 'Save' : 'Edit'}</Text>
          </Pressable>
        </View>
        <Text style={styles.helperText}>
          Stored only on this device. Never leaves your phone except to call the
          model you pick below.
        </Text>

        <Text style={[styles.sectionLabel, styles.sectionGap]}>MODEL</Text>
        <Pressable
          style={styles.field}
          onPress={() => setShowModelPicker(true)}
        >
          <Text style={styles.modelText}>{modelLabel}</Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>

        <Text style={[styles.sectionLabel, styles.sectionGap]}>REMINDERS</Text>
        <View style={styles.field}>
          <Text style={styles.reminderText}>
            Nudge me after {quietDaysThreshold} quiet days
          </Text>
          <Switch
            value={reminderEnabled}
            onValueChange={handleReminderToggle}
            trackColor={{ false: colors.toggleInactive, true: colors.text }}
            thumbColor={colors.bg}
          />
        </View>

        <Text style={[styles.sectionLabel, styles.sectionGap]}>YOUR DATA</Text>
        <Pressable
          style={styles.exportBtn}
          onPress={handleExport}
          disabled={exporting}
        >
          <Text style={styles.exportText}>
            {exporting ? 'Exporting…' : 'Export workout history'}
          </Text>
        </Pressable>
      </ScrollView>

      <Modal visible={showModelPicker} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModelPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Model</Text>
            <FlatList
              data={modelOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.modelOption,
                    item.id === modelId && styles.modelOptionActive,
                  ]}
                  onPress={async () => {
                    await updateModelId(item.id);
                    setShowModelPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modelOptionText,
                      item.id === modelId && styles.modelOptionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backArrow: {
    fontSize: 32,
    color: colors.text,
    lineHeight: 36,
    width: 40,
  },
  headerTitle: {
    ...typography.label,
    color: colors.text,
    fontSize: 13,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  sectionGap: {
    marginTop: spacing.lg,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.bg,
  },
  maskedKey: {
    fontSize: 15,
    color: colors.text,
    letterSpacing: 2,
    flex: 1,
  },
  keyInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  editLink: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  helperText: {
    ...typography.caption,
    color: colors.muted,
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  modelText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: colors.muted,
  },
  reminderText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  exportBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  exportText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.md,
    maxHeight: '50%',
  },
  modalTitle: {
    ...typography.label,
    color: colors.muted,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modelOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modelOptionActive: {
    backgroundColor: colors.inputBg,
  },
  modelOptionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  modelOptionTextActive: {
    fontWeight: '600',
  },
});
