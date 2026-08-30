import { useState, useEffect, useCallback } from 'react';
import {
  getSetting,
  setSetting,
  getBooleanSetting,
  getNumberSetting,
} from '../db/settings';
import { getApiKey, saveApiKey } from '../storage/secure';
import { MODEL_OPTIONS } from '../llm/providers';

export function useSettings() {
  const [modelId, setModelId] = useState('auto');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [quietDaysThreshold, setQuietDaysThreshold] = useState(3);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [model, reminder, quietDays, key] = await Promise.all([
      getSetting('modelId'),
      getBooleanSetting('reminderEnabled', true),
      getNumberSetting('quietDaysThreshold', 3),
      getApiKey(),
    ]);
    setModelId(model ?? 'auto');
    setReminderEnabled(reminder);
    setQuietDaysThreshold(quietDays);
    setApiKeySet(!!key);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateModelId = async (id: string) => {
    await setSetting('modelId', id);
    setModelId(id);
  };

  const updateReminderEnabled = async (enabled: boolean) => {
    await setSetting('reminderEnabled', String(enabled));
    setReminderEnabled(enabled);
  };

  const updateApiKey = async (key: string) => {
    await saveApiKey(key);
    setApiKeySet(true);
  };

  const modelLabel =
    MODEL_OPTIONS.find((m) => m.id === modelId)?.label ?? 'Auto (best available)';

  return {
    modelId,
    modelLabel,
    modelOptions: MODEL_OPTIONS,
    reminderEnabled,
    quietDaysThreshold,
    apiKeySet,
    loading,
    updateModelId,
    updateReminderEnabled,
    updateApiKey,
    reload: load,
  };
}
